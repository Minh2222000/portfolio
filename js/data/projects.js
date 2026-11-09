/* ==========================================================================
   projects.js — NGUỒN DUY NHẤT cho danh sách dự án.
   Sửa nội dung ở đây, index.html và project.html tự dựng lại theo.
   Không dùng JSON + fetch để trang mở thẳng bằng file:// vẫn chạy.

   Số liệu trong phần metrics lấy trực tiếp từ file Figma qua REST API
   (số trang, số khung, số module) — đều là con số đếm được, không ước lượng.

   Mỗi dự án:
     id        chuỗi không dấu, dùng làm ?id= trên project.html
     year      thời gian làm dự án: một năm ("2025") hoặc một khoảng ("2022-2023").
               "2025+" nghĩa là chỉ biết dự án nằm trong giai đoạn từ năm đó
               trở đi (CV chỉ ghi mốc bắt đầu công việc, không ghi năm từng dự
               án); thứ tự sắp xếp vẫn lấy năm 2025 làm mốc.
     title     tên hiển thị
     role      vai trò trong dự án            { vi, en }
     stack     mảng công cụ và nền tảng (hoặc lĩnh vực), hiện thành thẻ nhãn
     poster    ảnh xuất từ chính khung Figma của dự án. BỎ TRỐNG (không khai)
               khi dự án chưa có ảnh: trang case study tự gỡ khung ảnh và ảnh
               xem trước bám con trỏ tự không hiện, không có ảnh vỡ.
     gallery   TUỲ CHỌN. Bộ ảnh cho trang case study, thay cho một ảnh poster.
               Ảnh đầu chiếm trọn chiều ngang, các ảnh sau chia đôi hàng dưới.
               Ảnh trong cùng bộ nên cùng tỉ lệ. Không khai thì dùng poster.
               Ảnh dọc (chụp màn hình điện thoại) thì thêm cờ `tall`:
                 { src: "...", tall: true }
               Ảnh dọc chiếm ô hẹp hơn (ba cái một hàng) và không bao giờ được
               chọn làm ảnh dẫn đầu.
     galleryCutout  TUỲ CHỌN. Mặc định cho CẢ BỘ: bật khi ảnh đã tách nền
               (.webp có kênh alpha). Trang bỏ khung viền để thiết bị nổi thẳng
               trên nền, thay vì nằm trong một cái hộp — đúng thứ vừa gỡ đi.
               Riêng một ảnh cần khác thì viết phần tử đó thành object:
                 { src: "...", cutout: false }
     live      link bản chạy thật, để trống nếu hệ thống không công khai
     figma     link file Figma, để trống thì nút "Xem file Figma" tự biến mất
     summary   một câu tóm tắt                { vi, en }
     challenge / approach / result   ba đoạn của case study   { vi, en }
     tasks     TUỲ CHỌN. Danh sách đầu việc, hiện thành khối "Công việc" ngay
               dưới "Yêu cầu". Là MẢNG câu chứ không phải một đoạn văn:
               { vi: [...], en: [...] }. Không khai thì khối đó tự biến mất.
     criteria  TUỲ CHỌN. Gạch đầu dòng các tiêu chí, hiện ngay DƯỚI đoạn văn
               challenge — không phải một khối riêng. Cùng dạng { vi: [...],
               en: [...] } như tasks. Đoạn challenge khi đó nên kết bằng dấu
               hai chấm để dẫn vào danh sách, ví dụ "...đáp ứng các tiêu chí
               sau:". Không khai thì không có gạch đầu dòng nào.
     metrics   tối đa 4 số liệu   [{ value, label: { vi, en } }]
     cinematic TUỲ CHỌN. true = trang chi tiết dùng bố cục điện ảnh (chương, bảng
               thông tin dính, lightbox...). Hiện mới bật cho "dcim" làm mẫu.
   ========================================================================== */

window.PF = window.PF || {};

window.PF.projects = [
  {
    id: "getfly",
    year: "2022-2023",
    title: "Getfly-G Version — Mobile App CRM",
    role: { vi: "Product Designer", en: "Product Designer" },
    stack: ["Figma", "Visual Code", "Word", "Excel"],
    poster: "assets/img/work-getfly.jpg",
    /* Mỗi ảnh là NGUYÊN MỘT FRAME màn hình app di động xuất từ file Figma Getfly
       (375px, xuất ở 3x; không cắt widget, không mockup). Ba mockup iPhone cũ
       vẫn nằm trong assets/img. poster ở trên vẫn giữ vì danh sách ngoài trang
       chủ dùng nó. */
    gallery: [
      { src: "assets/img/work-getfly-fig-customers.webp",     w: 1125, h: 2436 },
      { src: "assets/img/work-getfly-fig-inbox.webp",         w: 1125, h: 2064 },
      { src: "assets/img/work-getfly-fig-login.webp",         w: 1125, h: 2436 },
      { src: "assets/img/work-getfly-fig-conversion.webp",    w: 1125, h: 2436 },
      { src: "assets/img/work-getfly-fig-kpi-list.webp",      w: 1125, h: 2412 },
      { src: "assets/img/work-getfly-fig-projects.webp",      w: 1125, h: 2436 },
      { src: "assets/img/work-getfly-fig-orders.webp",        w: 1125, h: 2229 },
      { src: "assets/img/work-getfly-fig-display-filter.webp", w: 1125, h: 2331 },
      { src: "assets/img/work-getfly-fig-relationships.webp", w: 1125, h: 2436 },
      { src: "assets/img/work-getfly-fig-task-edit.webp",     w: 1125, h: 2706 },
      { src: "assets/img/work-getfly-fig-kpi-add.webp",       w: 1125, h: 2412 },
      { src: "assets/img/work-getfly-fig-order-create.webp",  w: 1125, h: 2322 }
    ],
    live: "",
    summary: {
      vi: "Ứng dụng CRM trên Mobile để quản lý thông tin khách hàng, thiết kế trên nền một Design System dùng chung.",
      en: "A mobile CRM app for managing customer information, designed on top of a shared Design System."
    },
    challenge: {
      vi: "Thiết kế ứng dụng CRM trên nền tảng Mobile cho Getfly (phiên bản G), bao gồm các tiêu chí:",
      en: "Design a CRM app on the Mobile platform for Getfly (G Version), meeting these criteria:"
    },
    criteria: {
      vi: [
        "Giao diện nhận diện thương hiệu",
        "Làm rõ các module liên quan đến khách hàng",
        "Hệ thống component dùng chung, nhất quán và dễ tái sử dụng"
      ],
      en: [
        "A brand-recognizable interface",
        "Clarity in the customer-related modules",
        "A shared component system that is consistent and easy to reuse"
      ]
    },
    tasks: {
      vi: [
        "Tiếp nhận yêu cầu từ khách hàng, đọc và đối chiếu với các use case (UC) để xác định đúng phạm vi, dữ liệu hiển thị và hành vi của từng màn hình trước khi thiết kế.",
        "Phân tích luồng làm việc của người dùng CRM trên điện thoại và dựng sơ đồ luồng thao tác cho các phân hệ Khách hàng, Công việc, KPI và Đơn hàng.",
        "Thiết kế UI/UX cho ứng dụng Getfly-G Version trên nền tảng Mobile: từ đăng nhập bằng tên miền, trang chủ và thư nội bộ, đến các màn hình danh sách, chi tiết, thêm mới và chỉnh sửa.",
        "Thiết kế phân hệ Khách hàng (danh sách tất cả khách hàng, tỉ lệ chuyển đổi, quản lý mối quan hệ) và phân hệ Công việc, Dự án (danh sách, thêm và chỉnh sửa công việc).",
        "Thiết kế phân hệ KPI (đang áp dụng, thêm mới KPI) và phân hệ Đơn hàng (danh sách, tạo đơn hàng mua), cùng bộ lọc hiển thị trên trang chủ.",
        "Xây dựng và chuẩn hóa Design System dùng chung: bộ component, màu sắc, kiểu chữ, khoảng cách và các trạng thái, để mọi màn hình được dựng từ cùng một bộ thành phần.",
        "Tối ưu tính nhất quán và khả năng tái sử dụng: gom các thành phần lặp lại như thẻ danh sách, thanh tìm kiếm, bộ lọc, biểu mẫu, hộp thoại và nút thành component dùng chung, có đủ trạng thái.",
        "Dựng prototype để kiểm tra luồng thao tác trên di động và thống nhất với khách hàng trước khi bàn giao cho đội phát triển ứng dụng.",
        "Chuẩn bị file thiết kế gồm component, style và các trạng thái để đội phát triển triển khai đúng thiết kế.",
        "Chịu trách nhiệm với kết quả đầu ra của sản phẩm thiết kế."
      ],
      en: [
        "Received requirements from the client and checked them against the use cases (UC) to set the right scope, displayed data and behaviour of every screen before designing.",
        "Analysed the CRM user's workflow on a phone and drew the flow diagrams for the Customers, Tasks, KPI and Orders modules.",
        "Designed the UI/UX of the Getfly-G Version app on Mobile: from sign-in by domain name, the home screen and internal mail, to list, detail, add and edit screens.",
        "Designed the Customers module (all-customer list, conversion rate, relationship management) and the Tasks and Projects module (list, adding and editing tasks).",
        "Designed the KPI module (active KPIs, adding a KPI) and the Orders module (list, creating a purchase order), plus the display filter on the home screen.",
        "Built and standardised a shared Design System: components, colours, type, spacing and states, so every screen is assembled from the same set of parts.",
        "Improved consistency and reusability by turning repeated pieces such as list cards, search bars, filters, forms, dialogs and buttons into shared components with all their states.",
        "Built a prototype to check the mobile flows and align with the client before handing over to the app development team.",
        "Prepared the design files with components, styles and states so the developers could implement the design faithfully.",
        "Took responsibility for the output of the design work."
      ]
    },
    approach: {
      vi: "Xây dựng và chuẩn hóa Design System cùng bộ component dùng chung, để màn hình mới được dựng từ các thành phần có sẵn thay vì thiết kế lại từ đầu. Cách làm này giữ giao diện nhất quán giữa các phân hệ và tăng khả năng tái sử dụng.",
      en: "Built and standardised a Design System with a shared component set, so new screens are assembled from existing parts instead of designed from scratch. This keeps the interface consistent across modules and raises reusability."
    },
    result: {
      vi: "Giảm 40% thời gian thiết kế giao diện mới nhờ triển khai Design System.",
      en: "Cut the time to design new interfaces by 40% by rolling out the Design System."
    },
    metrics: [
      { value: "40%", label: { vi: "giảm thời gian thiết kế giao diện mới", en: "less time to design new screens" } },
      { value: "712", label: { vi: "khung thiết kế", en: "design frames" } },
      { value: "29", label: { vi: "phân hệ", en: "modules" } },
      { value: "107", label: { vi: "khung riêng phần khách hàng", en: "frames on customers alone" } }
    ]
  },
  {
    id: "h04",
    year: "2026",
    title: "H04 — Cổng thông tin và hệ thống quản lý chứng thư số quốc gia",
    role: { vi: "Team Lead Design / Business Analyst", en: "Team Lead Design / Business Analyst" },
    stack: ["Figma", "Visual Code", "Word", "Excel"],
    poster: "assets/img/work-h04.jpg",
    /* Mỗi ảnh là NGUYÊN MỘT FRAME màn hình xuất từ file Figma H04 (không cắt
       widget, không mockup). Ba mockup cũ (tablet, laptop, laptop-day) vẫn nằm
       trong assets/img. poster ở trên vẫn giữ vì danh sách ngoài trang chủ dùng. */
    gallery: [
      { src: "assets/img/work-h04-fig-dashboard.webp",        w: 2880, h: 1920 },
      { src: "assets/img/work-h04-fig-login.webp",            w: 2880, h: 1920 },
      { src: "assets/img/work-h04-fig-grid-view.webp",        w: 2880, h: 1920 },
      { src: "assets/img/work-h04-fig-page-list.webp",        w: 2880, h: 2600 },
      { src: "assets/img/work-h04-fig-content-tree.webp",     w: 2880, h: 1920 },
      { src: "assets/img/work-h04-fig-create-menu.webp",      w: 2880, h: 1920 },
      { src: "assets/img/work-h04-fig-info-history.webp",     w: 2880, h: 1920 },
      { src: "assets/img/work-h04-fig-structure-config.webp", w: 2880, h: 2256 },
      { src: "assets/img/work-h04-fig-layout-editor.webp",    w: 2880, h: 2082 },
      { src: "assets/img/work-h04-fig-article-form.webp",     w: 2880, h: 2560 },
      { src: "assets/img/work-h04-fig-menu-config.webp",      w: 2880, h: 1920 },
      { src: "assets/img/work-h04-fig-tree-expanded.webp",    w: 2880, h: 1920 }
    ],
    live: "",
    /* Link Figma tạm ẩn — bỏ dấu chú thích dòng dưới là nút "Xem file Figma"
       hiện lại, không phải đi tìm lại link. */
    // figma: "https://www.figma.com/design/jezKPJUJabFLo9AnPzUYXv/H04?node-id=0-1&t=nANlHF7101zqYzMu-1",
    summary: {
      vi: "Hệ thống quản lý chứng thư số quốc gia của Bộ Công An, kèm cổng thông tin dành cho nhân dân.",
      en: "The national digital certificate management system of the Ministry of Public Security, with an information portal for the people."
    },
    challenge: {
      vi: "Thiết kế giao diện cho hệ thống quản lý chứng thư số quốc gia và cổng thông tin, bao gồm các tiêu chí:",
      en: "Design the interface for the national digital certificate management system and its information portal, meeting these criteria:"
    },
    criteria: {
      vi: [
        "Giao diện phù hợp với nghiệp vụ quản lý chứng thư số",
        "Giao diện nhận diện thương hiệu Bộ Công An",
        "Đủ các mục thông tin"
      ],
      en: [
        "An interface that fits the digital certificate management workflow",
        "A Ministry of Public Security brand-recognizable interface",
        "Complete information sections"
      ]
    },
    tasks: {
      vi: [
        "Gặp mặt, trao đổi với khách hàng; tiếp nhận yêu cầu, làm rõ từng nhu cầu của đơn vị quản lý chứng thư số và ghi lại thành danh sách yêu cầu.",
        "Phân tích nghiệp vụ quản lý chứng thư số quốc gia và đối chiếu với bảng use case (UC) của dự án để xác định phạm vi từng màn hình.",
        "Xây dựng giải pháp UI/UX phù hợp với nghiệp vụ: cấu trúc thông tin, sơ đồ luồng thao tác và wireframe trước khi thiết kế chi tiết.",
        "Thiết kế hệ thống quản trị nội dung (CMS) của cổng: đăng nhập, bảng thống kê nội dung, hiển thị nội dung dạng lưới và danh sách, cây nội dung kèm danh sách tin bài, menu Tạo, thông tin và lịch sử thay đổi.",
        "Thiết kế phần cấu hình của CMS: cấu trúc và loại tài liệu, bố cục trang theo chuyên mục phân cấp, cấu hình menu và biểu mẫu soạn bài viết.",
        "Thiết kế phần cổng thông tin dành cho nhân dân đi kèm hệ thống quản lý.",
        "Dẫn dắt đội Design: phân công công việc theo từng nhóm màn hình, thống nhất quy chuẩn giao diện, review thiết kế và kiểm soát chất lượng đầu ra.",
        "Điều phối, quản lý team Design, team Dev; phối hợp với các bộ phận phát triển và giải đáp thắc mắc về thiết kế để sản phẩm được triển khai đúng.",
        "Chịu trách nhiệm với kết quả đầu ra của sản phẩm."
      ],
      en: [
        "Met and talked with the client; took in requirements, clarified each need of the digital-certificate management unit and recorded them as a requirements list.",
        "Analysed the national digital-certificate management business and checked it against the project's use-case (UC) table to set the scope of each screen.",
        "Built a UI/UX solution that fits the business: information structure, task flow diagrams and wireframes before detailed design.",
        "Designed the portal's content management system (CMS): sign-in, content statistics board, grid and list views of content, the content tree with article lists, the Create menu, information and change history.",
        "Designed the CMS configuration: structure and document types, page layout by hierarchical section, menu configuration and the article editing form.",
        "Designed the public information portal that goes with the management system.",
        "Led the Design team: assigned work by screen group, agreed the interface conventions, reviewed designs and controlled output quality.",
        "Coordinated and managed the Design and Dev teams; worked with the development units and answered design questions so the product was implemented faithfully.",
        "Took responsibility for the product's output."
      ]
    },
    approach: {
      vi: "Bắt đầu từ việc làm rõ nghiệp vụ quản lý chứng thư số cùng khách hàng, rồi chuyển thành giải pháp UI/UX bám sát nghiệp vụ đó. Đội Design được phân công theo từng phần và được rà soát chất lượng trước khi bàn giao cho các bộ phận phát triển.",
      en: "Started by clarifying the digital certificate management workflow with the client, then turned it into a UI/UX solution that follows that workflow closely. The Design team worked by assigned parts and was quality-checked before handover to the development departments."
    },
    metrics: [
      { value: "995", label: { vi: "khung thiết kế", en: "design frames" } },
      { value: "4", label: { vi: "nhóm người dùng", en: "user groups" } }
    ]
  },
  {
    id: "vinatex",
    year: "2025",
    title: "Vinatex — hệ thống quản lý nội bộ doanh nghiệp dệt may",
    role: {
      vi: "Team Lead Design / Business Analyst / FE & Mobile Team Manager",
      en: "Team Lead Design / Business Analyst / FE & Mobile Team Manager"
    },
    stack: ["Figma", "Visual Code", "Word", "Excel"],
    poster: "assets/img/work-vinatex.jpg",
    /* Mười frame desktop NGUYÊN BẢN xuất từ file Figma Vinatex (không cắt widget,
       không mockup), rồi sáu ảnh màn hình app di động 9:16. Ba mockup máy tính
       cũ (imac, hp, macbook) vẫn nằm trong assets/img. */
    gallery: [
      { src: "assets/img/work-vinatex-fig-dashboard.webp",     w: 2880, h: 3048 },
      { src: "assets/img/work-vinatex-fig-users.webp",         w: 2880, h: 2572 },
      { src: "assets/img/work-vinatex-fig-user-groups.webp",   w: 2880, h: 2572 },
      { src: "assets/img/work-vinatex-fig-roles.webp",         w: 2880, h: 2572 },
      { src: "assets/img/work-vinatex-fig-role-edit.webp",     w: 2880, h: 3204 },
      { src: "assets/img/work-vinatex-fig-categories.webp",    w: 2880, h: 2572 },
      { src: "assets/img/work-vinatex-fig-org-list.webp",      w: 2880, h: 2572 },
      { src: "assets/img/work-vinatex-fig-login-log.webp",     w: 2880, h: 2572 },
      { src: "assets/img/work-vinatex-fig-report-form.webp",   w: 2880, h: 4258 },
      { src: "assets/img/work-vinatex-fig-column-settings.webp", w: 2880, h: 2572 },
      { src: "assets/img/work-vinatex-app-1.webp", w: 900, h: 1600 },
      { src: "assets/img/work-vinatex-app-2.webp", w: 900, h: 1600 },
      { src: "assets/img/work-vinatex-app-3.webp", w: 900, h: 1600 },
      { src: "assets/img/work-vinatex-app-4.webp", w: 900, h: 1600 },
      { src: "assets/img/work-vinatex-app-5.webp", w: 900, h: 1600 },
      { src: "assets/img/work-vinatex-app-6.webp", w: 900, h: 1600 }
    ],
    live: "",
    summary: {
      vi: "Hệ thống quản lý nội bộ cho doanh nghiệp dệt may, trong đó có phần soạn, duyệt và theo dõi báo cáo cho người đại diện phần vốn, dựng riêng cho năm nền tảng.",
      en: "An internal management system for a textile and garment enterprise, including drafting, approving, and tracking reports for capital representatives, designed for five platforms."
    },
    challenge: {
      vi: "Thiết kế hệ thống quản lý nội bộ cho doanh nghiệp dệt may Vinatex, trên cả máy tính và ứng dụng di động.",
      en: "Design an internal management system for the textile and garment enterprise Vinatex, on both desktop and mobile app."
    },
    tasks: {
      vi: [
        "Gặp gỡ, trao đổi với khách hàng; tìm hiểu quy trình quản lý nội bộ của doanh nghiệp dệt may, nhất là quy trình soạn, duyệt và theo dõi báo cáo của người đại diện phần vốn.",
        "Phân tích yêu cầu nghiệp vụ, đặc tả thành yêu cầu sản phẩm và xây dựng giải pháp chung cho hệ thống, dựng riêng cho năm nền tảng.",
        "Dẫn dắt đội Design: định hướng thiết kế cho bản Desktop và ứng dụng di động, phân công theo từng phân hệ, review và kiểm soát chất lượng giao diện.",
        "Thiết kế trang chủ dạng bảng công việc kèm dòng thời gian, cùng các màn hình soạn, duyệt và theo dõi báo cáo.",
        "Thiết kế khu quản trị: người dùng, nhóm người dùng, vai trò kèm ma trận phân quyền, danh mục đơn vị và tổ chức, biểu mẫu báo cáo, nhật ký đăng nhập và nhật ký hệ thống, cài đặt cột hiển thị.",
        "Thiết kế các màn hình ứng dụng di động tương ứng với bản Desktop, giữ cùng ngôn ngữ giao diện giữa các nền tảng.",
        "Quản lý đội Front-end và Mobile: phân công, theo dõi tiến độ và điều phối nguồn lực giữa các nền tảng.",
        "Kết nối các bộ phận Design, BA, Front-end và Mobile để quá trình triển khai đồng bộ, thiết kế được dựng đúng trên từng nền tảng.",
        "Đảm bảo, chịu trách nhiệm sản phẩm Desktop và App."
      ],
      en: [
        "Met and talked with the client; learned the internal management process of the textile company, above all how reports are drafted, approved and tracked for the capital representatives.",
        "Analysed the business requirements, specified them as product requirements and built the overall solution, delivered separately for five platforms.",
        "Led the Design team: set the design direction for the Desktop version and the mobile app, assigned work by module, reviewed and controlled interface quality.",
        "Designed the home screen as a work board with a timeline, plus the screens for drafting, approving and tracking reports.",
        "Designed the admin area: users, user groups, roles with the permission matrix, unit and organisation catalogues, report forms, login and system logs, column display settings.",
        "Designed the mobile app screens that match the Desktop version, keeping one interface language across platforms.",
        "Managed the Front-end and Mobile teams: assigning work, tracking progress and coordinating resources across platforms.",
        "Connected Design, BA, Front-end and Mobile so delivery stayed in step and the design was built faithfully on each platform.",
        "Ensured and took responsibility for the Desktop and App products."
      ]
    },
    approach: {
      vi: "Một đầu mối giữ ba mạch việc chạy song song: giải pháp sản phẩm từ phân tích nghiệp vụ, chất lượng giao diện của đội Design, và tiến độ của đội Front-end, Mobile. Các bộ phận được kết nối để bản Desktop và bản App đồng bộ với nhau.",
      en: "One point of ownership across three parallel threads: the product solution from the business analysis, the interface quality from the Design team, and the schedule of the Front-end and Mobile teams. The departments were connected so the desktop and app versions stay in sync."
    },
    metrics: [
      { value: "5", label: { vi: "nền tảng vẽ riêng", en: "platforms drawn out" } },
      { value: "830", label: { vi: "khung thiết kế", en: "design frames" } },
      { value: "83", label: { vi: "khung hướng dẫn sử dụng", en: "user-guide frames" } }
    ]
  },
  {
    id: "dmst",
    year: "2026",
    title: "ĐMST — Cổng thông tin Đổi mới sáng tạo",
    role: { vi: "Lead Team Design", en: "Lead Team Design" },
    stack: ["Figma", "Visual Code", "Word", "Excel"],
    poster: "assets/img/work-dmst.jpg",
    /* Mỗi ảnh là NGUYÊN MỘT FRAME màn hình xuất từ file Figma ĐMST (không cắt
       widget, không mockup). Ba mockup cũ vẫn nằm trong assets/img. poster ở
       trên vẫn giữ vì danh sách ngoài trang chủ dùng nó. */
    gallery: [
      { src: "assets/img/work-dmst-fig-home-hero.webp",             w: 2880, h: 2048 },
      { src: "assets/img/work-dmst-fig-news-search.webp",           w: 2880, h: 3778 },
      { src: "assets/img/work-dmst-fig-personal-profile.webp",      w: 2880, h: 2962 },
      { src: "assets/img/work-dmst-fig-org-profile.webp",           w: 2880, h: 3062 },
      { src: "assets/img/work-dmst-fig-order-form-modal.webp",      w: 2880, h: 2230 },
      { src: "assets/img/work-dmst-fig-order-list.webp",            w: 2880, h: 2520 },
      { src: "assets/img/work-dmst-fig-feedback-list.webp",         w: 2880, h: 2940 },
      { src: "assets/img/work-dmst-fig-survey.webp",                w: 2880, h: 2468 },
      { src: "assets/img/work-dmst-fig-document-detail.webp",       w: 2880, h: 3152 },
      { src: "assets/img/work-dmst-fig-support-organizations.webp", w: 2880, h: 3284 },
      { src: "assets/img/work-dmst-fig-campaign-list.webp",         w: 2880, h: 3992 },
      { src: "assets/img/work-dmst-fig-logout-confirm.webp",        w: 2880, h: 1920 }
    ],
    live: "",
    summary: {
      vi: "Cổng thông tin công khai và khu quản trị đi kèm, dựng đủ cho máy tính, máy tính bảng và điện thoại.",
      en: "A public portal with its own admin area, designed out for desktop, tablet, and phone."
    },
    challenge: {
      vi: "Thiết kế cổng thông tin đổi mới sáng tạo cho Bộ Công An C12, với cấu trúc giao diện cổng thông tin nhất quán xuyên suốt quá trình phát triển.",
      en: "Design an innovation portal for C12, Ministry of Public Security, with a portal interface structure that stays consistent throughout development."
    },
    tasks: {
      vi: [
        "Định hướng UI/UX cho cổng thông tin Đổi mới sáng tạo (C12, Bộ Công an): xác định cấu trúc trang, điều hướng và cách trình bày nội dung cho người dùng cá nhân và tổ chức.",
        "Xây dựng cấu trúc giao diện cổng: trang chủ, tìm kiếm tin tức, văn bản (có khung xem tài liệu), tổ chức hỗ trợ khởi nghiệp và chiến dịch.",
        "Thiết kế phân hệ tài khoản và hồ sơ: đăng nhập, hồ sơ cá nhân, thông tin tổ chức; và phân hệ đăng ký, theo dõi đơn đặt hàng gồm biểu mẫu đăng ký và danh sách theo trạng thái.",
        "Thiết kế phân hệ tương tác của cổng: phản hồi và khảo sát.",
        "Quản lý, phân công và review công việc của đội ngũ Design theo từng phân hệ của cổng.",
        "Kiểm soát tính nhất quán và chất lượng thiết kế trong quá trình phát triển: thống nhất thành phần giao diện dùng chung, kiểm tra các trạng thái và nội dung dài trước khi bàn giao."
      ],
      en: [
        "Set the UI/UX direction for the Innovation portal (C12, Ministry of Public Security): defined page structure, navigation and how content is presented to individual and organisation users.",
        "Built the portal's interface structure: home, news search, documents (with a document viewer), startup support organisations and campaigns.",
        "Designed the account and profile modules: sign-in, personal profile, organisation information; and the order registration and tracking module with the registration form and status-based lists.",
        "Designed the portal's interaction modules: feedback and surveys.",
        "Managed, assigned and reviewed the Design team's work by module of the portal.",
        "Controlled design consistency and quality during development: aligned the shared interface components and checked states and long content before handover."
      ]
    },
    approach: {
      vi: "Dựng cấu trúc giao diện cổng thông tin trước, rồi giao việc cho đội Design theo từng phần và review để mọi màn hình giữ chung một ngôn ngữ thiết kế, từ cổng công khai đến khu quản trị đi kèm.",
      en: "Built the portal's interface structure first, then assigned the Design team work by section and reviewed it so every screen shares one design language, from the public portal to its admin area."
    },
    metrics: [
      { value: "678", label: { vi: "khung thiết kế", en: "design frames" } },
      { value: "3", label: { vi: "nền tảng vẽ riêng", en: "platforms drawn out" } },
      { value: "2", label: { vi: "phiên bản khu quản trị", en: "admin versions" } }
    ]
  },
  {
    id: "web-gtel",
    year: "2025",
    title: "Website GTEL",
    role: { vi: "Product Owner / Team Lead Design / Business Analyst", en: "Product Owner / Team Lead Design / Business Analyst" },
    stack: ["Figma", "Visual Code", "Word", "Excel"],
    poster: "assets/img/work-web-gtel.jpg",
    /* Mỗi ảnh là NGUYÊN MỘT FRAME trang web xuất từ file Figma Web GTEL (không
       cắt, không mockup). Trang web là thiết kế dài (cao 1,2 đến 3,6 lần rộng)
       nên ba trang ngắn nhất xếp trước. Ba mockup cũ vẫn nằm trong assets/img.
       poster ở trên vẫn giữ vì danh sách ngoài trang chủ dùng nó. */
    gallery: [
      { src: "assets/img/work-web-gtel-fig-service.webp",    w: 2880, h: 3436 },
      { src: "assets/img/work-web-gtel-fig-websites.webp",   w: 2880, h: 4654 },
      { src: "assets/img/work-web-gtel-fig-culture.webp",    w: 2880, h: 5882 },
      { src: "assets/img/work-web-gtel-fig-fields.webp",     w: 2880, h: 7002 },
      { src: "assets/img/work-web-gtel-fig-home.webp",       w: 2880, h: 7532 },
      { src: "assets/img/work-web-gtel-fig-news.webp",       w: 2880, h: 7472 },
      { src: "assets/img/work-web-gtel-fig-library.webp",    w: 2880, h: 8592 },
      { src: "assets/img/work-web-gtel-fig-careers.webp",    w: 2880, h: 9180 },
      { src: "assets/img/work-web-gtel-fig-job-detail.webp", w: 2880, h: 9692 },
      { src: "assets/img/work-web-gtel-fig-news-detail.webp", w: 2880, h: 10378 }
    ],
    live: "",
    summary: {
      vi: "Website giới thiệu một tổng công ty công nghệ viễn thông, kèm đặc tả đầy đủ cách trang chuyển động khi cuộn.",
      en: "A corporate site for a telecoms technology group, with a full spec of how the page moves as you scroll."
    },
    challenge: {
      vi: "Thiết kế website LandingPage cho GTEL",
      en: "Design a landing page website for GTEL"
    },
    tasks: {
      vi: [
        "Gặp gỡ, trao đổi với khách hàng",
        "Phân tích nhu cầu của doanh nghiệp để xác định cấu trúc website: giới thiệu, lĩnh vực hoạt động, dịch vụ, tin tức, thư viện và tuyển dụng.",
        "Định hướng thiết kế các trang chính của website: trang chủ, lĩnh vực hoạt động, văn hóa doanh nghiệp, dịch vụ, danh mục website, tin tức, thư viện, tuyển dụng.",
        "Định hướng thiết kế các trang chi tiết: chi tiết tin tức, chi tiết tuyển dụng.",
        "Định hướng đặc tả cách trang chuyển động khi cuộn để đội Front-end triển khai đúng.",
        "Điều phối, quản lý team Design, team FE",
        "Chịu trách nhiệm với kết quả đầu ra của sản phẩm"
      ],
      en: [
        "Met and talked with the client",
        "Analysed the company's needs to set the site structure: about, fields of activity, services, news, library and careers.",
        "Set the design direction for the site's main pages: home, fields of activity, corporate culture, services, website directory, news, library, careers.",
        "Set the design direction for the detail pages: news detail and job detail.",
        "Directed the spec of how the pages move on scroll so the Front-end team could build it faithfully.",
        "Coordinated and managed the Design and FE teams",
        "Took responsibility for the product's output"
      ]
    },
    metrics: [
      { value: "53", label: { vi: "khung đặc tả chuyển động", en: "motion frames" } },
      { value: "120", label: { vi: "thành phần dùng lại", en: "reusable components" } },
      { value: "200", label: { vi: "tổng số khung", en: "frames total" } }
    ]
  },
  {
    id: "fia-search",
    year: "2026",
    title: "FIA — Hệ thống quản lý đầu tư trong và ngoài nước (Bộ Tài chính)",
    role: { vi: "Project Manager", en: "Project Manager" },
    stack: ["Figma", "Visual Code", "Word", "Excel"],
    poster: "assets/img/work-fia-search.jpg",
    /* Mỗi ảnh là NGUYÊN MỘT FRAME màn hình xuất từ file Figma FIA (không cắt
       widget, không mockup). Ba mockup cũ vẫn nằm trong assets/img. poster ở
       trên vẫn giữ vì danh sách ngoài trang chủ dùng nó. */
    gallery: [
      { src: "assets/img/work-fia-search-fig-summary-dashboard.webp",       w: 2880, h: 1898 },
      { src: "assets/img/work-fia-search-fig-monthly-stats.webp",           w: 2880, h: 1624 },
      { src: "assets/img/work-fia-search-fig-dashboard-overview.webp",      w: 2880, h: 4170 },
      { src: "assets/img/work-fia-search-fig-dashboard-donut-charts.webp",  w: 2880, h: 4750 },
      { src: "assets/img/work-fia-search-fig-capital-trend.webp",           w: 2880, h: 3564 },
      { src: "assets/img/work-fia-search-fig-capital-project-list.webp",    w: 2880, h: 3648 },
      { src: "assets/img/work-fia-search-fig-new-project-list.webp",        w: 2880, h: 2202 },
      { src: "assets/img/work-fia-search-fig-new-project-filter.webp",      w: 2880, h: 2280 },
      { src: "assets/img/work-fia-search-fig-capital-increase-table.webp",  w: 2880, h: 2780 },
      { src: "assets/img/work-fia-search-fig-capital-increase-filter.webp", w: 2880, h: 2300 },
      { src: "assets/img/work-fia-search-fig-industry-summary.webp",        w: 2880, h: 2048 },
      { src: "assets/img/work-fia-search-fig-column-settings-modal.webp",   w: 2880, h: 2280 }
    ],
    live: "",
    summary: {
      vi: "Website tra cứu và báo cáo tổng hợp về các hạng mục đầu tư.",
      en: "A website for looking up and reporting on investment items."
    },
    challenge: {
      vi: "Triển khai hệ thống quản lý đầu tư trong và ngoài nước của Bộ Tài chính, trong đó có website tra cứu các hạng mục đầu tư, bao gồm các tiêu chí:",
      en: "Deliver the Ministry of Finance's system for managing domestic and foreign investment, including a website for looking up investment items, meeting these criteria:"
    },
    criteria: {
      vi: [
        "Website hiển thị rõ các thông tin về các mục đầu tư",
        "Chia rõ phân luồng khách/người dùng"
      ],
      en: [
        "The website clearly displays information about the investment items",
        "Clearly separated flows for guests and logged-in users"
      ]
    },
    tasks: {
      vi: [
        "Trao đổi với khách hàng (Bộ Tài chính), tiếp nhận yêu cầu và chốt phạm vi hệ thống: tra cứu và báo cáo tổng hợp các hạng mục đầu tư trong và ngoài nước.",
        "Lập và quản lý kế hoạch triển khai: chia việc theo từng nhóm màn hình báo cáo, đặt mốc bàn giao và theo dõi tiến độ từng hạng mục.",
        "Điều phối nguồn lực: phân công team Design và team Dev, cân đối khối lượng công việc theo tiến độ.",
        "Kết nối các bộ phận và các bên liên quan: truyền đạt yêu cầu của khách hàng tới đội thực hiện và phản hồi ngược lại.",
        "Theo dõi các màn hình báo cáo của hệ thống: dashboard tổng hợp, thống kê theo tháng, xu hướng vốn, danh sách dự án đầu tư mới và tăng vốn, tổng hợp theo ngành, bộ lọc và cài đặt cột hiển thị.",
        "Theo dõi chất lượng đầu ra: kiểm tra thiết kế và sản phẩm theo yêu cầu đã chốt trước khi bàn giao.",
        "Kiểm soát tiến độ và quản lý các vấn đề phát sinh: ghi nhận, phân loại, xử lý và báo cáo lại cho khách hàng.",
        "Chịu trách nhiệm với kết quả đầu ra của sản phẩm."
      ],
      en: [
        "Talked with the client (Ministry of Finance), took in requirements and fixed the system scope: lookup and summary reports on domestic and foreign investment items.",
        "Built and managed the delivery plan: split the work by report screen group, set handover milestones and tracked each work item.",
        "Coordinated resources: assigned the Design and Dev teams and balanced the workload against the schedule.",
        "Connected the departments and stakeholders: passed the client's requirements to the delivery team and fed back the other way.",
        "Followed the system's report screens: summary dashboard, monthly statistics, capital trend, lists of new and increased-capital projects, industry summary, filters and column settings.",
        "Monitored output quality: checked the design and product against the agreed requirements before handover.",
        "Controlled the schedule and managed issues as they came up: logged, sorted, handled and reported back to the client.",
        "Took responsibility for the product's output."
      ]
    },
    approach: {
      vi: "Giữ vai trò đầu mối quản lý: chốt kế hoạch, điều phối nguồn lực giữa các bộ phận, theo dõi chất lượng đầu ra và xử lý vấn đề phát sinh để tiến độ không bị đứt quãng.",
      en: "Acted as the management point of contact: fixing the plan, coordinating resources across departments, tracking output quality, and handling issues as they came up so the schedule did not stall."
    },
    metrics: [
      { value: "168", label: { vi: "khung thiết kế", en: "design frames" } },
      { value: "1", label: { vi: "trang đặc tả chuyển động", en: "motion spec page" } }
    ]
  },
  {
    id: "logistics",
    year: "2025",
    title: "Phần mềm dữ liệu Logistics",
    role: { vi: "Team Lead Design / Business Analyst", en: "Team Lead Design / Business Analyst" },
    stack: ["Figma", "Visual Code", "Word", "Excel"],
    poster: "assets/img/work-logistics.jpg",
    /* Mỗi ảnh là NGUYÊN MỘT FRAME màn hình xuất từ file Figma Logistics (không
       cắt widget, không mockup). Ba mockup cũ vẫn nằm trong assets/img. poster
       ở trên vẫn giữ vì danh sách ngoài trang chủ dùng nó. */
    gallery: [
      { src: "assets/img/work-logistics-fig-login.webp",        w: 2880, h: 1800 },
      { src: "assets/img/work-logistics-fig-units.webp",        w: 2880, h: 2048 },
      { src: "assets/img/work-logistics-fig-users.webp",        w: 2880, h: 2048 },
      { src: "assets/img/work-logistics-fig-permissions.webp",  w: 2880, h: 2048 },
      { src: "assets/img/work-logistics-fig-enterprises.webp",  w: 2880, h: 2072 },
      { src: "assets/img/work-logistics-fig-road-form.webp",    w: 2880, h: 2562 },
      { src: "assets/img/work-logistics-fig-config-form.webp",  w: 2880, h: 3294 },
      { src: "assets/img/work-logistics-fig-center-detail.webp", w: 2880, h: 2480 },
      { src: "assets/img/work-logistics-fig-airport-detail.webp", w: 2880, h: 2286 },
      { src: "assets/img/work-logistics-fig-api-sharing.webp",  w: 2880, h: 2400 }
    ],
    live: "",
    summary: {
      vi: "Hệ thống quản lý dữ liệu vận tải cho các đơn vị Sở, Ban, Ngành — quản lý tuyến đường, hồ sơ và danh mục.",
      en: "A transport data system for provincial departments, covering routes, records, and reference catalogues."
    },
    challenge: {
      vi: "Thiết kế website nội bộ cho Logistics Hải Phòng",
      en: "Design an internal website for Hai Phong Logistics"
    },
    tasks: {
      vi: [
        "Trao đổi với khách hàng",
        "Làm tài liệu SRS, hướng dẫn sử dụng",
        "Định hướng thiết kế các màn hình chính: đăng nhập, quản lý đơn vị Sở Ban Ngành, người dùng và phân quyền.",
        "Định hướng thiết kế các màn hình dữ liệu logistics: doanh nghiệp logistics, hạ tầng đường bộ và hàng không, chi tiết trung tâm logistics, thêm mới văn bản và cấu hình.",
        "Định hướng thiết kế màn hình chia sẻ thông tin qua API.",
        "Điều phối, quản lý team Design",
        "Chịu trách nhiệm với đầu ra của sản phẩm"
      ],
      en: [
        "Talked with the client",
        "Wrote the SRS documents and user guides",
        "Set the design direction for the main screens: sign-in, department unit management, users and permissions.",
        "Set the design direction for the logistics data screens: logistics enterprises, road and air infrastructure, logistics centre details, adding documents and configuration.",
        "Set the design direction for the information-sharing screen through APIs.",
        "Coordinated and managed the Design team",
        "Took responsibility for the product's output"
      ]
    },
    metrics: [
      { value: "431", label: { vi: "khung thiết kế", en: "design frames" } },
      { value: "1", label: { vi: "khuôn màn hình dùng chung", en: "shared screen template" } }
    ]
  },
  {
    id: "beli-teacher",
    year: "2024-2025",
    title: "BELI — Nền tảng Web quản lý và đặt lịch giáo viên nước ngoài",
    role: { vi: "Product Team Lead / Business Analyst", en: "Product Team Lead / Business Analyst" },
    stack: ["Figma", "Visual Code", "Word", "Excel"],
    poster: "assets/img/work-beli-teacher.jpg",
    /* Mỗi ảnh là NGUYÊN MỘT FRAME màn hình xuất từ file Figma Beli (không cắt
       widget, không mockup). Ba mockup cũ vẫn nằm trong assets/img. poster ở
       trên vẫn giữ vì danh sách ngoài trang chủ dùng nó. */
    gallery: [
      { src: "assets/img/work-beli-teacher-fig-match-list.webp",    w: 2880, h: 2528 },
      { src: "assets/img/work-beli-teacher-fig-login.webp",         w: 2880, h: 2048 },
      { src: "assets/img/work-beli-teacher-fig-owner-dashboard.webp", w: 2880, h: 3758 },
      { src: "assets/img/work-beli-teacher-fig-teachers.webp",      w: 2880, h: 4354 },
      { src: "assets/img/work-beli-teacher-fig-signup.webp",        w: 2880, h: 2048 },
      { src: "assets/img/work-beli-teacher-fig-chat.webp",          w: 2880, h: 2688 },
      { src: "assets/img/work-beli-teacher-fig-job-detail.webp",    w: 2880, h: 3446 },
      { src: "assets/img/work-beli-teacher-fig-profile.webp",       w: 1440, h: 2439 },
      { src: "assets/img/work-beli-teacher-fig-charts.webp",        w: 2880, h: 3870 },
      { src: "assets/img/work-beli-teacher-fig-profile-edit.webp",  w: 1440, h: 2683 },
      { src: "assets/img/work-beli-teacher-fig-policy.webp",        w: 1440, h: 853 }
    ],
    live: "",
    summary: {
      vi: "Website nội bộ trung tâm tiếng Anh cung cấp giáo viên nước ngoài.",
      en: "An internal website for an English center that places foreign teachers."
    },
    challenge: {
      vi: "Thiết kế website nội bộ cho trung tâm cho thuê giáo viên nước ngoài dạy tiếng Anh, đáp ứng các tiêu chí sau:",
      en: "Design an internal website for a center that places foreign English teachers, meeting these criteria:"
    },
    criteria: {
      vi: [
        "Giao diện thân thiện",
        "Ngôn ngữ chính là tiếng Anh",
        "Module chính liên quan đến cho thuê giáo viên nước ngoài, hợp đồng, lịch dạy của các giáo viên"
      ],
      en: [
        "A friendly interface",
        "English as the primary language",
        "Core modules for placing foreign teachers, contracts, and teachers' teaching schedules"
      ]
    },
    tasks: {
      vi: [
        "Gặp gỡ, trao đổi với khách hàng.",
        "Phân tích yêu cầu nghiệp vụ và làm rõ nhu cầu của các trường học: cách trường tìm, đặt lịch và quản lý giáo viên nước ngoài.",
        "Lên danh sách các tiêu chí theo yêu cầu từ phía khách hàng, làm cơ sở để đối chiếu thiết kế.",
        "Xây dựng giải pháp sản phẩm cho nền tảng Web quản lý và đặt lịch giáo viên nước ngoài dành cho các trường học.",
        "Thiết kế tổng thể giao diện và trải nghiệm người dùng: đăng ký, đăng nhập, danh sách ghép giáo viên, hồ sơ giáo viên (xem và chỉnh sửa), chi tiết công việc và trò chuyện.",
        "Thiết kế khu dành cho bên quản lý: bảng điều khiển, biểu đồ thống kê và trang chính sách.",
        "Dẫn dắt đội ngũ Design: định hướng thiết kế, phân công công việc, review và kiểm soát chất lượng.",
        "Điều phối, quản lý team Design, team Dev; phối hợp trong quá trình phát triển và hoàn thiện sản phẩm.",
        "Làm tài liệu, biên bản bàn giao liên quan đến dự án.",
        "Chịu trách nhiệm với kết quả đầu ra của sản phẩm."
      ],
      en: [
        "Met and talked with the client.",
        "Analysed the business requirements and clarified the schools' needs: how a school finds, books and manages foreign teachers.",
        "Listed the criteria requested by the client, as a basis for checking the design against.",
        "Built the product solution for the Web platform that manages and books foreign teachers for schools.",
        "Designed the overall interface and user experience: sign-up, sign-in, teacher matching list, teacher profile (view and edit), job details and chat.",
        "Designed the area for the managing side: dashboard, statistics charts and the policy page.",
        "Led the Design team: set the design direction, assigned work, reviewed and controlled quality.",
        "Coordinated and managed the Design and Dev teams; worked through development and polishing of the product.",
        "Wrote the project documents and handover records.",
        "Took responsibility for the product's output."
      ]
    },
    approach: {
      vi: "Đi từ nhu cầu của các trường học sang giải pháp sản phẩm, rồi thiết kế tổng thể giao diện và trải nghiệm cho nền tảng, đồng thời dẫn dắt đội Design và phối hợp với đội phát triển để hoàn thiện sản phẩm.",
      en: "Moved from the schools' needs to a product solution, then designed the platform's overall interface and experience, while leading the Design team and working with the development team to finish the product."
    },
    metrics: [
      { value: "179", label: { vi: "khung thiết kế", en: "design frames" } },
      { value: "EN", label: { vi: "ngôn ngữ sản phẩm", en: "product language" } }
    ]
  },
  {
    id: "tich-hop-chia-se",
    year: "2026",
    title: "Tích hợp chia sẻ dữ liệu",
    role: { vi: "Team Lead Design / Business Analyst", en: "Team Lead Design / Business Analyst" },
    stack: ["Figma", "Visual Code", "Word", "Excel"],
    poster: "assets/img/work-tich-hop-chia-se.jpg",
    /* Mỗi ảnh là NGUYÊN MỘT FRAME màn hình xuất từ file Figma Tích hợp chia sẻ
       (không cắt widget, không mockup). Ba mockup cũ vẫn nằm trong assets/img.
       poster ở trên vẫn giữ vì danh sách ngoài trang chủ dùng nó. */
    gallery: [
      { src: "assets/img/work-tich-hop-chia-se-fig-danh-muc-list.webp",      w: 2880, h: 1966 },
      { src: "assets/img/work-tich-hop-chia-se-fig-giam-sat-dashboard.webp", w: 2880, h: 4082 },
      { src: "assets/img/work-tich-hop-chia-se-fig-giam-sat-chia-se.webp",   w: 2880, h: 3020 },
      { src: "assets/img/work-tich-hop-chia-se-fig-bo-loc.webp",             w: 2880, h: 1966 },
      { src: "assets/img/work-tich-hop-chia-se-fig-schema-list.webp",        w: 2880, h: 2112 },
      { src: "assets/img/work-tich-hop-chia-se-fig-them-moi-danh-muc.webp",  w: 2880, h: 1966 },
      { src: "assets/img/work-tich-hop-chia-se-fig-chi-tiet-modal.webp",     w: 1500, h: 1024 },
      { src: "assets/img/work-tich-hop-chia-se-fig-them-moi-schema.webp",    w: 1500, h: 1100 },
      { src: "assets/img/work-tich-hop-chia-se-fig-sua-bang-du-lieu.webp",   w: 1500, h: 1100 },
      { src: "assets/img/work-tich-hop-chia-se-fig-sua-schema-json.webp",    w: 1500, h: 986 },
      { src: "assets/img/work-tich-hop-chia-se-fig-chi-tiet-schema.webp",    w: 1500, h: 1126 },
      { src: "assets/img/work-tich-hop-chia-se-fig-giam-sat-danh-sach.webp", w: 1500, h: 1024 }
    ],
    live: "",
    summary: {
      vi: "Website nội bộ của Bộ Công An về dữ liệu.",
      en: "An internal website of the Ministry of Public Security for data."
    },
    challenge: {
      vi: "Thiết kế website nội bộ quản lý đầu ra/vào của dữ liệu, gồm các tiêu chí sau:",
      en: "Design an internal website managing the incoming and outgoing data, meeting these criteria:"
    },
    criteria: {
      vi: [
        "Giao diện nhận diện thương hiệu",
        "Dữ liệu theo thời gian thực"
      ],
      en: [
        "A brand-recognizable interface",
        "Real-time data"
      ]
    },
    tasks: {
      vi: [
        "Tiếp nhận thông tin từ phía khách hàng",
        "Định hướng thiết kế các màn hình quản lý danh mục: danh sách, bộ lọc, thêm mới, xem chi tiết.",
        "Định hướng thiết kế phần quản lý schema: danh sách, thêm mới, chỉnh sửa bảng dữ liệu và schema, xem chi tiết.",
        "Định hướng thiết kế phần giám sát: giám sát xử lý dữ liệu tích hợp và giám sát chia sẻ dữ liệu trong nội bộ.",
        "Điều phối, quản lý team Design, team Dev",
        "Chịu trách nhiệm với kết quả đầu ra của sản phẩm"
      ],
      en: [
        "Took in information from the client",
        "Set the design direction for the catalogue management screens: list, filters, adding, viewing details.",
        "Set the design direction for schema management: list, adding, editing data tables and schemas, viewing details.",
        "Set the design direction for monitoring: monitoring of integrated-data processing and of internal data sharing.",
        "Coordinated and managed the Design and Dev teams",
        "Took responsibility for the product's output"
      ]
    },
    metrics: [
      { value: "145", label: { vi: "khung thiết kế", en: "design frames" } },
      { value: "4", label: { vi: "chỉ số trạng thái đầu màn", en: "status figures up top" } }
    ]
  },
  {
    id: "hrm-gtsc",
    year: "2026",
    title: "Phần mềm nhân sự GTSC",
    role: { vi: "Team Lead Design / Business Analyst / Product Owner / Project Manager", en: "Team Lead Design / Business Analyst / Product Owner / Project Manager" },
    stack: ["Figma", "Visual Code", "Word", "Excel"],
    poster: "assets/img/work-hrm-gtsc.jpg",
    /* Mỗi ảnh là NGUYÊN MỘT FRAME màn hình xuất từ file Figma HRM (không cắt
       widget, không mockup). Ba mockup cũ vẫn nằm trong assets/img. poster ở
       trên vẫn giữ vì danh sách ngoài trang chủ dùng nó. */
    gallery: [
      { src: "assets/img/work-hrm-gtsc-fig-dashboard.webp",         w: 2880, h: 1920 },
      { src: "assets/img/work-hrm-gtsc-fig-login-rules.webp",       w: 2880, h: 1828 },
      { src: "assets/img/work-hrm-gtsc-fig-contracts.webp",         w: 2880, h: 1920 },
      { src: "assets/img/work-hrm-gtsc-fig-contract-document.webp", w: 2880, h: 2306 },
      { src: "assets/img/work-hrm-gtsc-fig-timesheet-list.webp",    w: 2880, h: 1920 },
      { src: "assets/img/work-hrm-gtsc-fig-timesheet-detail.webp",  w: 2880, h: 2682 },
      { src: "assets/img/work-hrm-gtsc-fig-org-chart.webp",         w: 2880, h: 1920 },
      { src: "assets/img/work-hrm-gtsc-fig-departments.webp",       w: 2880, h: 2608 },
      { src: "assets/img/work-hrm-gtsc-fig-recruitment-list.webp",  w: 2880, h: 2048 },
      { src: "assets/img/work-hrm-gtsc-fig-employee-form.webp",     w: 2880, h: 2958 },
      { src: "assets/img/work-hrm-gtsc-fig-calendar-event.webp",    w: 2880, h: 2516 }
    ],
    live: "",
    summary: {
      vi: "Hệ thống quản trị nhân sự nội bộ: tuyển dụng, chấm công, hợp đồng, phòng ban, cùng bảng điều khiển tổng quan.",
      en: "An internal HR system covering recruitment, attendance, contracts, and departments, with an overview dashboard."
    },
    challenge: {
      vi: "Thiết kế website nội bộ HRM quản lý nhân sự cho GTSC.",
      en: "Design an internal HRM website for staff management at GTSC."
    },
    tasks: {
      vi: [
        "Gặp gỡ, giao tiếp với khách hàng",
        "Định hướng thiết kế đăng nhập (kèm bảng nội quy lần đầu đăng nhập) và bảng điều khiển.",
        "Định hướng thiết kế các phân hệ chính: hợp đồng, bảng chấm công, sơ đồ phòng ban, tuyển dụng, hồ sơ nhân sự, lịch sự kiện.",
        "Điều phối team Design, team FE, team BE",
        "Quản lý kết quả đầu ra của sản phẩm"
      ],
      en: [
        "Met and communicated with the client",
        "Set the design direction for sign-in (with the rules shown on first login) and the dashboard.",
        "Set the design direction for the main modules: contracts, timesheets, department chart, recruitment, employee records, event calendar.",
        "Coordinated the Design, FE and BE teams",
        "Managed the product's output"
      ]
    },
    metrics: [
      { value: "119", label: { vi: "khung thiết kế", en: "design frames" } },
      { value: "2", label: { vi: "phiên bản sau phản hồi", en: "versions after feedback" } }
    ]
  },
  {
    id: "kho-ttdmst",
    year: "2026",
    title: "Kho dữ liệu TTĐMST",
    role: { vi: "Team Lead Design / Business Analyst", en: "Team Lead Design / Business Analyst" },
    stack: ["Figma", "Visual Code", "Word", "Excel"],
    poster: "assets/img/work-kho-ttdmst.jpg",
    /* Mỗi ảnh là NGUYÊN MỘT FRAME màn hình xuất từ file Figma Kho TTĐMST (không
       cắt widget, không mockup). Ba mockup cũ vẫn nằm trong assets/img. poster
       ở trên vẫn giữ vì danh sách ngoài trang chủ dùng nó. */
    gallery: [
      { src: "assets/img/work-kho-ttdmst-fig-users-list.webp",         w: 1500, h: 1024 },
      { src: "assets/img/work-kho-ttdmst-fig-kiem-tra-tong-quan.webp", w: 1500, h: 1762 },
      { src: "assets/img/work-kho-ttdmst-fig-loai-du-lieu-list.webp",  w: 1500, h: 1024 },
      { src: "assets/img/work-kho-ttdmst-fig-nhat-ky.webp",            w: 1500, h: 1024 },
      { src: "assets/img/work-kho-ttdmst-fig-kiem-tra-bang.webp",      w: 1500, h: 1042 },
      { src: "assets/img/work-kho-ttdmst-fig-user-detail.webp",        w: 1500, h: 1024 },
      { src: "assets/img/work-kho-ttdmst-fig-loai-du-lieu-detail.webp", w: 1500, h: 1024 },
      { src: "assets/img/work-kho-ttdmst-fig-schema-detail.webp",      w: 1500, h: 1024 },
      { src: "assets/img/work-kho-ttdmst-fig-dong-bo.webp",            w: 1500, h: 1091 },
      { src: "assets/img/work-kho-ttdmst-fig-nhat-ky-detail.webp",     w: 1500, h: 1360 },
      { src: "assets/img/work-kho-ttdmst-fig-cau-hinh-modal.webp",     w: 1500, h: 1024 },
      { src: "assets/img/work-kho-ttdmst-fig-gia-lap.webp",            w: 1500, h: 1052 }
    ],
    live: "",
    summary: {
      vi: "Phần mềm nội bộ quản trị kho dữ liệu: phân quyền, nhật ký, giám sát xử lý và cấu hình kiểm tra dữ liệu.",
      en: "Internal software for a data warehouse: permissions, audit logs, processing monitors, and validation config."
    },
    challenge: {
      vi: "Thiết kế website nội bộ quản lý dữ liệu cho Bộ Công An C12.",
      en: "Design an internal data management website for C12, Ministry of Public Security."
    },
    tasks: {
      vi: [
        "Điều phối team Design",
        "Định hướng thiết kế các màn hình quản trị: người dùng, nhóm quyền, nhật ký hệ thống.",
        "Định hướng thiết kế các màn hình dữ liệu: danh mục loại dữ liệu, chi tiết schema, cấu hình đồng bộ dữ liệu.",
        "Định hướng thiết kế phần giám sát xử lý dữ liệu: tổng quan, tình trạng kiểm tra, giám sát giả lập, và thiết lập cấu hình phục vụ kiểm tra dữ liệu.",
        "Quản lý API, DB đầu ra",
        "Chịu trách nhiệm với sản phẩm"
      ],
      en: [
        "Coordinated the Design team",
        "Set the design direction for the admin screens: users, permission groups, system logs.",
        "Set the design direction for the data screens: data-type catalogue, schema details, data sync configuration.",
        "Set the design direction for data-processing monitoring: overview, validation status, simulated monitoring, and the configuration setup for data validation.",
        "Managed the output APIs and database",
        "Took responsibility for the product"
      ]
    },
    metrics: [
      { value: "9", label: { vi: "phân hệ", en: "modules" } },
      { value: "28", label: { vi: "khung bộ giao diện", en: "design-kit frames" } },
      { value: "11", label: { vi: "trang làm việc", en: "working pages" } }
    ]
  },
  {
    id: "dmst-backoffice",
    year: "2026",
    title: "ĐMST Backoffice",
    role: { vi: "Team Lead Design / Business Analyst", en: "Team Lead Design / Business Analyst" },
    stack: ["Figma", "Visual Code", "Word", "Excel"],
    poster: "assets/img/work-dmst-backoffice.jpg",
    /* Mỗi ảnh là NGUYÊN MỘT FRAME màn hình xuất từ file Figma ĐMST Backoffice
       (không cắt widget, không mockup). Ba mockup cũ vẫn nằm trong assets/img.
       poster ở trên vẫn giữ vì danh sách ngoài trang chủ dùng nó. */
    gallery: [
      { src: "assets/img/work-dmst-backoffice-fig-ho-so-list.webp",       w: 1500, h: 1024 },
      { src: "assets/img/work-dmst-backoffice-fig-nhat-ky-dashboard.webp", w: 1500, h: 1478 },
      { src: "assets/img/work-dmst-backoffice-fig-loai-van-ban.webp",     w: 1500, h: 1024 },
      { src: "assets/img/work-dmst-backoffice-fig-chuyen-muc.webp",       w: 1500, h: 1024 },
      { src: "assets/img/work-dmst-backoffice-fig-nguoi-dung.webp",       w: 1500, h: 1024 },
      { src: "assets/img/work-dmst-backoffice-fig-thong-ke.webp",         w: 1500, h: 1024 },
      { src: "assets/img/work-dmst-backoffice-fig-ho-so-detail.webp",     w: 1500, h: 1028 },
      { src: "assets/img/work-dmst-backoffice-fig-chi-tiet.webp",         w: 1500, h: 1028 },
      { src: "assets/img/work-dmst-backoffice-fig-them-moi.webp",         w: 1500, h: 1028 },
      { src: "assets/img/work-dmst-backoffice-fig-nguoi-dung-detail.webp", w: 1500, h: 1028 },
      { src: "assets/img/work-dmst-backoffice-fig-them-nguoi-dung.webp",  w: 1500, h: 1028 },
      { src: "assets/img/work-dmst-backoffice-fig-nhat-ky-detail.webp",   w: 1500, h: 1028 }
    ],
    live: "",
    summary: {
      vi: "Khu quản trị nội dung và hồ sơ cho cổng Đổi mới sáng tạo: bảy loại hồ sơ, thống kê, nhật ký và tài khoản cán bộ.",
      en: "The content and records admin for the innovation portal: seven record types, statistics, logs, and staff accounts."
    },
    challenge: {
      vi: "Thiết kế website quản lý thông tin trên Portal.",
      en: "Design a website for managing the content published on the Portal."
    },
    tasks: {
      vi: [
        "Quản lý, điều phối team Design, team FE, team BE",
        "Định hướng thiết kế khu quản trị cho bảy loại hồ sơ: danh sách, chi tiết và thêm mới.",
        "Định hướng thiết kế các màn hình quản trị: loại văn bản, chuyên mục, tài khoản cán bộ.",
        "Định hướng thiết kế các màn hình theo dõi: nhật ký hoạt động và thống kê bình chọn.",
        "Đảm bảo, chịu trách nhiệm với sản phẩm"
      ],
      en: [
        "Managed and coordinated the Design, FE and BE teams",
        "Set the design direction for the admin area covering seven record types: lists, details and adding new records.",
        "Set the design direction for the admin screens: document types, sections, staff accounts.",
        "Set the design direction for the tracking screens: activity log and vote statistics.",
        "Ensured and took responsibility for the product"
      ]
    },
    metrics: [
      { value: "7", label: { vi: "loại hồ sơ", en: "record types" } },
      { value: "17", label: { vi: "trang làm việc", en: "working pages" } },
      { value: "26", label: { vi: "khung bộ giao diện", en: "design-kit frames" } }
    ]
  },
  {
    id: "dcim",
    year: "2025",
    title: "DCIM — hệ thống giám sát thiết bị tại Trung tâm dữ liệu quốc gia (C12)",
    role: { vi: "Team Lead Design / Business Analyst", en: "Team Lead Design / Business Analyst" },
    stack: ["Figma", "Blender", "Visual Code", "Word", "Excel"],
    poster: "assets/img/work-dcim.jpg",
    /* Mỗi ảnh là NGUYÊN MỘT FRAME màn hình xuất từ file Figma DCIM (không cắt
       widget). Không dùng mockup thiết bị: mockup cũ nghiêng, nhỏ, kèm bàn
       phím và chuột nên giao diện đọc không ra. Ba tệp work-dcim-imac /
       mac-studio / monitor vẫn nằm trong assets/img. w, h là kích thước thật. */
    gallery: [
      { src: "assets/img/work-dcim-frame-map-sitemap.webp",    w: 2880, h: 2322 },
      { src: "assets/img/work-dcim-dashboard.webp",            w: 2880, h: 3870 },
      { src: "assets/img/work-dcim-dashboard-dark.webp",       w: 2880, h: 4208 },
      { src: "assets/img/work-dcim-frame-map-location.webp",   w: 2880, h: 2322 },
      { src: "assets/img/work-dcim-frame-map-popup.webp",      w: 2880, h: 2098 },
      { src: "assets/img/work-dcim-frame-map-site.webp",       w: 2880, h: 2088 },
      { src: "assets/img/work-dcim-frame-map-site-modal.webp", w: 2880, h: 2088 },
      { src: "assets/img/work-dcim-frame-map-device.webp",     w: 2880, h: 2054 },
      { src: "assets/img/work-dcim-frame-map-edit.webp",       w: 2880, h: 2082 },
      { src: "assets/img/work-dcim-frame-map-site-edit.webp",  w: 2880, h: 2050 },
      { src: "assets/img/work-dcim-frame-list-sites.webp",     w: 2880, h: 2032 },
      { src: "assets/img/work-dcim-frame-regions.webp",        w: 2880, h: 2032 }
    ],
    live: "",
    summary: {
      vi: "Website giám sát thiết bị và tủ Rack của Trung tâm dữ liệu quốc gia, theo dõi trạng thái và dữ liệu theo thời gian thực, kèm mô hình 3D tủ Rack dựng bằng Blender.",
      en: "A website monitoring equipment and server racks at the National Data Center, tracking status and data in real time, with a 3D rack model built in Blender."
    },
    challenge: {
      vi: "Thiết kế website nội bộ giám sát khu vực của Trung Tâm Dữ Liệu Quốc gia, gồm các tiêu chí:",
      en: "Design an internal website for area monitoring at the National Data Center, meeting these criteria:"
    },
    criteria: {
      vi: [
        "Giao diện dễ dùng",
        "Phát triển các khu vực theo thời gian thực"
      ],
      en: [
        "An easy-to-use interface",
        "Real-time development of monitored areas"
      ]
    },
    tasks: {
      vi: [
        "Gặp gỡ, trao đổi với khách hàng (C12): tìm hiểu cách vận hành phòng máy, thiết bị và tủ Rack, cùng những dữ liệu cần theo dõi.",
        "Phân tích yêu cầu nghiệp vụ và xây dựng giải pháp thiết kế cho hệ thống giám sát thiết bị, tủ Rack tại Trung tâm dữ liệu quốc gia.",
        "Thiết kế bảng điều khiển tổng quan: tổng số rack, site, tenant và thiết bị; mức sử dụng rack; số lượng thiết bị theo loại; số rack theo từng site.",
        "Thiết kế giao diện theo dõi trạng thái và dữ liệu thiết bị theo thời gian thực (Real-time Monitoring): sáu bảng xếp hạng Top 10 theo nhiệt độ và độ ẩm, mỗi loại xem theo Region, Site hoặc Location và Tenant.",
        "Thiết kế màn hình theo dõi thiết bị cấp nguồn: nhiệt độ và độ ẩm cao nhất ghi nhận được, biểu đồ công suất tiêu thụ, trạng thái từng pha (Phase status) và đồng hồ đo công suất.",
        "Thiết kế sơ đồ phòng máy theo vị trí: mặt bằng Location và Site, thẻ rack tô màu theo mức sử dụng, cửa sổ chi tiết rack và thiết bị, chế độ chỉnh sửa sơ đồ.",
        "Dùng Blender thiết kế và dựng mô hình 3D tủ Rack để trực quan hóa thiết bị trong hệ thống.",
        "Dẫn dắt đội Design, định hướng UI/UX và kiểm soát chất lượng thiết kế.",
        "Điều phối, quản lý team Design, team FE.",
        "Chịu trách nhiệm với kết quả đầu ra của sản phẩm."
      ],
      en: [
        "Met and talked with the client (C12): learned how the server rooms, equipment and racks are run and what data needs to be tracked.",
        "Analysed the business requirements and built the design solution for the equipment and rack monitoring system at the National Data Center.",
        "Designed the overview dashboard: total racks, sites, tenants and devices; rack utilisation; devices by type; racks per site.",
        "Designed the interface for tracking equipment status and data in real time (Real-time Monitoring): six Top 10 boards by temperature and humidity, each viewed by Region, Site or Location, and Tenant.",
        "Designed the screen for power-supply devices: highest recorded temperature and humidity, power consumption charts, per-phase status (Phase status) and power gauges.",
        "Designed the room map by location: Location and Site floor plans, rack cards coloured by usage level, rack and device detail windows, a map edit mode.",
        "Used Blender to design and model a 3D server rack for visualising equipment in the system.",
        "Led the Design team, set the UI/UX direction and controlled design quality.",
        "Coordinated and managed the Design and FE teams.",
        "Took responsibility for the product's output."
      ]
    },
    approach: {
      vi: "Từ phân tích nghiệp vụ giám sát thiết bị, dựng giao diện theo dõi trạng thái và dữ liệu theo thời gian thực; tủ Rack được dựng thành mô hình 3D bằng Blender để người vận hành nhìn thiết bị trực quan ngay trong hệ thống.",
      en: "Starting from the equipment-monitoring business analysis, built an interface that tracks status and data in real time; the rack was modelled in 3D in Blender so operators can see the equipment visually inside the system."
    },
    result: {
      vi: "Từ bản phân tích nghiệp vụ đến sản phẩm hoàn thiện: giao diện giám sát thời gian thực và mô hình 3D tủ Rack dựng bằng Blender.",
      en: "From business analysis to a finished product: a real-time monitoring interface and a 3D server-rack model built in Blender."
    }
  },
  {
    id: "tp-group",
    year: "2025",
    title: "TP Group — Website doanh nghiệp",
    role: { vi: "Project Manager", en: "Project Manager" },
    stack: ["Figma", "Visual Code", "Word", "Excel"],
    poster: "assets/img/work-tp-group.jpg",
    /* Mỗi ảnh là NGUYÊN MỘT FRAME màn hình xuất từ file Figma TP-Group (không
       cắt widget, không mockup). Các trang Home và Giới thiệu bị bỏ vì quá dài
       (cao hơn 2,2 lần rộng). Ba mockup cũ vẫn nằm trong assets/img. poster ở
       trên vẫn giữ vì danh sách ngoài trang chủ dùng nó. */
    gallery: [
      { src: "assets/img/work-tp-group-fig-projects-vi.webp",          w: 2400, h: 3333 },
      { src: "assets/img/work-tp-group-fig-contact-vi.webp",           w: 2400, h: 2618 },
      { src: "assets/img/work-tp-group-fig-products-infra-vi.webp",    w: 2400, h: 3977 },
      { src: "assets/img/work-tp-group-fig-projects-it-vi.webp",       w: 2400, h: 3333 },
      { src: "assets/img/work-tp-group-fig-products-security-vi.webp", w: 2400, h: 3395 },
      { src: "assets/img/work-tp-group-fig-products-services-vi.webp", w: 2400, h: 3395 },
      { src: "assets/img/work-tp-group-fig-projects-en.webp",          w: 2400, h: 3333 },
      { src: "assets/img/work-tp-group-fig-contact-en.webp",           w: 2400, h: 2618 },
      { src: "assets/img/work-tp-group-fig-products-infra-en.webp",    w: 2400, h: 3977 },
      { src: "assets/img/work-tp-group-fig-products-security-en.webp", w: 2400, h: 3395 }
    ],
    live: "",
    summary: {
      vi: "Website LandingPage về TP-Group, doanh nghiệp về công nghệ thông tin và truyền thông.",
      en: "A landing page website for TP-Group, an information technology and communications company."
    },
    challenge: {
      vi: "Thiết kế website landingpage giới thiệu về doanh nghiệp TP-GROUP, gồm các tiêu chí sau:",
      en: "Design a landing page website introducing TP-GROUP, meeting these criteria:"
    },
    criteria: {
      vi: [
        "Website theo style business",
        "Nghiên cứu về doanh nghiệp để lấy thông tin của doanh nghiệp",
        "Đáp ứng có module giới thiệu, module về sản phẩm"
      ],
      en: [
        "A business-style website",
        "Researching the company to gather its information",
        "An about module and a products module"
      ]
    },
    tasks: {
      vi: [
        "Trao đổi với khách hàng; tiếp nhận yêu cầu, xác định phạm vi và lập kế hoạch triển khai dự án Website.",
        "Nghiên cứu doanh nghiệp: lĩnh vực công nghệ thông tin và truyền thông của TP Group, để định hướng nội dung và cấu trúc website.",
        "Quản lý cấu trúc website: Trang chủ, Giới thiệu, Dự án (có bộ lọc theo lĩnh vực), Sản phẩm theo nhóm (Hạ tầng CNTT, An toàn thông tin, Dịch vụ tích hợp và tư vấn), Liên hệ; hai ngôn ngữ Việt và Anh.",
        "Điều phối nhân sự và các bên liên quan trong quá trình phát triển Website; điều phối, quản lý team Design, team Dev.",
        "Theo dõi tiến độ từng trang và từng ngôn ngữ, kiểm soát chất lượng thiết kế và sản phẩm trước khi gửi khách hàng.",
        "Quản lý quá trình bàn giao sản phẩm: tổng hợp phản hồi của khách hàng, chuyển cho đội thực hiện và xác nhận lại khi hoàn tất.",
        "Chịu trách nhiệm với kết quả đầu ra của sản phẩm."
      ],
      en: [
        "Talked with the client; took in requirements, set the scope and planned the delivery of the Website project.",
        "Researched the company: TP Group's information technology and communications business, to direct the content and structure of the website.",
        "Managed the website structure: Home, About, Projects (with a filter by field), Products by group (IT Infrastructure, Information Security, Integration and Consulting Services), Contact; in Vietnamese and English.",
        "Coordinated people and stakeholders during Website development; coordinated and managed the Design and Dev teams.",
        "Tracked progress page by page and language by language, and controlled design and product quality before sending to the client.",
        "Managed the product handover: collected the client's feedback, passed it to the delivery team and confirmed again when done.",
        "Took responsibility for the product's output."
      ]
    },
    approach: {
      vi: "Chốt phạm vi và kế hoạch ngay khi tiếp nhận yêu cầu, sau đó điều phối nhân sự và các bên liên quan, theo dõi tiến độ, kiểm soát chất lượng và quản lý khâu bàn giao.",
      en: "Fixed scope and plan as soon as the requirements came in, then coordinated people and stakeholders, tracked the schedule, controlled quality, and managed handover."
    },
    metrics: [
      { value: "66", label: { vi: "khung thiết kế", en: "design frames" } },
      { value: "2", label: { vi: "nền tảng", en: "platforms" } }
    ]
  },
  {
    id: "thong-ke-ttdl",
    year: "2025",
    title: "Thống kê dữ liệu vào TTDL Quốc gia",
    role: { vi: "Team Lead Design / Business Analyst", en: "Team Lead Design / Business Analyst" },
    stack: ["Figma", "Visual Code", "Word", "Excel"],
    poster: "assets/img/work-thong-ke-ttdl.jpg",
    /* Mỗi ảnh là NGUYÊN MỘT FRAME màn hình xuất từ file Figma Thống kê dữ liệu
       (không cắt widget, không mockup). Ba mockup cũ vẫn nằm trong assets/img.
       poster ở trên vẫn giữ vì danh sách ngoài trang chủ dùng nó. */
    gallery: [
      { src: "assets/img/work-thong-ke-ttdl-fig-danh-sach-ban-ghi.webp", w: 2880, h: 2260 },
      { src: "assets/img/work-thong-ke-ttdl-fig-tong-quan.webp",         w: 2880, h: 5962 },
      { src: "assets/img/work-thong-ke-ttdl-fig-tuan.webp",              w: 2880, h: 4386 },
      { src: "assets/img/work-thong-ke-ttdl-fig-ngay.webp",              w: 2880, h: 4380 },
      { src: "assets/img/work-thong-ke-ttdl-fig-nam.webp",               w: 2880, h: 4304 },
      { src: "assets/img/work-thong-ke-ttdl-fig-doi-soat-thang.webp",    w: 2880, h: 4656 },
      { src: "assets/img/work-thong-ke-ttdl-fig-doi-soat-tuan.webp",     w: 2880, h: 2912 },
      { src: "assets/img/work-thong-ke-ttdl-fig-doi-soat-nam.webp",      w: 2880, h: 2478 },
      { src: "assets/img/work-thong-ke-ttdl-fig-ban-ghi-chi-tiet.webp",  w: 2880, h: 2868 },
      { src: "assets/img/work-thong-ke-ttdl-fig-ban-ghi-loc.webp",       w: 2880, h: 2260 },
      { src: "assets/img/work-thong-ke-ttdl-fig-throughput.webp",        w: 2880, h: 2260 }
    ],
    live: "",
    summary: {
      vi: "Website nội bộ của Bộ Công An, thống kê dữ liệu của Trung Tâm Dữ Liệu Quốc Gia.",
      en: "An internal website of the Ministry of Public Security, tracking data statistics for the National Data Center."
    },
    challenge: {
      vi: "Thiết kế website nội bộ thống kê dữ liệu ra/vào của quốc gia, gồm các tiêu chí sau:",
      en: "Design an internal website tracking the nation's incoming and outgoing data, meeting these criteria:"
    },
    criteria: {
      vi: [
        "Giao diện dễ sử dụng",
        "Có lưu log việc chuyển dữ liệu"
      ],
      en: [
        "An easy-to-use interface",
        "Logging of data transfers"
      ]
    },
    tasks: {
      vi: [
        "Gặp mặt, trao đổi với khách hàng",
        "Định hướng thiết kế dashboard thống kê theo ngày, tuần, tháng và năm.",
        "Định hướng thiết kế bảng đối soát theo ngày, tuần, tháng, năm và dòng chi tiết mở rộng.",
        "Định hướng thiết kế danh sách bản ghi: bộ lọc thời gian, tooltip, dòng mở rộng hiển thị XML và báo cáo throughput.",
        "Điều phối, quản lý team Design, team Dev",
        "Chịu trách nhiệm với kết quả đầu ra của sản phẩm"
      ],
      en: [
        "Met and talked with the client",
        "Set the design direction for the statistics dashboards by day, week, month and year.",
        "Set the design direction for the reconciliation tables by day, week, month and year, with expandable detail rows.",
        "Set the design direction for the record list: time filters, tooltips, rows that expand to show XML, and the throughput report.",
        "Coordinated and managed the Design and Dev teams",
        "Took responsibility for the product's output"
      ]
    },
    metrics: [
      { value: "37", label: { vi: "khung thiết kế", en: "design frames" } },
      { value: "3", label: { vi: "bộ lọc", en: "filter axes" } }
    ]
  },

  /* --- Dự án lấy từ CV, CHƯA có ảnh ------------------------------------------
     Cố tình không khai poster/gallery: ảnh chưa có thì để trống, không dùng ảnh
     của dự án khác. Khi có ảnh thật, thêm `poster` (và `gallery` nếu có bộ ảnh)
     theo mẫu các dự án ở trên là khung ảnh tự hiện lại.
     year "2025+" / "2024+": CV chỉ ghi mốc bắt đầu công việc (GTSC 03/2025,
     Freelance 01/2024), không ghi năm từng dự án. */
  {
    id: "v01",
    year: "2025+",
    title: "V01 — Cổng thông tin quốc gia (Bộ Công an)",
    role: { vi: "Team Lead Design", en: "Team Lead Design" },
    stack: ["UI/UX Design", "Team Leadership", "Portal"],
    /* Nguyên một frame màn hình từ file Figma V01 (trang PC-Minh và Mobile-Minh,
       không cắt widget): tám màn desktop rồi bốn màn iPhone. Màn di động cao
       4-5 lần rộng nên ở dải ngang là dải hẹp; bấm vào để xem phóng to. */
    gallery: [
      { src: "assets/img/work-v01-fig-pc-tham-van.webp",        w: 2880, h: 4050 },
      { src: "assets/img/work-v01-fig-pc-chi-tiet-du-thao.webp", w: 2880, h: 4494 },
      { src: "assets/img/work-v01-fig-pc-lay-y-kien.webp",      w: 2880, h: 5190 },
      { src: "assets/img/work-v01-fig-pc-gop-y.webp",           w: 2880, h: 5634 },
      { src: "assets/img/work-v01-fig-pc-du-thao-quy.webp",     w: 2880, h: 5514 },
      { src: "assets/img/work-v01-fig-pc-hoi-dap.webp",         w: 2880, h: 3926 },
      { src: "assets/img/work-v01-fig-pc-van-ban.webp",         w: 2880, h: 3722 },
      { src: "assets/img/work-v01-fig-pc-bai-viet.webp",        w: 2880, h: 5392 },
      { src: "assets/img/work-v01-fig-mobile-tham-van.webp",    w: 1170, h: 5565 },
      { src: "assets/img/work-v01-fig-mobile-du-thao.webp",     w: 1170, h: 5856 },
      { src: "assets/img/work-v01-fig-mobile-video.webp",       w: 1170, h: 5046 },
      { src: "assets/img/work-v01-fig-mobile-audio.webp",       w: 1170, h: 4947 }
    ],
    live: "",
    summary: {
      vi: "Cổng thông tin quốc gia của Bộ Công an; dẫn dắt đội Design từ định hướng UI/UX đến kiểm soát chất lượng đầu ra.",
      en: "A national information portal of the Ministry of Public Security; leading the Design team from UI/UX direction to output quality control."
    },
    challenge: {
      vi: "Thiết kế cấu trúc và giao diện cho cổng thông tin quốc gia của Bộ Công an, do một đội Design cùng thực hiện.",
      en: "Design the structure and interface of the national information portal of the Ministry of Public Security, delivered by a Design team."
    },
    tasks: {
      vi: [
        "Dẫn dắt và điều phối đội ngũ Design trong quá trình triển khai dự án; chia việc theo các nhóm chức năng của cổng: tham vấn chính sách, lấy ý kiến dự thảo, hỏi đáp pháp luật, cơ sở dữ liệu văn bản, multimedia.",
        "Định hướng giải pháp UI/UX và cấu trúc giao diện cổng thông tin quốc gia: bố cục trang, thanh điều hướng và cách trình bày nội dung dài.",
        "Định hướng thiết kế phân hệ tham vấn chính sách và lấy ý kiến dự thảo: danh sách dự thảo, trang chi tiết văn bản dự thảo và biểu mẫu góp ý.",
        "Định hướng thiết kế phân hệ hỏi đáp pháp luật, cơ sở dữ liệu văn bản có tìm kiếm, trang bài viết và phần multimedia (video, audio).",
        "Định hướng bộ giao diện cho cả bản máy tính và bản di động (iPhone) trên cùng một bộ chức năng.",
        "Phân công công việc cho từng thành viên, review thiết kế và kiểm soát chất lượng đầu ra.",
        "Phối hợp với các bộ phận liên quan trong quá trình phát triển sản phẩm."
      ],
      en: [
        "Led and coordinated the Design team through delivery; split the work by the portal's functional groups: policy consultation, draft-for-comment, legal Q&A, document database, multimedia.",
        "Set the UI/UX solution and the interface structure of the national information portal: page layout, navigation bar and how long content is presented.",
        "Directed the design of policy consultation and draft-for-comment: draft lists, draft document detail pages and the comment form.",
        "Directed the design of legal Q&A, the searchable document database, article pages and multimedia (video, audio).",
        "Directed the interface set for both the desktop and the mobile (iPhone) versions of the same features.",
        "Assigned work to each member, reviewed designs and controlled output quality.",
        "Worked with the related departments during product development."
      ]
    },
    approach: {
      vi: "Định hướng giải pháp UI/UX và cấu trúc giao diện cổng thông tin trước, sau đó phân công cho đội Design, review thiết kế và kiểm soát chất lượng đầu ra, song song phối hợp với các bộ phận liên quan trong quá trình phát triển.",
      en: "Set the UI/UX solution and the portal's interface structure first, then assigned the Design team, reviewed designs and controlled output quality, while working with the relevant departments during development."
    }
  },
  {
    id: "du-an-175",
    year: "2025+",
    title: "175 — Dự án nội bộ C12 (Bộ Công an)",
    role: { vi: "Lead Team Design", en: "Lead Team Design" },
    stack: ["UI/UX Design", "Team Leadership", "Internal system"],
    /* Nguyên một frame màn hình từ file Figma dự án 175 (không cắt widget) */
    gallery: [
      { src: "assets/img/work-du-an-175-fig-user-detail.webp",       w: 1440, h: 1024 },
      { src: "assets/img/work-du-an-175-fig-permissions.webp",       w: 1440, h: 1024 },
      { src: "assets/img/work-du-an-175-fig-user-edit.webp",         w: 1440, h: 1024 },
      { src: "assets/img/work-du-an-175-fig-group-members.webp",     w: 1440, h: 1024 },
      { src: "assets/img/work-du-an-175-fig-add-members-modal.webp", w: 1440, h: 1024 },
      { src: "assets/img/work-du-an-175-fig-add-group-modal.webp",   w: 1440, h: 1024 },
      { src: "assets/img/work-du-an-175-fig-user-filter.webp",       w: 1440, h: 1024 },
      { src: "assets/img/work-du-an-175-fig-sync-progress.webp",     w: 1440, h: 1024 },
      { src: "assets/img/work-du-an-175-fig-group-info.webp",        w: 1440, h: 1024 },
      { src: "assets/img/work-du-an-175-fig-user-list.webp",         w: 1440, h: 1024 },
      { src: "assets/img/work-du-an-175-fig-notifications.webp",     w: 1440, h: 1524 },
      { src: "assets/img/work-du-an-175-fig-login.webp",             w: 1440, h: 960 }
    ],
    live: "",
    summary: {
      vi: "Dự án nội bộ của C12, Bộ Công an; dẫn dắt đội Design triển khai giải pháp giao diện.",
      en: "An internal project of C12, Ministry of Public Security; leading the Design team in delivering the interface solution."
    },
    challenge: {
      vi: "Triển khai giải pháp giao diện cho dự án nội bộ 175 của C12, Bộ Công an.",
      en: "Deliver the interface solution for project 175, an internal project of C12, Ministry of Public Security."
    },
    tasks: {
      vi: [
        "Dẫn dắt đội ngũ Design triển khai giải pháp giao diện cho dự án nội bộ C12 (Bộ Công an).",
        "Phân công công việc và định hướng thiết kế theo từng nhóm màn hình: quản lý người dùng, phân quyền, nhóm người dùng, thông báo và đăng nhập.",
        "Định hướng thiết kế luồng quản lý người dùng: danh sách và bộ lọc, thông tin người dùng, chỉnh sửa, phân quyền và trạng thái đồng bộ.",
        "Định hướng thiết kế luồng nhóm người dùng: danh sách thành viên, thêm thành viên, thêm nhóm mới và thông tin nhóm.",
        "Review sản phẩm của từng thành viên: đối chiếu với định hướng, yêu cầu chỉnh sửa và thống nhất chuẩn giao diện chung.",
        "Kiểm soát chất lượng thiết kế: tính nhất quán, các trạng thái và hộp thoại của từng màn hình.",
        "Phối hợp với các bộ phận liên quan trong quá trình triển khai."
      ],
      en: [
        "Led the Design team in delivering the interface solution for the internal C12 project (Ministry of Public Security).",
        "Assigned work and set the design direction by screen group: user management, permissions, user groups, notifications and sign-in.",
        "Directed the user-management flow: list and filters, user information, editing, permissions and sync status.",
        "Directed the user-group flow: member list, adding members, adding a new group and group information.",
        "Reviewed each member's work: checked it against the direction, requested changes and agreed the shared interface standards.",
        "Controlled design quality: consistency, states and dialogs of every screen.",
        "Worked with the related departments during delivery."
      ]
    },
    approach: {
      vi: "Định hướng thiết kế và phân công công việc cho đội Design, review sản phẩm ở từng bước để kiểm soát chất lượng, đồng thời phối hợp với các bộ phận liên quan trong suốt quá trình triển khai.",
      en: "Set the design direction and assigned work to the Design team, reviewed deliverables at each step to control quality, and worked with the relevant departments throughout delivery."
    }
  },
  {
    id: "du-an-422",
    year: "2025+",
    title: "422 — Đề án Chuyển đổi số trong hoạt động tố tụng hình sự và thi hành án hình sự (C01 – Bộ Công an)",
    role: { vi: "Supervisor Project Manager / Lead Team Design", en: "Supervisor Project Manager / Lead Team Design" },
    stack: ["Project Management", "UI/UX Design", "Digital transformation"],
    /* Nguyên một frame màn hình từ file Figma dự án 422 (giao diện tối, rộng 1920) */
    gallery: [
      { src: "assets/img/work-du-an-422-fig-dashboard.webp",          w: 1920, h: 1453 },
      { src: "assets/img/work-du-an-422-fig-giao-dich.webp",          w: 1920, h: 1080 },
      { src: "assets/img/work-du-an-422-fig-ho-so-list.webp",         w: 1920, h: 1080 },
      { src: "assets/img/work-du-an-422-fig-ho-so-detail.webp",       w: 1920, h: 1668 },
      { src: "assets/img/work-du-an-422-fig-advanced-search.webp",    w: 1920, h: 1080 },
      { src: "assets/img/work-du-an-422-fig-compare-dialog.webp",     w: 1920, h: 1080 },
      { src: "assets/img/work-du-an-422-fig-alert-detail.webp",       w: 1920, h: 1558 },
      { src: "assets/img/work-du-an-422-fig-alert-list.webp",         w: 1920, h: 1080 },
      { src: "assets/img/work-du-an-422-fig-catalog.webp",            w: 1920, h: 1089 },
      { src: "assets/img/work-du-an-422-fig-transaction-detail.webp", w: 1920, h: 1080 },
      { src: "assets/img/work-du-an-422-fig-reconcile.webp",          w: 1920, h: 1255 },
      { src: "assets/img/work-du-an-422-fig-user-detail.webp",        w: 1920, h: 1080 }
    ],
    live: "",
    summary: {
      vi: "Đề án chuyển đổi số của C01, Bộ Công an trong hoạt động tố tụng hình sự và thi hành án hình sự; vừa giám sát quản lý dự án vừa dẫn dắt đội Design.",
      en: "A digital transformation program of C01, Ministry of Public Security, for criminal proceedings and criminal judgment enforcement; supervising project management while leading the Design team."
    },
    challenge: {
      vi: "Triển khai đề án chuyển đổi số trong hoạt động tố tụng hình sự và thi hành án hình sự của C01, Bộ Công an, với yêu cầu theo sát tiến độ, chất lượng và xử lý kịp thời các vấn đề phát sinh.",
      en: "Deliver the digital transformation program for criminal proceedings and criminal judgment enforcement of C01, Ministry of Public Security, with close tracking of schedule and quality and timely handling of issues as they arise."
    },
    tasks: {
      vi: [
        "Giám sát và điều phối hoạt động quản lý dự án thuộc đề án chuyển đổi số trong hoạt động tố tụng hình sự và thi hành án hình sự (C01, Bộ Công an).",
        "Theo dõi tiến độ và chất lượng triển khai, kiểm tra đầu ra của các nhóm thực hiện.",
        "Dẫn dắt đội ngũ Design, định hướng giải pháp UI/UX cho phần mềm điều hành hồ sơ tố tụng điện tử (giao diện tối).",
        "Định hướng các màn hình chính: trang chủ theo từng cơ quan, giao dịch giữa Điều tra và Viện kiểm sát, danh sách và chi tiết hồ sơ tố tụng, tìm kiếm nâng cao, so sánh metadata giữa các phiên bản.",
        "Định hướng phần cảnh báo (danh sách, chi tiết, trạng thái quá hạn), chi tiết giao dịch lỗi kèm màn đối soát, danh mục dùng chung và quản lý người dùng.",
        "Kiểm soát chất lượng thiết kế: thống nhất bộ thành phần, kiểm tra các trạng thái và hộp thoại trước khi bàn giao.",
        "Phối hợp với PM, khách hàng và các bộ phận chuyên môn.",
        "Theo dõi tiến độ và xử lý vấn đề phát sinh."
      ],
      en: [
        "Supervised and coordinated project management for the digital transformation program in criminal proceedings and criminal judgment enforcement (C01, Ministry of Public Security).",
        "Tracked delivery schedule and quality and checked the output of the working teams.",
        "Led the Design team and set the UI/UX solution for the electronic case-file management software (dark interface).",
        "Directed the main screens: home by agency, transactions between Investigation and the Procuracy, case lists and details, advanced search, metadata comparison between versions.",
        "Directed the alerts area (list, details, overdue status), failed-transaction details with the reconciliation screen, shared catalogues and user management.",
        "Controlled design quality: aligned the component set and checked states and dialogs before handover.",
        "Worked with the PM, the client and the specialist departments.",
        "Tracked progress and handled issues as they came up."
      ]
    },
    approach: {
      vi: "Hai vai trò song song: ở góc quản lý, giám sát tiến độ và chất lượng triển khai cùng PM; ở góc thiết kế, định hướng UI/UX và kiểm soát chất lượng đội Design. Khách hàng và các bộ phận chuyên môn được kết nối để vấn đề phát sinh được xử lý kịp thời.",
      en: "Two roles in parallel: on the management side, supervising schedule and delivery quality alongside the PM; on the design side, setting the UI/UX direction and controlling the Design team's quality. The client and specialist departments were kept connected so issues were handled in time."
    }
  },
  {
    id: "btc-dashboard",
    year: "2024+",
    title: "Bộ Tài chính — Hệ thống Dashboard và báo cáo dữ liệu",
    role: { vi: "UI/UX Designer", en: "UI/UX Designer" },
    stack: ["UI/UX Design", "Dashboard", "Data Visualization"],
    live: "",
    summary: {
      vi: "Dashboard, biểu đồ và bảng dữ liệu phục vụ quản trị và theo dõi thông tin.",
      en: "Dashboards, charts, and data tables for management and information tracking."
    },
    challenge: {
      vi: "Thiết kế hệ thống Dashboard và báo cáo dữ liệu cho Bộ Tài chính, phục vụ quản trị và theo dõi thông tin theo yêu cầu nghiệp vụ.",
      en: "Design the Dashboard and data reporting system for the Ministry of Finance, serving management and information tracking according to business requirements."
    },
    tasks: {
      vi: [
        "Triển khai dự án theo hình thức freelance: tiếp nhận yêu cầu về nhu cầu theo dõi và quản trị thông tin của Bộ Tài chính.",
        "Thiết kế Dashboard tổng hợp phục vụ quản trị, theo dõi thông tin.",
        "Thiết kế biểu đồ và bảng dữ liệu cho từng loại số liệu cần theo dõi.",
        "Tối ưu phân cấp thông tin theo yêu cầu nghiệp vụ: đưa số liệu quan trọng lên trước, phần chi tiết ở tầng sau.",
        "Trực quan hóa dữ liệu: chọn dạng biểu đồ và bảng phù hợp với từng loại số liệu.",
        "Tổ chức bố cục giao diện để người quản trị theo dõi nhiều chỉ số trên cùng một màn hình mà vẫn dễ đọc.",
        "Phối hợp với khách hàng và đội ngũ phát triển để đảm bảo chất lượng sản phẩm và tiến độ bàn giao."
      ],
      en: [
        "Delivered the project as freelance work: took in the requirements for how the Ministry of Finance tracks and manages information.",
        "Designed the summary dashboard for management and tracking of information.",
        "Designed the charts and data tables for each kind of figure to be tracked.",
        "Tuned the information hierarchy to the business requirements: key figures first, detail on a deeper level.",
        "Visualised the data: chose chart and table forms that suit each kind of figure.",
        "Organised the layout so managers can follow many indicators on one screen and still read it easily.",
        "Worked with the client and the development team to ensure product quality and delivery on schedule."
      ]
    },
    approach: {
      vi: "Sắp xếp phân cấp thông tin, cách trực quan hóa dữ liệu và bố cục giao diện bám theo yêu cầu nghiệp vụ, để người quản trị nhìn vào là theo dõi được thông tin cần thiết.",
      en: "Arranged the information hierarchy, data visualisation, and interface layout around the business requirements, so administrators can track the information they need at a glance."
    }
  },
  {
    id: "canifa",
    year: "2024+",
    title: "Canifa — Website và Landing Page chiến dịch",
    role: { vi: "UI/UX Designer", en: "UI/UX Designer" },
    stack: ["UI/UX Design", "Website", "Landing Page"],
    live: "",
    summary: {
      vi: "Website và Landing Page phục vụ hoạt động truyền thông và kinh doanh của chiến dịch.",
      en: "A website and campaign landing pages serving communications and sales."
    },
    challenge: {
      vi: "Thiết kế giao diện Website và Landing Page phục vụ hoạt động truyền thông, kinh doanh, theo định hướng thương hiệu.",
      en: "Design the interface of a Website and Landing Pages for communications and sales activity, in line with the brand direction."
    },
    tasks: {
      vi: [
        "Triển khai dự án theo hình thức freelance: tiếp nhận yêu cầu thiết kế Website và Landing Page cho hoạt động truyền thông, kinh doanh của Canifa.",
        "Thiết kế giao diện Website và Landing Page cho các chiến dịch.",
        "Xây dựng bố cục giao diện từng trang: thứ tự các khối nội dung, nhịp đọc và vị trí các lời kêu gọi hành động.",
        "Tối ưu trải nghiệm người dùng trên Website và Landing Page chiến dịch.",
        "Phối hợp hoàn thiện thiết kế theo định hướng thương hiệu: đối chiếu với bộ nhận diện và yêu cầu hình ảnh của khách hàng.",
        "Phối hợp với khách hàng và đội ngũ phát triển để đảm bảo chất lượng sản phẩm và tiến độ bàn giao."
      ],
      en: [
        "Delivered the project as freelance work: took in the design requirements for the Website and Landing Pages for Canifa's communication and sales activities.",
        "Designed the Website and Landing Page interfaces for the campaigns.",
        "Built the page layouts: order of content blocks, reading rhythm and placement of calls to action.",
        "Improved the user experience on the Website and the campaign Landing Pages.",
        "Worked on finishing the design to the brand direction: checking against the client's identity and visual requirements.",
        "Worked with the client and the development team to ensure product quality and delivery on schedule."
      ]
    },
    approach: {
      vi: "Dựng bố cục cho từng trang theo mục tiêu truyền thông và kinh doanh, tối ưu trải nghiệm người dùng, rồi phối hợp hoàn thiện thiết kế sao cho đúng định hướng thương hiệu.",
      en: "Laid out each page around its communications and sales goal, improved the user experience, then worked to finish the design so it matches the brand direction."
    }
  },
  {
    id: "nam-long-emc",
    year: "2024+",
    title: "Nam Long EMC — Website doanh nghiệp",
    role: { vi: "Project Manager", en: "Project Manager" },
    stack: ["Project Management", "Website"],
    live: "",
    summary: {
      vi: "Website doanh nghiệp; quản lý kế hoạch, phạm vi và tiến độ từ lúc tiếp nhận yêu cầu đến khi bàn giao.",
      en: "A corporate website; managing plan, scope, and schedule from receiving requirements to handover."
    },
    challenge: {
      vi: "Triển khai website doanh nghiệp cho Nam Long EMC, với kế hoạch và phạm vi rõ ràng, chất lượng sản phẩm bàn giao được kiểm soát.",
      en: "Deliver a corporate website for Nam Long EMC, with a clear plan and scope and a controlled quality of the delivered product."
    },
    tasks: {
      vi: [
        "Quản lý kế hoạch và phạm vi triển khai dự án Website: xác định phạm vi, chia giai đoạn và các mốc thời gian.",
        "Điều phối nguồn lực, kết nối khách hàng với đội ngũ thực hiện: làm đầu mối tiếp nhận ý kiến của khách và chuyển cho đội thiết kế, phát triển.",
        "Theo dõi tiến độ, xử lý vấn đề phát sinh trong quá trình triển khai.",
        "Kiểm soát chất lượng sản phẩm bàn giao trước khi gửi khách hàng.",
        "Làm việc với khách hàng trong giai đoạn bàn giao để chốt các điều chỉnh cuối cùng."
      ],
      en: [
        "Managed the plan and scope of the Website project: set the scope, split it into phases and milestones.",
        "Coordinated resources and connected the client with the delivery team: the single point for taking the client's feedback and passing it to the design and development team.",
        "Tracked progress and handled issues as they came up during delivery.",
        "Controlled the quality of the deliverables before handing them to the client.",
        "Worked with the client during handover to settle the final adjustments."
      ]
    },
    approach: {
      vi: "Chốt kế hoạch và phạm vi, làm cầu nối giữa khách hàng và đội thực hiện, theo dõi tiến độ, xử lý kịp thời vấn đề phát sinh và kiểm soát chất lượng trước khi bàn giao.",
      en: "Fixed the plan and scope, bridged the client and the delivery team, tracked the schedule, handled issues in time, and controlled quality before handover."
    }
  }
];

/* --- Thứ tự hiển thị ------------------------------------------------------
   Mới nhất lên đầu. Mốc so sánh là năm CUỐI của trường year: với một khoảng
   như "2022-2023" thì 2023 mới là lần gần đây nhất dự án còn được động tới,
   lấy năm đầu sẽ đẩy nó xuống sâu hơn thực tế.

   Sắp ở đây chứ không ở work.js, vì case.js cũng đọc chính mảng này để dựng
   liên kết "dự án tiếp theo". Sắp ở một nơi mà không sắp ở nơi kia thì thứ tự
   trong danh sách và thứ tự khi bấm sang dự án sau sẽ lệch nhau.

   Array.sort ổn định, nên các dự án cùng năm giữ nguyên thứ tự viết trong file
   — muốn đổi ngôi giữa chúng thì đổi vị trí khối ở trên. */
(function (list) {
  function latestYear(project) {
    var found = String(project.year).match(/\d{4}/g);
    return found ? Number(found[found.length - 1]) : 0;
  }
  list.sort(function (a, b) { return latestYear(b) - latestYear(a); });
})(window.PF.projects);
