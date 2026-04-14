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
          <h1>비밀번호를 입력한 뒤 사이트에 들어올 수 있습니다.</h1>
          <p className="auth-description">
            비밀번호는 브라우저에서 해시로 확인되며, 현재 탭을 닫으면 다시 입력해야 합니다.
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
        <h1>기존 사장님 페이지는 그대로 두고, 사용자용 서비스 접근 경로를 새로 추가했습니다.</h1>
        <p className="app-description">
          운영자용 대시보드와 사용자용 웹·모바일 서비스 화면을 각각 분리해 접근할 수 있도록 구성했습니다.
          아래에서 필요한 서비스 유형을 선택해 바로 이동할 수 있습니다.
        </p>
        <div className="entry-grid">
          <article className="entry-card">
            <p className="entry-label">OWNER SYSTEM</p>
            <h2>사장님 운영 페이지</h2>
            <p>기존에 만든 대시보드, 바 관리, 쿠폰, 구인, 플랫폼 CS 흐름을 그대로 유지합니다.</p>
            <div className="app-actions">
              <a href={`${process.env.PUBLIC_URL}/owner.html`} target="_blank" rel="noreferrer">
                사장님 페이지 열기
              </a>
            </div>
          </article>
          <article className="entry-card highlight">
            <p className="entry-label">USER SYSTEM</p>
            <h2>사용자용 웹/모바일 서비스</h2>
            <p>회원, 바 탐색, 기획전, 쿠폰, 마이페이지, 알림, 고객지원 기능을 한 흐름으로 살펴볼 수 있습니다.</p>
            <div className="app-actions">
              <a href={`${process.env.PUBLIC_URL}/user.html`} target="_blank" rel="noreferrer">
                사용자 서비스 열기
              </a>
            </div>
          </article>
        </div>
      </section>
    </main>
  );
}

export default App;
