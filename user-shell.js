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
        <h1 class="site-auth-title">비밀번호를 입력한 뒤 사이트에 들어올 수 있습니다.</h1>
        <p class="site-auth-copy">비밀번호는 브라우저에서 해시로 확인되며, 현재 탭을 닫으면 다시 입력해야 합니다.</p>
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
    { href: 'user-bars.html', label: '바 탐색' },
    { href: 'user-events.html', label: '이벤트' },
    { href: 'user-coupons.html', label: '쿠폰' },
  ];

  const mobileItems = [
    { href: 'user.html', label: '홈' },
    { href: 'user-bars.html', label: '바 탐색' },
    { href: 'user-events.html', label: '이벤트/기획전' },
    { href: 'user-coupons.html', label: '쿠폰' },
    { href: 'user-profile.html', label: 'MY' },
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
            <a class="site-brand" href="user.html">바로가자</a>
            <nav class="site-nav">${desktopNav}</nav>
          </div>
          <div class="site-actions">
            <button class="alarm-button" type="button" aria-label="알림">●</button>
            <span class="welcome-copy"><strong>OOO 님</strong><span>환영합니다.</span></span>
            <a href="user-profile.html">MY</a>
            <a href="user-support.html">고객센터</a>
            <a href="/webProjectSample/" data-site-logout>로그아웃</a>
          </div>
        </div>
      </header>
      <div class="mobile-topbar">
        <div class="mobile-topbar-inner">
          <a class="mobile-brand" href="user.html"><span>LOGO</span><strong>바로가자</strong></a>
          <button class="alarm-button mobile" type="button" aria-label="알림">●</button>
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
