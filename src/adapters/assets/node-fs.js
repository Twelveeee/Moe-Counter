import fs from "node:fs/promises";
import path from "node:path";

import mime from "mime-types";

export function createNodeFsAssetsAdapter() {
  const assetsRoot = resolveAssetsRoot();

  return {
    async readJson(relativePath) {
      const filePath = resolveRelativeAssetPath(relativePath, assetsRoot);
      const content = await fs.readFile(filePath, "utf8");
      return JSON.parse(content);
    },

    async readBinary(relativePath) {
      const filePath = resolveRelativeAssetPath(relativePath, assetsRoot);
      const content = await fs.readFile(filePath);
      return new Uint8Array(content);
    },

    async serve(pathname) {
      if (!pathname.startsWith("/assets/")) {
        return null;
      }

      const relative = pathname.slice("/assets/".length);
      const filePath = resolveRelativeAssetPath(relative, assetsRoot);

      try {
        const content = await fs.readFile(filePath);

        return new Response(content, {
          status: 200,
          headers: {
            "content-type": detectMime(filePath),
          },
        });
      } catch (error) {
        if (error?.code === "ENOENT") {
          return null;
        }

        throw error;
      }
    },
  };
}

function resolveAssetsRoot() {
  if (typeof process !== "undefined" && typeof process.cwd === "function") {
    return path.resolve(process.cwd(), "assets");
  }

  return path.resolve("assets");
}

function resolveRelativeAssetPath(relativePath, assetsRoot) {
  const decoded = decodeURIComponent(relativePath);
  const normalized = path.posix.normalize(`/${decoded}`).replace(/^\//, "");

  if (!normalized || normalized.startsWith("..")) {
    throw new Error(`Invalid asset path: ${relativePath}`);
  }

  const filePath = path.join(assetsRoot, normalized);
  if (!filePath.startsWith(assetsRoot)) {
    throw new Error(`Invalid asset path: ${relativePath}`);
  }

  return filePath;
}

function detectMime(filePath) {
  if (filePath.endsWith(".less")) {
    return "text/css; charset=utf-8";
  }

  return mime.lookup(filePath) || "application/octet-stream";
}
