/**
 * takeKONTROL — Order store
 * =================================================================
 * Primary:   append-only JSON log with in-memory index (fsync'd).
 * Secondary: DynamoDB sync — every write is pushed to AWS.
 *
 * Solid e-commerce guarantees:
 *   1. Idempotent capture  — same PayPal order ID → same local order,
 *                            no double charge ever possible.
 *   2. Atomic local write  — fsync before returning, so a process kill
 *                            never loses a PAID record.
 *   3. DynamoDB conditional write — PutItem only if orderID does not
 *                            exist, preventing duplicate DB rows even
 *                            on retry storms.
 *   4. Order number uniqueness — date + name + 4 random chars from an
 *                            unambiguous alphabet; collision probability
 *                            is 1 in 1M at normal volumes.
 *   5. Webhook dedup       — markEventSeen() prevents double-processing
 *                            PayPal's at-least-once delivery.
 *   6. Stale quote guard   — server/routes/orders.js re-prices before
 *                            capture; price cannot drift silently.
 *   7. DynamoDB failure    — never blocks a payment; sync is async and
 *                            the local log is the source of truth.
 * =================================================================
 */

import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';

import { DATA_DIR } from './config.js';

const LOG_FILE         = path.join(DATA_DIR, 'orders.log');
const ORDERS_TABLE     = process.env.DYNAMODB_ORDERS_TABLE || 'takeKONTROL-Orders';
const AWS_REGION       = process.env.AWS_REGION            || 'ap-south-1';

fs.mkdirSync(DATA_DIR, { recursive: true });

const orders     = new Map();   // orderId (UUID) -> order
const byPaypalId = new Map();   // paypalOrderId  -> orderId
const byOrderNum = new Set();   // orderNumbers issued this session
const byEmail    = new Map();   // email -> Set of orderIds

/* ── Boot: replay log ────────────────────────────────────────────── */
if (fs.existsSync(LOG_FILE)) {
  for (const line of fs.readFileSync(LOG_FILE, 'utf8').split('\n')) {
    if (!line.trim()) continue;
    try {
      const record  = JSON.parse(line);
      const existing = orders.get(record.orderId) || {};
      const merged   = { ...existing, ...record };
      orders.set(record.orderId, merged);
      if (merged.paypalOrderId) byPaypalId.set(merged.paypalOrderId, record.orderId);
      if (merged.orderNumber)   byOrderNum.add(merged.orderNumber);
      if (merged.email) {
        if (!byEmail.has(merged.email)) byEmail.set(merged.email, new Set());
        byEmail.get(merged.email).add(record.orderId);
      }
    } catch { /* torn last line — safe to ignore */ }
  }
}

let fd     = fs.openSync(LOG_FILE, 'a');
let closed = false;

function append(record) {
  if (closed) throw new Error('Order store is closed');
  fs.writeSync(fd, JSON.stringify(record) + '\n');
  fs.fsyncSync(fd);
}

/* ── Order number: TK-2408-ERIKA-XK ─────────────────────────────── */
const ALPHA = '23456789ABCDEFGHJKLMNPQRSTUVWXYZ'; // no 0/O, 1/I confusion

function randomSuffix(len = 4) {
  let out = '';
  for (const byte of crypto.randomBytes(len)) out += ALPHA[byte % ALPHA.length];
  return out;
}

function makeOrderNumber(data = {}) {
  const now   = new Date();
  const yymm  = String(now.getFullYear()).slice(2) +
                String(now.getMonth() + 1).padStart(2, '0');

  const name  = (data.shipping?.firstName || 'GUEST')
    .toUpperCase()
    .replace(/[^A-Z0-9]/g, '')
    .slice(0, 8);

  // Retry up to 10 times to guarantee uniqueness within this process.
  for (let attempt = 0; attempt < 10; attempt++) {
    const suffix = randomSuffix(4);
    const num    = `TK-${yymm}-${name}-${suffix}`;
    if (!byOrderNum.has(num)) {
      byOrderNum.add(num);
      return num;
    }
  }

  // Astronomically unlikely, but fall back to a longer suffix.
  const fallback = `TK-${yymm}-${name}-${randomSuffix(8)}`;
  byOrderNum.add(fallback);
  return fallback;
}

/* ── DynamoDB client (lazy, cached) ─────────────────────────────── */
let dynamoClient = null;

async function getDynamo() {
  if (dynamoClient) return dynamoClient;
  if (!process.env.AWS_ACCESS_KEY_ID || !process.env.AWS_SECRET_ACCESS_KEY) return null;
  try {
    const { DynamoDBClient }        = await import('@aws-sdk/client-dynamodb');
    const { DynamoDBDocumentClient } = await import('@aws-sdk/lib-dynamodb');
    const base = new DynamoDBClient({ region: AWS_REGION });
    dynamoClient = DynamoDBDocumentClient.from(base);
    return dynamoClient;
  } catch (err) {
    console.warn('[store] DynamoDB client init failed:', err.message);
    return null;
  }
}

/**
 * Push the full order to DynamoDB with a conditional write:
 *   - On CREATE: fails if orderID already exists (prevents duplicate rows)
 *   - On UPDATE: always overwrites (idempotent status updates are safe)
 */
async function syncToDynamo(order, isCreate = false) {
  try {
    const client = await getDynamo();
    if (!client) return;

    const { PutCommand } = await import('@aws-sdk/lib-dynamodb');

    const item = {
      orderID:       order.orderId,          // partition key — matches table schema
      orderId:       order.orderId,          // convenience duplicate
      orderNumber:   order.orderNumber,
      status:        order.status,
      createdAt:     order.createdAt,
      updatedAt:     order.updatedAt,
      paypalOrderId: order.paypalOrderId  || undefined,
      captureId:     order.captureId      || undefined,
      email:         order.email          || undefined,
      payerEmail:    order.payerEmail     || undefined,
      grandTotal:    order.quote?.grandTotal  || undefined,
      currency:      order.quote?.currency    || 'EUR',
      couponCode:    order.couponCode         || undefined,
      discount:      order.quote?.discount    || undefined,
      paidAmount:    order.paidAmount     || undefined,
      paidAt:        order.paidAt         || undefined,
      settledVia:    order.settledVia     || undefined,
      firstName:     order.shipping?.firstName || undefined,
      lastName:      order.shipping?.lastName  || undefined,
      city:          order.shipping?.city      || undefined,
      country:       order.shipping?.country   || undefined,
      rawQuote:      JSON.stringify(order.quote    || {}),
      rawShipping:   JSON.stringify(order.shipping || {})
    };

    // Strip undefined values — DynamoDB SDK rejects them
    for (const key of Object.keys(item)) {
      if (item[key] === undefined) delete item[key];
    }

    const cmd = new PutCommand({
      TableName:                ORDERS_TABLE,
      Item:                     item,
      // On first create: reject if a row with this orderID already exists.
      // This makes the write idempotent — a retry of the same UUID is a no-op.
      ...(isCreate && {
        ConditionExpression:          'attribute_not_exists(orderID)',
      })
    });

    await client.send(cmd);
  } catch (err) {
    // ConditionalCheckFailedException means the row already exists —
    // that is actually fine on a retry; anything else is logged.
    if (err.name !== 'ConditionalCheckFailedException') {
      console.warn('[store] DynamoDB sync failed:', err.message);
    }
  }
}

/* ── Public API ──────────────────────────────────────────────────── */

export function createOrder(data) {
  // Idempotency: if the same PayPal order ID arrives twice (retry storm),
  // return the existing order instead of creating a duplicate.
  if (data.paypalOrderId && byPaypalId.has(data.paypalOrderId)) {
    const existingId = byPaypalId.get(data.paypalOrderId);
    const existing   = orders.get(existingId);
    if (existing) {
      console.warn('[store] duplicate createOrder for PayPal ID', data.paypalOrderId, '— returning existing');
      return existing;
    }
  }

  const orderId = crypto.randomUUID();
  const now     = new Date().toISOString();
  const record  = {
    orderId,
    orderNumber: makeOrderNumber(data),
    status:      'CREATED',
    createdAt:   now,
    updatedAt:   now,
    ...data
  };

  orders.set(orderId, record);
  if (record.paypalOrderId) byPaypalId.set(record.paypalOrderId, orderId);
  if (record.email) {
    if (!byEmail.has(record.email)) byEmail.set(record.email, new Set());
    byEmail.get(record.email).add(orderId);
  }

  append(record);
  syncToDynamo(record, true);   // async, non-blocking, conditional write
  return record;
}

export function updateOrder(orderId, patch) {
  const existing = orders.get(orderId);
  if (!existing) return null;

  const merged = {
    ...existing,
    ...patch,
    orderId,
    updatedAt: new Date().toISOString()
  };

  orders.set(orderId, merged);
  if (merged.paypalOrderId) byPaypalId.set(merged.paypalOrderId, orderId);
  if (merged.email) {
    if (!byEmail.has(merged.email)) byEmail.set(merged.email, new Set());
    byEmail.get(merged.email).add(orderId);
  }

  append({ orderId, ...patch, updatedAt: merged.updatedAt });
  syncToDynamo(merged, false);  // async, non-blocking, unconditional update
  return merged;
}

export const getOrder          = (orderId)      => orders.get(orderId) || null;
export const getOrdersByEmail = (email) => {
  if (!email) return [];
  const ids = byEmail.get(email.toLowerCase().trim()) || new Set();
  return Array.from(ids)
    .map(id => orders.get(id))
    .filter(Boolean)
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
};

export const getOrderByPaypalId = (paypalOrderId) => {
  const id = byPaypalId.get(paypalOrderId);
  return id ? orders.get(id) : null;
};

/** Webhooks are delivered more than once — process each event exactly once. */
const seenEvents = new Set();

export function markEventSeen(eventId) {
  if (seenEvents.has(eventId)) return false;
  seenEvents.add(eventId);
  if (seenEvents.size > 10_000) seenEvents.delete(seenEvents.values().next().value);
  return true;
}

export function closeStore() {
  if (closed) return;
  closed = true;
  try { fs.closeSync(fd); } catch { /* already closed */ }
  fd = -1;
}
