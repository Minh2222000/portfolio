/* ==========================================================================
   modules/preloader.js — màn mở đầu: đếm phần trăm rồi kéo màn lên.

   Con số bám theo tiến độ tải thật (ảnh + font), không phải đếm giả.
   Xong thì phát sự kiện "pf:loaded" để hero bắt đầu màn chào.
   ========================================================================== */

(function () {
  "use strict";

  var PF = (window.PF = window.PF || {});
  PF.modules = PF.modules || {};

  function done() {
    document.body.classList.remove("is-loading");
    document.dispatchEvent(new CustomEvent("pf:loaded"));
    if (window.ScrollTrigger) window.ScrollTrigger.refresh();
  }

  /* Đếm số ảnh đã tải xong trên tổng số ảnh của trang. Font tính thêm một
     phần nữa, vì chữ nhảy font giữa chừng trông rất xấu.

     Bỏ qua ảnh loading="lazy": trình duyệt có quyền hoãn chúng cho tới khi
     người xem cuộn tới, nên chờ chúng là chờ một sự kiện có thể không bao
     giờ đến, và màn mở đầu treo lại vài giây vô cớ. */
  function trackProgress(onProgress) {
    var imgs = Array.prototype.slice.call(document.images).filter(function (img) {
      return img.getAttribute("loading") !== "lazy" && img.getAttribute("src");
    });
    var total = imgs.length + 1;
    var loaded = 0;

    function tick() {
      loaded += 1;
      onProgress(Math.min(1, loaded / total));
    }

    imgs.forEach(function (img) {
      if (img.complete) {
        tick();
      } else {
        img.addEventListener("load", tick, { once: true });
        img.addEventListener("error", tick, { once: true });  /* ảnh lỗi vẫn phải tính */
      }
    });

    if (document.fonts && document.fonts.ready) {
      document.fonts.ready.then(tick).catch(tick);
    } else {
      tick();
    }

    /* Chốt chặn: mạng treo cũng không được để khách nhìn màn đen mãi */
    setTimeout(function () { onProgress(1); }, 2200);
  }

  function init(ctx) {
    var el = document.querySelector(".preloader");
    if (!el) { done(); return; }

    /* Giảm chuyển động, hoặc không có GSAP: bỏ hẳn màn mở đầu */
    if (ctx.reduced || !window.gsap) {
      el.remove();
      done();
      return;
    }

    var gsap = window.gsap;
    var countEl = el.querySelector(".preloader__count");
    var barEl = el.querySelector(".preloader__bar i");
    var nameEls = el.querySelectorAll(".preloader__name span");

    var target = 0;      /* tiến độ thật, nhảy từng nấc */
    var shown = 0;       /* tiến độ hiển thị, bò dần tới target */
    var finished = false;
    /* Sàn thời gian: chữ HOÀNG MINH mất 1 giây để trượt lên hết. Đóng màn
       sớm hơn thì người xem thấy một cái chớp chứ không thấy màn mở đầu. */
    var MIN_MS = 1100;
    var startedAt = performance.now();

    /* clip-path phải có giá trị khởi điểm thì mới tween được sang giá trị khác */
    gsap.set(el, { clipPath: "inset(0% 0% 0% 0%)" });
    gsap.set(nameEls, { yPercent: 110 });
    gsap.to(nameEls, { yPercent: 0, duration: 0.9, ease: "expo.out", stagger: 0.06, delay: 0.1 });

    /* Con số không giật theo từng sự kiện tải mà bò dần tới đích,
       nên nhìn như một thanh tiến độ thật chứ không như một cái đèn nháy. */
    function frame(time, delta) {
      /* Hệ số nội suy tính theo thời gian thật chứ không theo số khung hình.
         Máy 144Hz và máy 60Hz phải mất đúng bằng nhau để đếm hết; và khi
         trình duyệt hạ nhịp vẽ xuống một lần mỗi giây — chuyện luôn xảy ra
         với tab đang nằm ở nền — con số vẫn tiến chứ không bò tại chỗ. */
      var dt = Math.min(delta, 1000) / 1000;
      shown += (target - shown) * (1 - Math.pow(0.0001, dt));

      if (countEl) countEl.textContent = String(Math.round(shown * 100)).padStart(3, "0");
      if (barEl) gsap.set(barEl, { scaleX: shown });

      var longEnough = performance.now() - startedAt >= MIN_MS;
      if (!finished && longEnough && target >= 1 && shown > 0.99) {
        finished = true;
        gsap.ticker.remove(frame);
        if (countEl) countEl.textContent = "100";
        if (barEl) gsap.set(barEl, { scaleX: 1 });
        exit();
      }
    }

    function exit() {
      gsap.timeline({ onComplete: function () { el.remove(); } })
        .to(el.querySelectorAll(".preloader__count, .preloader__name, .preloader__bar"), {
          opacity: 0, duration: 0.35, ease: "power2.in"
        })
        .to(el, {
          clipPath: "inset(0% 0% 100% 0%)",   /* màn đen thu lên trên, để lộ trang */
          duration: 1,
          ease: "expo.inOut",
          /* Báo xong ngay khi màn bắt đầu kéo lên, không đợi kéo hết: hero
             chạy màn chào ngay bên dưới tấm màn đang mở, hai lớp chuyển động
             chồng lên nhau. Đợi hết thì trang đứng im mất thêm một giây. */
          onStart: done
        }, "-=0.1");
    }

    gsap.ticker.add(frame);
    trackProgress(function (p) { target = Math.max(target, p); });
  }

  PF.modules.preloader = { init: init };
})();
