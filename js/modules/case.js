/* ==========================================================================
   modules/case.js — dựng trang case study từ ?id= trên thanh địa chỉ.

   Chỉ một file project.html dùng chung cho mọi dự án. Thêm dự án mới thì
   chỉ cần thêm một phần tử vào js/data/projects.js, không phải tạo file.
   ========================================================================== */

(function () {
  "use strict";

  var PF = (window.PF = window.PF || {});
  PF.modules = PF.modules || {};

  var project = null;

  function currentId() {
    /* URLSearchParams đọc được cả khi mở bằng file:// vì phần ?id= vẫn nằm
       trong location.search. */
    return new URLSearchParams(window.location.search).get("id");
  }

  /* Điền vào MỌI phần tử mang cùng data-case. Trang có hai chỗ hiện năm
     (nhãn trên tiêu đề và ô thông tin bên dưới), nên chỉ lấy phần tử đầu
     tiên là bỏ sót một chỗ. */
  function fill(selector, value) {
    if (value == null) return;
    document.querySelectorAll('[data-case="' + selector + '"]').forEach(function (el) {
      el.textContent = value;
    });
  }

  /* Không phải dự án nào cũng kể đủ ba đoạn Yêu cầu / Cách làm / Kết quả.
     Trường vắng mặt trả về null để fill() bỏ qua thay vì ném lỗi; khối tương
     ứng trên trang đã được dropEmptyBlocks() gỡ đi từ trước. */
  function text(field, lang) {
    var value = project[field];
    if (!value) return null;
    return value[lang] || value.vi || null;
  }

  /* project.html dùng chung cho cả mười lăm dự án nên nó luôn mang sẵn đủ ba
     khối. Dự án nào không có đoạn nào thì gỡ hẳn khối đó ra: để lại một tiêu
     đề với đoạn văn rỗng bên dưới trông như trang hỏng, chứ không như một
     lựa chọn. */
  function dropEmptyBlocks() {
    ["challenge", "tasks", "approach", "result"].forEach(function (field) {
      if (project[field]) return;
      var node = document.querySelector('[data-case="' + field + '"]');
      if (!node) return;
      var block = node.closest(".case__block");
      (block || node).remove();
    });
  }

  /* Danh sách kiểu gạch đầu dòng — dùng chung cho "Công việc" (field `tasks`,
     một khối riêng) và cho các tiêu chí rời trong "Yêu cầu" (field `criteria`,
     nằm ngay dưới đoạn văn challenge). Khác các đoạn văn khác ở chỗ nội dung
     là một MẢNG câu chứ không phải một chuỗi, nên phải dựng lại các <li> mỗi
     lần đổi ngôn ngữ — fill() chỉ gán được textContent cho một phần tử. */
  function renderBulletList(selector, field, lang) {
    var wrap = document.querySelector('[data-case="' + selector + '"]');
    if (!wrap) return;

    var list = project[field] && (project[field][lang] || project[field].vi);
    wrap.innerHTML = "";
    if (!list || !list.length) return;

    list.forEach(function (item) {
      var li = document.createElement("li");
      li.textContent = item;
      wrap.appendChild(li);
    });
  }

  function localise() {
    if (!project) return;
    var lang = PF.lang || "vi";

    fill("role", text("role", lang));
    fill("summary", text("summary", lang));
    fill("challenge", text("challenge", lang));
    fill("approach", text("approach", lang));
    fill("result", text("result", lang));
    renderBulletList("tasks", "tasks", lang);
    renderBulletList("criteria", "criteria", lang);

    document.querySelectorAll("[data-metric-label]").forEach(function (node, i) {
      var m = project.metrics[i];
      if (m) node.textContent = m.label[lang] || m.label.vi;
    });
  }

  function renderMetrics() {
    var wrap = document.querySelector('[data-case="metrics"]');
    if (!wrap) return;
    if (!project.metrics || !project.metrics.length) { wrap.remove(); return; }

    project.metrics.forEach(function (m) {
      var cell = document.createElement("div");
      cell.className = "case__metric";
      cell.setAttribute("data-reveal", "");

      var value = document.createElement("b");
      value.textContent = m.value;

      var label = document.createElement("span");
      label.setAttribute("data-metric-label", "");

      cell.appendChild(value);
      cell.appendChild(label);
      wrap.appendChild(cell);
    });
  }

  function renderStack() {
    var wrap = document.querySelector('[data-case="stack"]');
    if (!wrap) return;
    project.stack.forEach(function (name) {
      var tag = document.createElement("span");
      tag.className = "tag";
      tag.textContent = name;
      wrap.appendChild(tag);
    });
  }

  function renderLive() {
    var link = document.querySelector('[data-case="live"]');
    if (!link) return;
    /* Dự án chưa công khai thì giấu hẳn nút, tốt hơn là để một nút chết */
    if (!project.live) { link.remove(); return; }
    link.href = project.live;
    link.target = "_blank";
    link.rel = "noopener noreferrer";
  }

  /* Cùng khuôn với renderLive: không có link thì gỡ nút, không để nút chết. */
  function renderFigma() {
    var link = document.querySelector('[data-case="figma"]');
    if (!link) return;
    if (!project.figma) { link.remove(); return; }
    link.href = project.figma;
    link.target = "_blank";
    link.rel = "noopener noreferrer";
  }

  /* Ảnh bìa.

     Dự án nào khai `gallery` thì trải cả bộ ảnh ra thay cho một ảnh duy nhất:
     ảnh đầu chiếm trọn chiều ngang, những ảnh sau chia đôi hàng bên dưới.
     Không khai thì vẫn đúng một ảnh `poster` như cũ.

     Bộ ảnh dựng lưới riêng chứ không mượn lại khung .case__cover: khung đó ép
     16:9 rồi cắt bằng object-fit, mà ảnh mockup chụp thiết bị thì cắt là mất
     chân đế với bàn tay cầm máy — hỏng đúng cái làm nên bức ảnh. */
  function renderCover() {
    var fig = document.querySelector(".case__cover");
    if (!fig) return;

    var shots = project.gallery;

    if (!shots || !shots.length) {
      var one = fig.querySelector("img");
      if (one) {
        one.src = project.poster;
        one.alt = project.title;
      }
      return;
    }

    var wrap = document.createElement("div");
    wrap.className = "case__shots";

    /* Ảnh dẫn đầu là ảnh NGANG đầu tiên, KHÔNG phải phần tử số 0. Bộ nào mở
       màn bằng một loạt ảnh điện thoại mà cho cái 9:16 đầu tiên kéo hết chiều
       ngang thì nó cao gần bằng ba màn hình, cuộn mãi mới qua. */
    var daCoLead = false;

    shots.forEach(function (entry, i) {
      /* Mỗi phần tử là một chuỗi đường dẫn, hoặc { src, cutout } khi riêng ảnh
         đó cần khác mặc định của cả bộ.

         Vì sao cần tới mức từng ảnh: một bộ hoàn toàn có thể trộn ảnh đã tách
         nền với ảnh chụp còn nguyên phông. Bỏ khung cho ảnh còn phông thì nó
         thành một hình chữ nhật cắt cụt nằm chơ vơ; giữ khung cho ảnh đã tách
         nền thì nhốt lại cái máy vừa được thả ra. Phải chọn theo từng ảnh. */
      var src = typeof entry === "string" ? entry : entry.src;
      var cutout = typeof entry === "string" || entry.cutout === undefined
        ? !!project.galleryCutout
        : !!entry.cutout;
      var tall = typeof entry === "object" && !!entry.tall;

      var lead = !tall && !daCoLead;
      if (lead) daCoLead = true;

      var item = document.createElement("figure");
      item.className = "case__shot"
        + (lead ? " case__shot--lead" : "")
        + (tall ? " case__shot--tall" : "")
        + (cutout ? " case__shot--cutout" : "");
      item.setAttribute("data-reveal", "");

      var img = document.createElement("img");
      img.src = src;
      /* Ba ảnh cùng mô tả một sản phẩm nên cùng một alt là thừa và ồn với
         trình đọc màn hình. Ảnh đầu mang alt, hai ảnh sau để rỗng — chúng chỉ
         là góc nhìn khác của chính thứ vừa mô tả. */
      img.alt = lead ? project.title : "";
      /* Ảnh đầu nằm ngay trong khung nhìn nên tải ngay; phần còn lại đợi cuộn
         tới. Bộ ảnh mockup nặng hơn ảnh chụp giao diện thường khá nhiều. */
      img.loading = i === 0 ? "eager" : "lazy";   /* ảnh trên cùng, không phải ảnh dẫn */
      img.decoding = "async";

      item.appendChild(img);
      wrap.appendChild(item);
    });

    fig.parentNode.replaceChild(wrap, fig);
  }

  function renderNext() {
    var link = document.querySelector('[data-case="next"]');
    if (!link) return;
    var list = PF.projects;
    var idx = list.indexOf(project);
    var next = list[(idx + 1) % list.length];      /* hết danh sách thì quay vòng */
    link.href = "project.html?id=" + encodeURIComponent(next.id);
    var nameEl = link.querySelector('[data-case="nextName"]');
    if (nameEl) nameEl.textContent = next.title;
  }

  function showMissing() {
    var main = document.querySelector("main");
    if (!main) return;
    main.innerHTML = "";

    var wrap = document.createElement("div");
    wrap.className = "shell section stack-v";
    /* Cho khối lỗi đủ cao để chân trang không trôi lên giữa màn hình */
    wrap.style.minHeight = "60vh";
    wrap.style.paddingTop = "9rem";
    wrap.style.alignItems = "flex-start";

    var msg = document.createElement("p");
    msg.className = "lead";
    msg.textContent = (PF.t && PF.t("case.missing")) || "Không tìm thấy dự án này.";

    var back = document.createElement("a");
    back.className = "btn";
    back.href = "index.html";
    back.textContent = (PF.t && PF.t("case.back")) || "Quay lại danh sách";

    wrap.appendChild(msg);
    wrap.appendChild(back);
    main.appendChild(wrap);
  }

  function init() {
    /* Trang chủ không có phần tử này, nên module tự đứng ngoài */
    if (!document.querySelector('[data-case="title"]')) return;
    if (!PF.projects) return;

    var id = currentId();
    project = PF.projects.filter(function (p) { return p.id === id; })[0] || null;

    if (!project) { showMissing(); return; }

    fill("title", project.title);
    fill("year", project.year);

    renderCover();

    dropEmptyBlocks();
    renderStack();
    renderMetrics();
    renderLive();
    renderFigma();
    renderNext();
    localise();

    document.addEventListener("pf:lang", localise);

    var d = PF.i18n && PF.i18n[PF.lang];
    if (d) document.title = project.title + " — " + d["meta.title"];
  }

  PF.modules.caseStudy = { init: init };
})();
