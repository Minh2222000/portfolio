/* ==========================================================================
   modules/reveal.js — mọi chuyển động gắn với thao tác cuộn ngoài hero:

     1. hiện dần các khối có data-reveal
     2. đoạn tuyên ngôn sáng dần theo từng chữ
     3. ảnh chân dung trôi thị sai

   Tất cả nằm trong gsap.matchMedia. Máy đang giảm chuyển động thì nhận bản
   tĩnh với nội dung hiện sẵn, không phải bản chạy rồi tắt nửa chừng.
   ========================================================================== */

(function () {
  "use strict";

  var PF = (window.PF = window.PF || {});
  PF.modules = PF.modules || {};

  /* Máy giảm chuyển động: mở khoá mọi thứ đang chờ hiện, rồi dừng */
  function showEverything() {
    document.querySelectorAll("[data-reveal]").forEach(function (el) {
      el.style.opacity = "1";
      el.style.transform = "none";
    });
    var manifesto = document.querySelector(".manifesto");
    if (manifesto) manifesto.style.color = "var(--fg)";
  }

  function init(ctx) {
    if (!window.gsap || !window.ScrollTrigger) { showEverything(); return; }
    if (ctx.reduced) { showEverything(); return; }

    var gsap = window.gsap;
    var mm = gsap.matchMedia();

    mm.add("(prefers-reduced-motion: no-preference)", function () {
      /* --- 1. Hiện dần theo nhóm ---------------------------------------- */
      /* Đặt trạng thái ẩn TRƯỚC khi tạo batch. Làm ngược lại thì phần tử
         đang nằm sẵn trong khung nhìn sẽ được batch cho hiện ngay lúc tạo,
         rồi bị lệnh set ghi đè về ẩn, và không bao giờ hiện lại nữa. */
      gsap.set("[data-reveal]", { opacity: 0, y: 34 });

      /* batch gom những phần tử cùng lọt vào màn hình trong một nhịp lại,
         rồi hiện chúng so le. Rẻ hơn nhiều so với mỗi phần tử một trigger. */
      window.ScrollTrigger.batch("[data-reveal]", {
        start: "top 88%",
        once: true,
        onEnter: function (batch) {
          gsap.to(batch, {
            opacity: 1,
            y: 0,
            duration: 0.95,
            ease: "expo.out",
            stagger: 0.08,
            overwrite: true
          });
        }
      });

      /* --- 2. Tuyên ngôn sáng dần theo chữ ------------------------------- */
      var manifesto = document.querySelector(".manifesto");
      var split = null;

      /* Nội suy ĐỘ MỜ chứ không nội suy màu.

         Bản trước đọc --steel và --bone ra hex rồi tween màu giữa hai giá
         trị đó. GSAP chốt hex ngay lúc tạo tween, nên khi người dùng bấm
         đổi sang giao diện sáng thì cả đoạn tuyên ngôn kẹt lại màu chữ của
         ban đêm — trắng ngà trên nền giấy, không đọc nổi. Để CSS giữ màu
         (var(--fg)) và chỉ tween opacity thì giao diện nào cũng đúng, mà
         mắt nhìn không phân biệt được với cách cũ. */
      var DIM = 0.28;

      if (manifesto && window.SplitText) {
        /* Tách theo từ, không tách theo ký tự: đọc một câu dài mà từng chữ
           cái nhấp nháy riêng thì rất mỏi mắt. */
        split = window.SplitText.create(manifesto, {
          type: "words",
          wordsClass: "word",
          /* autoSplit tự chia lại khi font tải xong hoặc khi đổi bề rộng,
             nên chữ không bị ngắt dòng sai lúc mới vào trang. */
          autoSplit: true,
          onSplit: function (self) {
            return gsap.fromTo(
              self.words,
              { opacity: DIM },
              {
                opacity: 1,
                ease: "none",
                stagger: 1,
                scrollTrigger: {
                  trigger: manifesto,
                  start: "top 78%",
                  end: "bottom 58%",
                  scrub: 0.4
                }
              }
            );
          }
        });
        /* Từng chữ tự lo độ mờ, thẻ cha chỉ cần cấp màu chữ đầy đủ */
        manifesto.style.color = "var(--fg)";
      }

      /* --- 3. Ảnh chân dung trôi thị sai --------------------------------- */
      var portraitImg = document.querySelector(".portrait img");
      if (portraitImg) {
        gsap.fromTo(
          portraitImg,
          { yPercent: -6 },
          {
            yPercent: 6,
            ease: "none",
            scrollTrigger: {
              trigger: ".portrait",
              start: "top bottom",
              end: "bottom top",
              scrub: true
            }
          }
        );
      }

      return function () {
        if (split) split.revert();
        gsap.set("[data-reveal]", { clearProps: "all" });
      };
    });

    PF.revealMM = mm;
  }

  PF.modules.reveal = { init: init };
})();
