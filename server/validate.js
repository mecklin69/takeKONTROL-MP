/**
 * takeKONTROL — Input validation
 * =================================================================
 * The checkout form validates the same rules in the browser for fast
 * feedback. These are the ones that count: a request can arrive from
 * curl with any body at all.
 * =================================================================
 */

/** Countries we ship to. Adding one here is the only change needed. */
export const EU_SHIPPING = ['DE', 'AT', 'CH', 'NL', 'BE', 'LU', 'FR', 'DK', 'PL', 'CZ'];

export const EMAIL_PATTERN = /^[^@\s]+@[^@\s]+\.[^@\s]{2,}$/;

const REQUIRED_FIELDS = [
  'firstName', 'lastName', 'street', 'houseNumber',
  'postalCode', 'city', 'country', 'email'
];

const MAX_FIELD_LENGTH = 200;

/**
 * @param {unknown} input
 * @returns {{value: object} | {error: string}} the offending field name
 *          on failure, so the client can highlight exactly one input.
 */
export function validateShipping(input) {
  if (!input || typeof input !== 'object') return { error: 'shipping' };

  const shipping = {};
  for (const field of REQUIRED_FIELDS) {
    const value = String(input[field] || '').trim();
    if (!value) return { error: field };
    shipping[field] = value.slice(0, MAX_FIELD_LENGTH);
  }

  shipping.addressExtra = String(input.addressExtra || '').trim().slice(0, MAX_FIELD_LENGTH);
  shipping.phone = String(input.phone || '').trim().slice(0, 40);

  if (!EMAIL_PATTERN.test(shipping.email)) return { error: 'email' };
  if (!EU_SHIPPING.includes(shipping.country)) return { error: 'country' };
  if (shipping.country === 'DE' && !/^\d{5}$/.test(shipping.postalCode)) {
    return { error: 'postalCode' };
  }

  return { value: shipping };
}
