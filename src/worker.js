import { createAssetsAdapter } from "./adapters/assets/index.js";
import { createStore } from "./adapters/store/index.js";
import { handleAppRequest } from "./core/app.js";
import { createLogger } from "./lib/logger.js";

export default {
  async fetch(request, env) {
    const logger = createLogger(env.LOG_LEVEL || "info");
    let store;

    const runtime = {
      env,
      logger,
      assets: createAssetsAdapter({
        platform: "worker",
        assetsBinding: env.ASSETS,
      }),
      getStore: () => {
        if (!store) {
          store = createStore({ env });
        }

        return store;
      },
    };

    return handleAppRequest(request, runtime);
  },
};
