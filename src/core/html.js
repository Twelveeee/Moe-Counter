function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

function toInlineJson(value) {
  return JSON.stringify(value).replaceAll("<", "\\u003c");
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

const I18N = {
  en: {
    htmlLang: "en",
    pageTitle: "Moe Counter!",
    languageLabel: "Language",
    languageEnglish: "English",
    languageChinese: "中文",
    mainTitle: "Moe Counter!",
    howToUseTitle: "How to use",
    howToUseDesc: "Set a unique id for your counter, replace <code>:name</code> in the URL. That's it.",
    svgAddress: "SVG address",
    imgTag: "Img tag",
    markdown: "Markdown",
    exampleTitle: "e.g.",
    exampleAlt: "Moe Counter!",
    moreThemeTitle: "More theme✨",
    themeQueryLabel: "Use query <code>theme</code>:",
    toolTitle: "Tool",
    tableParam: "Param",
    tableDescription: "Description",
    tableValue: "Value",
    nameDesc: "Unique counter name",
    themeDesc: "Select theme, default <code>moebooru</code>",
    paddingDesc: "0-16, default <code>7</code>",
    offsetDesc: "-500~500, default <code>0</code>",
    scaleDesc: "0.1~2, default <code>1</code>",
    alignDesc: "top/center/bottom, default <code>top</code>",
    pixelatedDesc: "0/1, default <code>1</code>",
    darkmodeDesc: "0/1/auto, default <code>auto</code>",
    unusualOptions: "Unusual Options",
    numDesc: "0~1e15, default <code>0</code>",
    prefixDesc: "empty to disable",
    generateButton: "Generate",
    resultAlt: "counter result",
    sourceCodeText: "source code",
    alertNameRequired: "Please input counter name.",
    alignTop: "top",
    alignCenter: "center",
    alignBottom: "bottom",
    darkmodeAuto: "auto",
    darkmodeYes: "yes",
    darkmodeNo: "no",
    randomTheme: "* random",
  },
  zh: {
    htmlLang: "zh-CN",
    pageTitle: "萌萌计数器",
    languageLabel: "语言",
    languageEnglish: "English",
    languageChinese: "中文",
    mainTitle: "萌萌计数器",
    howToUseTitle: "使用方法",
    howToUseDesc: "给你的计数器设置唯一 ID，把 URL 里的 <code>:name</code> 替换掉即可。",
    svgAddress: "SVG 地址",
    imgTag: "图片标签",
    markdown: "Markdown",
    exampleTitle: "例如",
    exampleAlt: "萌萌计数器示例",
    moreThemeTitle: "更多主题✨",
    themeQueryLabel: "使用查询参数 <code>theme</code>：",
    toolTitle: "工具",
    tableParam: "参数",
    tableDescription: "说明",
    tableValue: "值",
    nameDesc: "唯一计数器名称",
    themeDesc: "选择主题，默认 <code>moebooru</code>",
    paddingDesc: "0-16，默认 <code>7</code>",
    offsetDesc: "-500~500，默认 <code>0</code>",
    scaleDesc: "0.1~2，默认 <code>1</code>",
    alignDesc: "top/center/bottom，默认 <code>top</code>",
    pixelatedDesc: "0/1，默认 <code>1</code>",
    darkmodeDesc: "0/1/auto，默认 <code>auto</code>",
    unusualOptions: "非常用选项",
    numDesc: "0~1e15，默认 <code>0</code>",
    prefixDesc: "留空则禁用",
    generateButton: "生成",
    resultAlt: "计数器结果",
    sourceCodeText: "源码",
    alertNameRequired: "请输入计数器名称。",
    alignTop: "顶部",
    alignCenter: "居中",
    alignBottom: "底部",
    darkmodeAuto: "自动",
    darkmodeYes: "是",
    darkmodeNo: "否",
    randomTheme: "* 随机",
  },
};

export function renderIndexPage({ site, gaId, lang = "en", themeNames }) {
  const selectedLang = lang === "zh" ? "zh" : "en";
  const t = I18N[selectedLang];
  const escapedSite = escapeHtml(site);
  const escapedGaId = gaId ? escapeHtml(gaId) : "";
  const globalData = toInlineJson({
    site,
    lang: selectedLang,
    messages: {
      requiredName: t.alertNameRequired,
    },
  });

  return `<!doctype html>
<html lang="${t.htmlLang}">
  <head>
    <meta charset="utf-8" />
    <title>${escapeHtml(t.pageTitle)}</title>
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

      var __global_data = ${globalData};
    </script>
  </head>
  <body>
    <div class="lang-switch">
      <label for="lang_select">${escapeHtml(t.languageLabel)}</label>
      <select id="lang_select" aria-label="${escapeHtml(t.languageLabel)}">
        <option value="en"${selectedLang === "en" ? " selected" : ""}>${escapeHtml(t.languageEnglish)}</option>
        <option value="zh"${selectedLang === "zh" ? " selected" : ""}>${escapeHtml(t.languageChinese)}</option>
      </select>
    </div>

    <h1 id="main_title"><i>${escapeHtml(t.mainTitle)}</i></h1>

    <h3>${escapeHtml(t.howToUseTitle)}</h3>
    <p>${t.howToUseDesc}</p>

    <h5>${escapeHtml(t.svgAddress)}</h5>
    <code>${escapedSite}/@:name</code>

    <h5>${escapeHtml(t.imgTag)}</h5>
    <code>&lt;img src="${escapedSite}/@:name" alt=":name" /&gt;</code>

    <h5>${escapeHtml(t.markdown)}</h5>
    <code>![:name](${escapedSite}/@:name)</code>

    <h5>${escapeHtml(t.exampleTitle)}</h5>
    <img src="${escapedSite}/@index" alt="${escapeHtml(t.exampleAlt)}" />

    <details id="themes">
      <summary id="more_theme" onclick='_evt_push("click", "normal", "more_theme")'>
        <h3>${escapeHtml(t.moreThemeTitle)}</h3>
      </summary>
      <p>${t.themeQueryLabel} <code>${escapedSite}/@:name?theme=moebooru</code></p>
      ${renderThemeCards(themeNames, site)}
    </details>

    <h3>${escapeHtml(t.toolTitle)}</h3>
    <div class="tool">
      <table>
        <thead>
          <tr><th>${escapeHtml(t.tableParam)}</th><th>${escapeHtml(t.tableDescription)}</th><th>${escapeHtml(t.tableValue)}</th></tr>
        </thead>
        <tbody>
          <tr>
            <td><code>name</code></td>
            <td>${t.nameDesc}</td>
            <td><input id="name" type="text" placeholder=":name" /></td>
          </tr>
          <tr>
            <td><code>theme</code></td>
            <td>${t.themeDesc}</td>
            <td>
              <select id="theme">
                <option value="random" selected>${escapeHtml(t.randomTheme)}</option>
                ${renderThemeOptions(themeNames)}
              </select>
            </td>
          </tr>
          <tr>
            <td><code>padding</code></td>
            <td>${t.paddingDesc}</td>
            <td><input id="padding" type="number" value="7" min="0" max="16" step="1" /></td>
          </tr>
          <tr>
            <td><code>offset</code></td>
            <td>${t.offsetDesc}</td>
            <td><input id="offset" type="number" value="0" min="-500" max="500" step="1" /></td>
          </tr>
          <tr>
            <td><code>scale</code></td>
            <td>${t.scaleDesc}</td>
            <td><input id="scale" type="number" value="1" min="0.1" max="2" step="0.1" /></td>
          </tr>
          <tr>
            <td><code>align</code></td>
            <td>${t.alignDesc}</td>
            <td>
              <select id="align" name="align">
                <option value="top" selected>${escapeHtml(t.alignTop)}</option>
                <option value="center">${escapeHtml(t.alignCenter)}</option>
                <option value="bottom">${escapeHtml(t.alignBottom)}</option>
              </select>
            </td>
          </tr>
          <tr>
            <td><code>pixelated</code></td>
            <td>${t.pixelatedDesc}</td>
            <td>
              <input id="pixelated" type="checkbox" role="switch" checked />
              <label for="pixelated"><span></span></label>
            </td>
          </tr>
          <tr>
            <td><code>darkmode</code></td>
            <td>${t.darkmodeDesc}</td>
            <td>
              <select id="darkmode" name="darkmode">
                <option value="auto" selected>${escapeHtml(t.darkmodeAuto)}</option>
                <option value="1">${escapeHtml(t.darkmodeYes)}</option>
                <option value="0">${escapeHtml(t.darkmodeNo)}</option>
              </select>
            </td>
          </tr>
          <tr><td colspan="3"><h4 class="caption">${escapeHtml(t.unusualOptions)}</h4></td></tr>
          <tr>
            <td><code>num</code></td>
            <td>${t.numDesc}</td>
            <td><input id="num" type="number" value="0" min="0" max="1e15" step="1" /></td>
          </tr>
          <tr>
            <td><code>prefix</code></td>
            <td>${escapeHtml(t.prefixDesc)}</td>
            <td><input id="prefix" type="number" value="" min="0" max="999999" step="1" /></td>
          </tr>
        </tbody>
      </table>

      <button id="get" onclick='_evt_push("click", "normal", "get_counter")'>${escapeHtml(t.generateButton)}</button>

      <div>
        <code id="code"></code>
        <img id="result" alt="${escapeHtml(t.resultAlt)}" style="display: none;" />
      </div>
    </div>

    <p class="github">
      <a href="https://github.com/Twelveeee/Moe-Counter-Cloudflare" target="_blank" rel="nofollow" onclick='_evt_push("click", "normal", "go_github")'>${escapeHtml(t.sourceCodeText)}</a>
    </p>

    <div class="back-to-top"></div>

    <script async src="https://cdn.jsdelivr.net/npm/party-js@2/bundle/party.min.js"></script>
    <script async src="${escapedSite}/assets/script.js"></script>
  </body>
</html>`;
}
