import { useEffect, useState } from 'react';
import './App.css';

const SITE_ACCESS_KEY = 'barogo-site-access';
const PASSWORD_HASH = '567c07c85c7063d1c9820cf78c8b28ce35aee1a180f716c69a122e0194e22c46';

async function sha256(value) {
  const encoder = new TextEncoder();
  const data = encoder.encode(value);
  const digest = await window.crypto.subtle.digest('SHA-256', data);

  return Array.from(new Uint8Array(digest))
    .map((byte) => byte.toString(16).padStart(2, '0'))
    .join('');
}

const entryCards = [
  {
    label: 'OWNER SYSTEM',
    title: '사장님 운영 시스템',
    description:
      '매장 운영, 쿠폰 관리, 리뷰 확인, 공지와 CS 대응까지 사장님용 관리 화면으로 바로 진입합니다.',
    href: `${process.env.PUBLIC_URL}/owner.html`,
    action: '사장님 페이지 열기',
  },
  {
    label: 'USER SYSTEM',
    title: '사용자 웹 · 모바일 서비스',
    description:
      '바 탐색, 이벤트, 쿠폰, 마이페이지, 알림, 고객지원까지 실제 사용자 흐름으로 확인할 수 있습니다.',
    href: `${process.env.PUBLIC_URL}/user.html`,
    action: '사용자 서비스 열기',
    highlight: true,
  },
  {
    label: 'Q&A FLOW',
    title: '질의 · 응답 작성 플로우',
    description:
      '저장 없이 화면만 먼저 확인할 수 있는 5단계 질의 작성 흐름입니다. 이전 / 다음으로 실제 입력 경험을 볼 수 있습니다.',
    href: `${process.env.PUBLIC_URL}/user-qa.html`,
    action: '질의/응답 열기',
  },
];

function App() {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isChecking, setIsChecking] = useState(true);
  const [isUnlocked, setIsUnlocked] = useState(false);

  useEffect(() => {
    const storedAccess = window.sessionStorage.getItem(SITE_ACCESS_KEY);
    if (storedAccess === PASSWORD_HASH) {
      setIsUnlocked(true);
    }

    setIsChecking(false);
  }, []);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');

    const inputHash = await sha256(password);
    if (inputHash !== PASSWORD_HASH) {
      setPassword('');
      setError('비밀번호가 올바르지 않습니다.');
      return;
    }

    window.sessionStorage.setItem(SITE_ACCESS_KEY, PASSWORD_HASH);
    setIsUnlocked(true);
    setPassword('');
  };

  if (isChecking) {
    return <main className="app-shell is-loading" />;
  }

  if (!isUnlocked) {
    return (
      <main className="auth-shell">
        <section className="auth-card">
          <p className="auth-kicker">PRIVATE ACCESS</p>
          <h1>비밀번호를 입력한 뒤 시안 허브로 들어올 수 있습니다.</h1>
          <p className="auth-description">
            비밀번호는 현재 세션에서만 유지되고, 브라우저를 닫으면 다시 입력해야 합니다.
          </p>
          <form className="auth-form" onSubmit={handleSubmit}>
            <label className="auth-field" htmlFor="site-password">
              입장 비밀번호
            </label>
            <input
              id="site-password"
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              placeholder="비밀번호를 입력하세요"
              autoComplete="current-password"
              required
            />
            {error ? <p className="auth-error">{error}</p> : null}
            <button type="submit">입장하기</button>
          </form>
        </section>
      </main>
    );
  }

  return (
    <main className="app-shell">
      <section className="app-hero">
        <p className="app-kicker">BAROGO SERVICE HUB</p>
        <h1>사장님, 사용자, 질의·응답 흐름을 한 화면에서 바로 선택할 수 있게 구성했습니다.</h1>
        <p className="app-description">
          첫 진입 화면에서 필요한 역할과 목적에 따라 바로 이동할 수 있도록 허브를 정리했습니다.
          운영용 화면과 사용자용 서비스는 유지하면서, 별도 확인이 필요한 질의·응답 작성 플로우도
          독립 진입으로 분리했습니다.
        </p>

        <div className="entry-grid entry-grid-triple">
          {entryCards.map((card) => (
            <article key={card.href} className={`entry-card${card.highlight ? ' highlight' : ''}`}>
              <p className="entry-label">{card.label}</p>
              <h2>{card.title}</h2>
              <p>{card.description}</p>
              <div className="app-actions">
                <a href={card.href} target="_blank" rel="noreferrer">
                  {card.action}
                </a>
              </div>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}

export default App;
