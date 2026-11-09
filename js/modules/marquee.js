/* ==========================================================================
   modules/marquee.js — dải chữ chạy ngang, tự trôi đều với tốc độ cố định.

   Cuộn trang không ảnh hưởng gì đến dải chữ: nó luôn tự di chuyển, hai hàng
   chạy ngược chiều nhau.
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

    /* Tốc độ cố định tính theo giây chứ không theo khung hình, để màn 60Hz và
       144Hz chạy cùng một nhịp. Không đọc vận tốc cuộn. */
    var SPEED = 54;            /* pixel mỗi giây */

    function frame(time, deltaTime) {
      /* deltaTime tính bằng mili giây. Chặn trần để lúc tab bị treo rồi quay
         lại, dải chữ không nhảy một đoạn dài. */
      var step = SPEED * Math.min(deltaTime, 100) / 1000;

      lanes.forEach(function (lane) {
        lane.offset -= step * lane.dir;
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
