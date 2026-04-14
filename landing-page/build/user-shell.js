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
    'user.html': '오늘 가볼 만한 바, 쿠폰, 이벤트를 앱 홈처럼 한 번에 모아봤습니다.',
    'user-account.html': '회원가입과 로그인도 앱 첫 진입처럼 가볍고 친숙하게 보이도록 정리했습니다.',
    'user-bars.html': '탐색, 후기, 좋아요, 단골 저장까지 사용자의 선택 흐름이 자연스럽게 이어집니다.',
    'user-events.html': '기획전과 이벤트는 배너와 카드 중심으로 소비자 서비스처럼 보여줍니다.',
    'user-coupons.html': '쿠폰 지갑과 사용 버튼이 눈에 바로 들어오도록 모바일 중심으로 배치했습니다.',
    'user-profile.html': '프로필과 취향 정보가 개인화 추천으로 연결되는 마이페이지 흐름입니다.',
    'user-notifications.html': '좋아요한 바 소식과 쿠폰 만료 알림을 피드처럼 가볍게 확인할 수 있습니다.',
    'user-support.html': '고객지원도 운영 화면이 아니라 실제 서비스 도움말 센터처럼 보이게 구성했습니다.',
  };

  const menuGroups = [
    {
      title: 'Quick Access',
      items: [
        { href: 'user.html', label: '홈', meta: 'Home' },
        { href: 'user-bars.html', label: '탐색', meta: 'Bars' },
        { href: 'user-events.html', label: '이벤트', meta: 'Event' },
        { href: 'user-coupons.html', label: '쿠폰', meta: 'Coupon' },
      ],
    },
    {
      title: 'My Space',
      items: [
        { href: 'user-account.html', label: '계정', meta: 'Auth' },
        { href: 'user-profile.html', label: '마이', meta: 'My' },
        { href: 'user-notifications.html', label: '알림', meta: 'Alert' },
        { href: 'user-support.html', label: '도움', meta: 'Help' },
      ],
    },
  ];

  if (sidebar) {
    const sectionsMarkup = menuGroups
      .map((group) => {
        const itemsMarkup = group.items
          .map((item) => {
            const activeClass = item.href === currentPage ? ' active' : '';
            return `
              <a class="menu-link${activeClass}" href="${item.href}">
                <span>${item.label}</span>
                <small>${item.meta}</small>
              </a>
            `;
          })
          .join('');

        return `
          <section class="sidebar-section">
            <h2 class="sidebar-title">${group.title}</h2>
            <nav class="menu-list">${itemsMarkup}</nav>
          </section>
        `;
      })
      .join('');

    sidebar.innerHTML = `
      <div class="sidebar-header">
        <div class="brand">
          <div class="brand-mark">BAROGO</div>
          <div class="brand-copy">${sidebarCopyByPage[currentPage] || sidebarCopyByPage['user.html']}</div>
        </div>
        <div class="profile-chip">
          <div class="profile-avatar">HK</div>
          <div>
            <strong>홍길동 님</strong>
            <p>오늘도 새로운 바를 찾아볼까요?</p>
          </div>
        </div>
      </div>
      ${sectionsMarkup}
      <div class="sidebar-footer">
        <p>지금 사용 가능한 쿠폰 4장과 좋아요한 바의 새 소식 2건이 도착했어요.</p>
        <a href="user-coupons.html">혜택 바로 보기</a>
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
