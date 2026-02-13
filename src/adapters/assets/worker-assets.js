export function createWorkerAssetsAdapter(assetsBinding) {
  if (!assetsBinding || typeof assetsBinding.fetch !== "function") {
    throw new Error("Cloudflare assets binding `ASSETS` is missing or invalid");
  }

  return {
    async readJson(relativePath) {
      const response = await assetsBinding.fetch(toAssetsUrl(relativePath));
      if (!response.ok) {
        throw new Error(`Asset not found: ${relativePath} (${response.status})`);
      }
      return response.json();
    },

    async readBinary(relativePath) {
      const response = await assetsBinding.fetch(toAssetsUrl(relativePath));
      if (!response.ok) {
        throw new Error(`Asset not found: ${relativePath} (${response.status})`);
      }

      return new Uint8Array(await response.arrayBuffer());
    },

    async serve(pathname) {
      if (!pathname.startsWith("/assets/")) {
        return null;
      }

      const relativePath = pathname.slice("/assets/".length);
      const response = await assetsBinding.fetch(toAssetsUrl(relativePath));

      if (!response.ok) {
        return null;
      }

      return response;
    },
  };
}

function toAssetsUrl(relativePath) {
  const sanitized = relativePath.replace(/^\/+/, "");
  return `https://assets.local/${sanitized}`;
}
