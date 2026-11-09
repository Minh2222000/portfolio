/* ==========================================================================
   modules/contact.js — đồng hồ giờ Hà Nội ở khối liên hệ.
   ========================================================================== */

(function () {
  "use strict";

  var PF = (window.PF = window.PF || {});
  PF.modules = PF.modules || {};

  /* --- Đồng hồ giờ Hà Nội ------------------------------------------------ */
  /* Nhà tuyển dụng ở múi giờ khác nhìn con số này là biết ngay giờ nào gọi
     được. Tính bằng Intl nên không phụ thuộc giờ máy của người xem. */
  function setupClock() {
    var nodes = document.querySelectorAll("[data-clock]");
    if (!nodes.length) return;

    var fmt;
    try {
      fmt = new Intl.DateTimeFormat("vi-VN", {
        timeZone: "Asia/Ho_Chi_Minh",
        hour: "2-digit",
        minute: "2-digit",
        hour12: false
      });
    } catch (err) {
      return;                  /* trình duyệt quá cũ thì bỏ qua, không phải lỗi */
    }

    function tick() {
      var now = fmt.format(new Date());
      nodes.forEach(function (n) { n.textContent = now; });
    }

    tick();
    window.setInterval(tick, 30000);
  }

  function init() {
    setupClock();
  }

  PF.modules.contact = { init: init };
})();
