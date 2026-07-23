// Lightweight structured logger with correlation IDs.
// Emits JSON in production, pretty in dev. Safe on server + client.

type Level = "debug" | "info" | "warn" | "error";
type Fields = Record<string, unknown>;

const isDev = typeof import.meta !== "undefined" && (import.meta as any).env?.DEV;

export function newCorrelationId(): string {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) return crypto.randomUUID();
  return `cid_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 10)}`;
}

function emit(level: Level, scope: string, message: string, fields?: Fields) {
  const record = {
    ts: new Date().toISOString(),
    level,
    scope,
    message,
    ...fields,
  };
  const line = isDev ? `[${level}] ${scope}: ${message}` : JSON.stringify(record);
  const method = level === "error" ? "error" : level === "warn" ? "warn" : "log";
  // eslint-disable-next-line no-console
  (console as any)[method](line, isDev && fields ? fields : "");
}

export const log = {
  debug: (scope: string, msg: string, f?: Fields) => emit("debug", scope, msg, f),
  info: (scope: string, msg: string, f?: Fields) => emit("info", scope, msg, f),
  warn: (scope: string, msg: string, f?: Fields) => emit("warn", scope, msg, f),
  error: (scope: string, msg: string, f?: Fields) => emit("error", scope, msg, f),
};

export function logError(scope: string, error: unknown, fields?: Fields) {
  const err = error instanceof Error ? error : new Error(String(error));
  emit("error", scope, err.message, {
    ...fields,
    errorName: err.name,
    stack: err.stack,
  });
}

/** Wrap a fetch-like call with a correlation ID header + structured timing log. */
export async function tracedFetch(
  scope: string,
  input: RequestInfo | URL,
  init?: RequestInit,
): Promise<Response> {
  const correlationId = newCorrelationId();
  const start = Date.now();
  const headers = new Headers(init?.headers);
  headers.set("x-correlation-id", correlationId);
  try {
    const res = await fetch(input, { ...init, headers });
    log.info(scope, "fetch.complete", {
      correlationId,
      url: String(input),
      status: res.status,
      durationMs: Date.now() - start,
    });
    return res;
  } catch (err) {
    logError(scope, err, { correlationId, url: String(input), durationMs: Date.now() - start });
    throw err;
  }
}
