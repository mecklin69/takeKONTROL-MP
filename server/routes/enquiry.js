/**
 * takeKONTROL — Enquiry route
 * =================================================================
 * The original enquiry.js put AWS credentials directly in the browser
 * source, which exposed them to anyone who opened devtools. That
 * approach is also broken by the AWS SDK v2 requiring the global `AWS`
 * object from a CDN script, which CSP headers and ad blockers routinely
 * block.
 *
 * This route runs on the server where the credentials stay in .env and
 * never appear in a response. The browser POSTs JSON; this writes to
 * DynamoDB and replies; done.
 *
 * Required .env additions:
 *   AWS_REGION=ap-south-1
 *   AWS_ACCESS_KEY_ID=...      (use a new key — rotate the old one NOW)
 *   AWS_SECRET_ACCESS_KEY=...
 *   DYNAMODB_TABLE=TakeKONTROL_enquiries
 * =================================================================
 */

import { Router } from 'express';
import { asyncHandler } from '../middleware/async-handler.js';

export const enquiryRouter = Router();

const EMAIL_PATTERN = /^[^@\s]+@[^@\s]+\.[^@\s]{2,}$/;

const REQUIRED = ['firstName', 'lastName', 'email', 'message', 'consent'];

const TABLE = process.env.DYNAMODB_TABLE || 'TakeKONTROL_enquiries';
const REGION = process.env.AWS_REGION || 'ap-south-1';

/** Lazy-load the AWS SDK so the server boots cleanly without it. */
let docClient = null;
async function getClient() {
  if (docClient) return docClient;

  if (!process.env.AWS_ACCESS_KEY_ID || !process.env.AWS_SECRET_ACCESS_KEY) {
    throw new Error('AWS credentials not configured. Set AWS_ACCESS_KEY_ID and AWS_SECRET_ACCESS_KEY in .env');
  }

  // AWS SDK v3 ships with Node 18+; v2 does not. Use v3.
  const { DynamoDBClient } = await import('@aws-sdk/client-dynamodb');
  const { DynamoDBDocumentClient } = await import('@aws-sdk/lib-dynamodb');

  const base = new DynamoDBClient({ region: REGION });
  docClient = DynamoDBDocumentClient.from(base);
  return docClient;
}

function validate(body) {
  if (!body || typeof body !== 'object') return 'missing body';
  for (const field of REQUIRED) {
    if (field === 'consent') {
      if (!body.consent) return 'consent required';
      continue;
    }
    if (!String(body[field] || '').trim()) return `${field} required`;
  }
  if (!EMAIL_PATTERN.test(String(body.email || '').trim())) return 'invalid email';
  return null;
}

enquiryRouter.post('/enquiry', asyncHandler(async (req, res) => {
  const problem = validate(req.body);
  if (problem) return res.status(400).json({ error: 'INVALID_INPUT', message: problem });

  const b = req.body;
  const item = {
    email_timestamp: `${String(b.email).trim()}_${Date.now()}`,
    Type: String(b.type || 'personal').slice(0, 50),
    FirstName: String(b.firstName || '').trim().slice(0, 200),
    LastName: String(b.lastName || '').trim().slice(0, 200),
    Email: String(b.email || '').trim().slice(0, 200),
    Phone: String(b.phone || 'N/A').trim().slice(0, 40),
    BusinessDetails: {
      Company: String(b.company || 'N/A').trim().slice(0, 200),
      Role: String(b.role || 'N/A').trim().slice(0, 200),
      Size: String(b.size || 'N/A').slice(0, 50),
      Industry: String(b.industry || 'N/A').slice(0, 100)
    },
    ProductInterest: String(b.product || 'N/A').slice(0, 200),
    Budget: String(b.budget || 'N/A').slice(0, 100),
    Message: String(b.message || '').trim().slice(0, 4000),
    Lang: String(b.lang || 'de').slice(0, 5),
    SubmittedAt: new Date().toISOString()
  };

  try {
    const client = await getClient();
    const { PutCommand } = await import('@aws-sdk/lib-dynamodb');
    await client.send(new PutCommand({ TableName: TABLE, Item: item }));
    return res.json({ ok: true });
  } catch (err) {
    console.error('[enquiry] DynamoDB error:', err.name, err.message);

    // The table does not exist yet, AWS creds are wrong, or the region
    // is off — all produce a clear message in the log. The visitor gets
    // a generic error so they try again or email directly.
    return res.status(502).json({ error: 'ENQUIRY_FAILED' });
  }
}));
