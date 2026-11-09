/* ==========================================================================
   modules/hero.js — màn chào và quầng sáng bám con trỏ.

   Chờ sự kiện "pf:loaded" từ preloader rồi mới chạy, để hai màn không đè
   lên nhau. Toàn bộ nằm trong gsap.matchMedia nên máy đang giảm chuyển động
   sẽ nhận bản tĩnh, không phải bản đã chạy rồi bị tắt giữa chừng.
   ========================================================================== */

(function () {
  "use strict";

  var PF = (window.PF = window.PF || {});
  PF.modules = PF.modules || {};

  function init(ctx) {
    var hero = document.querySelector(".hero");
    if (!hero || !window.gsap) return;

    var gsap = window.gsap;
    var mm = gsap.matchMedia();

    /* ----------------------------------------------------------------------
       Bản đầy đủ — máy không yêu cầu giảm chuyển động
       ---------------------------------------------------------------------- */
    mm.add("(prefers-reduced-motion: no-preference)", function () {
      var lines = hero.querySelectorAll(".hero__line > span");
      var rest = hero.querySelectorAll("[data-hero-in]");

      gsap.set(lines, { yPercent: 108 });
      gsap.set(rest, { opacity: 0, y: 26 });

      var intro = gsap.timeline({ paused: true })
        .to(lines, {
          yPercent: 0,
          duration: 1.15,
          ease: "expo.out",
          stagger: 0.08
        })
        /* Phần chữ nhỏ vào sau tên một nhịp, để mắt đọc theo đúng thứ tự */
        .to(rest, {
          opacity: 1,
          y: 0,
          duration: 0.9,
          ease: "power3.out",
          stagger: 0.07
        }, "-=0.75");

      document.addEventListener("pf:loaded", function () { intro.play(); }, { once: true });
      /* Preloader đã xong trước khi module này chạy thì vẫn phải vào được */
      if (!document.body.classList.contains("is-loading")) intro.play();

      /* --- Chữ trôi chậm hơn nền khi cuộn xuống -------------------------- */
      gsap.to(hero.querySelector(".hero__inner"), {
        y: 90,
        opacity: 0.25,
        ease: "none",
        scrollTrigger: {
          trigger: hero,
          start: "top top",
          end: "bottom top",
          scrub: 0.6
        }
      });

      return function () {
        gsap.set([lines, rest], { clearProps: "all" });
      };
    });

    /* ----------------------------------------------------------------------
       Quầng sáng bám con trỏ — chỉ trên máy có chuột
       ---------------------------------------------------------------------- */
    mm.add("(hover: hover) and (prefers-reduced-motion: no-preference)", function () {
      var glow = hero.querySelector(".hero__glow");
      if (!glow) return;

      var toX = gsap.quickTo(glow, "x", { duration: 1.4, ease: "power3.out" });
      var toY = gsap.quickTo(glow, "y", { duration: 1.4, ease: "power3.out" });

      function move(e) {
        var r = hero.getBoundingClientRect();
        /* Quầng sáng chỉ đi được một phần ba quãng chuột đi, nên nó lơ lửng
           phía sau chứ không dính chặt vào tay. */
        toX((e.clientX - r.width / 2) * 0.34);
        toY((e.clientY - r.top - r.height / 2) * 0.34);
      }

      hero.addEventListener("mousemove", move, { passive: true });

      return function () {
        hero.removeEventListener("mousemove", move);
        gsap.set(glow, { clearProps: "all" });
      };
    });

    PF.heroMM = mm;
  }

  PF.modules.hero = { init: init };
})();
