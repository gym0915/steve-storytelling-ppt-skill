/*!
 * reveal-minimap.js — 自包含的 Hoverable Minimap 导航组件
 * -------------------------------------------------------------
 * 特性：
 *   - 右侧悬停式迷你地图（fisheye / 邻近放大）+ 文字预览卡
 *   - 三态视觉：默认(灰) / 当前页(亮灰) / 悬停焦点(强调色，无荧光)
 *   - 所有颜色由 CSS 变量 --mm-* 驱动 —— 改主题只需覆盖变量，无需动 JS
 *   - 数据源可解耦：默认读 reveal.js 的 slides，也可传入自定义 getSlides/goTo/onChange
 *
 * 集成方式（reveal.js 项目）：
 *   1) 在 reveal.js 之后引入本脚本：<script src="minimap.js"></script>
 *      —— 脚本会自动检测全局 Reveal 并初始化。
 *   2) 或放 reveal.js 之前引入，再手动：RevealMinimap.init({ reveal: Reveal, ... })
 *
 * 集成方式（非 reveal 项目）：
 *   RevealMinimap.init({
 *     getSlides: () => [{title:'A', body:'...'}, ...],  // 返回页面数据数组
 *     goTo:      (i) => { 跳到第 i 页 },
 *     onChange:  (cb) => { 当前页变化时调用 cb(i) },
 *     capture:   (slideEl, i) => dataURL,  // 可选：返回该页缩略图(dataURL)，组件自动展示
 *     container: document.body,                          // 挂载点，默认 body
 *   });
 *
 * 主题适配：
 *   覆盖 CSS 变量即可，例如浅色主题：
 *   html[data-theme="light"] { --mm-line: rgba(0,0,0,.5); --mm-accent:#d6006e; ... }
 *   详见 minimap-themes.css
 */
(function (global) {
  'use strict';

  var STYLE_ID = 'reveal-minimap-style';

  // 组件样式 + 主题变量默认值（深色）。宿主覆盖 --mm-* 即可换肤。
  var CSS = [
    ':root {',
    '  --mm-line: #d3d3d3;',
    '  --mm-line-active: #222222;',
    '  --mm-accent: #00ffcc;',
    '  --mm-outline: rgba(0,0,0,0.28);',
    '  --mm-preview-bg: rgba(22,24,30,0.94);',
    '  --mm-preview-border: rgba(255,255,255,0.14);',
    '  --mm-preview-fg: #e0e0e0;',
    '  --mm-preview-title: #ffffff;',
    '  --mm-preview-index: var(--mm-accent);',
    '  --mm-preview-body: rgba(255,255,255,0.62);',
    '}',
    '',
    '.reveal-minimap {',
    '  position: fixed; right: 0; left: auto; top: 50%;',
    '  width: 46px; height: auto; z-index: 10;',
    '  display: flex; flex-direction: column; align-items: flex-end;',
    '  justify-content: center; gap: 10px; padding: 60px 12px 60px 0;',
    '  transform: translateY(-50%);',
    '  box-sizing: border-box; pointer-events: auto; user-select: none;',
    '}',
    '',
    '.minimap-item {',
    '  position: relative; width: 100%; height: 3px;',
    '  display: flex; align-items: center; justify-content: flex-end;',
    '  cursor: pointer;',
    '}',
    '',
    '.minimap-line {',
    '  height: 2px; border-radius: 1px;',
    '  background: var(--mm-line);',
    '  transform-origin: right center;',
    '  will-change: width, height, opacity, background;',
    '  transition: width 0.18s ease, height 0.18s ease, opacity 0.18s ease,',
    '              background 0.18s ease;',
    '}',
    '',
    '/* 当前页（未悬停时）：稍亮的线，标记阅读位置 */',
    '.minimap-item.active .minimap-line { background: var(--mm-line-active); }',
    '',
    '/* 悬停焦点线：主题强调色；邻近线保持灰度，不使用荧光阴影 */',
    '.minimap-line.is-hover {',
    '  background: var(--mm-accent);',
    '}',
    '',
    '.minimap-preview {',
    '  position: fixed; right: 58px; left: auto; width: 260px; padding: 14px 16px;',
    '  background: var(--mm-preview-bg);',
    '  border: 1px solid var(--mm-preview-border);',
    '  border-radius: 10px; box-shadow: 0 14px 44px rgba(0,0,0,0.5);',
    '  color: var(--mm-preview-fg);',
    "  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;",
    '  font-size: 13px; line-height: 1.5; pointer-events: none; opacity: 0;',
    '  transform: translateY(-50%) scale(0.96);',
    '  transition: opacity 0.15s ease, transform 0.15s ease, top 0.08s ease;',
    '  z-index: 101; backdrop-filter: blur(8px); -webkit-backdrop-filter: blur(8px);',
    '  max-height: 280px; overflow: hidden;',
    '}',
    '',
    '.minimap-preview.visible { opacity: 1; transform: translateY(-50%) scale(1); }',
    '',
    '.minimap-preview-thumb {',
    '  display: block; width: 100%; height: 96px; object-fit: cover;',
    '  border-radius: 6px; margin-bottom: 10px; background: var(--mm-preview-bg);',
    '}',
    '.minimap-preview-thumb[hidden] { display: none; }',
    '',
    '.minimap-preview-index {',
    '  color: var(--mm-preview-index); font-size: 11px; font-weight: 700;',
    '  letter-spacing: 0.08em; text-transform: uppercase; margin-bottom: 6px;',
    '}',
    '.minimap-preview-title {',
    '  font-weight: 600; color: var(--mm-preview-title);',
    '  margin-bottom: 5px; font-size: 14px;',
    '}',
    '.minimap-preview-body {',
    '  color: var(--mm-preview-body); display: -webkit-box;',
    '  -webkit-line-clamp: 4; -webkit-box-orient: vertical; overflow: hidden;',
    '}'
  ].join('\n');

  function injectStyle() {
    if (document.getElementById(STYLE_ID)) return;
    var s = document.createElement('style');
    s.id = STYLE_ID;
    s.textContent = CSS;
    (document.head || document.documentElement).appendChild(s);
  }

  function clamp(v, min, max) {
    return Math.max(min, Math.min(max, v));
  }

  function getSlideData(slide, idx) {
    var heading = slide.querySelector('h1, h2, h3, h4, h5, h6');
    var title = heading ? heading.textContent.trim() : ('Slide ' + (idx + 1));
    var all = (slide.textContent || '').replace(/\s+/g, ' ').trim();
    var body = all.indexOf(title) === 0 ? all.slice(title.length).trim() : all;
    return {
      title: title,
      body: body.length > 150 ? body.slice(0, 150) + '…' : body
    };
  }

  var booted = false;

  function init(opts) {
    if (booted) return;
    booted = true;

    opts = opts || {};
    var Reveal = opts.reveal || global.Reveal;

    // 数据源（默认对接 reveal.js，可替换为任意项目）
    var capture = opts.capture || null; // 可选：返回某页缩略图 dataURL
    var getSlides = opts.getSlides || function () {
      var list = (Reveal && Reveal.getSlides) ? Reveal.getSlides() : [];
      return list.map(function (s, i) {
        var d = getSlideData(s, i);
        if (capture) {
          try { d.thumb = capture(s, i); } catch (err) { /* capture 失败则忽略 */ }
        }
        return d;
      });
    };
    var goTo = opts.goTo || function (i) {
      if (Reveal && Reveal.slide) Reveal.slide(i);
    };
    var onChange = opts.onChange || function (cb) {
      if (!Reveal) return;
      Reveal.on('slidechanged', function (e) { cb(e.indexh); });
      Reveal.on('ready', function () { cb(Reveal.getIndices().h); });
    };

    injectStyle();

    var minimap = document.createElement('div');
    minimap.className = 'reveal-minimap';

    var preview = document.createElement('div');
    preview.className = 'minimap-preview';
    preview.innerHTML =
      '<img class="minimap-preview-thumb" alt="" hidden>' +
      '<div class="minimap-preview-index"></div>' +
      '<div class="minimap-preview-title"></div>' +
      '<div class="minimap-preview-body"></div>';

    var mount = opts.container
      ? (typeof opts.container === 'string' ? document.querySelector(opts.container) : opts.container)
      : document.body;
    mount.appendChild(minimap);
    mount.appendChild(preview);

    var slides = [];
    var activeIndex = 0;
    var hoverIndex = -1;

    function build() {
      minimap.innerHTML = '';
      slides.length = 0;

      var data = getSlides();
      data.forEach(function (d, idx) {
        slides.push({ data: d, item: null });

        var item = document.createElement('div');
        item.className = 'minimap-item' + (idx === activeIndex ? ' active' : '');
        item.dataset.index = idx;

        var line = document.createElement('div');
        line.className = 'minimap-line';
        item.appendChild(line);
        minimap.appendChild(item);

        slides[idx].item = item;

        item.addEventListener('click', function () { goTo(idx); });

        item.addEventListener('mouseenter', function () {
          hoverIndex = idx;
          updateFisheye();
          showPreview(idx);
        });
      });

      updateFisheye();
    }

    // 颜色完全由 CSS 变量 + is-hover / active class 决定，JS 只算几何与透明度，
    // 因此组件可随主题变量自动适配，无需任何 JS 修改。
    function updateFisheye() {
      slides.forEach(function (s, idx) {
        var item = s.item;
        var line = item.querySelector('.minimap-line');
        item.classList.toggle('active', idx === activeIndex);

        var isActive = idx === activeIndex;
        var defaultW = 10, defaultH = 2, defaultOp = 0.22;
        var activeW = 10, activeH = 2, activeOp = 0.55;

        var baseW = isActive ? activeW : defaultW;
        var baseH = isActive ? activeH : defaultH;
        var baseOp = isActive ? activeOp : defaultOp;

        var isHover = false;
        if (hoverIndex >= 0) {
          var dist = Math.abs(idx - hoverIndex);
          var sigma = 0.85;
          var factor = Math.exp(-(dist * dist) / (2 * sigma * sigma)); // 0..1
          var peakW = 40, peakH = 2.5, peakOp = 1;

          baseW = baseW + (peakW - baseW) * factor;
          baseH = baseH + (peakH - baseH) * factor;
          baseOp = baseOp + (peakOp - baseOp) * factor;

          isHover = (dist === 0); // 仅正悬停项变为焦点强调色
        }

        line.classList.toggle('is-hover', isHover);
        line.style.width = Math.round(baseW) + 'px';
        line.style.height = Math.round(baseH) + 'px';
        line.style.opacity = baseOp.toFixed(2);
      });
    }

    function showPreview(idx) {
      if (idx < 0 || idx >= slides.length) return;
      var item = slides[idx].item;
      var rect = item.getBoundingClientRect();
      var vh = window.innerHeight;
      var top = rect.top + rect.height / 2;

      preview.querySelector('.minimap-preview-index').textContent =
        'Page ' + (idx + 1) + ' / ' + slides.length;
      preview.querySelector('.minimap-preview-title').textContent = slides[idx].data.title;
      preview.querySelector('.minimap-preview-body').textContent = slides[idx].data.body;

      var thumbEl = preview.querySelector('.minimap-preview-thumb');
      var thumb = slides[idx].data.thumb;
      if (thumb) { thumbEl.src = thumb; thumbEl.hidden = false; }
      else { thumbEl.removeAttribute('src'); thumbEl.hidden = true; }

      preview.classList.add('visible');

      var pr = preview.getBoundingClientRect();
      top = clamp(top, pr.height / 2 + 10, vh - pr.height / 2 - 10);
      preview.style.top = top + 'px';
    }

    function hidePreview() {
      preview.classList.remove('visible');
    }

    function onMinimapMouseMove(e) {
      var closest = -1, minDist = Infinity;
      slides.forEach(function (s, idx) {
        var r = s.item.getBoundingClientRect();
        var center = r.top + r.height / 2;
        var d = Math.abs(center - e.clientY);
        if (d < minDist) { minDist = d; closest = idx; }
      });
      if (closest !== hoverIndex) {
        hoverIndex = closest;
        updateFisheye();
        showPreview(hoverIndex);
      } else if (hoverIndex >= 0) {
        showPreview(hoverIndex);
      }
    }

    function onMinimapMouseLeave() {
      hoverIndex = -1;
      updateFisheye();
      hidePreview();
    }

    minimap.addEventListener('mousemove', onMinimapMouseMove);
    minimap.addEventListener('mouseleave', onMinimapMouseLeave);

    onChange(function (i) { activeIndex = i; updateFisheye(); });

    if (Reveal && Reveal.isReady && Reveal.isReady()) {
      activeIndex = Reveal.getIndices().h;
      build();
    }
  }

  var api = { init: init };
  global.RevealMinimap = api;

  // 自动初始化：若全局已有 Reveal 则接管
  if (global.Reveal) {
    if (global.Reveal.isReady && global.Reveal.isReady()) {
      injectStyle();
      init({ reveal: global.Reveal });
    } else {
      global.Reveal.on('ready', function () {
        injectStyle();
        init({ reveal: global.Reveal });
      });
    }
  }
})(window);
