import { getCountByName } from "./counter.js";
import { badRequestFromZod, internalServerError, json } from "./errors.js";
import { renderIndexPage } from "./html.js";
import { renderCountSvg } from "./svg.js";
import { getThemeManifest } from "./theme-manifest.js";
import { counterQuerySchema, nameSchema } from "./validation.js";

const IMAGE_CONTENT_TYPE = "image/svg+xml";
const NO_CACHE = "max-age=0, no-cache, no-store, must-revalidate";
const ALLOW_METHODS = "GET, POST, PUT, DELETE";

export async function handleAppRequest(request, runtime) {
  const { env, assets, logger } = runtime;
  const getStore = runtime.getStore || (() => runtime.store);
  const url = new URL(request.url);

  try {
    if (request.method === "OPTIONS") {
      return withCors(
        new Response(null, {
          status: 204,
          headers: {
            "Access-Control-Allow-Methods": request.headers.get("access-control-request-method") || ALLOW_METHODS,
            "Access-Control-Allow-Headers": request.headers.get("access-control-request-headers") || "*",
          },
        }),
        request
      );
    }

    if (request.method !== "GET") {
      return withCors(
        json(
          {
            code: 405,
            message: "Method Not Allowed",
          },
          405
        ),
        request
      );
    }

    if (url.pathname.startsWith("/assets/")) {
      const assetResponse = await assets.serve(url.pathname);
      if (assetResponse) {
        return withCors(assetResponse, request);
      }
    }

    if (url.pathname === "/") {
      const manifest = await getThemeManifest(assets);
      const site = env.APP_SITE || `${url.protocol}//${url.host}`;
      const gaId = env.GA_ID || "";

      const html = renderIndexPage({
        site,
        gaId,
        themeNames: Object.keys(manifest.themes || {}),
      });

      return withCors(
        new Response(html, {
          status: 200,
          headers: {
            "content-type": "text/html; charset=utf-8",
          },
        }),
        request
      );
    }

    if (url.pathname === "/heart-beat") {
      logger.debug("heart-beat");

      return withCors(
        new Response("alive", {
          status: 200,
          headers: {
            "content-type": "text/plain; charset=utf-8",
            "cache-control": NO_CACHE,
          },
        }),
        request
      );
    }

    const counterMatch = url.pathname.match(/^\/(?:get\/)?@([^/]+)$/);
    if (counterMatch) {
      const parsedName = nameSchema.safeParse(decodeURIComponent(counterMatch[1] || ""));
      if (!parsedName.success) {
        return withCors(badRequestFromZod(parsedName.error), request);
      }

      const parsedQuery = counterQuerySchema.safeParse(Object.fromEntries(url.searchParams.entries()));
      if (!parsedQuery.success) {
        return withCors(badRequestFromZod(parsedQuery.error), request);
      }

      const name = parsedName.data;
      const query = parsedQuery.data;
      const manifest = await getThemeManifest(assets);
      const store = getStore();

      const counter = await getCountByName({
        store,
        name,
        num: query.num,
      });

      let theme = query.theme;
      if (theme === "random") {
        theme = randomArray(Object.keys(manifest.themes || {}));
      }

      const svg = await renderCountSvg({
        assets,
        manifest,
        count: counter.num,
        theme,
        padding: query.padding,
        offset: query.offset,
        align: query.align,
        scale: query.scale,
        pixelated: query.pixelated,
        darkmode: query.darkmode,
        prefix: query.prefix,
      });

      const headers = {
        "content-type": IMAGE_CONTENT_TYPE,
        "cache-control": NO_CACHE,
      };

      if (name === "demo") {
        headers["cache-control"] = "max-age=31536000";
      }

      logger.debug(
        counter,
        query,
        `ip: ${request.headers.get("cf-connecting-ip") || request.headers.get("x-forwarded-for") || "unknown"}`,
        `ref: ${request.headers.get("referer") || null}`,
        `ua: ${request.headers.get("user-agent") || null}`
      );

      return withCors(
        new Response(svg, {
          status: 200,
          headers,
        }),
        request
      );
    }

    const recordMatch = url.pathname.match(/^\/record\/@([^/]+)$/);
    if (recordMatch) {
      const parsedName = nameSchema.safeParse(decodeURIComponent(recordMatch[1] || ""));
      if (!parsedName.success) {
        return withCors(badRequestFromZod(parsedName.error), request);
      }

      const data = await getCountByName({
        store: getStore(),
        name: parsedName.data,
        num: 0,
      });

      return withCors(json(data), request);
    }

    return withCors(new Response("Not Found", { status: 404 }), request);
  } catch (error) {
    logger.error("request failed", error);
    return withCors(internalServerError(), request);
  }
}

function withCors(response, request) {
  const origin = request.headers.get("origin");
  if (!origin) {
    return response;
  }

  response.headers.set("Access-Control-Allow-Origin", origin);
  response.headers.set("Access-Control-Allow-Credentials", "true");
  return response;
}

function randomArray(arr) {
  if (!arr.length) {
    return "moebooru";
  }

  return arr[Math.floor(Math.random() * arr.length)];
}
