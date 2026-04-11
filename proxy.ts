import { NextProxy, NextRequest, NextResponse, ProxyConfig } from "next/server";

import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";

const redis = new Redis({
  url: process.env.REDIS_UPSTASH_KV_REST_API_URL,
  token: process.env.REDIS_UPSTASH_KV_REST_API_TOKEN,
})

const ratelimit = new Ratelimit({
  redis: redis,
  limiter: Ratelimit.fixedWindow(10, "1 m"),
});

export const proxy: NextProxy = async (req: NextRequest) => {
  const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? req.headers.get("x-real-ip") ?? "unknown"
  const key = `rate-limit:${ip}`;
  const result = await ratelimit.limit(key);

  if (!result.success) {
    const url = req.nextUrl.clone()
    url.pathname = "/ratelimited"
    return NextResponse.rewrite(url)
  }

  return NextResponse.next()
}

export const config: ProxyConfig = {
  matcher: "/compare/:path*"
}