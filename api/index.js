import { createAssetsAdapter } from "../src/adapters/assets/index.js";
import { createStore } from "../src/adapters/store/index.js";
import { handleAppRequest } from "../src/core/app.js";
import { createLogger } from "../src/lib/logger.js";

export default async function handler(req, res) {
  const logger = createLogger(process.env.LOG_LEVEL || "info");
  let store;

  const headers = new Headers();
  for (const [key, value] of Object.entries(req.headers)) {
    if (Array.isArray(value)) {
      headers.set(key, value.join(", "));
    } else if (value !== undefined) {
      headers.set(key, String(value));
    }
  }

  const protocol = req.headers["x-forwarded-proto"] || "https";
  const host = req.headers["x-forwarded-host"] || req.headers.host || "localhost";
  const url = `${protocol}://${host}${req.url}`;

  const request = new Request(url, {
    method: req.method,
    headers,
  });

  const runtime = {
    env: process.env,
    logger,
    assets: createAssetsAdapter({ platform: "node" }),
    getStore: () => {
      if (!store) {
        store = createStore({
          env: process.env,
        });
      }

      return store;
    },
  };

  const response = await handleAppRequest(request, runtime);

  res.statusCode = response.status;
  response.headers.forEach((value, key) => {
    res.setHeader(key, value);
  });

  const body = Buffer.from(await response.arrayBuffer());
  res.end(body);
}
