/**
 * Security and sanitization utilities for DU Badhon
 * Standardized according to OWASP Top 10 & defensive engineering guidelines.
 */

// Bangladeshi mobile phone regex: 013-019 (11 digits) or with +88 prefix
const BD_PHONE_REGEX = /^(\+?8801|01)[3-9]\d{8}$/;

/**
 * Validates and sanitizes a phone number to prevent protocol injection,
 * malformed dialer intents, and garbage data.
 */
export function validateAndSanitizePhone(rawPhone: string): {
  valid: boolean;
  sanitized: string;
  error?: string;
} {
  if (!rawPhone || typeof rawPhone !== "string") {
    return { valid: false, sanitized: "", error: "Phone number is required." };
  }

  // Strip all whitespace, dashes, parentheses
  const cleaned = rawPhone.replace(/[\s\-()]/g, "").trim();

  // Ensure only digits and leading plus sign
  if (!/^\+?\d+$/.test(cleaned)) {
    return {
      valid: false,
      sanitized: cleaned,
      error: "Phone number must contain digits only.",
    };
  }

  // Normalize: if 11 digits starting with 01, format standard
  if (!BD_PHONE_REGEX.test(cleaned)) {
    return {
      valid: false,
      sanitized: cleaned,
      error: "Please enter a valid 11-digit Bangladeshi mobile number (e.g., 017XXXXXXXX).",
    };
  }

  return { valid: true, sanitized: cleaned };
}

/**
 * Returns a strictly sanitized tel: URI preventing any scheme or parameter injection.
 */
export function getSafeTelUri(phone: string): string {
  if (!phone || typeof phone !== "string") return "#";
  const cleanDigits = phone.replace(/[^0-9+]/g, "");
  return cleanDigits.length >= 7 ? `tel:${cleanDigits}` : "#";
}

/**
 * Returns a strictly sanitized WhatsApp link.
 */
export function getSafeWhatsAppUri(phone: string): string {
  if (!phone || typeof phone !== "string") return "#";
  // Strip everything except digits
  let digits = phone.replace(/\D/g, "");
  // Prepend BD country code 88 if not already present
  if (digits.startsWith("01")) {
    digits = `88${digits}`;
  }
  return digits.length >= 10 ? `https://wa.me/${digits}` : "#";
}

/**
 * Strips ASCII control characters, trims whitespace, and clamps length to prevent
 * storage exhaustion (DoS) and visual injection.
 */
export function sanitizeInputText(
  rawText: string | undefined | null,
  maxLength = 250,
): string {
  if (!rawText || typeof rawText !== "string") return "";

  // Strip ASCII control characters (0x00-0x1F except newline and tab) and 0x7F
  const stripped = rawText.replace(/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/g, "");

  return stripped.trim().slice(0, maxLength);
}
