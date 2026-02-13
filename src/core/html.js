function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

function renderThemeOptions(themeNames) {
  return themeNames
    .map((theme) => `<option value="${escapeHtml(theme)}">${escapeHtml(theme)}</option>`)
    .join("\n");
}

function renderThemeCards(themeNames, site) {
  return themeNames
    .map(
      (theme) => `
        <div class="item" data-theme="${escapeHtml(theme)}">
          <h5>${escapeHtml(theme)}</h5>
          <img data-src="${escapeHtml(site)}/@demo?theme=${encodeURIComponent(theme)}" alt="${escapeHtml(theme)}" />
        </div>`
    )
    .join("\n");
}

export function renderIndexPage({ site, gaId, themeNames }) {
  const escapedSite = escapeHtml(site);
  const escapedGaId = gaId ? escapeHtml(gaId) : "";

  return `<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <title>Moe Counter!</title>
    <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />
    <link rel="icon" type="image/png" href="${escapedSite}/assets/favicon.png" />
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/normalize.css" />
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bamboo.css" />
    <link rel="stylesheet/less" href="${escapedSite}/assets/style.less" />
    <script src="https://cdn.jsdelivr.net/npm/less"></script>
    ${gaId ? `<script async src="https://www.googletagmanager.com/gtag/js?id=${escapedGaId}"></script>` : ""}
    <script>
      window.dataLayer = window.dataLayer || [];
      function gtag() { dataLayer.push(arguments); }
      gtag('js', new Date());
      ${gaId ? `gtag('config', '${escapedGaId}');` : ""}

      function _evt_push(type, category, label) {
        gtag('event', type, {
          event_category: category,
          event_label: label
        });
      }

      var __global_data = { site: "${escapedSite}" };
    </script>
  </head>
  <body>
    <h1 id="main_title"><i>Moe Counter!</i></h1>

    <h3>How to use</h3>
    <p>Set a unique id for your counter, replace <code>:name</code> in the URL. That's it.</p>

    <h5>SVG address</h5>
    <code>${escapedSite}/@:name</code>

    <h5>Img tag</h5>
    <code>&lt;img src="${escapedSite}/@:name" alt=":name" /&gt;</code>

    <h5>Markdown</h5>
    <code>![:name](${escapedSite}/@:name)</code>

    <h5>e.g.</h5>
    <img src="${escapedSite}/@index" alt="Moe Counter!" />

    <details id="themes">
      <summary id="more_theme" onclick='_evt_push("click", "normal", "more_theme")'>
        <h3>More theme✨</h3>
      </summary>
      <p>Use query <code>theme</code>: <code>${escapedSite}/@:name?theme=moebooru</code></p>
      ${renderThemeCards(themeNames, site)}
    </details>

    <h3>Tool</h3>
    <div class="tool">
      <table>
        <thead>
          <tr><th>Param</th><th>Description</th><th>Value</th></tr>
        </thead>
        <tbody>
          <tr>
            <td><code>name</code></td>
            <td>Unique counter name</td>
            <td><input id="name" type="text" placeholder=":name" /></td>
          </tr>
          <tr>
            <td><code>theme</code></td>
            <td>Select theme, default <code>moebooru</code></td>
            <td>
              <select id="theme">
                <option value="random" selected>* random</option>
                ${renderThemeOptions(themeNames)}
              </select>
            </td>
          </tr>
          <tr>
            <td><code>padding</code></td>
            <td>0-16, default <code>7</code></td>
            <td><input id="padding" type="number" value="7" min="0" max="16" step="1" /></td>
          </tr>
          <tr>
            <td><code>offset</code></td>
            <td>-500~500, default <code>0</code></td>
            <td><input id="offset" type="number" value="0" min="-500" max="500" step="1" /></td>
          </tr>
          <tr>
            <td><code>scale</code></td>
            <td>0.1~2, default <code>1</code></td>
            <td><input id="scale" type="number" value="1" min="0.1" max="2" step="0.1" /></td>
          </tr>
          <tr>
            <td><code>align</code></td>
            <td>top/center/bottom, default <code>top</code></td>
            <td>
              <select id="align" name="align">
                <option value="top" selected>top</option>
                <option value="center">center</option>
                <option value="bottom">bottom</option>
              </select>
            </td>
          </tr>
          <tr>
            <td><code>pixelated</code></td>
            <td>0/1, default <code>1</code></td>
            <td>
              <input id="pixelated" type="checkbox" role="switch" checked />
              <label for="pixelated"><span></span></label>
            </td>
          </tr>
          <tr>
            <td><code>darkmode</code></td>
            <td>0/1/auto, default <code>auto</code></td>
            <td>
              <select id="darkmode" name="darkmode">
                <option value="auto" selected>auto</option>
                <option value="1">yes</option>
                <option value="0">no</option>
              </select>
            </td>
          </tr>
          <tr><td colspan="3"><h4 class="caption">Unusual Options</h4></td></tr>
          <tr>
            <td><code>num</code></td>
            <td>0~1e15, default <code>0</code></td>
            <td><input id="num" type="number" value="0" min="0" max="1e15" step="1" /></td>
          </tr>
          <tr>
            <td><code>prefix</code></td>
            <td>empty to disable</td>
            <td><input id="prefix" type="number" value="" min="0" max="999999" step="1" /></td>
          </tr>
        </tbody>
      </table>

      <button id="get" onclick='_evt_push("click", "normal", "get_counter")'>Generate</button>

      <div>
        <code id="code"></code>
        <img id="result" alt="counter result" />
      </div>
    </div>

    <p class="github">
      <a href="https://github.com/Twelveeee/Moe-Counter-Cloudflare" target="_blank" rel="nofollow" onclick='_evt_push("click", "normal", "go_github")'>source code</a>
    </p>

    <div class="back-to-top"></div>

    <script async src="https://cdn.jsdelivr.net/npm/party-js@2/bundle/party.min.js"></script>
    <script async src="${escapedSite}/assets/script.js"></script>
  </body>
</html>`;
}
