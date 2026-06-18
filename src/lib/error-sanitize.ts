// Sanitizes database/internal error messages before showing to users
// Prevents leaking schema details, table names, constraint names, etc.

const SENSITIVE_PATTERNS = [
  /relation/i,
  /table/i,
  /column/i,
  /constraint/i,
  /index/i,
  /foreign key/i,
  /primary key/i,
  /unique/i,
  /violates/i,
  /duplicate key/i,
  /null value/i,
  /insert/i,
  /update/i,
  /delete/i,
  /select/i,
  /supabase/i,
  /postgres/i,
  /postgresql/i,
  /pg_/i,
  /public\./i,
  /private\./i,
  /auth\./i,
  /function/i,
  /permission denied/i,
  /rls/i,
  /row level security/i,
  /policy/i,
];

const GENERIC_MESSAGES: Record<string, string> = {
  "Invalid login credentials": "Invalid email or password",
  "Email not confirmed": "Please verify your email address first",
  "User already registered": "An account with this email already exists",
  "Password should be at least": "Password is too short",
  "Unable to validate email": "Invalid email address",
};

export function sanitizeError(error: unknown): string {
  if (!error) return "Something went wrong";

  // Handle string errors
  if (typeof error === "string") {
    return sanitizeMessage(error);
  }

  // Handle Error objects
  if (error instanceof Error) {
    return sanitizeMessage(error.message);
  }

  // Handle Supabase-style errors with message property
  if (typeof error === "object" && error !== null) {
    const obj = error as Record<string, unknown>;
    if (typeof obj.message === "string") {
      return sanitizeMessage(obj.message);
    }
    if (typeof obj.error === "string") {
      return sanitizeMessage(obj.error);
    }
    if (typeof obj.error_description === "string") {
      return sanitizeMessage(obj.error_description);
    }
  }

  return "Something went wrong";
}

function sanitizeMessage(message: string): string {
  // Check for known user-friendly messages first
  for (const [key, value] of Object.entries(GENERIC_MESSAGES)) {
    if (message.includes(key)) {
      return value;
    }
  }

  // Check for sensitive patterns
  for (const pattern of SENSITIVE_PATTERNS) {
    if (pattern.test(message)) {
      return "Something went wrong. Please try again.";
    }
  }

  // If message is too technical/long, use generic
  if (message.length > 200) {
    return "Something went wrong. Please try again.";
  }

  return message;
}
