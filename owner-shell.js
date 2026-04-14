(() => {
  const SITE_ACCESS_KEY = "barogo-site-access";
  const PASSWORD_HASH = "567c07c85c7063d1c9820cf78c8b28ce35aee1a180f716c69a122e0194e22c46";
  const body = document.body;
  const toggleButton = document.querySelector("[data-sidebar-toggle]");
  const closeElements = document.querySelectorAll("[data-sidebar-close]");
  const sidebar = document.querySelector(".sidebar");
  const currentPage = window.location.pathname.split("/").pop() || "owner.html";

  body.classList.add("auth-pending");

  const sha256 = async (value) => {
    const encoder = new TextEncoder();
    const data = encoder.encode(value);
    const digest = await window.crypto.subtle.digest("SHA-256", data);

    return Array.from(new Uint8Array(digest))
      .map((byte) => byte.toString(16).padStart(2, "0"))
      .join("");
  };

  const unlockSite = () => {
    window.sessionStorage.setItem(SITE_ACCESS_KEY, PASSWORD_HASH);
    body.classList.remove("auth-pending");
    document.querySelector(".site-auth-overlay")?.remove();
  };

  const renderAuthOverlay = () => {
    const overlay = document.createElement("div");
    overlay.className = "site-auth-overlay";
    overlay.innerHTML = `
      <section class="site-auth-card">
        <p class="site-auth-kicker">PRIVATE ACCESS</p>
        <h1 class="site-auth-title">비밀번호를 입력한 뒤 사이트에 들어올 수 있습니다.</h1>
        <p class="site-auth-copy">비밀번호는 브라우저에서 해시로 확인되며, 현재 탭이 닫히면 다시 입력해야 합니다.</p>
        <form class="site-auth-form">
          <label for="site-password">입장 비밀번호</label>
          <input id="site-password" type="password" placeholder="비밀번호를 입력하세요" autocomplete="current-password" required />
          <p class="site-auth-error" hidden>비밀번호가 올바르지 않습니다.</p>
          <button class="btn-primary" type="submit">입장하기</button>
        </form>
      </section>
    `;

    const form = overlay.querySelector(".site-auth-form");
    const input = overlay.querySelector("#site-password");
    const error = overlay.querySelector(".site-auth-error");

    form?.addEventListener("submit", async (event) => {
      event.preventDefault();
      error.hidden = true;

      const inputHash = await sha256(input.value);
      if (inputHash !== PASSWORD_HASH) {
        input.value = "";
        error.hidden = false;
        input.focus();
        return;
      }

      unlockSite();
    });

    body.appendChild(overlay);
    input?.focus();
  };

  if (window.sessionStorage.getItem(SITE_ACCESS_KEY) === PASSWORD_HASH) {
    body.classList.remove("auth-pending");
  } else {
    renderAuthOverlay();
  }

  const sidebarCopyByPage = {
    "owner.html": "사장님 운영 화면입니다.<br />왼쪽 메뉴에서 전체 기능으로 이동할 수 있습니다.",
    "bar-management.html": "브랜드 정보와 매장 기본 정보를 같은 흐름으로 관리합니다.",
    "review-management.html": "고객 후기를 확인하고 응답 흐름을 같은 화면에서 정리합니다.",
    "bar-news.html": "바 소식과 매장 공지 업데이트를 운영 흐름 안에서 관리합니다.",
    "notification.html": "예약 문의 응답 상태와 우선 처리 건을 빠르게 확인합니다.",
    "coupon.html": "입장 쿠폰 처리와 사용 이력을 같은 구조에서 관리합니다.",
    "job-management.html": "구인 공고, 지원자 검토, 응답 흐름을 단일한 콘텐츠로 관리합니다.",
    "chat.html": "채팅 문의와 최근 대화 상태를 같은 대시보드 흐름으로 확인합니다.",
    "shopping.html": "주류와 비품 발주를 상품 탐색부터 요청까지 연결합니다.",
    "order-history.html": "발주 이력과 입고 상태를 명확하게 정리합니다.",
    "payment.html": "구독 상태, 결제 수단, 청구 이력을 한 화면에서 관리합니다.",
    "notice.html": "플랫폼 공지사항을 빠르게 확인할 수 있는 안내 화면입니다.",
    "faq.html": "자주 묻는 질문과 운영 가이드를 한곳에 모았습니다.",
    "inquiry.html": "1:1 문의 접수와 답변 현황을 운영 흐름 안에서 확인합니다.",
  };

  const menuSections = [
    {
      title: "관리 메뉴",
      items: [
        { href: "owner.html", label: "대시보드", meta: "Home" },
        { href: "bar-management.html", label: "바 정보 관리", meta: "Info" },
        { href: "review-management.html", label: "후기 관리", meta: "Review" },
        { href: "bar-news.html", label: "바 소식 관리", meta: "News" },
        { href: "notification.html", label: "예약 문의 관리", meta: "Q&A" },
        { href: "coupon.html", label: "쿠폰 내역", meta: "Coupon" },
      ],
    },
    {
      title: "운영",
      items: [
        { href: "job-management.html", label: "알바 구인 관리", meta: "Jobs" },
        { href: "chat.html", label: "채팅", meta: "Chat" },
        { href: "shopping.html", label: "쇼핑 및 발주", meta: "Order" },
        { href: "order-history.html", label: "발주내역", meta: "History" },
        { href: "payment.html", label: "결제/구독 관리", meta: "Pay" },
      ],
    },
    {
      title: "플랫폼 CS",
      items: [
        { href: "notice.html", label: "공지사항", meta: "Notice" },
        { href: "faq.html", label: "FAQ", meta: "FAQ" },
        { href: "inquiry.html", label: "1:1 문의", meta: "Help" },
      ],
    },
  ];

  if (sidebar) {
    const sectionsMarkup = menuSections
      .map((section) => {
        const itemsMarkup = section.items
          .map((item) => {
            const activeClass = item.href === currentPage ? " active" : "";
            return `<a class="menu-link${activeClass}" href="${item.href}"><span>${item.label}</span><small>${item.meta}</small></a>`;
          })
          .join("");

        return `<section class="sidebar-section"><h2 class="sidebar-title">${section.title}</h2><nav class="menu-list">${itemsMarkup}</nav></section>`;
      })
      .join("");

    sidebar.innerHTML = `
      <div class="brand">
        <div class="brand-mark">바로가자</div>
        <div class="brand-copy">${sidebarCopyByPage[currentPage] || sidebarCopyByPage["owner.html"]}</div>
      </div>
      ${sectionsMarkup}
      <div class="sidebar-footer">
        <p>이번 달 신규 예약 응답률이 안정적입니다. 왼쪽 메뉴에서 필요한 화면으로 바로 이동해보세요.</p>
        <a href="owner.html">대시보드로 이동</a>
      </div>
    `;
  }

  if (toggleButton) {
    toggleButton.addEventListener("click", () => {
      body.classList.toggle("sidebar-open");
    });
  }

  closeElements.forEach((element) => {
    element.addEventListener("click", () => {
      body.classList.remove("sidebar-open");
    });
  });

  document.querySelectorAll(".faq-question").forEach((button) => {
    button.addEventListener("click", () => {
      button.closest(".faq-item")?.classList.toggle("open");
    });
  });

  document.querySelectorAll('a[href="/webProjectSample/"]').forEach((link) => {
    link.addEventListener("click", () => {
      window.sessionStorage.removeItem(SITE_ACCESS_KEY);
    });
  });
})();
