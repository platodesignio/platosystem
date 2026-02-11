type RateRecord = {
  count: number;
  lastReset: number;
};

const RATE_LIMIT_WINDOW = 60 * 1000; // 1分
const MAX_REQUESTS = 30;

const store = new Map<string, RateRecord>();

export function checkRateLimit(
  key: string
): boolean {
  const now = Date.now();
  const record = store.get(key);

  if (!record) {
    store.set(key, {
      count: 1,
      lastReset: now
    });
    return true;
  }

  if (now - record.lastReset > RATE_LIMIT_WINDOW) {
    store.set(key, {
      count: 1,
      lastReset: now
    });
    return true;
  }

  if (record.count >= MAX_REQUESTS) {
    return false;
  }

  record.count++;
  return true;
}
