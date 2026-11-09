/* ==========================================================================
   i18n.js — TOÀN BỘ chữ hiển thị trên trang, cho cả tiếng Việt và tiếng Anh.

   Cách dùng trong HTML:
     <p data-i18n="hero.lead"></p>            đổ vào textContent
     <p data-i18n-html="about.manifesto"></p> đổ vào innerHTML (khi có thẻ b/strong)
     <input data-i18n-attr="placeholder:form.namePh">  đổ vào một thuộc tính

   Khoá viết phẳng theo kiểu "nhóm.tên" cho dễ tìm. Muốn thêm ngôn ngữ thì
   thêm một khối nữa cạnh vi và en, rồi thêm nút vào .lang trong index.html.
   ========================================================================== */

window.PF = window.PF || {};

window.PF.i18n = {
  vi: {
    "meta.title": "Hoàng Minh — Lập trình viên giao diện, chuyên chuyển động web",
    "meta.desc": "Tôi dựng lại những website từng đoạt giải và bắt chúng giữ 60 khung hình mỗi giây. Hà Nội, làm việc từ xa.",

    "nav.work": "Dự án",
    "nav.about": "Giới thiệu",
    "nav.cap": "Năng lực",
    "nav.contact": "Liên hệ",
    "nav.langLabel": "Chọn ngôn ngữ",
    "nav.themeToLight": "Chuyển sang giao diện sáng",
    "nav.themeToDark": "Chuyển sang giao diện tối",

    "loader.tag": "Đang dựng khung hình",

    "hero.where": "Hà Nội, Việt Nam",
    "hero.name1": "HOÀNG",
    "hero.name2": "MINH",
    "hero.lead": "Với hơn <strong>4 năm kinh nghiệm</strong> chuyên về UI/UX Designer, có kinh nghiệm về PO/PM.",
    "hero.scroll": "Cuộn xuống",

    "about.label": "#about",
    "about.title": "Định hướng phát triển",
    "about.manifesto": "Bản thân luôn sẵn sàng học cái mới, nhưng không học vì nó đang thịnh. Mỗi xu hướng đọc được đều phải trả lời một câu: nó giải quyết vấn đề gì của người đang dùng sản phẩm này? Sau thời gian học tập và phát triển bản thân trong nhiều vai trò, bản thân tin <b>tư duy quan trọng hơn công cụ</b>.",
    "about.cap": "Ảnh chân dung — thay file tại assets/img/portrait.svg",
    "about.k1": "Vai trò",
    "about.v1": "UI/UX Lead Team, PO/PM, BA",
    "about.k2": "Công cụ",
    "about.v2": "Figma, Framer, Visual Code, Jitter, PTS, AI",
    "about.k3": "Phương pháp",
    "about.v3": "User research, Design system, Usability testing",

    "work.label": "#work",
    "work.title": "Dự án",
    "work.more": "Xem thêm {n} dự án",
    "work.view": "Xem",
    "work.hint": "rê chuột",

    "cap.label": "#capabilities",
    "cap.title": "Kỹ năng, chuyên ngành của bản thân",
    "cap.k1": "Thiết kế",
    "cap.t1": "UI/UX Designer",
    "cap.b1": "Thiết kế trải nghiệm bắt đầu từ vấn đề người dùng, không phải từ giao diện đẹp. Wireframe, prototype, kiểm thử — rồi mới đến pixel cuối cùng.",
    "cap.l1a": "Wireframe và prototype bằng Figma",
    "cap.l1b": "Nghiên cứu người dùng, kiểm thử khả dụng",
    "cap.l1c": "Xây dựng và duy trì design system",
    "cap.k2": "Sản phẩm",
    "cap.t2": "PO/PM",
    "cap.b2": "Ưu tiên đúng việc, đúng thời điểm. Cân bằng nhu cầu người dùng, mục tiêu kinh doanh và năng lực đội ngũ để sản phẩm đi đúng hướng.",
    "cap.l2a": "Xây dựng roadmap và quản lý backlog",
    "cap.l2b": "Viết user story, tiêu chí chấp nhận",
    "cap.l2c": "Làm việc với stakeholder, theo dõi chỉ số sau ra mắt",
    "cap.k3": "Nghiệp vụ",
    "cap.t3": "BA",
    "cap.b3": "Đọc đúng bài toán nghiệp vụ trước khi đề xuất giải pháp. Tài liệu rõ ràng để đội phát triển làm đúng ngay từ lần đầu.",
    "cap.l3a": "Thu thập và phân tích yêu cầu",
    "cap.l3b": "Vẽ quy trình nghiệp vụ, use case",
    "cap.l3c": "Viết tài liệu đặc tả (SRS, FRD)",


    "contact.label": "#contact",
    "contact.title": "Liên hệ",
    "contact.mailLabel": "Thư điện tử",
    "contact.available": "Đang nhận việc",

    "footer.rights": "Tự viết tay, không dùng khung dựng sẵn",
    "footer.clock": "Giờ Hà Nội",
    "footer.top": "Lên đầu trang",

    "case.back": "Quay lại danh sách",
    "case.role": "Vai trò",
    "case.year": "Năm",
    "case.stack": "Công cụ",
    "case.challenge": "Yêu cầu",
    "case.tasks": "Công việc",
    "case.approach": "Cách làm",
    "case.result": "Kết quả",
    "case.live": "Xem bản chạy",
    "case.figma": "Xem file Figma",
    "case.next": "Dự án tiếp theo",
    "case.missing": "Không tìm thấy dự án này. Quay lại danh sách nhé."
  },

  en: {
    "meta.title": "Hoang Minh — Frontend developer, web motion specialist",
    "meta.desc": "I rebuild award-winning websites and make them hold 60 frames per second. Hanoi, working remotely.",

    "nav.work": "Work",
    "nav.about": "About",
    "nav.cap": "Capabilities",
    "nav.contact": "Contact",
    "nav.langLabel": "Choose language",
    "nav.themeToLight": "Switch to light theme",
    "nav.themeToDark": "Switch to dark theme",

    "loader.tag": "Building frames",

    "hero.where": "Hanoi, Vietnam",
    "hero.name1": "HOANG",
    "hero.name2": "MINH",
    "hero.lead": "Over <strong>4 years</strong> specialising in UI/UX design, plus hands-on PO/PM experience.",
    "hero.scroll": "Scroll",

    "about.label": "#about",
    "about.title": "Growth direction",
    "about.manifesto": "Always ready to learn something new, but never because it is trending. Every trend I read has to answer one question: what problem does it solve for the people already using this product? After years of learning and growing across several roles, I believe <b>mindset matters more than tools</b>.",
    "about.cap": "Portrait — swap the file at assets/img/portrait.svg",
    "about.k1": "Role",
    "about.v1": "UI/UX Team Lead, PO/PM, BA",
    "about.k2": "Tools",
    "about.v2": "Figma, Framer, VS Code, Jitter, Photoshop, Illustrator",
    "about.k3": "Method",
    "about.v3": "User research, design systems, usability testing",

    "work.label": "#work",
    "work.title": "Work",
    "work.more": "Show {n} more projects",
    "work.view": "View",
    "work.hint": "hover",

    "cap.label": "#capabilities",
    "cap.title": "My skills, my disciplines",
    "cap.k1": "Design",
    "cap.t1": "UI/UX Designer",
    "cap.b1": "Experience design starts from the user's problem, not from a pretty screen. Wireframe, prototype, test — then the final pixel.",
    "cap.l1a": "Wireframes and prototypes in Figma",
    "cap.l1b": "User research and usability testing",
    "cap.l1c": "Building and maintaining design systems",
    "cap.k2": "Product",
    "cap.t2": "PO/PM",
    "cap.b2": "Prioritising the right thing at the right time — balancing user needs, business goals, and team capacity to keep the product on track.",
    "cap.l2a": "Roadmap and backlog management",
    "cap.l2b": "User stories and acceptance criteria",
    "cap.l2c": "Stakeholder alignment and post-launch metrics",
    "cap.k3": "Business",
    "cap.t3": "BA",
    "cap.b3": "Understanding the business problem before proposing a solution. Clear documentation so the dev team builds it right the first time.",
    "cap.l3a": "Requirements gathering and analysis",
    "cap.l3b": "Process mapping and use cases",
    "cap.l3c": "Specification docs (SRS, FRD)",


    "contact.label": "#contact",
    "contact.title": "Contact",
    "contact.mailLabel": "Email",
    "contact.available": "Available for work",

    "footer.rights": "Hand-written, no site builder",
    "footer.clock": "Hanoi time",
    "footer.top": "Back to top",

    "case.back": "Back to all work",
    "case.role": "Role",
    "case.year": "Year",
    "case.stack": "Tools",
    "case.challenge": "The brief",
    "case.tasks": "Responsibilities",
    "case.approach": "Approach",
    "case.result": "Result",
    "case.live": "View live",
    "case.figma": "View Figma file",
    "case.next": "Next project",
    "case.missing": "That project does not exist. Head back to the list."
  }
};
