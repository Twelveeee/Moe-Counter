const DEFAULT_COUNT = 0;
const DEFAULT_PREFIX = "moe_count_";

export function createUpstashStore({
  restUrl,
  restToken,
  prefix = DEFAULT_PREFIX,
  fetchImpl = fetch,
}) {
  if (!restUrl) {
    throw new Error("UPSTASH_REDIS_REST_URL is required when DB_DRIVER=upstash");
  }

  if (!restToken) {
    throw new Error("UPSTASH_REDIS_REST_TOKEN is required when DB_DRIVER=upstash");
  }

  const baseUrl = restUrl.replace(/\/$/, "");

  return {
    async incrementAndGet(name) {
      const result = await execCommand({
        baseUrl,
        restToken,
        fetchImpl,
        command: "incr",
        key: `${prefix}${name}`,
      });

      return {
        name,
        num: Number(result ?? DEFAULT_COUNT),
      };
    },

    async getNum(name) {
      const result = await execCommand({
        baseUrl,
        restToken,
        fetchImpl,
        command: "get",
        key: `${prefix}${name}`,
      });

      if (result === null || result === undefined) {
        return { name, num: DEFAULT_COUNT };
      }

      return {
        name,
        num: Number(result),
      };
    },
  };
}

async function execCommand({ baseUrl, restToken, fetchImpl, command, key }) {
  const url = `${baseUrl}/${command}/${encodeURIComponent(key)}`;

  const response = await fetchImpl(url, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${restToken}`,
    },
  });

  if (!response.ok) {
    throw new Error(`Upstash request failed: ${response.status} ${response.statusText}`);
  }

  const payload = await response.json();

  if (payload.error) {
    throw new Error(`Upstash error: ${payload.error}`);
  }

  return payload.result;
}
