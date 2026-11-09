/* ==========================================================================
   modules/nav.js — điều hướng: bấm là cuộn tới, và thanh bên trái luôn cho
   biết đang đứng ở section nào.

   Nhãn trên thanh bên là chính id của section (#work, #about...) chứ không
   phải số thứ tự trang trí — nó nói đúng vị trí thật trong tài liệu.
   ========================================================================== */

(function () {
  "use strict";

  var PF = (window.PF = window.PF || {});
  PF.modules = PF.modules || {};

  function init() {
    var links = Array.prototype.slice.call(document.querySelectorAll("[data-scroll-to]"));
    var navLinks = Array.prototype.slice.call(document.querySelectorAll(".nav__link"));

    /* Trong lúc trang tự cuộn theo lệnh bấm, đừng để nav ẩn đi. Bấm một mục
       rồi thấy chính thanh menu biến mất là cảm giác hỏng, dù kỹ thuật thì
       đúng là trang đang cuộn xuống. */
    var programmaticUntil = 0;

    /* --- Bấm để cuộn ----------------------------------------------------- */
    links.forEach(function (link) {
      link.addEventListener("click", function (e) {
        var sel = link.getAttribute("data-scroll-to");
        var target = document.querySelector(sel);
        if (!target) return;              /* để trình duyệt tự xử nếu không tìm thấy */
        e.preventDefault();
        programmaticUntil = performance.now() + 1600;
        PF.scrollTo(target);
      });
    });

    /* --- Đánh dấu section đang xem --------------------------------------- */
    if (!window.ScrollTrigger) return;

    var sections = Array.prototype.slice.call(document.querySelectorAll("main section[id]"));

    function mark(id) {
      navLinks.forEach(function (item) {
        item.classList.toggle("is-current", item.getAttribute("data-scroll-to") === "#" + id);
      });
    }

    sections.forEach(function (section) {
      window.ScrollTrigger.create({
        trigger: section,
        /* Coi là "đang xem" khi section chiếm phần giữa màn hình */
        start: "top 45%",
        end: "bottom 45%",
        onToggle: function (self) {
          if (self.isActive) mark(section.id);
        }
      });
    });

    /* --- Ẩn nav khi cuộn xuống ------------------------------------------- */
    var navEl = document.querySelector(".nav");
    if (navEl) {
      window.ScrollTrigger.create({
        start: "top -80",          /* qua 80px đầu mới bắt đầu ẩn hiện */
        end: 99999,
        onUpdate: function (self) {
          if (performance.now() < programmaticUntil) {
            navEl.classList.remove("is-hidden");
            return;
          }
          /* direction: 1 là đang cuộn xuống, -1 là cuộn lên */
          navEl.classList.toggle("is-hidden", self.direction === 1);
        },
        onLeaveBack: function () {
          navEl.classList.remove("is-hidden");
        }
      });
    }

  }

  PF.modules.nav = { init: init };
})();
