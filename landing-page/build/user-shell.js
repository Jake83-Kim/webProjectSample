(() => {
  const SITE_ACCESS_KEY = 'barogo-site-access';
  const PASSWORD_HASH = '567c07c85c7063d1c9820cf78c8b28ce35aee1a180f716c69a122e0194e22c46';
  const body = document.body;
  const shell = document.querySelector('.sidebar');
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
        <h1 class="site-auth-title">비밀번호를 입력한 사용자만 시안을 볼 수 있습니다.</h1>
        <p class="site-auth-copy">입장 비밀번호는 현재 세션에만 저장되며, 브라우저를 닫으면 다시 입력해야 합니다.</p>
        <form class="site-auth-form">
          <label for="site-password">입장 비밀번호</label>
          <input id="site-password" type="password" placeholder="비밀번호를 입력하세요" autocomplete="current-password" required />
          <p class="site-auth-error" hidden>비밀번호가 올바르지 않습니다.</p>
          <button class="site-auth-button" type="submit">입장하기</button>
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

  const navItems = [
    { href: 'user.html', label: '서비스 홈' },
    { href: 'user-account.html', label: '계정' },
    { href: 'user-bars.html', label: '바 큐레이션' },
    { href: 'user-events.html', label: '기획전·이벤트' },
    { href: 'user-coupons.html', label: '쿠폰' },
    { href: 'user-profile.html', label: '마이페이지' },
    { href: 'user-notifications.html', label: '알림' },
    { href: 'user-support.html', label: '고객지원' }
  ];

  const mobileItems = [
    { href: 'user.html', label: '홈' },
    { href: 'user-bars.html', label: '바' },
    { href: 'user-events.html', label: '이벤트' },
    { href: 'user-coupons.html', label: '쿠폰' },
    { href: 'user-profile.html', label: 'MY' }
  ];

  if (shell) {
    const desktopNav = navItems
      .map((item) => {
        const active = item.href === currentPage ? ' active' : '';
        return `<a class="site-nav-link${active}" href="${item.href}">${item.label}</a>`;
      })
      .join('');

    const mobileNav = mobileItems
      .map((item) => {
        const active = item.href === currentPage ? ' active' : '';
        return `<a class="bottom-nav-link${active}" href="${item.href}">${item.label}</a>`;
      })
      .join('');

    shell.innerHTML = `
      <header class="site-header">
        <div class="site-header-inner">
          <div class="site-brand-area">
            <a class="site-brand" href="user.html">BAROGO</a>
            <nav class="site-nav">${desktopNav}</nav>
          </div>
          <div class="site-actions">
            <a class="icon-link" href="user-notifications.html" aria-label="알림">알림</a>
            <span class="welcome-copy"><strong>김바로 고객님</strong><span>오늘도 새로운 바를 추천해드릴게요.</span></span>
            <a href="user-profile.html">MY</a>
            <a href="user-support.html">고객지원</a>
            <a href="/webProjectSample/" data-site-logout>로그아웃</a>
          </div>
        </div>
      </header>
      <div class="mobile-topbar">
        <div class="mobile-topbar-inner">
          <a class="mobile-brand" href="user.html"><span>APP</span><strong>BAROGO</strong></a>
          <a class="icon-link mobile" href="user-notifications.html" aria-label="알림">알림</a>
        </div>
      </div>
      <nav class="bottom-nav">${mobileNav}</nav>
    `;
  }

  document.querySelectorAll('.faq-question').forEach((button) => {
    button.addEventListener('click', () => {
      button.closest('.faq-item')?.classList.toggle('open');
    });
  });

  document.querySelectorAll('[data-site-logout], a[href="/webProjectSample/"]').forEach((link) => {
    link.addEventListener('click', () => {
      window.sessionStorage.removeItem(SITE_ACCESS_KEY);
    });
  });
})();
