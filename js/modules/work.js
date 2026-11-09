/* ==========================================================================
   modules/work.js — dựng danh sách dự án từ js/data/projects.js và làm
   tấm ảnh xem trước bám theo con trỏ.

   Danh sách dựng bằng JavaScript để nội dung chỉ nằm ở một chỗ duy nhất.
   Phần chữ được cập nhật khi đổi ngôn ngữ, còn khung DOM giữ nguyên — dựng
   lại cả khung sẽ giết hết ScrollTrigger đang gắn lên nó.
   ========================================================================== */

(function () {
  "use strict";

  var PF = (window.PF = window.PF || {});
  PF.modules = PF.modules || {};

  /* Số dự án hiện ngay khi vào trang. Phần còn lại nằm sau nút "Xem thêm":
     mười lăm hàng đổ ra cùng lúc thì không còn là danh sách chọn lọc nữa,
     người xem cuộn mãi không tới phần giới thiệu. */
  var VISIBLE = 5;

  var rows = [];        /* giữ tham chiếu để đổi ngôn ngữ mà không dựng lại DOM */

  function el(tag, cls, text) {
    var node = document.createElement(tag);
    if (cls) node.className = cls;
    if (text != null) node.textContent = text;
    return node;
  }

  function buildRow(project, index) {
    var row = el("article", "work__row");
    row.setAttribute("data-project", project.id);

    if (index < VISIBLE) {
      /* Hàng cũng hiện dần khi cuộn tới, dùng chung cơ chế với các khối khác.
         Vì vậy module này phải chạy TRƯỚC reveal trong main.js. */
      row.setAttribute("data-reveal", "");
    } else {
      /* Hàng ẩn KHÔNG mang data-reveal: ScrollTrigger đo một phần tử
         display:none ra toạ độ bằng 0 và coi như nó đã vào khung nhìn, nên
         hiệu ứng hiện dần sẽ cháy hết trước khi ai kịp bấm nút. Phần này để
         hàm expand() tự lo. */
      row.classList.add("work__row--more");
    }

    var year = el("div", "work__year", project.year);
    var title = el("h3", "work__title", project.title);
    var role = el("div", "work__role");
    var go = el("div", "work__go", "↗");        /* mũi tên chéo lên */

    /* Một liên kết phủ kín cả hàng: bấm đâu cũng vào được, mà vẫn chỉ có
       một điểm dừng khi đi bằng phím Tab. */
    var link = el("a", "work__link");
    link.href = "project.html?id=" + encodeURIComponent(project.id);
    link.setAttribute("data-cursor", "");
    link.setAttribute("data-transition", "");

    var srLabel = el("span", "sr-only");
    link.appendChild(srLabel);

    row.appendChild(year);
    row.appendChild(title);
    row.appendChild(role);
    row.appendChild(go);
    row.appendChild(link);

    rows.push({ project: project, role: role, link: link, srLabel: srLabel, node: row });
    return row;
  }

  function localise() {
    var lang = PF.lang || "vi";
    updateMoreLabel();
    rows.forEach(function (r) {
      r.role.textContent = r.project.role[lang] || r.project.role.vi;
      var label = (PF.t && PF.t("work.view")) || "Xem";
      r.srLabel.textContent = label + " " + r.project.title;
      r.link.setAttribute("data-cursor", label);
    });
  }

  /* --- Nút "Xem thêm" ---------------------------------------------------- */
  var moreBtn = null;
  var expanded = false;

  /* Nhãn nút ghép từ chuỗi có chỗ trống {n} chứ không nối chuỗi thủ công:
     tiếng Việt đặt số sau động từ ("Xem thêm 10 dự án"), tiếng Anh đặt số vào
     giữa ("Show 10 more projects"). Nối tay là hỏng một trong hai. */
  function updateMoreLabel() {
    if (!moreBtn || expanded) return;
    var label = moreBtn.querySelector(".work__more-label");
    var n = PF.projects.length - VISIBLE;
    var tpl = (PF.t && PF.t("work.more")) || "Xem thêm {n} dự án";
    if (label) label.textContent = tpl.replace("{n}", String(n));
  }

  function setupMore(ctx, listEl) {
    moreBtn = document.querySelector(".work__more");
    if (!moreBtn) return;

    /* Ít dự án hơn mức hiển thị thì không có gì để mở thêm */
    if (PF.projects.length <= VISIBLE) {
      var wrap = moreBtn.closest(".work__actions");
      (wrap || moreBtn).remove();
      moreBtn = null;
      return;
    }

    moreBtn.hidden = false;
    updateMoreLabel();

    moreBtn.addEventListener("click", function () {
      if (expanded) return;
      expanded = true;

      var extra = Array.prototype.slice.call(listEl.querySelectorAll(".work__row--more"));
      listEl.classList.add("is-expanded");
      moreBtn.setAttribute("aria-expanded", "true");

      if (window.gsap && !ctx.reduced) {
        window.gsap.from(extra, {
          opacity: 0,
          y: 28,
          duration: 0.7,
          ease: "expo.out",
          stagger: 0.05,
          /* Trang vừa dài thêm mấy nghìn pixel — mọi mốc ScrollTrigger phía
             dưới đều sai cho tới khi đo lại. */
          onComplete: function () {
            if (window.ScrollTrigger) window.ScrollTrigger.refresh();
          }
        });
      } else if (window.ScrollTrigger) {
        window.ScrollTrigger.refresh();
      }

      /* Nút đã làm xong việc của nó. Giữ lại một nút chết chỉ tổ vướng khi
         đi bằng phím Tab. */
      var actions = moreBtn.closest(".work__actions");
      if (window.gsap && !ctx.reduced) {
        window.gsap.to(actions || moreBtn, {
          opacity: 0, height: 0, paddingTop: 0, duration: 0.4, ease: "power2.in",
          onComplete: function () { (actions || moreBtn).remove(); }
        });
      } else {
        (actions || moreBtn).remove();
      }
      moreBtn = null;
    });
  }

  /* Ảnh xem trước dùng đúng ảnh DẪN của trang case study — cùng ảnh người
     xem sẽ thấy đầu tiên nếu bấm vào. case.js chọn ảnh NGANG đầu tiên trong
     `gallery` làm ảnh dẫn (xem renderCover trong js/modules/case.js); một số
     dự án mở đầu bằng ảnh chụp màn hình điện thoại (`tall: true`) nên không
     thể lấy đại phần tử đầu mảng.

     Không dùng project.poster nữa: poster giờ chỉ còn phục vụ thẻ dự án ở
     danh sách và làm phương án dự phòng khi một dự án chưa kịp có gallery. */
  function leadImage(project) {
    var gallery = project.gallery;
    if (!gallery || !gallery.length) return project.poster;

    for (var i = 0; i < gallery.length; i++) {
      var entry = gallery[i];
      var tall = typeof entry === "object" && !!entry.tall;
      if (!tall) return typeof entry === "string" ? entry : entry.src;
    }
    var first = gallery[0];   /* toàn bộ đều tall — không nên xảy ra, nhưng vẫn phải trả về gì đó */
    return typeof first === "string" ? first : first.src;
  }

  /* --- Ảnh xem trước bám con trỏ ---------------------------------------- */
  function setupPreview(ctx, listEl) {
    var box = document.querySelector(".work__preview");
    if (!box || !window.gsap || ctx.isTouch || ctx.reduced) {
      if (box) box.remove();
      return;
    }

    var gsap = window.gsap;
    var img = box.querySelector("img");
    var current = null;

    var toX = gsap.quickTo(box, "x", { duration: 0.55, ease: "power3.out" });
    var toY = gsap.quickTo(box, "y", { duration: 0.55, ease: "power3.out" });
    /* Ảnh nghiêng nhẹ theo hướng tay đang di chuyển, như một tấm ảnh thật
       bị kéo lê trên mặt bàn. */
    var toRot = gsap.quickTo(box, "rotation", { duration: 0.7, ease: "power3.out" });

    /* null chứ không phải 0: lần chuột vào danh sách đầu tiên mà lấy mốc 0
       thì độ lệch bằng cả toạ độ X, và tấm ảnh nảy lên góc nghiêng tối đa
       ngay khung hình đầu. */
    var lastX = null;

    gsap.set(box, { xPercent: -50, yPercent: -50, scale: 0.86, opacity: 0 });

    listEl.addEventListener("mousemove", function (e) {
      if (lastX === null) lastX = e.clientX;
      toX(e.clientX);
      toY(e.clientY);
      toRot(gsap.utils.clamp(-9, 9, (e.clientX - lastX) * 0.7));
      lastX = e.clientX;
    }, { passive: true });

    listEl.addEventListener("mouseover", function (e) {
      var row = e.target.closest(".work__row");
      if (!row || row === current) return;
      current = row;

      var id = row.getAttribute("data-project");
      var project = PF.projects.filter(function (p) { return p.id === id; })[0];
      if (!project) return;

      img.src = leadImage(project);
      img.alt = "";
      gsap.to(box, { opacity: 1, scale: 1, duration: 0.4, ease: "expo.out" });
    });

    function hide() {
      current = null;
      lastX = null;
      gsap.to(box, { opacity: 0, scale: 0.86, duration: 0.3, ease: "power2.out" });
    }

    listEl.addEventListener("mouseleave", hide);
    /* Chuột ra khỏi cửa sổ trình duyệt khi đang ở trên một hàng. */
    document.documentElement.addEventListener("mouseleave", hide);

    /* Danh sách cuộn khuất khỏi màn hình mà trình duyệt chưa kịp bắn mouseleave
       (cuộn bằng phím, bấm menu, kéo thanh cuộn) thì tấm ảnh bị kẹt lại, nổi
       đè lên chữ ở section khác. ScrollTrigger giữ đúng quy ước "một nguồn
       cuộn duy nhất" của trang. */
    if (window.ScrollTrigger) {
      window.ScrollTrigger.create({
        trigger: listEl,
        start: "top bottom",
        end: "bottom top",
        onLeave: hide,
        onLeaveBack: hide
      });
    }
  }

  function init(ctx) {
    var listEl = document.querySelector(".work__list");
    if (!listEl || !PF.projects) return;

    var frag = document.createDocumentFragment();
    PF.projects.forEach(function (p, i) { frag.appendChild(buildRow(p, i)); });
    listEl.appendChild(frag);

    localise();
    document.addEventListener("pf:lang", localise);

    setupPreview(ctx, listEl);
    setupMore(ctx, listEl);
  }

  PF.modules.work = { init: init };
})();
