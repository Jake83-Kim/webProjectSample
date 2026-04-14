(() => {
  const SITE_ACCESS_KEY = 'barogo-site-access';
  const PASSWORD_HASH = '567c07c85c7063d1c9820cf78c8b28ce35aee1a180f716c69a122e0194e22c46';
  const body = document.body;
  const toggleButton = document.querySelector('[data-sidebar-toggle]');
  const closeElements = document.querySelectorAll('[data-sidebar-close]');
  const sidebar = document.querySelector('.sidebar');
  const currentPage = window.location.pathname.split('/').pop() || 'user.html';

  body.classList.add('auth-pending');

  const sha256 = async (value) => {
    const encoder = new TextEncoder();
    const data = encoder.encode(value);
    const digest = await window.crypto.subtle.digest('SHA-256', data);

    return Array.from(new Uint8Array(digest))
      .map((byte) => byte.toString(16).padStart(2, '0'))
      .join('');
  };

  const unlockSite = () => {
    window.sessionStorage.setItem(SITE_ACCESS_KEY, PASSWORD_HASH);
    body.classList.remove('auth-pending');
    document.querySelector('.site-auth-overlay')?.remove();
  };

  const renderAuthOverlay = () => {
    const overlay = document.createElement('div');
    overlay.className = 'site-auth-overlay';
    overlay.innerHTML = `
      <section class="site-auth-card">
        <p class="site-auth-kicker">PRIVATE ACCESS</p>
        <h1 class="site-auth-title">비밀번호를 입력한 뒤 사이트에 들어올 수 있습니다.</h1>
        <p class="site-auth-copy">비밀번호는 브라우저에서 해시로 확인되며, 현재 탭을 닫으면 다시 입력해야 합니다.</p>
        <form class="site-auth-form">
          <label for="site-password">입장 비밀번호</label>
          <input id="site-password" type="password" placeholder="비밀번호를 입력하세요" autocomplete="current-password" required />
          <p class="site-auth-error" hidden>비밀번호가 올바르지 않습니다.</p>
          <button class="btn-primary" type="submit">입장하기</button>
        </form>
      </section>
    `;

    const form = overlay.querySelector('.site-auth-form');
    const input = overlay.querySelector('#site-password');
    const error = overlay.querySelector('.site-auth-error');

    form?.addEventListener('submit', async (event) => {
      event.preventDefault();
      error.hidden = true;

      const inputHash = await sha256(input.value);
      if (inputHash !== PASSWORD_HASH) {
        input.value = '';
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
    body.classList.remove('auth-pending');
  } else {
    renderAuthOverlay();
  }

  const sidebarCopyByPage = {
    'user.html': '사용자 서비스 첫 화면입니다.<br />회원, 바 탐색, 쿠폰, 알림, 고객지원까지 한 흐름으로 이동할 수 있습니다.',
    'user-account.html': '회원가입, 로그인, 계정 찾기, 소셜 로그인을 한 화면 구조로 정리했습니다.',
    'user-bars.html': '바 검색, 상세 보기, 후기, 단골, 좋아요, 바 소식 탐색 흐름을 보여줍니다.',
    'user-events.html': '기획전과 이벤트 목록, 상세 정보, 참여 유도를 한 곳에서 확인합니다.',
    'user-coupons.html': '보유 쿠폰 확인과 사용 가능 상태를 모바일 친화 흐름으로 배치했습니다.',
    'user-profile.html': '마이페이지에서 프로필 수정, 활동 관리, 선호 정보 정리를 다룹니다.',
    'user-notifications.html': '주요 활동 알림과 개인화 알림 설정을 같은 대시보드 흐름으로 구성했습니다.',
    'user-support.html': 'FAQ, 공지사항, 1:1 문의, 약관 열람까지 고객지원 기능을 연결했습니다.',
  };

  const menuSections = [
    {
      title: '서비스 홈',
      items: [
        { href: 'user.html', label: '사용자 대시보드', meta: 'Home' },
        { href: 'user-account.html', label: '회원 계정 기능', meta: 'Auth' },
      ],
    },
    {
      title: '탐색과 혜택',
      items: [
        { href: 'user-bars.html', label: '바 큐레이션', meta: 'Bars' },
        { href: 'user-events.html', label: '기획전 / 이벤트', meta: 'Event' },
        { href: 'user-coupons.html', label: '쿠폰 관리', meta: 'Coupon' },
      ],
    },
    {
      title: '개인화와 지원',
      items: [
        { href: 'user-profile.html', label: '마이페이지', meta: 'My' },
        { href: 'user-notifications.html', label: '알림', meta: 'Alert' },
        { href: 'user-support.html', label: '고객지원 CS', meta: 'Help' },
      ],
    },
  ];

  if (sidebar) {
    const sectionsMarkup = menuSections
      .map((section) => {
        const itemsMarkup = section.items
          .map((item) => {
            const activeClass = item.href === currentPage ? ' active' : '';
            return `<a class="menu-link${activeClass}" href="${item.href}"><span>${item.label}</span><small>${item.meta}</small></a>`;
          })
          .join('');

        return `<section class="sidebar-section"><h2 class="sidebar-title">${section.title}</h2><nav class="menu-list">${itemsMarkup}</nav></section>`;
      })
      .join('');

    sidebar.innerHTML = `
      <div class="brand">
        <div class="brand-mark">BAROGO USER</div>
        <div class="brand-copy">${sidebarCopyByPage[currentPage] || sidebarCopyByPage['user.html']}</div>
      </div>
      ${sectionsMarkup}
      <div class="sidebar-footer">
        <p>사용자 여정 중심으로 기능을 나눠서 웹과 모바일 앱 모두에 어울리는 정보 구조로 정리했습니다.</p>
        <a href="user.html">사용자 홈으로 이동</a>
      </div>
    `;
  }

  if (toggleButton) {
    toggleButton.addEventListener('click', () => {
      body.classList.toggle('sidebar-open');
    });
  }

  closeElements.forEach((element) => {
    element.addEventListener('click', () => {
      body.classList.remove('sidebar-open');
    });
  });

  document.querySelectorAll('.faq-question').forEach((button) => {
    button.addEventListener('click', () => {
      button.closest('.faq-item')?.classList.toggle('open');
    });
  });

  document.querySelectorAll('a[href="/webProjectSample/"]').forEach((link) => {
    link.addEventListener('click', () => {
      window.sessionStorage.removeItem(SITE_ACCESS_KEY);
    });
  });
})();
