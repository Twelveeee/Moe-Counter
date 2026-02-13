import { createNodeFsAssetsAdapter } from "./node-fs.js";
import { createWorkerAssetsAdapter } from "./worker-assets.js";

export function createAssetsAdapter({ platform, assetsBinding }) {
  if (platform === "worker") {
    return createWorkerAssetsAdapter(assetsBinding);
  }

  if (platform === "node") {
    return createNodeFsAssetsAdapter();
  }

  throw new Error(`Unsupported assets platform: ${platform}`);
}
