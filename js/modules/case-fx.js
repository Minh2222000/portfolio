/* ==========================================================================
   modules/case-fx.js — trang chi tiết dự án kiểu "điện ảnh". Chạy cho mọi dự án
   trừ dự án khai `cinematic: false` trong js/data/projects.js.

   Hai phần:
     A. build()   dựng lại bố cục từ DOM mà case.js đã điền: tiêu đề cỡ lớn
                  (chữ đặc + chữ viền), ảnh chính, bảng thông tin dính, các
                  chương 01–04, thư viện ảnh, lightbox, dải "dự án tiếp theo".
                  Chạy đồng bộ, TRƯỚC reveal.js, nên các chương mới mang
                  data-reveal được reveal.js quét như mọi khối khác.
     B. motion()  chuyển động. Mọi thứ theo cuộn đi qua ScrollTrigger, bọc
                  trong gsap.matchMedia:
                    - không giảm chuyển động : màn chào chữ, ảnh mở màn (clip-path)
                    - + chuột thật (hover/fine): thanh tiến độ, ảnh trôi thị sai,
                      thiết bị nổi theo chiều sâu, chữ + ảnh phản ứng theo con trỏ
                  Giảm chuyển động / cảm ứng nhận bản tĩnh đủ nội dung; lightbox
                  và bảng thông tin dính vẫn dùng được.
                  Một vòng gsap.ticker duy nhất cho phần theo con trỏ: chỉ chạy
                  khi có chuột trong hero, dừng khi hero rời khung nhìn / tab ẩn.

   Gỡ nhanh: xoá file này, css/case-fx.css, hai thẻ trong project.html, khối
   `cinematic` trong case.js (4 dòng).
   ========================================================================== */

(function () {
  "use strict";

  var PF = (window.PF = window.PF || {});
  PF.modules = PF.modules || {};

  var project = null;
  var main = null;
  var hero = null;
  var S = {
    introDone: true,     /* màn chào chữ xong chưa (chữ chỉ phản ứng sau đó) */
    measure: null,       /* do phần theo con trỏ gán */
    images: [],          /* mọi ảnh phóng to được, theo thứ tự trang */
    zooms: []
  };

  function q(sel, ctx) { return (ctx || document).querySelector(sel); }
  function qa(sel, ctx) { return Array.prototype.slice.call((ctx || document).querySelectorAll(sel)); }
  function clamp(v, lo, hi) { return v < lo ? lo : v > hi ? hi : v; }
  function pad(n) { return (n < 10 ? "0" : "") + n; }

  function make(tag, cls, attrs) {
    var node = document.createElement(tag);
    if (cls) node.className = cls;
    if (attrs) Object.keys(attrs).forEach(function (k) { node.setAttribute(k, attrs[k]); });
    return node;
  }

  /* Tra chuỗi có chỗ trống {n}. PF.t trả null khi thiếu khoá. */
  function tr(key, vars) {
    var s = PF.t ? PF.t(key) : null;
    if (s == null) s = "";
    if (vars) Object.keys(vars).forEach(function (k) { s = s.split("{" + k + "}").join(vars[k]); });
    return s;
  }

  /* "DCIM — hệ thống giám sát…" → ["DCIM", "hệ thống giám sát…"] */
  function splitTitle(full) {
    var parts = String(full).split(/\s+[—–]\s+/);
    return { head: parts[0], tail: parts.slice(1).join(" — ") };
  }

  /* ==========================================================================
     A. DỰNG BỐ CỤC
     ========================================================================== */

  /* Nút bọc ảnh: bấm để phóng to. Ảnh được DỜI (không nhân đôi) vào nút. */
  function zoomButton(img) {
    var index = S.images.length;
    var btn = make("button", "cfx-zoom", { type: "button" });
    btn.appendChild(img);
    S.images.push(img);
    S.zooms.push(btn);

    /* Tỉ lệ thật lấy từ ảnh khi tải xong; trong lúc chờ, khung giữ 4/3 (tỉ lệ
       của cả bộ mockup) nên bố cục không nhảy. */
    function setRatio() {
      if (img.naturalWidth && img.naturalHeight) {
        btn.style.setProperty("--cfx-ar", img.naturalWidth + " / " + img.naturalHeight);
      }
    }
    /* Dữ liệu khai kích thước (thuộc tính width/height): có tỉ lệ ngay từ đầu,
       dải ảnh ngang không đổi bề rộng khi ảnh tải xong. */
    var aw = Number(img.getAttribute("width")), ah = Number(img.getAttribute("height"));
    if (aw > 0 && ah > 0) btn.style.setProperty("--cfx-ar", aw + " / " + ah);
    if (img.complete) setRatio(); else img.addEventListener("load", setRatio, { once: true });

    btn.addEventListener("click", function () { openLightbox(index, btn); });
    return btn;
  }

  /* Ảnh tách nền có lề trong suốt rất rộng quanh thiết bị: nếu để nguyên, thiết
     bị nhỏ và nằm lơ lửng giữa khung cao. Đo hộp bao của phần có màu (alpha),
     rồi đặt khung nút theo đúng hộp đó (CSS đọc các biến --cfx-*). Lỗi đọc
     canvas (vd. mở bằng file://) thì giữ nguyên bố cục không cắt. */
  function trimCutout(img, btn) {
    function run() {
      try {
        var W = img.naturalWidth, H = img.naturalHeight;
        if (!W || !H) return;
        var k = Math.min(1, 480 / W);
        var cw = Math.max(1, Math.round(W * k)), ch = Math.max(1, Math.round(H * k));
        var c = document.createElement("canvas");
        c.width = cw; c.height = ch;
        var ctx = c.getContext("2d", { willReadFrequently: true });
        ctx.drawImage(img, 0, 0, cw, ch);
        var d = ctx.getImageData(0, 0, cw, ch).data;
        var l = cw, t = ch, r = -1, b = -1, x, y;
        for (y = 0; y < ch; y++) {
          for (x = 0; x < cw; x++) {
            if (d[(y * cw + x) * 4 + 3] > 10) {
              if (x < l) l = x; if (x > r) r = x; if (y < t) t = y; if (y > b) b = y;
            }
          }
        }
        if (r < l || b < t) return;
        var padS = Math.round(Math.max(r - l, b - t) * 0.03);
        l = Math.max(0, l - padS); r = Math.min(cw - 1, r + padS);
        t = Math.max(0, t - padS); b = Math.min(ch - 1, b + Math.ceil(padS / 2));
        var bw = r - l + 1, bh = b - t + 1;
        btn.style.setProperty("--cfx-ar", bw + " / " + bh);
        btn.style.setProperty("--cfx-arn", (bw / bh).toFixed(4));
        btn.style.setProperty("--cfx-iw", (cw / bw * 100).toFixed(3) + "%");
        btn.style.setProperty("--cfx-ml", (-l / bw * 100).toFixed(3) + "%");
        btn.style.setProperty("--cfx-mt", (-t / bw * 100).toFixed(3) + "%");
        btn.classList.add("cfx-zoom--trim");
      } catch (e) { /* giữ bố cục không cắt */ }
    }
    if (img.complete && img.naturalWidth) run(); else img.addEventListener("load", run, { once: true });
  }

  function buildHero() {
    hero = q(".case__hero", main);
    if (!hero) return;
    hero.classList.add("cfx-hero");
    var shell = q(".shell", hero);
    var h1 = q("[data-case='title']", hero);
    var summary = q("[data-case='summary']", hero);
    var facts = q(".case__facts", hero);

    /* --- Tên dự án: một dòng chữ đặc (tên ngắn) + một dòng chữ viền (phần mô
       tả sau dấu gạch). h1 mang aria-label đủ tên; các dòng ẩn khỏi cây a11y. */
    var t = splitTitle(project.title);
    h1.textContent = "";
    h1.classList.add("cfx-title");
    h1.setAttribute("aria-label", project.title);
    /* Tên ngắn nằm một dòng, cỡ chữ co theo số ký tự. Tên dài (> 14 ký tự) cho
       xuống dòng giữa các từ: cỡ chữ tính theo từ dài nhất hoặc nửa độ dài, để
       dòng chữ không bị hộp cắt (overflow hidden) xén mất. */
    var headChars = t.head.length;
    if (headChars > 14) {
      var longest = t.head.split(/\s+/).reduce(function (m, w) { return Math.max(m, w.length); }, 0);
      headChars = Math.max(longest, Math.ceil(t.head.length / 2));
      h1.classList.add("cfx-title--wrap");
    }
    h1.style.setProperty("--cfx-chars", String(Math.max(headChars, 3)));
    [["solid", t.head], ["outline", t.tail]].forEach(function (pair) {
      if (!pair[1]) return;
      var line = make("span", "cfx-line cfx-line--" + pair[0], { "aria-hidden": "true" });
      var inner = make("span", "cfx-line__in");
      inner.textContent = pair[1];
      line.appendChild(inner);
      h1.appendChild(line);
    });

    /* --- Lưới: cột chữ bên trái (tên, lời dẫn, hàng nhãn mono vai trò · công
       cụ · năm — dùng lại .case__facts), ảnh chính bên phải. Cột chữ là
       container nên cỡ tên tính theo bề rộng cột (đơn vị cqi), không tràn. */
    var grid = make("div", "cfx-hero__grid");
    var copy = make("div", "cfx-hero__copy");
    copy.appendChild(h1);
    if (summary) { summary.classList.add("cfx-hero__rise"); copy.appendChild(summary); }
    if (facts) { facts.classList.add("cfx-hero__rise"); copy.appendChild(facts); }
    grid.appendChild(copy);

    /* Ảnh chính = ảnh dẫn đầu của bộ ảnh (hoặc poster khi dự án chưa có bộ) */
    var shots = q(".case__shots", main);
    var lead = shots && (q(".case__shot--lead", shots) || q(".case__shot", shots));
    var cover = q(".case__cover", main);
    var leadImg = lead ? q("img", lead) : (cover ? q("img", cover) : null);
    if (leadImg) {
      var stage = make("div", "cfx-stage");
      var drift = make("div", "cfx-stage__drift");
      var tilt = make("div", "cfx-stage__tilt");
      var leadZoom = zoomButton(leadImg);
      /* Ảnh chụp giao diện phẳng (không phải mockup tách nền) có khung mảnh */
      if (!(project && project.galleryCutout)) leadZoom.classList.add("cfx-zoom--flat");
      /* Ảnh dọc (màn hình di động, trang dài): giới hạn chiều cao theo khung
         nhìn để ảnh đầu trang không dài hơn một màn hình. */
      var lw = Number(leadImg.getAttribute("width")), lh = Number(leadImg.getAttribute("height"));
      if (lw > 0 && lh > 0 && lw / lh < 0.9) leadZoom.classList.add("cfx-zoom--portrait");
      tilt.appendChild(leadZoom);
      drift.appendChild(tilt);
      stage.appendChild(drift);
      grid.appendChild(stage);
    } else {
      grid.classList.add("cfx-hero__grid--solo");
    }

    shell.appendChild(grid);
    if (lead && lead.parentNode) lead.parentNode.removeChild(lead);
  }

  /* Dải ảnh cuộn ngang: nút trái/phải, thanh tiến độ, kéo bằng chuột.
     Cuộn bằng bàn di chuột, cảm ứng và phím mũi tên là việc của trình duyệt
     (vùng cuộn có tabindex). Không chiếm con lăn dọc của trang. */
  function wireTrack(track, port, prevs, nexts, fill) {
    var reduced = !!(window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches);

    function sync() {
      var total = track.scrollWidth, view = track.clientWidth;
      var max = Math.max(0, total - view);
      var thumb = total ? Math.min(1, view / total) : 1;
      var p = max ? track.scrollLeft / max : 0;
      fill.style.width = (thumb * 100) + "%";
      fill.style.transform = "translateX(" + (thumb ? p * (1 - thumb) / thumb * 100 : 0) + "%)";
      prevs.forEach(function (b) { b.disabled = track.scrollLeft <= 2; });
      nexts.forEach(function (b) { b.disabled = track.scrollLeft >= max - 2; });
      port.classList.toggle("is-end", track.scrollLeft >= max - 2);
    }

    function step(dir) {
      track.scrollBy({ left: dir * Math.round(track.clientWidth * 0.8), behavior: reduced ? "auto" : "smooth" });
    }
    prevs.forEach(function (b) { b.addEventListener("click", function () { step(-1); }); });
    nexts.forEach(function (b) { b.addEventListener("click", function () { step(1); }); });

    track.addEventListener("scroll", sync, { passive: true });
    window.addEventListener("resize", sync);
    qa("img", track).forEach(function (im) { if (!im.complete) im.addEventListener("load", sync, { once: true }); });

    /* Kéo bằng chuột. Chỉ chuột: cảm ứng đã cuộn được sẵn. Kéo quá 5px thì coi là
       kéo, nuốt cú bấm cuối để ảnh không bật phóng to khi vừa thả chuột. */
    var down = false, moved = false, startX = 0, startLeft = 0;
    track.addEventListener("pointerdown", function (e) {
      if (e.pointerType !== "mouse" || e.button !== 0) return;
      down = true; moved = false; startX = e.clientX; startLeft = track.scrollLeft;
    });
    window.addEventListener("pointermove", function (e) {
      if (!down) return;
      var dx = e.clientX - startX;
      if (!moved && Math.abs(dx) > 5) { moved = true; track.classList.add("is-dragging"); }
      if (moved) track.scrollLeft = startLeft - dx;
    });
    function endDrag() {
      if (!down) return;
      down = false;
      track.classList.remove("is-dragging");
    }
    window.addEventListener("pointerup", endDrag);
    window.addEventListener("pointercancel", endDrag);
    track.addEventListener("click", function (e) {
      if (moved) { e.stopPropagation(); e.preventDefault(); moved = false; }
    }, true);

    sync();
  }

  /* Thư viện: các ảnh còn lại của bộ (ảnh dẫn đầu đã lên hero) */
  function buildGallery() {
    var shots = q(".case__shots", main);
    var cover = q(".case__cover", main);
    var figs = shots ? qa(".case__shot", shots) : [];
    var gallery = null;

    if (figs.length) {
      gallery = make("section", "cfx-gallery", { "aria-labelledby": "cfx-gallery-h" });
      var label = make("h2", "cfx-gallery__label mono", { id: "cfx-gallery-h", "data-i18n": "cfx.gallery" });
      var flat = !(project && project.galleryCutout);
      var grid = make("div", "cfx-gallery__grid" + (flat ? " cfx-gallery__grid--flat" : ""));
      var total = figs.length + (q(".cfx-stage") ? 1 : 0);
      figs.forEach(function (fig) {
        var img = q("img", fig);
        if (!img) return;
        var item = make("figure", "cfx-shot"
          + (fig.classList.contains("case__shot--tall") ? " cfx-shot--tall" : ""));
        if (flat) {
          /* Ảnh chụp giao diện phẳng: hiện nguyên cả frame theo tỉ lệ thật, có
             khung mảnh, xếp trong dải cuộn ngang (không ô nền, không cắt). */
          var flatZoom = zoomButton(img);
          /* Ảnh mockup đã tách nền (nền trong suốt) không bọc khung viền */
          if (!fig.classList.contains("case__shot--cutout")) flatZoom.classList.add("cfx-zoom--flat");
          item.appendChild(flatZoom);
        } else {
        /* Ô cố định chiều cao; thiết bị nằm đáy-giữa ô nên mọi ô chung một đường
           cơ sở. Ảnh tách nền được cắt bỏ phần trong suốt thừa quanh thiết bị. */
        var box = make("div", "cfx-shot__box");
        var float = make("div", "cfx-float");
        var zb = zoomButton(img);
        if (fig.classList.contains("case__shot--cutout") || (project && project.galleryCutout)) trimCutout(img, zb);
        float.appendChild(zb);
        box.appendChild(float);
        item.appendChild(box);
        }
        item.appendChild(make("figcaption", "cfx-shot__cap mono", {
          "aria-hidden": "true"
        })).textContent = pad(S.images.length) + " / " + pad(total);
        grid.appendChild(item);
      });
      if (flat) {
        /* Dải ảnh ngang: đầu dải có nhãn + gợi ý + hai nút, dưới dải có thanh
           tiến độ. Cuộn ngang bằng chuột kéo, bàn di chuột, cảm ứng, bàn phím
           hoặc hai nút. */
        gallery.classList.add("cfx-gallery--flat");
        var head = make("div", "cfx-gallery__head");
        head.appendChild(label);
        var tools = make("div", "cfx-gallery__tools");
        tools.appendChild(make("span", "cfx-gallery__hint mono", { "data-i18n": "cfx.galHint" }));
        var prev = make("button", "cfx-gallery__btn", { type: "button", "data-i18n-attr": "aria-label:cfx.galPrev" });
        prev.textContent = "←";
        var next = make("button", "cfx-gallery__btn", { type: "button", "data-i18n-attr": "aria-label:cfx.galNext" });
        next.textContent = "→";
        tools.appendChild(prev);
        tools.appendChild(next);
        head.appendChild(tools);

        grid.setAttribute("tabindex", "0");
        grid.setAttribute("role", "region");
        grid.setAttribute("data-i18n-attr", "aria-label:cfx.galRegion");
        var port = make("div", "cfx-gallery__port");
        port.appendChild(grid);
        /* Cặp nút thứ hai nằm hai bên mép dải, giữa ảnh; điều khiển cùng dải
           với cặp ở đầu và tự ẩn khi đã tới đầu/cuối. */
        var sidePrev = make("button", "cfx-gallery__side cfx-gallery__side--prev", { type: "button", "data-i18n-attr": "aria-label:cfx.galPrev" });
        sidePrev.textContent = "←";
        var sideNext = make("button", "cfx-gallery__side cfx-gallery__side--next", { type: "button", "data-i18n-attr": "aria-label:cfx.galNext" });
        sideNext.textContent = "→";
        port.appendChild(sidePrev);
        port.appendChild(sideNext);
        var bar = make("div", "cfx-gallery__bar", { "aria-hidden": "true" });
        var fill = make("i");
        bar.appendChild(fill);

        gallery.appendChild(head);
        gallery.appendChild(port);
        gallery.appendChild(bar);
        wireTrack(grid, port, [prev, sidePrev], [next, sideNext], fill);
      } else {
        gallery.appendChild(label);
        gallery.appendChild(grid);
      }
    }

    if (shots && shots.parentNode) shots.parentNode.removeChild(shots);
    if (cover && cover.parentNode) cover.parentNode.removeChild(cover);
    return gallery;
  }

  function buildStory() {
    /* Chương nào có dữ liệu thật mới có mặt; số chương đánh lại theo thứ tự. */
    var defs = [];
    var challenge = q("[data-case='challenge']");
    var criteria = q("[data-case='criteria']");
    var approach = q("[data-case='approach']");
    var tasks = q("[data-case='tasks']");
    var result = q("[data-case='result']");
    var metrics = q("[data-case='metrics']");
    /* CSS chia cỡ số theo số lượng số liệu để không tràn khung */
    if (metrics && project.metrics) {
      metrics.style.setProperty("--cfx-mn", String(Math.max(1, project.metrics.length)));
      metrics.style.setProperty("--cfx-mc", String(Math.max(2, project.metrics.reduce(function (m, x) {
        return Math.max(m, String(x.value).length);
      }, 0))));
    }

    if (challenge || criteria) defs.push({ key: "cfx.ch1", nodes: [challenge, criteria] });
    if (approach) defs.push({ key: "cfx.ch2", nodes: [approach] });
    if (tasks) defs.push({ key: "case.tasks", nodes: [tasks] });
    if (result || metrics) defs.push({ key: "case.result", nodes: [result, metrics] });

    var chapters = make("div", "cfx-chapters");
    var toc = make("ol", "cfx-toc__list");

    defs.forEach(function (def, i) {
      var id = "cfx-ch-" + (i + 1);
      var sec = make("section", "cfx-chapter", { id: id, "aria-labelledby": id + "-h", "data-reveal": "" });
      var head = make("div", "cfx-chapter__head");
      head.appendChild(make("span", "cfx-chapter__num", { "aria-hidden": "true" })).textContent = pad(i + 1);
      head.appendChild(make("h2", "cfx-chapter__title", { id: id + "-h", "data-i18n": def.key }));
      var body = make("div", "cfx-chapter__body");
      def.nodes.forEach(function (n) { if (n) body.appendChild(n); });
      sec.appendChild(head);
      sec.appendChild(body);
      chapters.appendChild(sec);

      var li = make("li");
      var a = make("a", "cfx-toc__link", { href: "#" + id });
      a.appendChild(make("span", "cfx-toc__num", { "aria-hidden": "true" })).textContent = pad(i + 1);
      a.appendChild(make("span", "", { "data-i18n": def.key }));
      a.addEventListener("click", function (e) {
        var target = document.getElementById(id);
        if (!target || !PF.scrollTo) return;
        e.preventDefault();
        PF.scrollTo(target, { offset: -90 });
        if (history.replaceState) history.replaceState(null, "", "#" + id);
      });
      li.appendChild(a);
      toc.appendChild(li);
    });

    /* --- Bảng thông tin dính ---------------------------------------------- */
    var panel = make("aside", "cfx-panel", { "data-i18n-attr": "aria-label:cfx.info" });
    panel.appendChild(make("p", "eyebrow cfx-panel__title", { "data-i18n": "cfx.info" }));

    /* Vai trò và công cụ đã có ở hàng nhãn dưới tên dự án nên bảng không lặp lại:
       chỉ còn mục lục chương (thêm ở dưới) và số liệu. */
    var list = make("dl", "cfx-panel__list");
    function item(labelKey, ddNode) {
      var row = make("div", "cfx-panel__item");
      row.appendChild(make("dt", "eyebrow", { "data-i18n": labelKey }));
      row.appendChild(ddNode);
      list.appendChild(row);
    }

    var hasMetrics = project.metrics && project.metrics.length;
    if (hasMetrics) {
      var ul = make("ul", "cfx-panel__metrics");
      project.metrics.forEach(function () {
        var li = make("li");
        li.appendChild(make("b"));
        li.appendChild(make("span", "", { "data-cfx-metric": "" }));
        ul.appendChild(li);
      });
      qa("li", ul).forEach(function (li, i) { li.firstChild.textContent = project.metrics[i].value; });
      var dd = make("dd");
      dd.appendChild(ul);
      item("case.result", dd);
    }
    if (defs.length > 1) {
      var nav = make("nav", "cfx-toc", { "data-i18n-attr": "aria-label:cfx.toc" });
      nav.appendChild(make("p", "eyebrow", { "data-i18n": "cfx.toc" }));
      nav.appendChild(toc);
      panel.appendChild(nav);
    }
    if (hasMetrics) panel.appendChild(list);

    var story = make("div", "cfx-story");
    story.appendChild(panel);
    story.appendChild(chapters);
    return story;
  }

  function buildNext() {
    var old = q("[data-case='next']");
    if (!old) return null;
    var href = old.getAttribute("href");
    var nameEl = q("[data-case='nextName']", old);
    var full = nameEl ? nameEl.textContent : "";
    old.parentNode.removeChild(old);
    if (!href || href === "#") return null;

    var short = splitTitle(full).head;
    var a = make("a", "cfx-next", { href: href, "data-transition": "" });
    a.style.setProperty("--cfx-n", String(Math.max(short.length, 4)));
    a.appendChild(make("span", "cfx-next__label mono", { "data-i18n": "case.next" }));
    var row = make("span", "cfx-next__row");
    row.appendChild(make("span", "cfx-next__name")).textContent = short;
    row.appendChild(make("span", "cfx-next__arrow", { "aria-hidden": "true" })).textContent = "→";
    a.appendChild(row);
    return a;
  }

  /* ---- Cập nhật chữ phụ thuộc ngôn ngữ ------------------------------------ */
  function refreshLabels() {
    var total = S.zooms.length;
    S.zooms.forEach(function (btn, i) {
      btn.setAttribute("aria-label", tr("cfx.zoom", { n: i + 1, m: total }));
    });
    var lang = PF.lang || "vi";
    qa("[data-cfx-metric]").forEach(function (node, i) {
      var m = project.metrics && project.metrics[i];
      if (m) node.textContent = m.label[lang] || m.label.vi;
    });
    /* apply(root) không chạm vào chính phần tử gốc, nên nhãn hộp thoại gán tay */
    if (lb) lb.el.setAttribute("aria-label", tr("cfx.lightbox"));
    if (lb && lb.index >= 0) fillLightbox(lb.index);
  }

  /* ==========================================================================
     LIGHTBOX — role="dialog" aria-modal, Esc / bấm ngoài để đóng, khoá cuộn
     nền, trả focus về nút đã mở.
     ========================================================================== */
  var lb = null;

  function buildLightbox() {
    var el = make("div", "cfx-lightbox", {
      role: "dialog",
      "aria-modal": "true",
      hidden: ""
    });
    var close = make("button", "cfx-lightbox__close", { type: "button" });
    close.appendChild(make("span", "", { "data-i18n": "cfx.close" }));
    close.appendChild(make("span", "", { "aria-hidden": "true" })).textContent = "✕";
    var fig = make("div", "cfx-lightbox__fig");
    var img = make("img", "cfx-lightbox__img", { alt: "" });
    var cap = make("p", "cfx-lightbox__cap mono", { "aria-hidden": "true" });
    fig.appendChild(img);
    fig.appendChild(cap);
    el.appendChild(fig);
    el.appendChild(close);
    document.body.appendChild(el);

    lb = { el: el, close: close, img: img, cap: cap, index: -1, opener: null, timer: 0 };

    close.addEventListener("click", closeLightbox);
    /* Bấm ra ngoài ảnh (nền, khoảng trống quanh ảnh) thì đóng */
    el.addEventListener("click", function (e) {
      if (e.target !== img) closeLightbox();
    });
    document.addEventListener("keydown", function (e) {
      if (lb.index < 0) return;
      if (e.key === "Escape") { e.preventDefault(); closeLightbox(); }
      else if (e.key === "Tab") { e.preventDefault(); close.focus(); }   /* chỉ có một nút */
    });
  }

  function fillLightbox(i) {
    var src = S.images[i];
    if (!src) return;
    lb.img.src = src.currentSrc || src.src;
    lb.img.alt = tr("cfx.shotAlt", { title: project.title, n: i + 1, m: S.images.length });
    lb.cap.textContent = pad(i + 1) + " / " + pad(S.images.length);
  }

  var LOCK_TARGETS = ["main", "header.nav", "footer"];

  function setBackground(inert) {
    LOCK_TARGETS.forEach(function (sel) {
      var node = q(sel);
      if (!node) return;
      if (inert) node.setAttribute("inert", ""); else node.removeAttribute("inert");
    });
  }

  function openLightbox(i, opener) {
    if (!lb) return;
    clearTimeout(lb.timer);
    lb.index = i;
    lb.opener = opener;
    fillLightbox(i);

    var root = document.documentElement;
    root.style.setProperty("--cfx-sbw", Math.max(0, window.innerWidth - root.clientWidth) + "px");
    root.classList.add("cfx-lock");
    if (PF.lenis) PF.lenis.stop();
    setBackground(true);

    lb.el.hidden = false;
    void lb.el.offsetWidth;                       /* để transition chạy từ trạng thái ẩn */
    lb.el.classList.add("is-open");
    lb.close.focus({ preventScroll: true });
  }

  function closeLightbox() {
    if (!lb || lb.index < 0) return;
    lb.index = -1;
    lb.el.classList.remove("is-open");

    setBackground(false);
    var root = document.documentElement;
    root.classList.remove("cfx-lock");
    root.style.removeProperty("--cfx-sbw");
    if (PF.lenis) PF.lenis.start();

    if (lb.opener && lb.opener.focus) lb.opener.focus({ preventScroll: true });
    lb.timer = setTimeout(function () { lb.el.hidden = true; }, 360);
  }

  /* ==========================================================================
     B. CHUYỂN ĐỘNG
     ========================================================================== */
  function motion() {
    var gsap = window.gsap;
    var ST = window.ScrollTrigger;
    if (!gsap || !ST || !hero) return;

    var mm = gsap.matchMedia();
    PF.caseFxMM = mm;

    var lines = qa(".cfx-line__in", hero);
    var rise = qa(".cfx-hero__rise", hero);
    var stageZoom = q(".cfx-stage .cfx-zoom", hero);
    var stageImg = stageZoom && q("img", stageZoom);

    /* Chương đang đọc: tô sáng mục tương ứng trong bảng thông tin. Chỉ đổi màu,
       không phải chuyển động, nên chạy ở mọi chế độ. */
    var tocLinks = qa(".cfx-toc__link");
    qa(".cfx-chapter").forEach(function (sec, i) {
      ST.create({
        trigger: sec,
        start: "top 55%",
        end: "bottom 55%",
        onToggle: function (self) {
          if (tocLinks[i]) tocLinks[i].classList.toggle("is-current", self.isActive);
        }
      });
    });

    /* ----- Mọi máy không giảm chuyển động: màn chào + ảnh mở màn ------------- */
    mm.add("(prefers-reduced-motion: no-preference)", function () {
      S.introDone = false;

      gsap.set(lines, { yPercent: 112 });
      gsap.set(rise, { opacity: 0, y: 22 });
      if (stageZoom) gsap.set(stageZoom, { clipPath: "inset(0 100% 0 0)" });
      if (stageImg) gsap.set(stageImg, { scale: 1.2 });

      var tl = gsap.timeline({
        delay: 0.35,
        defaults: { ease: "expo.out" },
        onComplete: function () {
          S.introDone = true;
          if (stageZoom) gsap.set(stageZoom, { clearProps: "clipPath" });
          if (S.measure) S.measure();
        }
      });
      tl.to(lines, { yPercent: 0, duration: 1.15, stagger: 0.12 }, 0);
      if (stageZoom) {
        tl.to(stageZoom, { clipPath: "inset(0 0% 0 0)", duration: 1.5, ease: "expo.inOut" }, 0.25);
        tl.to(stageImg, { scale: 1, duration: 2, ease: "expo.out" }, 0.25);
      }
      tl.to(rise, { opacity: 1, y: 0, duration: 1, stagger: 0.12 }, 0.55);

      /* Thư viện: ảnh mở màn bằng clip-path khi cuộn tới (một lần) */
      qa(".cfx-gallery .cfx-zoom").forEach(function (zb, i) {
        var img = q("img", zb);
        gsap.set(zb, { clipPath: i % 2 ? "inset(0 0 0 100%)" : "inset(0 100% 0 0)" });
        gsap.set(img, { scale: 1.18 });
        ST.create({
          trigger: zb.closest(".cfx-shot"),
          start: "top 84%",
          once: true,
          onEnter: function () {
            gsap.to(zb, {
              clipPath: "inset(0 0% 0 0%)",
              duration: 1.4,
              ease: "expo.inOut",
              onComplete: function () { gsap.set(zb, { clearProps: "clipPath" }); }
            });
            gsap.to(img, { scale: 1, duration: 1.9, ease: "expo.out" });
          }
        });
      });

      return function () {
        tl.kill();
        S.introDone = true;
      };
    });

    /* ----- Chuột thật + không giảm chuyển động: cuộn thị sai + theo con trỏ ---- */
    mm.add("(hover: hover) and (pointer: fine) and (prefers-reduced-motion: no-preference)", function () {
      /* 1. Thanh tiến độ cuộn */
      var bar = q(".cfx-progress i");
      var barWrap = q(".cfx-progress");
      if (bar) {
        barWrap.classList.add("is-on");
        gsap.fromTo(bar, { scaleX: 0 }, {
          scaleX: 1,
          ease: "none",
          scrollTrigger: { start: 0, end: "max", scrub: true }
        });
      }

      /* 2. Ảnh chính trôi nhẹ khi cuộn (chỉ transform) */
      var drift = q(".cfx-stage__drift", hero);
      if (drift) {
        gsap.fromTo(drift, { yPercent: 5 }, {
          yPercent: -9,
          ease: "none",
          scrollTrigger: { trigger: hero, start: "top top", end: "bottom top", scrub: true }
        });
      }

      /* 3. Thiết bị trong thư viện nổi theo chiều sâu: ảnh chẵn/lẻ trôi ngược
         chiều nhau, biên độ nhỏ (±1,6% chiều cao ô) để lúc đứng yên các thiết
         bị vẫn gần như thẳng hàng; giữa hành trình (ô ở giữa khung nhìn) độ lệch = 0. */
      qa(".cfx-gallery .cfx-float").forEach(function (fl, i) {
        var dir = i % 2 ? -1 : 1;
        var amp = 1.6;
        gsap.fromTo(fl, { yPercent: dir * amp }, {
          yPercent: -dir * amp,
          ease: "none",
          scrollTrigger: { trigger: fl.closest(".cfx-shot__box"), start: "top bottom", end: "bottom top", scrub: true }
        });
      });

      /* 4. Chữ tiêu đề + ảnh chính phản ứng theo con trỏ ---------------------- */
      var title = q(".cfx-title", hero);
      var tilt = q(".cfx-stage__tilt", hero);
      var units = [];                 /* { el, l, r, t, b, cx, cy, k, rot, wk, wr, rk } */
      var lineNodes = qa(".cfx-line", hero);
      var original = [];
      var fs = 160, R = 240;
      var ptr = { x: 0, y: 0, on: false };
      var tiltState = { rx: 0, ry: 0, tx: 0, ty: 0, wrx: 0, wry: 0 };
      var dirty = false;
      var running = false;

      /* Tách chữ. Dòng chữ đặc: từng chữ cái. Dòng chữ viền (dài): từng từ.
         Dấu thanh dính với chữ đứng trước. Hộp "từ" cấm ngắt giữa chừng. */
      function split() {
        units.length = 0;
        original = [];
        lineNodes.forEach(function (line) {
          var inner = q(".cfx-line__in", line);
          var text = (inner.textContent || "").normalize("NFC");
          original.push(text);
          var perChar = line.classList.contains("cfx-line--solid");
          var frag = document.createDocumentFragment();
          text.split(" ").forEach(function (word, wi, arr) {
            var box = make("span", "cfx-word");
            if (perChar) {
              var parts = [];
              Array.from(word).forEach(function (ch) {
                if (/[̀-ͯ]/.test(ch) && parts.length) parts[parts.length - 1] += ch;
                else parts.push(ch);
              });
              parts.forEach(function (ch) { box.appendChild(unit(ch, 1)); });
            } else {
              box.appendChild(unit(word, 0.45));
            }
            frag.appendChild(box);
            if (wi < arr.length - 1) frag.appendChild(document.createTextNode(" "));
          });
          inner.textContent = "";
          inner.appendChild(frag);
        });
        measure();
      }

      function unit(text, rk) {
        var s = make("span", "cfx-unit", { "aria-hidden": "true" });
        s.textContent = text;
        units.push({ el: s, l: 0, r: 0, t: 0, b: 0, cx: 0, cy: 0, k: 0, rot: 0, wk: 0, wr: 0, rk: rk });
        return s;
      }

      function unsplit() {
        lineNodes.forEach(function (line, i) {
          var inner = q(".cfx-line__in", line);
          if (inner && original[i] != null) inner.textContent = original[i];
        });
        units.length = 0;
      }

      /* Đo một lần lúc refresh / sau màn chào, không đo mỗi khung hình */
      function measure() {
        if (!title) return;
        fs = parseFloat(getComputedStyle(title).fontSize) || 160;
        R = Math.max(fs * 1.5, 150);
        var sx = window.pageXOffset, sy = window.pageYOffset;
        for (var i = 0; i < units.length; i++) {
          var u = units[i];
          var b = u.el.getBoundingClientRect();
          u.l = b.left + sx; u.r = b.right + sx;
          u.t = b.top + sy;  u.b = b.bottom + sy;
          u.cx = (u.l + u.r) / 2; u.cy = (u.t + u.b) / 2;
          u.lift = Math.min(b.height * 0.07, 9);
        }
      }
      S.measure = measure;

      function tick(time, dtMs) {
        var dt = Math.min(dtMs, 80) / 1000;
        var aC = 1 - Math.exp(-dt * 9);
        var aT = 1 - Math.exp(-dt * 5);
        var sx = window.pageXOffset, sy = window.pageYOffset;
        var px = ptr.x + sx, py = ptr.y + sy;
        var live = ptr.on && S.introDone;
        var busy = dirty;
        dirty = false;

        for (var i = 0; i < units.length; i++) {
          var u = units[i];
          var tk = 0, tr_ = 0;
          if (live) {
            /* khoảng cách tới HỘP gần nhất (từ dài vẫn bắt được con trỏ) */
            var dx = px < u.l ? u.l - px : px > u.r ? px - u.r : 0;
            var dy = py < u.t ? u.t - py : py > u.b ? py - u.b : 0;
            var d = Math.sqrt(dx * dx + dy * dy);
            if (d < R) {
              var t = 1 - d / R;
              tk = t * t * (3 - 2 * t);
              tr_ = clamp((u.cx - px) / R, -1, 1) * tk;
            }
          }
          u.k += (tk - u.k) * aC;
          u.rot += (tr_ - u.rot) * aC;
          if (Math.abs(tk - u.k) < 0.002 && Math.abs(tr_ - u.rot) < 0.002) { u.k = tk; u.rot = tr_; }
          else busy = true;

          if (u.k !== u.wk || u.rot !== u.wr) {
            u.wk = u.k; u.wr = u.rot;
            if (u.k === 0 && u.rot === 0) {
              u.el.style.transform = "";
              u.el.style.removeProperty("--p");
            } else {
              u.el.style.transform = "translate3d(0," + (-u.k * u.lift).toFixed(2) + "px,0) rotate(" + (u.rot * 8 * u.rk).toFixed(2) + "deg)";
              u.el.style.setProperty("--p", u.k.toFixed(3));
            }
          }
        }

        /* Ảnh chính nghiêng rất nhẹ: tối đa ~3deg và ~8px */
        if (tilt) {
          var nx = ptr.on ? ptr.x / window.innerWidth - 0.5 : 0;
          var ny = ptr.on ? ptr.y / window.innerHeight - 0.5 : 0;
          if (!S.introDone) { nx = 0; ny = 0; }
          tiltState.ry += (nx * 6 - tiltState.ry) * aT;
          tiltState.rx += (-ny * 5 - tiltState.rx) * aT;
          tiltState.tx += (nx * 16 - tiltState.tx) * aT;
          tiltState.ty += (ny * 12 - tiltState.ty) * aT;
          var moving = Math.abs(nx * 6 - tiltState.ry) > 0.01 || Math.abs(ny * 5 + tiltState.rx) > 0.01 ||
                       Math.abs(nx * 16 - tiltState.tx) > 0.05 || Math.abs(ny * 12 - tiltState.ty) > 0.05;
          if (moving) {
            busy = true;
            tilt.style.transform = "translate3d(" + tiltState.tx.toFixed(2) + "px," + tiltState.ty.toFixed(2) + "px,0) rotateX(" +
              tiltState.rx.toFixed(3) + "deg) rotateY(" + tiltState.ry.toFixed(3) + "deg)";
          } else if (!ptr.on) {
            tilt.style.transform = "";
          }
        }

        if (!busy) stop();
      }

      function wake() {
        if (running) return;
        running = true;
        hero.classList.add("cfx-moving");
        gsap.ticker.add(tick);
      }
      function stop() {
        if (!running) return;
        running = false;
        gsap.ticker.remove(tick);
        hero.classList.remove("cfx-moving");
      }

      function onMove(e) {
        if (e.pointerType === "touch") return;
        ptr.x = e.clientX;
        ptr.y = e.clientY;
        if (!ptr.on) { ptr.on = true; }
        dirty = true;
        wake();
      }
      function onLeave() {
        ptr.on = false;
        wake();                        /* để chữ và ảnh kịp về trạng thái nghỉ */
      }
      hero.addEventListener("pointermove", onMove, { passive: true });
      hero.addEventListener("pointerleave", onLeave);

      function onVis() { if (document.hidden) onLeave(); }
      document.addEventListener("visibilitychange", onVis);

      var trigger = ST.create({
        trigger: hero,
        start: "top bottom",
        end: "bottom top",
        onRefresh: measure,
        onToggle: function (self) { if (!self.isActive) onLeave(); },
        onUpdate: function () { if (ptr.on) { dirty = true; wake(); } }
      });

      split();
      if (document.fonts && document.fonts.ready) document.fonts.ready.then(measure);

      return function () {
        stop();
        hero.removeEventListener("pointermove", onMove);
        hero.removeEventListener("pointerleave", onLeave);
        document.removeEventListener("visibilitychange", onVis);
        trigger.kill();
        unsplit();
        if (tilt) tilt.style.transform = "";
        if (barWrap) barWrap.classList.remove("is-on");
        S.measure = null;
      };
    });
  }

  /* ==========================================================================
     Vào cuộc
     ========================================================================== */
  function init(p) {
    if (!p || p.cinematic === false) return;
    main = q("main");
    if (!main || main.classList.contains("case--cinematic")) return;
    project = p;

    main.classList.add("case--cinematic");

    buildHero();
    var gallery = buildGallery();
    var story = buildStory();
    var next = buildNext();

    /* Thứ tự trong khối thân: bảng + chương → thư viện → nút điều hướng */
    var body = q(".case__body", main);
    var navRow = q(".case__nav", main);
    var shell = body ? body.parentNode : (navRow && navRow.parentNode);
    if (shell) {
      if (body) shell.removeChild(body);
      shell.insertBefore(story, navRow || null);
      if (gallery) shell.insertBefore(gallery, navRow || null);
    }
    if (next) main.appendChild(next);

    /* Thanh tiến độ: ẩn mặc định, chỉ bật ở nhánh chuột thật + không giảm chuyển động */
    var progress = make("div", "cfx-progress", { "aria-hidden": "true" });
    progress.appendChild(make("i"));
    document.body.appendChild(progress);

    buildLightbox();

    var i18n = PF.modules.i18n;
    if (i18n && i18n.apply) { i18n.apply(main); i18n.apply(lb.el); }
    refreshLabels();
    document.addEventListener("pf:lang", refreshLabels);

    motion();
  }

  PF.modules.caseFx = { init: init };
})();
