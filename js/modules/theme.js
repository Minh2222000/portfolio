/* ==========================================================================
   modules/theme.js — đổi giao diện sáng/tối tại chỗ, không tải lại trang.

   Giao diện được ghi vào thuộc tính data-theme của thẻ <html>; tokens.css
   đọc thuộc tính đó rồi đổi toàn bộ bảng màu. File này chỉ lo ba việc:
   nhớ lựa chọn, đồng bộ nút bấm, và báo cho module khác biết mà cập nhật.

   Lưu ý: lần vẽ ĐẦU TIÊN không do file này quyết định. Có một đoạn script
   inline trong <head> chạy trước cả stylesheet để đặt sẵn data-theme —
   thiếu nó thì trang loé nền đen rồi mới nhảy sang nền sáng. File này chạy
   ở cuối <body>, tới lúc đó thì đã muộn.
   ========================================================================== */

(function () {
  "use strict";

  var PF = (window.PF = window.PF || {});
  PF.modules = PF.modules || {};

  var STORE_KEY = "pf-theme";
  var DEFAULT = "dark";
  var VALID = { dark: true, light: true };

  /* Màu thanh trạng thái của trình duyệt di động. Phải khớp với --bg của
     từng giao diện trong tokens.css, đổi ở đó thì nhớ đổi luôn ở đây. */
  var BAR_COLOR = { dark: "#06070a", light: "#f4f1e9" };

  var SWITCH_MS = 340;         /* khớp với transition 0.3s trong tokens.css */
  var switchTimer = 0;

  function readStored() {
    try {
      return window.localStorage.getItem(STORE_KEY);
    } catch (err) {
      return null;             /* chế độ ẩn danh, hoặc file:// bị chặn */
    }
  }

  function writeStored(theme) {
    try {
      window.localStorage.setItem(STORE_KEY, theme);
    } catch (err) {
      /* không nhớ được thì thôi, không phải lỗi đáng dừng trang */
    }
  }

  function systemQuery() {
    try {
      return window.matchMedia("(prefers-color-scheme: light)");
    } catch (err) {
      return null;
    }
  }

  /* Giao diện khởi đầu: đã chọn lần trước > cài đặt hệ điều hành > tối.
     Mặc định là tối vì đó mới là tông gốc của trang — nền giấy chỉ dành
     cho người đã nói rõ họ muốn nó. */
  function pick() {
    var stored = readStored();
    if (VALID[stored]) return stored;
    var mq = systemQuery();
    return mq && mq.matches ? "light" : DEFAULT;
  }

  function paint(theme) {
    document.documentElement.setAttribute("data-theme", theme);
    var meta = document.querySelector('meta[name="theme-color"]');
    if (meta) meta.setAttribute("content", BAR_COLOR[theme]);
  }

  /* Bật transition màu trong đúng một nhịp rồi gỡ ra. Để nó nằm thường trực
     thì mọi hiệu ứng hover và mọi lần ScrollTrigger đổi màu đều phải đi qua
     bộ nội suy — trả giá cả phiên chỉ để đẹp một cái chớp mắt. */
  function crossfade() {
    var root = document.documentElement;
    root.classList.add("is-theming");
    window.clearTimeout(switchTimer);
    switchTimer = window.setTimeout(function () {
      root.classList.remove("is-theming");
    }, SWITCH_MS);
  }

  /* Nhãn nút phải nói việc SẼ xảy ra khi bấm, không phải trạng thái hiện tại.
     Chuỗi lấy từ từ điển i18n nên đổi ngôn ngữ là nhãn đổi theo. */
  function syncButton() {
    var btn = document.querySelector("[data-theme-toggle]");
    if (!btn) return;
    var key = PF.theme === "dark" ? "nav.themeToLight" : "nav.themeToDark";
    var label = PF.t ? PF.t(key) : null;
    if (label) {
      btn.setAttribute("aria-label", label);
      btn.setAttribute("title", label);
    }
  }

  /* persist = true khi chính người dùng bấm nút. Lúc trang chỉ đang đi theo
     cài đặt hệ điều hành thì KHÔNG ghi gì: ghi vào là biến một thay đổi ở
     cấp máy thành "người này đã tự chọn", và từ đó trang bơ luôn mọi lần họ
     đổi sáng/tối ở cấp máy. */
  function apply(theme, animate, persist) {
    if (!VALID[theme] || theme === PF.theme) return;
    PF.theme = theme;
    if (persist) writeStored(theme);
    if (animate && !(PF.ctx && PF.ctx.reduced)) crossfade();
    paint(theme);
    syncButton();
    document.dispatchEvent(new CustomEvent("pf:theme", { detail: { theme: theme } }));
  }

  function set(theme, animate) {
    apply(theme, animate, true);
  }

  function toggle() {
    set(PF.theme === "dark" ? "light" : "dark", true);
  }

  function init() {
    /* Script inline trong <head> đã đặt data-theme trước khi trang vẽ.
       Đọc lại chính nó để hai bên không lệch nhau. */
    var current = document.documentElement.getAttribute("data-theme");
    PF.theme = VALID[current] ? current : pick();
    paint(PF.theme);

    var btn = document.querySelector("[data-theme-toggle]");
    if (btn) btn.addEventListener("click", toggle);
    syncButton();

    /* Đổi ngôn ngữ thì nhãn nút phải dịch theo */
    document.addEventListener("pf:lang", syncButton);

    /* Người dùng đổi giao diện ở cấp hệ điều hành: chỉ đi theo khi họ CHƯA
       tự chọn trên trang này. Đã chọn rồi thì lựa chọn đó là quyết định. */
    var mq = systemQuery();
    if (!mq) return;
    var follow = function () {
      if (VALID[readStored()]) return;
      apply(mq.matches ? "light" : "dark", true, false);
    };
    if (mq.addEventListener) mq.addEventListener("change", follow);
    else if (mq.addListener) mq.addListener(follow);   /* Safari cũ */
  }

  PF.modules.theme = { init: init, set: set, toggle: toggle };
})();
