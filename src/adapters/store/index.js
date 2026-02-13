import { createD1Store } from "./d1.js";
import { createUpstashStore } from "./upstash.js";

export function createStore({ env, fetchImpl = fetch }) {
  const driver = (env.DB_DRIVER || "d1").toLowerCase();

  if (driver === "d1") {
    return createD1Store(env.DB);
  }

  if (driver === "upstash") {
    return createUpstashStore({
      restUrl: env.UPSTASH_REDIS_REST_URL,
      restToken: env.UPSTASH_REDIS_REST_TOKEN,
      prefix: env.COUNTER_PREFIX || "moe_count_",
      fetchImpl,
    });
  }

  throw new Error(`Unsupported DB_DRIVER: ${driver}`);
}
