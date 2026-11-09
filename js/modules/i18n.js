/* ==========================================================================
   modules/i18n.js — đổi ngôn ngữ tại chỗ, không tải lại trang.

   Đọc chuỗi từ js/data/i18n.js và đổ vào mọi phần tử có data-i18n.
   Lựa chọn được nhớ trong localStorage; nếu trình duyệt chặn localStorage
   (hay gặp khi mở bằng file://) thì trang vẫn chạy, chỉ là không nhớ.
   ========================================================================== */

(function () {
  "use strict";

  var PF = (window.PF = window.PF || {});
  PF.modules = PF.modules || {};

  var STORE_KEY = "pf-lang";
  var DEFAULT = "vi";

  function readStored() {
    try {
      return window.localStorage.getItem(STORE_KEY);
    } catch (err) {
      return null;               /* chế độ ẩn danh, hoặc file:// bị chặn */
    }
  }

  function writeStored(lang) {
    try {
      window.localStorage.setItem(STORE_KEY, lang);
    } catch (err) {
      /* không nhớ được thì thôi, không phải lỗi đáng dừng trang */
    }
  }

  /* Ngôn ngữ khởi đầu: đã chọn lần trước > tiếng Việt.

     Cố tình KHÔNG đọc navigator.language. Đây là portfolio của một người
     Việt, gửi cho nhà tuyển dụng Việt là chính; ai vào cũng phải thấy bản
     tiếng Việt trước, kể cả khi máy họ đang để tiếng Anh. Muốn tiếng Anh
     thì bấm nút EN — và từ đó localStorage nhớ giúp. */
  function pick() {
    var stored = readStored();
    if (stored && PF.i18n[stored]) return stored;
    return DEFAULT;
  }

  function dict() {
    return PF.i18n[PF.lang] || PF.i18n[DEFAULT];
  }

  /* Tra một khoá. Trả về null nếu không có, để nơi gọi tự quyết định. */
  function t(key) {
    var d = dict();
    return Object.prototype.hasOwnProperty.call(d, key) ? d[key] : null;
  }

  function apply(root) {
    var scope = root || document;
    var d = dict();

    scope.querySelectorAll("[data-i18n]").forEach(function (el) {
      var v = d[el.getAttribute("data-i18n")];
      if (v != null) el.textContent = v;
    });

    /* Chỉ dùng cho chuỗi có sẵn thẻ b/strong trong từ điển của chính mình,
       không bao giờ nhận nội dung từ người dùng nhập vào. */
    scope.querySelectorAll("[data-i18n-html]").forEach(function (el) {
      var v = d[el.getAttribute("data-i18n-html")];
      if (v != null) el.innerHTML = v;
    });

    /* data-i18n-attr="placeholder:form.namePh, aria-label:nav.langLabel" */
    scope.querySelectorAll("[data-i18n-attr]").forEach(function (el) {
      el.getAttribute("data-i18n-attr").split(",").forEach(function (pair) {
        var bits = pair.split(":");
        if (bits.length < 2) return;
        var attr = bits[0].trim();
        var v = d[bits.slice(1).join(":").trim()];
        if (v != null) el.setAttribute(attr, v);
      });
    });

    if (!root) {
      document.documentElement.setAttribute("lang", PF.lang);
      if (d["meta.title"]) document.title = d["meta.title"];
      var meta = document.querySelector('meta[name="description"]');
      if (meta && d["meta.desc"]) meta.setAttribute("content", d["meta.desc"]);
    }
  }

  function set(lang) {
    if (!PF.i18n[lang] || lang === PF.lang) return;
    PF.lang = lang;
    writeStored(lang);
    apply();
    syncButtons();
    /* Báo cho những module tự dựng nội dung (danh sách dự án, case study)
       biết mà cập nhật phần chữ của chúng. */
    document.dispatchEvent(new CustomEvent("pf:lang", { detail: { lang: lang } }));
  }

  function syncButtons() {
    document.querySelectorAll("[data-lang]").forEach(function (btn) {
      btn.setAttribute("aria-pressed", String(btn.getAttribute("data-lang") === PF.lang));
    });
  }

  function init() {
    if (!PF.i18n) return;
    PF.lang = pick();
    PF.t = t;

    document.querySelectorAll("[data-lang]").forEach(function (btn) {
      btn.addEventListener("click", function () {
        set(btn.getAttribute("data-lang"));
      });
    });

    apply();
    syncButtons();
  }

  PF.modules.i18n = { init: init, apply: apply, set: set, t: t };
})();
