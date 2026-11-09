/* ==========================================================================
   main.js — điểm khởi động duy nhất.

   Đăng ký plugin GSAP, đọc điều kiện thiết bị một lần rồi truyền cho mọi
   module qua đối tượng ctx, và gọi từng module theo đúng thứ tự phụ thuộc.

   Vì sao không dùng ES module: trang phải mở được bằng cách bấm đúp vào
   index.html trên ổ đĩa. Trên giao thức file:// thì type="module" bị chính
   sách CORS chặn, còn thẻ script thường thì chạy bình thường. Mỗi module
   tự gắn mình vào window.PF.modules, file này chỉ gọi chúng dậy.
   ========================================================================== */

(function () {
  "use strict";

  var PF = (window.PF = window.PF || {});
  PF.modules = PF.modules || {};

  /* Thứ tự có ý nghĩa, đừng đảo tuỳ tiện:
       i18n        đặt PF.lang trước, mọi module sau đều đọc nó
       theme       chạy ngay sau i18n vì nhãn nút của nó lấy từ PF.t
       smoothScroll tạo PF.scrollTo cho nav dùng
       work        dựng hàng dự án TRƯỚC reveal, để reveal quét thấy chúng
       reveal      gắn ScrollTrigger sau khi DOM đã đủ
       transition  gắn cuối, để không nuốt click của các module khác  */
  var ORDER = [
    "i18n",
    "theme",
    "smoothScroll",
    "work",
    "caseStudy",
    "preloader",
    "cursor",
    "nav",
    "hero",
    "heroFx",
    "marquee",
    "reveal",
    "contact",
    "transition"
  ];

  function readContext() {
    var reducedQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    return {
      reduced: reducedQuery.matches,
      /* Máy không có con trỏ chính xác: bỏ mọi thứ dựa vào hover */
      isTouch: window.matchMedia("(hover: none), (pointer: coarse)").matches
    };
  }

  function registerPlugins() {
    if (!window.gsap) return;
    var list = [];
    if (window.ScrollTrigger) list.push(window.ScrollTrigger);
    if (window.ScrollToPlugin) list.push(window.ScrollToPlugin);
    if (window.SplitText) list.push(window.SplitText);
    if (list.length) window.gsap.registerPlugin.apply(window.gsap, list);
  }

  function boot() {
    /* Gỡ cờ no-js: từ đây trở đi các trạng thái ẩn ban đầu mới có hiệu lực.
       Nếu file này không chạy được, cờ vẫn còn và responsive.css sẽ hiện
       toàn bộ nội dung ra. */
    document.documentElement.classList.remove("no-js");

    registerPlugins();

    var ctx = readContext();
    PF.ctx = ctx;

    ORDER.forEach(function (name) {
      var mod = PF.modules[name];
      if (!mod || typeof mod.init !== "function") return;
      try {
        mod.init(ctx);
      } catch (err) {
        /* Một module hỏng không được kéo cả trang xuống theo. Ghi log để
           còn sửa, rồi chạy tiếp module sau. */
        console.error("[portfolio] module " + name + " lỗi:", err);
      }
    });

    /* Ảnh và font tải xong làm chiều cao trang đổi, mà mọi mốc ScrollTrigger
       đều tính theo chiều cao lúc tạo — phải đo lại. */
    window.addEventListener("load", function () {
      if (window.ScrollTrigger) window.ScrollTrigger.refresh();
    });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", boot);
  } else {
    boot();
  }
})();
