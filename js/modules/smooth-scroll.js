/* ==========================================================================
   modules/smooth-scroll.js — cuộn mượt bằng Lenis, nối vào ScrollTrigger.

   Ba việc bắt buộc khi ghép Lenis với ScrollTrigger, thiếu một là hỏng:
     1. mỗi lần Lenis cuộn thì gọi ScrollTrigger.update
     2. cho Lenis chạy trong ticker của GSAP, không tự gọi requestAnimationFrame
     3. tắt lagSmoothing để hai bên không lệch nhau khi máy khựng một nhịp

   Máy đang bật chế độ giảm chuyển động thì bỏ hẳn Lenis, trả về cuộn thường.
   ========================================================================== */

(function () {
  "use strict";

  var PF = (window.PF = window.PF || {});
  PF.modules = PF.modules || {};

  function init(ctx) {
    if (!window.gsap || !window.ScrollTrigger) return;

    /* Người dùng muốn ít chuyển động thì cuộn mượt cũng là thừa. */
    if (ctx.reduced || !window.Lenis) {
      PF.lenis = null;
      return;
    }

    var lenis = new window.Lenis({
      duration: 1.05,
      easing: function (t) {
        /* expo.out — nhanh lúc đầu, dừng rất êm ở cuối */
        return t === 1 ? 1 : 1 - Math.pow(2, -10 * t);
      },
      smoothWheel: true,
      /* Trên điện thoại giữ nguyên cuộn gốc: mượt hơn, không tốn pin,
         và không phá thanh địa chỉ tự ẩn của trình duyệt. */
      syncTouch: false,
      touchMultiplier: 1.6
    });

    lenis.on("scroll", window.ScrollTrigger.update);

    window.gsap.ticker.add(function (time) {
      lenis.raf(time * 1000);          /* ticker tính bằng giây, Lenis cần mili giây */
    });
    window.gsap.ticker.lagSmoothing(0);

    PF.lenis = lenis;

    /* Dùng chung cho nav và nút lên đầu trang */
    PF.scrollTo = function (target, opts) {
      lenis.scrollTo(target, Object.assign({ offset: 0, duration: 1.15 }, opts || {}));
    };
  }

  /* Khi không có Lenis thì vẫn phải cuộn được — dùng hàm gốc của trình duyệt */
  function fallbackScrollTo(target) {
    var el = typeof target === "string" ? document.querySelector(target) : target;
    if (el && el.scrollIntoView) {
      el.scrollIntoView({ behavior: "auto", block: "start" });
    } else if (typeof target === "number") {
      window.scrollTo(0, target);
    }
  }

  PF.modules.smoothScroll = {
    init: function (ctx) {
      init(ctx);
      if (!PF.scrollTo) PF.scrollTo = fallbackScrollTo;
    }
  };
})();
