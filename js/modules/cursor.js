/* ==========================================================================
   modules/cursor.js — con trỏ tuỳ biến: một chấm bám sát tay, một vòng
   chạy đuổi theo sau. Vòng phình to và hiện chữ khi rê qua thứ bấm được.

   Chỉ bật trên thiết bị có chuột thật. Máy cảm ứng không có con trỏ để thay,
   bật lên chỉ tốn khung hình.
   ========================================================================== */

(function () {
  "use strict";

  var PF = (window.PF = window.PF || {});
  PF.modules = PF.modules || {};

  function init(ctx) {
    var el = document.querySelector(".cursor");
    if (!el || !window.gsap) return;

    /* Không có chuột, hoặc đang giảm chuyển động: bỏ luôn phần tử này */
    if (ctx.isTouch || ctx.reduced) {
      el.remove();
      return;
    }

    var gsap = window.gsap;
    var dot = el.querySelector(".cursor__dot");
    var ring = el.querySelector(".cursor__ring");
    var label = el.querySelector(".cursor__label");

    /* quickTo cho ra một hàm set nhanh, rẻ hơn nhiều so với gọi gsap.to mỗi
       lần chuột nhúc nhích. Chấm bám gần như tức thì, vòng chậm hơn một nhịp
       để tạo cảm giác có quán tính. */
    var dotX = gsap.quickTo(dot, "x", { duration: 0.15, ease: "power3.out" });
    var dotY = gsap.quickTo(dot, "y", { duration: 0.15, ease: "power3.out" });
    var ringX = gsap.quickTo(ring, "x", { duration: 0.5, ease: "power3.out" });
    var ringY = gsap.quickTo(ring, "y", { duration: 0.5, ease: "power3.out" });

    gsap.set([dot, ring], { xPercent: 0, yPercent: 0 });
    gsap.set(el, { opacity: 0 });

    var shown = false;

    window.addEventListener("mousemove", function (e) {
      if (!shown) {
        shown = true;
        gsap.to(el, { opacity: 1, duration: 0.3 });
      }
      dotX(e.clientX); dotY(e.clientY);
      ringX(e.clientX); ringY(e.clientY);
    }, { passive: true });

    /* Ra khỏi cửa sổ thì giấu đi, quay lại thì hiện */
    document.addEventListener("mouseleave", function () {
      gsap.to(el, { opacity: 0, duration: 0.2 });
      shown = false;
    });

    /* --- Trạng thái khi rê qua thứ bấm được ------------------------------ */
    function enter(text) {
      gsap.to(ring, { scale: 1.9, duration: 0.4, ease: "expo.out" });
      gsap.to(dot, { scale: 0, duration: 0.3, ease: "expo.out" });
      if (label && text) {
        label.textContent = text;
        gsap.to(label, { opacity: 1, duration: 0.25 });
      }
    }

    function leave() {
      gsap.to(ring, { scale: 1, duration: 0.4, ease: "expo.out" });
      gsap.to(dot, { scale: 1, duration: 0.3, ease: "expo.out" });
      if (label) gsap.to(label, { opacity: 0, duration: 0.2 });
    }

    /* Gắn bằng uỷ quyền sự kiện ở document, nên hàng dự án dựng bằng JS
       sau này cũng tự có hiệu ứng mà không cần gắn lại. */
    document.addEventListener("mouseover", function (e) {
      var hit = e.target.closest("[data-cursor], a, button");
      if (!hit) return;
      enter(hit.getAttribute("data-cursor") || "");
    });

    document.addEventListener("mouseout", function (e) {
      var hit = e.target.closest("[data-cursor], a, button");
      if (!hit) return;
      if (e.relatedTarget && hit.contains(e.relatedTarget)) return;  /* vẫn còn trong vùng */
      leave();
    });

    /* --- Nút hít nam châm ------------------------------------------------ */
    /* Nút bị kéo nhẹ về phía con trỏ khi tay lại gần. Chỉ dịch tối đa vài
       pixel: đủ để cảm thấy, không đủ để làm hỏng bố cục. */
    document.querySelectorAll("[data-magnetic]").forEach(function (btn) {
      var strength = parseFloat(btn.getAttribute("data-magnetic")) || 0.28;
      var toX = gsap.quickTo(btn, "x", { duration: 0.5, ease: "power3.out" });
      var toY = gsap.quickTo(btn, "y", { duration: 0.5, ease: "power3.out" });

      btn.addEventListener("mousemove", function (e) {
        var r = btn.getBoundingClientRect();
        toX((e.clientX - (r.left + r.width / 2)) * strength);
        toY((e.clientY - (r.top + r.height / 2)) * strength);
      });

      btn.addEventListener("mouseleave", function () { toX(0); toY(0); });
    });
  }

  PF.modules.cursor = { init: init };
})();
