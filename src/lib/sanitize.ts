/**
 * Sanitizes user input before sending to AI to prevent prompt injection.
 */

const MAX_MESSAGE_LENGTH = 4000;

const INJECTION_PATTERNS = [
  /\b(ignore|disregard|forget)\s+(all\s+)?(previous|prior|above)\s+(instructions?|orders?|commands?)/gi,
  /\b(you\s+are\s+now|act\s+as|pretend\s+to\s+be|simulate)\b/gi,
  /\b(system|prompt|instruct)\s*:/gi,
  /\[(system|prompt|instructions?)\]/gi,
  /\b(jailbreak|bypass|override)\b/gi,
  /\x00/g,
  /[\x1b\x1c\x1d\x1e\x1f]/g,
];

export function sanitizeInput(input: string): { sanitized: string; wasModified: boolean } {
  let wasModified = false;
  let sanitized = input.trim();

  if (sanitized.length > MAX_MESSAGE_LENGTH) {
    sanitized = sanitized.slice(0, MAX_MESSAGE_LENGTH);
    wasModified = true;
  }

  for (const pattern of INJECTION_PATTERNS) {
    if (pattern.test(sanitized)) {
      sanitized = sanitized.replace(pattern, "");
      wasModified = true;
    }
  }

  sanitized = sanitized.replace(/\s+/g, " ").trim();

  if (sanitized !== input.trim()) {
    wasModified = true;
  }

  return { sanitized, wasModified };
}

export function sanitizeForToolArg(input: string): string {
  return input.replace(/[<>\"\'\\]/g, "").trim();
}
