/**
 * takeKONTROL — DynamoDB service
 * All user-oriented reads go through here.
 * Writes still go through store.js (local log + DynamoDB sync).
 */

import { DATA_DIR } from './config.js';

const ORDERS_TABLE    = process.env.DYNAMODB_ORDERS_TABLE    || 'takeKONTROL-Orders';
const ADDRESSES_TABLE = process.env.DYNAMODB_ADDRESSES_TABLE || 'takeKONTROL-Addresses';
const RETURNS_TABLE   = process.env.DYNAMODB_RETURNS_TABLE   || 'takeKONTROL-Returns';
const AWS_REGION      = process.env.AWS_REGION               || 'ap-south-1';

let client = null;

async function getClient() {
  if (client) return client;
  if (!process.env.AWS_ACCESS_KEY_ID) return null;
  try {
    const { DynamoDBClient }         = await import('@aws-sdk/client-dynamodb');
    const { DynamoDBDocumentClient } = await import('@aws-sdk/lib-dynamodb');
    const base = new DynamoDBClient({ region: AWS_REGION });
    client = DynamoDBDocumentClient.from(base);
    return client;
  } catch (err) {
    console.warn('[dynamo] client init failed:', err.message);
    return null;
  }
}

/* ── Orders ─────────────────────────────────────────────────────── */

/** Get all orders for a user by email via GSI */
export async function getOrdersByEmail(email) {
  try {
    const c = await getClient();
    if (!c) return [];
    const { QueryCommand } = await import('@aws-sdk/lib-dynamodb');
    const res = await c.send(new QueryCommand({
      TableName:                 ORDERS_TABLE,
      IndexName:                 'email-index',
      KeyConditionExpression:    'email = :email',
      ExpressionAttributeValues: { ':email': email.toLowerCase().trim() },
      ScanIndexForward:          false   // newest first
    }));
    return res.Items || [];
  } catch (err) {
    console.warn('[dynamo] getOrdersByEmail failed:', err.message);
    return [];
  }
}

/** Get single order by orderID */
export async function getOrderById(orderID) {
  try {
    const c = await getClient();
    if (!c) return null;
    const { GetCommand } = await import('@aws-sdk/lib-dynamodb');
    const res = await c.send(new GetCommand({
      TableName: ORDERS_TABLE,
      Key: { orderID }
    }));
    return res.Item || null;
  } catch (err) {
    console.warn('[dynamo] getOrderById failed:', err.message);
    return null;
  }
}

/* ── Addresses ──────────────────────────────────────────────────── */

export async function getAddresses(userUID) {
  try {
    const c = await getClient();
    if (!c) return [];
    const { QueryCommand } = await import('@aws-sdk/lib-dynamodb');
    const res = await c.send(new QueryCommand({
      TableName:                 ADDRESSES_TABLE,
      KeyConditionExpression:    'userUID = :uid',
      ExpressionAttributeValues: { ':uid': userUID }
    }));
    return res.Items || [];
  } catch (err) {
    console.warn('[dynamo] getAddresses failed:', err.message);
    return [];
  }
}

export async function saveAddress(userUID, address) {
  try {
    const c = await getClient();
    if (!c) return false;
    const { PutCommand } = await import('@aws-sdk/lib-dynamodb');
    const addressId = address.addressId || `addr_${Date.now()}`;
    await c.send(new PutCommand({
      TableName: ADDRESSES_TABLE,
      Item: { userUID, addressId, ...address, updatedAt: new Date().toISOString() }
    }));
    return addressId;
  } catch (err) {
    console.warn('[dynamo] saveAddress failed:', err.message);
    return false;
  }
}

export async function deleteAddress(userUID, addressId) {
  try {
    const c = await getClient();
    if (!c) return false;
    const { DeleteCommand } = await import('@aws-sdk/lib-dynamodb');
    await c.send(new DeleteCommand({
      TableName: ADDRESSES_TABLE,
      Key: { userUID, addressId }
    }));
    return true;
  } catch (err) {
    console.warn('[dynamo] deleteAddress failed:', err.message);
    return false;
  }
}

/* ── Returns ────────────────────────────────────────────────────── */

export async function submitReturn(returnRequest) {
  try {
    const c = await getClient();
    if (!c) return false;
    const { PutCommand } = await import('@aws-sdk/lib-dynamodb');
    const returnId = `RET-${Date.now()}`;
    await c.send(new PutCommand({
      TableName: RETURNS_TABLE,
      Item: {
        returnId,
        status:    'REQUESTED',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        ...returnRequest
      }
    }));
    return returnId;
  } catch (err) {
    console.warn('[dynamo] submitReturn failed:', err.message);
    return false;
  }
}

export async function getReturnsByEmail(email) {
  try {
    const c = await getClient();
    if (!c) return [];
    const { QueryCommand } = await import('@aws-sdk/lib-dynamodb');
    const res = await c.send(new QueryCommand({
      TableName:                 RETURNS_TABLE,
      IndexName:                 'email-index',
      KeyConditionExpression:    'email = :email',
      ExpressionAttributeValues: { ':email': email.toLowerCase().trim() },
      ScanIndexForward:          false
    }));
    return res.Items || [];
  } catch (err) {
    console.warn('[dynamo] getReturnsByEmail failed:', err.message);
    return [];
  }
}
