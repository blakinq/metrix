/**
 * Minimal structured logger. Sentry hook is a no-op until SENTRY_DSN is wired.
 * See §18.
 */
type Fields = Record<string, unknown>;

function emit(level: string, msg: string, fields?: Fields) {
  const payload = {
    ts: new Date().toISOString(),
    level,
    msg,
    ...fields,
  };
  if (level === "error") console.error(JSON.stringify(payload));
  else if (level === "warn") console.warn(JSON.stringify(payload));
  else console.log(JSON.stringify(payload));
}

export const log = {
  info: (msg: string, fields?: Fields) => emit("info", msg, fields),
  warn: (msg: string, fields?: Fields) => emit("warn", msg, fields),
  error: (msg: string, fields?: Fields) => emit("error", msg, fields),
};
