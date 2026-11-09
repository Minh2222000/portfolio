/* ==========================================================================
   projects.js — NGUỒN DUY NHẤT cho danh sách dự án.
   Sửa nội dung ở đây, index.html và project.html tự dựng lại theo.
   Không dùng JSON + fetch để trang mở thẳng bằng file:// vẫn chạy.

   Số liệu trong phần metrics lấy trực tiếp từ file Figma qua REST API
   (số trang, số khung, số module) — đều là con số đếm được, không ước lượng.

   Mỗi dự án:
     id        chuỗi không dấu, dùng làm ?id= trên project.html
     year      thời gian làm dự án: một năm ("2025") hoặc một khoảng ("2022-2023")
     title     tên hiển thị
     role      vai trò trong dự án            { vi, en }
     stack     mảng công cụ và nền tảng, hiện thành thẻ nhãn
     poster    ảnh xuất từ chính khung Figma của dự án
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
   ========================================================================== */

window.PF = window.PF || {};

window.PF.projects = [
  {
    id: "getfly",
    year: "2022-2023",
    title: "Getfly CRM - G Version",
    role: { vi: "UI/UX Designer, BA", en: "UI/UX Designer, BA" },
    stack: ["Figma", "Visual Code", "Word", "Excel"],
    poster: "assets/img/work-getfly.jpg",
    /* Ảnh mockup dựng sẵn, cả ba đều đã tách nền. poster ở trên vẫn giữ nguyên
       vì danh sách ngoài trang chủ dùng nó. */
    gallery: [
      "assets/img/work-getfly-iphone-list.webp",
      "assets/img/work-getfly-iphone-home.webp",
      "assets/img/work-getfly-iphone-splash.webp"
    ],
    galleryCutout: true,
    live: "",
    summary: {
      vi: "App CRM, quản lý thông tin khách hàng.",
      en: "A CRM app for managing customer information."
    },
    challenge: {
      vi: "Thiết kế phần mềm app CRM, bao gồm các tiêu chí:",
      en: "Design a CRM app, meeting these criteria:"
    },
    criteria: {
      vi: [
        "Giao diện nhận diện thương hiệu",
        "Làm rõ các module liên quan đến khách hàng"
      ],
      en: [
        "A brand-recognizable interface",
        "Clarity in the customer-related modules"
      ]
    },
    tasks: {
      vi: [
        "Tiếp nhận yêu cầu từ khách hàng",
        "Đáp ứng yêu cầu theo UC",
        "Chịu trách nhiệm với kết quả đầu ra của sản phẩm"
      ],
      en: [
        "Receiving requirements from clients",
        "Fulfilling requirements according to use cases",
        "Taking responsibility for the product's output"
      ]
    },
    metrics: [
      { value: "712", label: { vi: "khung thiết kế", en: "design frames" } },
      { value: "29", label: { vi: "phân hệ", en: "modules" } },
      { value: "107", label: { vi: "khung riêng phần khách hàng", en: "frames on customers alone" } }
    ]
  },
  {
    id: "h04",
    year: "2026",
    title: "Cổng thông tin và chứng thư số",
    role: { vi: "UI/UX Team Lead, BA, PO", en: "UI/UX Team Lead, BA, PO" },
    stack: ["Figma", "Visual Code", "Word", "Excel"],
    poster: "assets/img/work-h04.jpg",
    /* Ảnh mockup dựng sẵn, xuất từ file PSD. poster ở trên vẫn giữ nguyên vì
       danh sách ngoài trang chủ dùng nó. */
    gallery: [
      "assets/img/work-h04-tablet.jpg",
      "assets/img/work-h04-laptop.jpg",
      "assets/img/work-h04-laptop-day.jpg"
    ],
    live: "",
    /* Link Figma tạm ẩn — bỏ dấu chú thích dòng dưới là nút "Xem file Figma"
       hiện lại, không phải đi tìm lại link. */
    // figma: "https://www.figma.com/design/jezKPJUJabFLo9AnPzUYXv/H04?node-id=0-1&t=nANlHF7101zqYzMu-1",
    summary: {
      vi: "Cổng thông tin của Bộ Công An dành cho nhân dân.",
      en: "An information portal of the Ministry of Public Security for the people."
    },
    challenge: {
      vi: "Thiết kế cổng thông tin, bao gồm các tiêu chí:",
      en: "Design an information portal, meeting these criteria:"
    },
    criteria: {
      vi: [
        "Giao diện nhận diện thương hiệu Bộ Công An",
        "Đủ các mục thông tin"
      ],
      en: [
        "A Ministry of Public Security brand-recognizable interface",
        "Complete information sections"
      ]
    },
    tasks: {
      vi: [
        "Gặp mặt, trao đổi với khách hàng",
        "Điều phối, quản lý team Design, team Dev",
        "Chịu trách nhiệm với kết quả đầu ra của sản phẩm"
      ],
      en: [
        "Meeting and discussing with clients",
        "Coordinating and managing the Design and Dev teams",
        "Taking responsibility for the product's output"
      ]
    },
    metrics: [
      { value: "995", label: { vi: "khung thiết kế", en: "design frames" } },
      { value: "4", label: { vi: "nhóm người dùng", en: "user groups" } }
    ]
  },
  {
    id: "vinatex",
    year: "2025",
    title: "Hệ thống báo cáo Vinatex",
    role: { vi: "UI/UX Team Lead, BA", en: "UI/UX Team Lead, BA" },
    stack: ["Figma", "Visual Code", "Word", "Excel"],
    poster: "assets/img/work-vinatex.jpg",
    /* Bộ ảnh trộn hai loại: sáu ảnh chụp màn hình app (9:16, nền đặc nên giữ
       khung viền) và ba mockup máy tính (4:3, đã tách nền nên bỏ khung). */
    gallery: [
      { src: "assets/img/work-vinatex-app-1.webp", tall: true },
      { src: "assets/img/work-vinatex-app-2.webp", tall: true },
      { src: "assets/img/work-vinatex-app-3.webp", tall: true },
      { src: "assets/img/work-vinatex-app-4.webp", tall: true },
      { src: "assets/img/work-vinatex-app-5.webp", tall: true },
      { src: "assets/img/work-vinatex-app-6.webp", tall: true },
      { src: "assets/img/work-vinatex-imac.webp",    cutout: true },
      { src: "assets/img/work-vinatex-hp.webp",      cutout: true },
      { src: "assets/img/work-vinatex-macbook.webp", cutout: true }
    ],
    live: "",
    summary: {
      vi: "Hệ thống soạn, duyệt và theo dõi báo cáo cho người đại diện phần vốn, dựng riêng cho năm nền tảng.",
      en: "A system for drafting, approving, and tracking reports for capital representatives, designed for five platforms."
    },
    challenge: {
      vi: "Thiết kế website nội bộ cho doanh nghiệp Vinatex.",
      en: "Design an internal website for Vinatex."
    },
    tasks: {
      vi: [
        "Gặp gỡ, trao đổi với khách hàng",
        "Điều phối, quản lý team Design, team FE, team BE",
        "Đảm bảo, chịu trách nhiệm sản phẩm Desktop và App"
      ],
      en: [
        "Meeting and discussing with clients",
        "Coordinating and managing the Design, Frontend and Backend teams",
        "Ensuring and taking responsibility for both the desktop and app products"
      ]
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
    title: "Cổng Đổi mới sáng tạo",
    role: { vi: "UI/UX Team Lead, BA, PO", en: "UI/UX Team Lead, BA, PO" },
    stack: ["Figma", "Visual Code", "Word", "Excel"],
    poster: "assets/img/work-dmst.jpg",
    /* Ảnh mockup dựng sẵn, xuất từ file PSD. poster ở trên vẫn giữ nguyên vì
       danh sách ngoài trang chủ dùng nó. */
    gallery: [
      "assets/img/work-dmst-imac.webp",
      "assets/img/work-dmst-monitor.webp",
      "assets/img/work-dmst-mac-studio.webp"
    ],
    galleryCutout: true,
    live: "",
    summary: {
      vi: "Cổng thông tin công khai và khu quản trị đi kèm, dựng đủ cho máy tính, máy tính bảng và điện thoại.",
      en: "A public portal with its own admin area, designed out for desktop, tablet, and phone."
    },
    challenge: {
      vi: "Thiết kế cổng thông tin đổi mới sáng tạo cho Bộ Công An C12.",
      en: "Design an innovation portal for C12, Ministry of Public Security."
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
    role: { vi: "PO, UI/UX Team Lead, BA", en: "PO, UI/UX Team Lead, BA" },
    stack: ["Figma", "Visual Code", "Word", "Excel"],
    poster: "assets/img/work-web-gtel.jpg",
    /* Ảnh mockup dựng sẵn, cả ba đều đã tách nền. poster ở trên vẫn giữ nguyên
       vì danh sách ngoài trang chủ dùng nó. */
    gallery: [
      "assets/img/work-web-gtel-monitor.webp",
      "assets/img/work-web-gtel-macbook.webp",
      "assets/img/work-web-gtel-hp.webp"
    ],
    galleryCutout: true,
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
        "Điều phối, quản lý team Design, team FE",
        "Chịu trách nhiệm với kết quả đầu ra của sản phẩm"
      ],
      en: [
        "Meeting and discussing with clients",
        "Coordinating and managing the Design and Frontend teams",
        "Taking responsibility for the product's output"
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
    title: "Hệ thống thông tin quốc gia về đầu tư nước ngoài",
    role: { vi: "PO/PM, UI/UX Team Lead, BA", en: "PO/PM, UI/UX Team Lead, BA" },
    stack: ["Figma", "Visual Code", "Word", "Excel"],
    poster: "assets/img/work-fia-search.jpg",
    /* Ảnh mockup dựng sẵn, đã tách nền. poster ở trên vẫn giữ nguyên vì danh
       sách ngoài trang chủ dùng nó. */
    gallery: [
      "assets/img/work-fia-search-dell.webp",
      "assets/img/work-fia-search-dell-iso.webp",
      "assets/img/work-fia-search-zenbook.webp"
    ],
    galleryCutout: true,
    live: "",
    summary: {
      vi: "Website tra cứu và báo cáo tổng hợp về các hạng mục đầu tư.",
      en: "A website for looking up and reporting on investment items."
    },
    challenge: {
      vi: "Thiết kế website về tra cứu các hạng mục đầu tư, bao gồm các tiêu chí:",
      en: "Design a website for looking up investment items, meeting these criteria:"
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
        "Trao đổi với khách hàng",
        "Điều phối, quản lý team Design, team Dev",
        "Chịu trách nhiệm với kết quả đầu ra của sản phẩm"
      ],
      en: [
        "Discussing with clients",
        "Coordinating and managing the Design and Dev teams",
        "Taking responsibility for the product's output"
      ]
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
    role: { vi: "UI/UX Team Lead, BA", en: "UI/UX Team Lead, BA" },
    stack: ["Figma", "Visual Code", "Word", "Excel"],
    poster: "assets/img/work-logistics.jpg",
    /* Ảnh mockup dựng sẵn, cả ba đều đã tách nền. poster ở trên vẫn giữ nguyên
       vì danh sách ngoài trang chủ dùng nó. */
    gallery: [
      "assets/img/work-logistics-dell.webp",
      "assets/img/work-logistics-monitor.webp",
      "assets/img/work-logistics-mac-studio.webp"
    ],
    galleryCutout: true,
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
        "Điều phối, quản lý team Design",
        "Chịu trách nhiệm với đầu ra của sản phẩm"
      ],
      en: [
        "Discussing with clients",
        "Writing the SRS and user manuals",
        "Coordinating and managing the Design team",
        "Taking responsibility for the product's output"
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
    title: "BeLi Teacher",
    role: { vi: "UI/UX Team Lead, BA, PO", en: "UI/UX Team Lead, BA, PO" },
    stack: ["Figma", "Visual Code", "Word", "Excel"],
    poster: "assets/img/work-beli-teacher.jpg",
    /* Ảnh mockup dựng sẵn, cả ba đều đã tách nền. poster ở trên vẫn giữ nguyên
       vì danh sách ngoài trang chủ dùng nó. */
    gallery: [
      "assets/img/work-beli-teacher-macbook.webp",
      "assets/img/work-beli-teacher-hp.webp",
      "assets/img/work-beli-teacher-monitor.webp"
    ],
    galleryCutout: true,
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
        "Gặp gỡ, trao đổi với khách hàng",
        "Lên danh sách các tiêu chí theo yêu cầu từ phía khách hàng",
        "Điều phối, quản lý team Design, team Dev",
        "Làm tài liệu, biên bản bàn giao liên quan đến dự án",
        "Chịu trách nhiệm với kết quả đầu ra của sản phẩm"
      ],
      en: [
        "Meeting and discussing with clients",
        "Listing out the criteria requested by the client",
        "Coordinating and managing the Design and Dev teams",
        "Preparing documentation and handover records for the project",
        "Taking responsibility for the product's output"
      ]
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
    role: { vi: "UI/UX Team Lead, BA", en: "UI/UX Team Lead, BA" },
    stack: ["Figma", "Visual Code", "Word", "Excel"],
    poster: "assets/img/work-tich-hop-chia-se.jpg",
    /* Ảnh mockup dựng sẵn, đã tách nền. poster ở trên vẫn giữ nguyên vì danh
       sách ngoài trang chủ dùng nó. */
    gallery: [
      "assets/img/work-tich-hop-chia-se-mac-studio.webp",
      "assets/img/work-tich-hop-chia-se-macbook.webp",
      "assets/img/work-tich-hop-chia-se-monitor.webp"
    ],
    galleryCutout: true,
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
        "Điều phối, quản lý team Design, team Dev",
        "Chịu trách nhiệm với kết quả đầu ra của sản phẩm"
      ],
      en: [
        "Receiving information from clients",
        "Coordinating and managing the Design and Dev teams",
        "Taking responsibility for the product's output"
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
    role: { vi: "UI/UX Team Lead, BA, PO/PM", en: "UI/UX Team Lead, BA, PO/PM" },
    stack: ["Figma", "Visual Code", "Word", "Excel"],
    poster: "assets/img/work-hrm-gtsc.jpg",
    /* Ảnh mockup dựng sẵn. poster ở trên vẫn giữ nguyên vì danh sách ngoài
       trang chủ dùng nó. */
    gallery: [
      "assets/img/work-hrm-gtsc-tab.webp",
      "assets/img/work-hrm-gtsc-hp.webp",
      /* Ảnh này là ảnh chụp studio còn nguyên phông, không tách nền được — nên
         nó giữ khung viền trong khi hai ảnh trên bỏ. */
      { src: "assets/img/work-hrm-gtsc-macbook.webp", cutout: false }
    ],
    galleryCutout: true,
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
        "Điều phối team Design, team FE, team BE",
        "Quản lý kết quả đầu ra của sản phẩm"
      ],
      en: [
        "Meeting and communicating with clients",
        "Coordinating the Design, Frontend and Backend teams",
        "Managing the product's output"
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
    role: { vi: "UI/UX Team Lead, BA", en: "UI/UX Team Lead, BA" },
    stack: ["Figma", "Visual Code", "Word", "Excel"],
    poster: "assets/img/work-kho-ttdmst.jpg",
    /* Ảnh mockup dựng sẵn, cả ba đều đã tách nền. poster ở trên vẫn giữ nguyên
       vì danh sách ngoài trang chủ dùng nó. */
    gallery: [
      "assets/img/work-kho-ttdmst-tab.webp",
      "assets/img/work-kho-ttdmst-monitor.webp",
      "assets/img/work-kho-ttdmst-macbook.webp"
    ],
    galleryCutout: true,
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
        "Quản lý API, DB đầu ra",
        "Chịu trách nhiệm với sản phẩm"
      ],
      en: [
        "Coordinating the Design team",
        "Managing the output APIs and database",
        "Taking responsibility for the product"
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
    role: { vi: "UI/UX Team Lead, BA", en: "UI/UX Team Lead, BA" },
    stack: ["Figma", "Visual Code", "Word", "Excel"],
    poster: "assets/img/work-dmst-backoffice.jpg",
    /* Ảnh mockup dựng sẵn, cả ba đều đã tách nền. poster ở trên vẫn giữ nguyên
       vì danh sách ngoài trang chủ dùng nó. */
    gallery: [
      "assets/img/work-dmst-backoffice-monitor.webp",
      "assets/img/work-dmst-backoffice-pixelbook.webp",
      "assets/img/work-dmst-backoffice-mac-studio.webp"
    ],
    galleryCutout: true,
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
        "Đảm bảo, chịu trách nhiệm với sản phẩm"
      ],
      en: [
        "Managing and coordinating the Design, Frontend and Backend teams",
        "Ensuring and taking responsibility for the product"
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
    title: "DCIM — giám sát trung tâm dữ liệu",
    role: { vi: "UI/UX Team Lead, BA", en: "UI/UX Team Lead, BA" },
    stack: ["Figma", "Visual Code", "Word", "Excel"],
    poster: "assets/img/work-dcim.jpg",
    /* Ảnh mockup dựng sẵn, cả ba đều đã tách nền. poster ở trên vẫn giữ nguyên
       vì danh sách ngoài trang chủ dùng nó. */
    gallery: [
      "assets/img/work-dcim-imac.webp",
      "assets/img/work-dcim-mac-studio.webp",
      "assets/img/work-dcim-monitor.webp"
    ],
    galleryCutout: true,
    live: "",
    summary: {
      vi: "Website giám sát Rack của trung tâm dữ liệu quốc gia.",
      en: "A rack monitoring website for the National Data Center."
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
        "Gặp gỡ, trao đổi với khách hàng",
        "Điều phối, quản lý team Design, team FE",
        "Chịu trách nhiệm với kết quả đầu ra của sản phẩm"
      ],
      en: [
        "Meeting and discussing with clients",
        "Coordinating and managing the Design and Frontend teams",
        "Taking responsibility for the product's output"
      ]
    },
    metrics: [
      { value: "6", label: { vi: "bảng xếp hạng cùng màn", en: "boards per screen" } },
      { value: "3", label: { vi: "chiều phân tích", en: "analytical dimensions" } }
    ]
  },
  {
    id: "tp-group",
    year: "2025",
    title: "TP-GROUP",
    role: { vi: "PO/PM, UI/UX Team Lead, BA", en: "PO/PM, UI/UX Team Lead, BA" },
    stack: ["Figma", "Visual Code", "Word", "Excel"],
    poster: "assets/img/work-tp-group.jpg",
    /* Ảnh mockup dựng sẵn. work-tp-group-macbook là ảnh chụp studio còn
       nguyên phông, không tách nền được — nó giữ khung viền trong khi hai
       ảnh kia bỏ. poster ở trên vẫn giữ nguyên vì danh sách ngoài trang chủ
       dùng nó. */
    gallery: [
      "assets/img/work-tp-group-hp.webp",
      "assets/img/work-tp-group-tab.webp",
      { src: "assets/img/work-tp-group-macbook.webp", cutout: false }
    ],
    galleryCutout: true,
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
        "Trao đổi với khách hàng",
        "Nghiên cứu doanh nghiệp",
        "Điều phối, quản lý team Design, team Dev",
        "Chịu trách nhiệm với kết quả đầu ra của sản phẩm"
      ],
      en: [
        "Discussing with clients",
        "Researching the company",
        "Coordinating and managing the Design and Dev teams",
        "Taking responsibility for the product's output"
      ]
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
    role: { vi: "UI/UX Team Lead, BA", en: "UI/UX Team Lead, BA" },
    stack: ["Figma", "Visual Code", "Word", "Excel"],
    poster: "assets/img/work-thong-ke-ttdl.jpg",
    /* Ảnh mockup dựng sẵn, cả ba đều đã tách nền. poster ở trên vẫn giữ nguyên
       vì danh sách ngoài trang chủ dùng nó. */
    gallery: [
      "assets/img/work-thong-ke-ttdl-pixelbook.webp",
      "assets/img/work-thong-ke-ttdl-macbook.webp",
      "assets/img/work-thong-ke-ttdl-tab.webp"
    ],
    galleryCutout: true,
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
        "Điều phối, quản lý team Design, team Dev",
        "Chịu trách nhiệm với kết quả đầu ra của sản phẩm"
      ],
      en: [
        "Meeting and discussing with clients",
        "Coordinating and managing the Design and Dev teams",
        "Taking responsibility for the product's output"
      ]
    },
    metrics: [
      { value: "37", label: { vi: "khung thiết kế", en: "design frames" } },
      { value: "3", label: { vi: "bộ lọc", en: "filter axes" } }
    ]
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
