import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { createRequire } from "node:module";

const require = createRequire(import.meta.url);
const sizeOf = require("image-size");
const mime = require("mime-types");

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const repoRoot = path.resolve(__dirname, "..");
const assetsRoot = path.join(repoRoot, "assets");
const themeRoot = path.join(assetsRoot, "theme");
const outputFile = path.join(assetsRoot, "theme-manifest.json");

const imageExts = new Set([".jpg", ".jpeg", ".png", ".gif", ".webp"]);

function isDirectory(filePath) {
  return fs.statSync(filePath).isDirectory();
}

function buildManifest() {
  const themes = {};
  const themeDirs = fs
    .readdirSync(themeRoot)
    .sort((a, b) => a.localeCompare(b, "en"));

  for (const theme of themeDirs) {
    const themePath = path.join(themeRoot, theme);
    if (!isDirectory(themePath)) {
      continue;
    }

    const chars = {};
    const files = fs
      .readdirSync(themePath)
      .sort((a, b) => a.localeCompare(b, "en"));

    for (const fileName of files) {
      const ext = path.extname(fileName).toLowerCase();
      if (!imageExts.has(ext)) {
        continue;
      }

      const absolutePath = path.join(themePath, fileName);
      const dim = sizeOf(absolutePath);
      if (!dim?.width || !dim?.height) {
        throw new Error(`Could not parse image size: ${absolutePath}`);
      }

      const charKey = path.parse(fileName).name;
      chars[charKey] = {
        width: dim.width,
        height: dim.height,
        mime: mime.lookup(fileName) || "application/octet-stream",
        path: `theme/${theme}/${fileName}`,
      };
    }

    themes[theme] = chars;
  }

  return { themes };
}

const manifest = buildManifest();
fs.writeFileSync(outputFile, `${JSON.stringify(manifest, null, 2)}\n`, "utf8");
console.log(`Wrote ${outputFile}`);
