# Portfolio — Hoàng Minh

Website portfolio tĩnh, viết tay bằng HTML + CSS + JavaScript. Không dùng
framework, không cần bước build, không cần cài gì.

## Chạy thử

Hai cách, cách nào cũng được:

```
# 1. Bấm đúp vào index.html — chạy thẳng từ ổ đĩa, không cần mạng
# 2. Qua máy chủ tĩnh (giống môi trường thật hơn)
python serve.py            # http://127.0.0.1:8090
python serve.py 9000       # đổi cổng
```

Trang được thiết kế để chạy giống hệt nhau ở cả hai chế độ. Thư viện GSAP và
Lenis đã tải sẵn vào `vendor/`, font đã tải sẵn vào `assets/fonts/`, nên mang
cả thư mục vào USB đem đi phỏng vấn vẫn mở được khi phòng họp không có wifi.

## Sửa nội dung — chỉ cần đụng hai file

| Muốn đổi gì | Sửa file nào |
|---|---|
| Mọi câu chữ trên trang, cả tiếng Việt lẫn tiếng Anh | `js/data/i18n.js` |
| Danh sách dự án và nội dung từng case study | `js/data/projects.js` |
| Màu, cỡ chữ, khoảng cách, tốc độ chuyển động | `css/tokens.css` |
| Bảng màu của giao diện sáng | `css/tokens.css`, khối `[data-theme="light"]` |

Không phải sửa HTML để đổi chữ. Mỗi phần tử trên trang mang một thuộc tính
`data-i18n="khoá"`, và JavaScript đổ chuỗi tương ứng vào lúc chạy.

### Những chỗ cần thay trước khi gửi cho nhà tuyển dụng

1. **Tên và giới thiệu** — `js/data/i18n.js`, các khoá `hero.*` và `about.*`
2. **Địa chỉ thư** — xuất hiện ở hai chỗ trong `index.html`: liên kết `mailto:`
   và khối JSON-LD trong `<head>`
3. **Liên kết mạng xã hội** — đã bỏ khỏi mục Liên hệ (chỉ còn email). Muốn thêm
   lại thì dựng khối `.contact__socials` (CSS còn trong `css/sections.css`)
4. **Ảnh** — ảnh chân dung đã là ảnh thật (`assets/img/portrait.webp`, tỉ lệ 4:5,
   800×1000). Các ảnh `assets/img/*.svg` còn lại là ảnh tạm tự sinh: thay bằng ảnh
   chụp thật (`.jpg` hoặc `.webp`), rồi sửa đường dẫn `poster` trong
   `js/data/projects.js`
5. **Năm ở chân trang** — `index.html` và `project.html`, dòng `© 2026`

### Thêm một dự án mới

Thêm một phần tử vào mảng trong `js/data/projects.js`. Danh sách ngoài trang chủ
và trang case study đều tự cập nhật theo. Không phải tạo file HTML mới —
`project.html` đọc `?id=` trên thanh địa chỉ và tự dựng nội dung.

### Nhiều ảnh cho một dự án

Mặc định trang case study hiện đúng một ảnh `poster`. Muốn nhiều ảnh thì thêm
trường `gallery` vào dự án đó:

```js
gallery: [
  "assets/img/work-h04-tablet.jpg",
  "assets/img/work-h04-laptop.jpg",
  "assets/img/work-h04-laptop-day.jpg"
],
```

Ảnh đầu chiếm trọn chiều ngang, các ảnh sau chia đôi hàng bên dưới; màn hẹp thì
xếp dọc hết. Ảnh giữ đúng tỉ lệ gốc, không bị cắt — nên **ảnh trong cùng một bộ
phải cùng tỉ lệ**, nếu không hàng dưới sẽ so le. Trường `poster` vẫn phải giữ vì
danh sách ngoài trang chủ dùng nó.

Ảnh **đã tách nền** thì xuất `.webp` (giữ kênh alpha, `.jpg` không có alpha nên
nền sẽ thành đen) rồi bật thêm cờ:

```js
galleryCutout: true,
```

Cờ này gỡ khung viền quanh ảnh để thiết bị nổi thẳng trên nền trang — còn giữ
viền thì cái máy vừa được tách nền lại nằm trong một cái hộp khác.

Ảnh **dọc** (chụp màn hình điện thoại) thêm cờ `tall`: nó chiếm ô hẹp hơn — ba
cái một hàng trên máy tính, hai cái một hàng trên điện thoại — và không bao giờ
được chọn làm ảnh dẫn đầu. Ảnh dẫn đầu luôn là ảnh **ngang** đầu tiên trong bộ,
vì một ảnh 9:16 kéo hết chiều ngang thì cao gần bằng ba màn hình.

Bộ ảnh trộn lẫn (ảnh đã tách nền / ảnh còn nguyên phông, ảnh ngang / ảnh dọc)
thì viết riêng phần tử cần khác thành object:

```js
gallery: [
  { src: "assets/img/app-1.webp", tall: true },     // ảnh dọc, có khung viền
  { src: "assets/img/imac.webp", cutout: true }     // ảnh ngang, đã tách nền
],
```

### Thêm mục "Công việc"

Khối "Công việc" nằm ngay dưới "Yêu cầu", hiện khi dự án khai `tasks`. Khác ba
đoạn kia ở chỗ nội dung là **mảng câu**, không phải một đoạn văn:

```js
tasks: {
  vi: ["Gặp gỡ, giao tiếp với khách hàng", "..."],
  en: ["Meeting and communicating with clients", "..."]
},
```

Không khai thì khối đó tự biến mất khỏi trang.

Trường `criteria` cùng khuôn nhưng KHÔNG phải một khối riêng — nó chèn ngay
dưới đoạn văn `challenge`, dùng khi "Yêu cầu" là một câu dẫn kèm vài tiêu chí
rời rạc thay vì một đoạn văn liền mạch:

```js
challenge: {
  vi: "...đáp ứng các tiêu chí sau:",
  en: "...meeting these criteria:"
},
criteria: {
  vi: ["Giao diện thân thiện", "..."],
  en: ["A friendly interface", "..."]
},
```

## Ngôn ngữ và giao diện

**Tiếng Việt là mặc định, không bàn.** Ai mở trang lần đầu cũng thấy bản tiếng
Việt, kể cả khi máy họ đang để tiếng Anh — `js/modules/i18n.js` cố tình không
đọc `navigator.language`. Bấm `EN` thì đổi sang tiếng Anh và trình duyệt nhớ
lựa chọn đó (khoá `pf-lang` trong localStorage) cho những lần sau.

**Sáng/tối theo thứ tự: đã chọn > cài đặt máy > tối.** Nút hình mặt trời/mặt
trăng cạnh `VI EN` đổi giao diện ngay, không tải lại trang. Chưa bấm bao giờ
thì trang đi theo `prefers-color-scheme` của hệ điều hành và vẫn tiếp tục đi
theo mỗi khi máy đổi; bấm một lần là lựa chọn đó thắng vĩnh viễn (khoá
`pf-theme`). Máy không nói gì thì mặc định là tối — đó mới là tông gốc.

Giao diện nằm ở thuộc tính `data-theme` của thẻ `<html>`. Có một đoạn script
inline trong `<head>` của cả hai trang đặt sẵn thuộc tính này trước khi trình
duyệt vẽ khung hình đầu tiên; thiếu nó thì trang loé nền đen rồi mới nhảy sang
nền sáng. Đừng dời đoạn đó xuống cuối `<body>`.

Khi thêm màu mới vào `css/tokens.css`, dùng lớp ngữ nghĩa chứ đừng dùng bảng
màu thô (`--ink`, `--bone`, `--sodium`…) — chúng chỉ đúng cho giao diện tối:

| Cần gì | Dùng biến |
|---|---|
| Nền trang, nền khối nổi | `--bg`, `--surface` |
| Ba bậc chữ | `--fg`, `--fg-muted`, `--fg-faint` |
| Vàng làm **chữ** hoặc viền mảnh | `--accent` (sáng thì nó tối lại cho đọc được) |
| Vàng làm **nền** một mảng | `--accent-solid` |
| Chữ nằm trên nền `--accent-solid` | `--on-accent` |
| Lớp phủ và chữ đè lên **ảnh** | `--photo-scrim`, `--photo-fg` (không đổi theo giao diện) |

## Cấu trúc

```
index.html         trang chính, 6 section
project.html       trang case study dùng chung cho mọi dự án
serve.py           máy chủ tĩnh để xem thử

css/
  tokens.css       biến thiết kế: màu (cả hai giao diện), cỡ chữ, khoảng cách, tốc độ
  base.css         reset, kiểu chữ nền tảng, lớp hạt phim
  layout.css       container, lưới, nhịp giữa các section
  components.css   nav, con trỏ, nút, thẻ, marquee
  sections.css     kiểu dáng riêng của từng section
  responsive.css   màn nhỏ, cảm ứng, giảm chuyển động, in giấy, không có JS

js/
  main.js          điểm khởi động, gọi các module theo đúng thứ tự
  data/            i18n.js và projects.js — nơi duy nhất chứa nội dung
  modules/         mỗi file một việc, tự gắn vào window.PF.modules

vendor/            GSAP 3.13, ScrollTrigger, SplitText, ScrollToPlugin, Lenis
assets/fonts/      Archivo, Roboto, JetBrains Mono (đều có dấu tiếng Việt)
assets/img/        ảnh tạm dạng SVG
```

## Vài quyết định kỹ thuật, và lý do

**Không dùng ES module.** Mỗi file JS nạp bằng thẻ `<script>` thường và tự đăng
ký vào `window.PF.modules`. Dùng `type="module"` thì trình duyệt áp chính sách
CORS, và trang mở bằng `file://` sẽ không chạy được dòng JavaScript nào.

**Không dùng `fetch` để lấy nội dung.** Chuỗi dịch và danh sách dự án nằm thẳng
trong file `.js` chứ không phải `.json`, cũng vì lý do trên.

**Một timeline điều khiển tất cả.** Mọi chuyển động theo cuộn đều đi qua GSAP
ScrollTrigger, không có chỗ nào tự nghe sự kiện `scroll` riêng. Nhờ vậy các lớp
không bao giờ lệch pha nhau.

**Bọc trong `gsap.matchMedia()`.** Máy bật chế độ giảm chuyển động nhận bản tĩnh
với đầy đủ nội dung, không phải bản chạy rồi tắt nửa chừng. Điện thoại không
nạp con trỏ tuỳ biến và ảnh xem trước.

**Cờ `no-js`.** Thẻ `<html>` mang sẵn class `no-js`; `main.js` gỡ nó ra ngay khi
chạy được. JavaScript hỏng thì `responsive.css` hiện lại toàn bộ nội dung đang
chờ. Trang mất chuyển động nhưng vẫn đọc được đủ.

**Đo bằng `127.0.0.1`, không dùng `localhost`.** Trên máy này `localhost` phải
đợi phân giải IPv6 hỏng rồi mới quay về IPv4, cộng thêm khoảng hai giây mỗi
request và làm mọi phép đo hiệu năng thành vô nghĩa.

## Trình duyệt hỗ trợ

Chrome, Edge, Firefox, Safari bản hiện hành. Cần `clip-path` (màn mở đầu),
`100svh` (chiều cao hero) và font biến thiên
(trục `wdth` của Archivo). Trình duyệt cũ hơn vẫn đọc được nội dung, chỉ mất
phần trang trí.

## Nếu muốn tối ưu thêm

Trang đang nạp 20 file JavaScript riêng lẻ, cố ý để dễ đọc và dễ sửa. Khi đem
lên máy chủ thật, nối chúng lại thành một file theo đúng thứ tự trong
`index.html` là bớt được 19 lượt request:

```
cat vendor/gsap.min.js vendor/ScrollTrigger.min.js vendor/SplitText.min.js vendor/ScrollToPlugin.min.js vendor/lenis.min.js js/data/*.js js/modules/*.js js/main.js > bundle.js
```

Phải liệt kê tên từng file thư viện chứ không dùng `vendor/*.js`: dấu sao xếp
theo thứ tự chữ cái, và `gsap.min.js` sẽ rơi xuống sau các plugin của chính nó.
Các file trong `modules/` thì thứ tự nào cũng được — mỗi file chỉ tự đăng ký vào
`window.PF.modules`, còn `main.js` mới là nơi quyết định gọi chúng theo thứ tự
nào. `main.js` luôn đứng cuối.
