interface RateLimitEntry {
  count: number;
  timestamp: number;
}

const rateLimitMap = new Map<string, RateLimitEntry>();

export function rateLimit(
  identifier: string,
  maxRequests: number = 10,
  windowMs: number = 60000 // 1 minute
): boolean {
  const now = Date.now();
  const userLimit = rateLimitMap.get(identifier);

  // If no entry or window expired, create new entry
  if (!userLimit || now - userLimit.timestamp > windowMs) {
    rateLimitMap.set(identifier, { count: 1, timestamp: now });
    return true;
  }

  // If limit exceeded, reject
  if (userLimit.count >= maxRequests) {
    return false;
  }

  // Increment and allow
  userLimit.count++;
  return true;
}

export function getRateLimitStatus(
  identifier: string,
  maxRequests: number = 10,
  windowMs: number = 60000
) {
  const now = Date.now();
  const userLimit = rateLimitMap.get(identifier);

  if (!userLimit || now - userLimit.timestamp > windowMs) {
    return {
      remaining: maxRequests,
      limit: maxRequests,
      resetAt: new Date(now + windowMs).toISOString(),
    };
  }

  return {
    remaining: Math.max(0, maxRequests - userLimit.count),
    limit: maxRequests,
    resetAt: new Date(userLimit.timestamp + windowMs).toISOString(),
  };
}

// Cleanup old entries every hour
setInterval(() => {
  const now = Date.now();
  for (const [key, entry] of rateLimitMap.entries()) {
    if (now - entry.timestamp > 3600000) { // 1 hour
      rateLimitMap.delete(key);
    }
  }
}, 3600000);
