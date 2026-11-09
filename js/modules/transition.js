/* ==========================================================================
   modules/transition.js — màn đen phủ lên khi rời trang.

   Chỉ chặn những liên kết nội bộ có gắn data-transition. Liên kết ra ngoài,
   mở tab mới, tải file, hay khi người dùng giữ Ctrl/Cmd đều để nguyên —
   cướp quyền của những thao tác đó là cách nhanh nhất làm người xem bực.
   ========================================================================== */

(function () {
  "use strict";

  var PF = (window.PF = window.PF || {});
  PF.modules = PF.modules || {};

  function init(ctx) {
    var veil = document.querySelector(".page-transition");
    if (!veil || !window.gsap) return;

    var gsap = window.gsap;

    /* Vào trang: màn đen đang phủ sẵn thì kéo lên. Đặt trong CSS thì trang
       vẫn đọc được khi JS chết, nên trạng thái ban đầu để ở scaleY(0). */
    if (!ctx.reduced) {
      gsap.fromTo(veil,
        { scaleY: 1, transformOrigin: "top center" },
        { scaleY: 0, duration: 0.75, ease: "expo.inOut", transformOrigin: "top center" }
      );
    }

    document.addEventListener("click", function (e) {
      var link = e.target.closest("a[data-transition]");
      if (!link) return;

      /* Người dùng đang cố mở tab mới — đừng xen vào */
      if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || e.button !== 0) return;
      if (link.target === "_blank" || link.hasAttribute("download")) return;

      var href = link.getAttribute("href");
      if (!href || href.charAt(0) === "#") return;

      /* Chỉ nhận liên kết cùng nguồn gốc */
      var url = new URL(href, window.location.href);
      if (url.origin !== window.location.origin) return;

      e.preventDefault();

      if (ctx.reduced) { window.location.href = href; return; }

      gsap.fromTo(veil,
        { scaleY: 0, transformOrigin: "bottom center" },
        {
          scaleY: 1,
          duration: 0.6,
          ease: "expo.inOut",
          transformOrigin: "bottom center",
          onComplete: function () { window.location.href = href; }
        }
      );
    });
  }

  PF.modules.transition = { init: init };
})();
