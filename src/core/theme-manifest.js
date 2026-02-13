const manifestCache = new WeakMap();

export async function getThemeManifest(assets) {
  if (!manifestCache.has(assets)) {
    const loader = assets.readJson("theme-manifest.json").catch((error) => {
      manifestCache.delete(assets);
      throw error;
    });

    manifestCache.set(assets, loader);
  }

  return manifestCache.get(assets);
}
