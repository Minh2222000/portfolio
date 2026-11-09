/* ==========================================================================
   modules/hero-fx.js — hiệu ứng "wow" cho hero, tách riêng để gỡ nhanh.

   Ba việc:
     1. Chữ cái của HOÀNG / MINH nhấc lên, nghiêng và đổi màu theo khoảng cách
        tới con trỏ (chỉ transform + màu, tuyệt đối không đụng bề rộng chữ).
     2. Đèn pha .hero__spot trôi theo con trỏ với độ trễ mượt.
     3. Dòng số liệu đếm từ 0 khi hero vào khung nhìn. Số cuối nằm sẵn trong
        HTML; JS chỉ đếm lên rồi trả đúng chuỗi gốc.

   Một vòng gsap.ticker duy nhất lo cả (1) và (2): chỉ chạy khi có chuột trong
   hero, tự dừng khi mọi thứ đã nghỉ, khi hero rời khung nhìn hoặc con trỏ
   rời hero. Toạ độ chữ đo một lần lúc ScrollTrigger refresh/đổi ngôn ngữ,
   không đọc layout mỗi khung hình.

   Giảm chuyển động và màn cảm ứng: không có (1)(2); giảm chuyển động cũng không
   có (3) — nhận bản tĩnh đủ nội dung. Gỡ: xoá file này, hero-fx.css, hai thẻ
   trong index.html và tên "heroFx" trong ORDER của main.js.
   ========================================================================== */

(function () {
  "use strict";

  var PF = (window.PF = window.PF || {});
  PF.modules = PF.modules || {};

  function clamp(v, lo, hi) { return v < lo ? lo : v > hi ? hi : v; }

  function init() {
    var hero = document.querySelector(".hero");
    if (!hero || !window.gsap) return;

    var gsap = window.gsap;
    var ST = window.ScrollTrigger;
    var mm = gsap.matchMedia();

    /* ----------------------------------------------------------------------
       3. Đếm số
       ---------------------------------------------------------------------- */
    mm.add("(prefers-reduced-motion: no-preference)", function () {
      var nodes = hero.querySelectorAll("[data-count]");
      if (!nodes.length || !ST) return;

      var items = Array.prototype.map.call(nodes, function (el) {
        return {
          el: el,
          final: el.textContent,                      /* chuỗi đúng, đã có sẵn trong HTML */
          vals: el.getAttribute("data-count").split(",").map(Number),
          sep: el.getAttribute("data-count-sep") || "–",
          pre: el.getAttribute("data-count-prefix") || "",
          suf: el.getAttribute("data-count-suffix") || ""
        };
      });

      var state = { p: 0 };
      var tween = null;
      var wait = null;
      var started = false;
      var loadedAt = -1e9;

      function render(p) {
        items.forEach(function (it) {
          it.el.textContent = it.pre + it.vals.map(function (v) {
            return Math.round(v * p);
          }).join(it.sep) + it.suf;
        });
      }
      function restore() {
        items.forEach(function (it) { it.el.textContent = it.final; });
      }
      function run() {
        if (started) return;
        started = true;
        render(0);
        tween = gsap.to(state, {
          p: 1,
          duration: 1.9,
          ease: "power3.out",
          onUpdate: function () { render(state.p); },
          onComplete: restore                         /* kết thúc luôn bằng chuỗi gốc */
        });
      }

      /* Số chỉ nên chạy khi người xem đã thấy nó: sau màn chờ, và đúng lúc
         hàng số liệu hiện ra trong màn chào của hero.js (~0.8s sau pf:loaded). */
      var INTRO_LAG = 0.8;
      function onLoaded() { loadedAt = performance.now(); }
      document.addEventListener("pf:loaded", onLoaded);

      function schedule() {
        if (document.body.classList.contains("is-loading")) {
          document.addEventListener("pf:loaded", function () {
            wait = gsap.delayedCall(INTRO_LAG, run);
          }, { once: true });
        } else {
          var left = INTRO_LAG - (performance.now() - loadedAt) / 1000;
          if (left > 0) wait = gsap.delayedCall(left, run); else run();
        }
      }

      var trigger = ST.create({
        trigger: hero,
        start: "top 85%",
        once: true,
        onEnter: schedule
      });

      return function () {
        trigger.kill();
        if (wait) wait.kill();
        if (tween) tween.kill();
        document.removeEventListener("pf:loaded", onLoaded);
        restore();
      };
    });

    /* ----------------------------------------------------------------------
       1 + 2. Chữ phản ứng theo con trỏ và đèn pha — chỉ máy có chuột thật
       ---------------------------------------------------------------------- */
    mm.add("(hover: hover) and (pointer: fine) and (prefers-reduced-motion: no-preference)", function () {
      var title = hero.querySelector(".hero__title");
      var inner = hero.querySelector(".hero__inner");
      var lines = hero.querySelectorAll(".hero__line > span");
      if (!title || !inner || !lines.length) return;

      var glow = hero.querySelector(".hero__glow");
      var spot = document.createElement("div");
      spot.className = "hero__spot";
      spot.setAttribute("aria-hidden", "true");
      hero.insertBefore(spot, glow ? glow.nextSibling : hero.firstChild);

      var chars = [];                 /* { el, cx, cy, k, r, wk, wr } */
      var fs = 160, R = 160, LIFT = 7, MAX_ROT = 9;
      var heroX = 0, heroY = 0, spotSize = 0;
      var ptr = { x: 0, y: 0, on: false };
      var spotPos = { x: 0, y: 0, snap: true };
      var dirty = false;
      var running = false;

      /* --- Tách chữ -------------------------------------------------------
         Mỗi chữ cái thành một inline-block. Dấu thanh (U+0300–036F) dính
         lại với chữ đứng trước để "À" không bị xé thành hai. Trình đọc màn
         hình đọc nhãn aria-label của h1; các ô chữ cái bị ẩn khỏi cây a11y. */
      function split() {
        chars.length = 0;
        var names = [];
        Array.prototype.forEach.call(lines, function (line) {
          var text = (line.textContent || "").normalize("NFC");
          names.push(text);
          var frag = document.createDocumentFragment();
          var parts = [];
          Array.from(text).forEach(function (ch) {
            if (/[̀-ͯ]/.test(ch) && parts.length) parts[parts.length - 1] += ch;
            else parts.push(ch);
          });
          parts.forEach(function (ch) {
            var s = document.createElement("span");
            s.className = "hfx-char";
            s.setAttribute("aria-hidden", "true");
            s.textContent = ch;
            frag.appendChild(s);
            chars.push({ el: s, cx: 0, cy: 0, k: 0, r: 0, wk: 0, wr: 0 });
          });
          line.textContent = "";
          line.appendChild(frag);
        });
        title.setAttribute("aria-label", names.join(" "));
        measure();
      }

      function unsplit() {
        Array.prototype.forEach.call(lines, function (line) {
          line.textContent = line.textContent;
        });
        title.removeAttribute("aria-label");
        chars.length = 0;
      }

      /* --- Đo: chạy lúc refresh/đổi ngôn ngữ, không chạy mỗi khung hình ----
         Dùng offsetLeft/offsetTop (không bị transform của màn chào làm lệch)
         cộng với vị trí trang của .hero__inner. */
      function measure() {
        fs = parseFloat(getComputedStyle(title).fontSize) || 160;
        R = fs * 1.7;
        LIFT = fs * 0.05;
        var sx = window.pageXOffset, sy = window.pageYOffset;
        var hr = hero.getBoundingClientRect();
        heroX = hr.left + sx;
        heroY = hr.top + sy;
        var iy = gsap.getProperty(inner, "y") || 0;     /* inner đang trôi theo cuộn */
        /* offsetParent của chữ là thẻ span con của .hero__line (nó mang
           transform của màn chào), nên lấy gốc từ .hero__line — hộp không
           transform — cộng khoảng đệm trên của nó, rồi mới cộng offset. */
        var cache = [];
        chars.forEach(function (c) {
          var span = c.el.parentElement;
          var box = span.parentElement;
          var base = null;
          for (var i = 0; i < cache.length; i++) if (cache[i].box === box) base = cache[i];
          if (!base) {
            var br = box.getBoundingClientRect();
            base = {
              box: box,
              x: br.left + sx + (parseFloat(getComputedStyle(box).paddingLeft) || 0),
              y: br.top + sy - iy + (parseFloat(getComputedStyle(box).paddingTop) || 0)
            };
            cache.push(base);
          }
          c.cx = base.x + c.el.offsetLeft + c.el.offsetWidth / 2;
          c.cy = base.y + c.el.offsetTop + c.el.offsetHeight / 2;
        });
        spotSize = spot.offsetWidth;
      }

      /* Màn chào còn đang trượt chữ lên thì chưa phản ứng */
      function introDone() {
        for (var i = 0; i < lines.length; i++) {
          if (gsap.getProperty(lines[i], "yPercent") !== 0) return false;
        }
        return true;
      }

      /* --- Vòng lặp duy nhất ------------------------------------------------ */
      function tick(time, dtMs) {
        var dt = Math.min(dtMs, 80) / 1000;
        var aC = 1 - Math.exp(-dt * 9);        /* chữ: bám nhanh, trễ dịu */
        var aS = 1 - Math.exp(-dt * 4.5);      /* đèn pha: trễ rõ hơn */
        var sx = window.pageXOffset, sy = window.pageYOffset;
        var iy = gsap.getProperty(inner, "y") || 0;
        var px = ptr.x + sx, py = ptr.y + sy;
        var live = ptr.on && introDone();
        var busy = dirty;
        dirty = false;

        for (var i = 0; i < chars.length; i++) {
          var c = chars[i];
          var tk = 0, tr = 0;
          if (live) {
            var dx = c.cx - px, dy = c.cy + iy - py;
            var d = Math.sqrt(dx * dx + dy * dy);
            if (d < R) {
              var t = 1 - d / R;
              tk = t * t * (3 - 2 * t);                 /* smoothstep */
              tr = clamp(dx / R, -1, 1) * tk;
            }
          }
          c.k += (tk - c.k) * aC;
          c.r += (tr - c.r) * aC;
          if (Math.abs(tk - c.k) < 0.002 && Math.abs(tr - c.r) < 0.002) { c.k = tk; c.r = tr; }
          else busy = true;

          if (c.k !== c.wk || c.r !== c.wr) {
            c.wk = c.k; c.wr = c.r;
            if (c.k === 0 && c.r === 0) {
              c.el.style.transform = "";
              c.el.style.removeProperty("--p");
            } else {
              c.el.style.transform = "translate3d(0," + (-c.k * LIFT).toFixed(2) + "px,0) rotate(" + (c.r * MAX_ROT).toFixed(2) + "deg)";
              c.el.style.setProperty("--p", c.k.toFixed(3));
            }
          }
        }

        /* Đèn pha: toạ độ trong hệ của hero */
        var tx = px - heroX - spotSize / 2;
        var ty = py - heroY - spotSize / 2;
        if (spotPos.snap && ptr.on) { spotPos.x = tx; spotPos.y = ty; spotPos.snap = false; }
        else if (ptr.on) {
          spotPos.x += (tx - spotPos.x) * aS;
          spotPos.y += (ty - spotPos.y) * aS;
          if (Math.abs(tx - spotPos.x) > 0.4 || Math.abs(ty - spotPos.y) > 0.4) busy = true;
        }
        spot.style.transform = "translate3d(" + spotPos.x.toFixed(1) + "px," + spotPos.y.toFixed(1) + "px,0)";

        if (!busy) stop();
      }

      function wake() {
        if (running) return;
        running = true;
        hero.classList.add("hfx-moving");
        gsap.ticker.add(tick);
      }
      function stop() {
        if (!running) return;
        running = false;
        gsap.ticker.remove(tick);
        hero.classList.remove("hfx-moving");
      }

      /* --- Sự kiện: nhẹ, chỉ ghi toạ độ --------------------------------------- */
      function onMove(e) {
        if (e.pointerType === "touch") return;
        ptr.x = e.clientX;
        ptr.y = e.clientY;
        if (!ptr.on) {
          ptr.on = true;
          if (spotSize === 0) measure();
          spotPos.snap = true;
          spot.classList.add("is-on");
        }
        dirty = true;
        wake();
      }
      function onLeave() {
        ptr.on = false;
        spot.classList.remove("is-on");
        wake();                         /* để chữ kịp trả về trạng thái nghỉ */
      }
      hero.addEventListener("pointermove", onMove, { passive: true });
      hero.addEventListener("pointerleave", onLeave);

      /* Đổi ngôn ngữ: i18n ghi đè textContent của hai dòng tên, phải tách lại */
      function onLang() { split(); }
      document.addEventListener("pf:lang", onLang);

      /* Tab ẩn: nhả con trỏ, vòng lặp tự dừng */
      function onVis() { if (document.hidden) onLeave(); }
      document.addEventListener("visibilitychange", onVis);

      /* Cuộn đi qua ScrollTrigger: hero rời khung nhìn thì nhả; đang cuộn khi
         chuột đứng yên thì chữ vẫn tính lại theo vị trí mới. */
      var trigger = ST && ST.create({
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
        document.removeEventListener("pf:lang", onLang);
        document.removeEventListener("visibilitychange", onVis);
        if (trigger) trigger.kill();
        unsplit();
        spot.remove();
      };
    });

    PF.heroFxMM = mm;
  }

  PF.modules.heroFx = { init: init };
})();
