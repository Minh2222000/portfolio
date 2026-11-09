/* ==========================================================================
   modules/marquee.js — dải chữ chạy ngang, tốc độ đọc từ vận tốc cuộn.

   Đây là chỗ trang tự chứng minh thay vì tự khen: cuộn nhanh thì dải chữ
   vọt theo, dừng tay thì nó trôi lại về nhịp nền.
   ========================================================================== */

(function () {
  "use strict";

  var PF = (window.PF = window.PF || {});
  PF.modules = PF.modules || {};

  function build(track, dir) {
    var group = track.querySelector(".marquee__group");
    if (!group) return null;

    /* Nhân bản nội dung cho đủ phủ hai lần bề rộng màn hình, để lúc nào
       cũng còn chữ ở phía sau khi dải chạy hết một vòng. */
    var needed = Math.ceil((window.innerWidth * 2) / Math.max(1, group.offsetWidth)) + 1;
    for (var i = 0; i < needed; i += 1) {
      track.appendChild(group.cloneNode(true));
    }

    return {
      track: track,
      dir: dir,
      width: group.offsetWidth,
      offset: 0
    };
  }

  function init(ctx) {
    var tracks = Array.prototype.slice.call(document.querySelectorAll(".marquee__track"));
    if (!tracks.length || !window.gsap) return;

    var gsap = window.gsap;

    /* Giảm chuyển động: để dải chữ đứng yên, vẫn đọc được đủ nội dung */
    if (ctx.reduced) return;

    var lanes = tracks.map(function (t, i) {
      return build(t, t.getAttribute("data-dir") === "left" ? -1 : 1);
    }).filter(Boolean);

    if (!lanes.length) return;

    var BASE = 0.9;            /* tốc độ nền, pixel mỗi khung hình */
    var boost = 0;             /* phần cộng thêm do cuộn, tự tiêu dần */

    /* ScrollTrigger đo vận tốc bằng pixel mỗi giây. Chia cho một số lớn để
       đưa về cùng đơn vị với tốc độ nền, rồi chặn trần cho khỏi vọt quá đà. */
    if (window.ScrollTrigger) {
      window.ScrollTrigger.create({
        trigger: document.body,
        start: "top top",
        end: "bottom bottom",
        onUpdate: function (self) {
          boost = gsap.utils.clamp(-14, 14, self.getVelocity() / 260);
        }
      });
    }

    function frame() {
      /* boost tiêu dần về 0 khi ngừng cuộn — dải chữ trôi lại nhịp nền chứ
         không phanh gấp. */
      boost *= 0.94;
      var speed = BASE + Math.abs(boost);
      /* Cuộn ngược thì dải cũng đổi chiều: chuyển động phải nói đúng sự thật
         về việc người xem đang làm gì. */
      var sign = boost < -0.4 ? -1 : 1;

      lanes.forEach(function (lane) {
        lane.offset -= speed * lane.dir * sign;
        /* Kéo về khoảng [-width, 0] để toạ độ không lớn dần vô hạn */
        if (lane.offset <= -lane.width) lane.offset += lane.width;
        if (lane.offset >= 0) lane.offset -= lane.width;
        gsap.set(lane.track, { x: lane.offset });
      });
    }

    gsap.ticker.add(frame);

    /* Đổi bề rộng cửa sổ thì bề rộng nhóm chữ cũng đổi — đo lại, nhưng chỉ
       sau khi người dùng ngừng kéo, chứ không phải mỗi khung hình. */
    var resizeTimer = null;
    window.addEventListener("resize", function () {
      window.clearTimeout(resizeTimer);
      resizeTimer = window.setTimeout(function () {
        lanes.forEach(function (lane) {
          var group = lane.track.querySelector(".marquee__group");
          if (group) lane.width = group.offsetWidth;
        });
      }, 200);
    });
  }

  PF.modules.marquee = { init: init };
})();
