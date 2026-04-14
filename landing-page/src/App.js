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

  const handleOwnerPage = () => {
    window.open(`${process.env.PUBLIC_URL}/owner.html`, '_blank', 'noopener,noreferrer');
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
            비밀번호는 브라우저에서 해시로 확인되며, 현재 탭이 닫히면 다시 입력해야 합니다.
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
        <p className="app-kicker">BAROGO OWNER PANEL</p>
        <h1>사장님 운영 페이지를 사이드 메뉴형 대시보드로 시작합니다.</h1>
        <p className="app-description">
          첫 진입 화면은 대시보드로 구성하고, 반응형 레이아웃 안에서 예약 문의, 쿠폰, 구인, 발주 같은 주요
          기능으로 빠르게 이동할 수 있게 연결했습니다.
        </p>
        <div className="app-actions">
          <button type="button" onClick={handleOwnerPage}>
            사장님 페이지 열기
          </button>
          <a href={`${process.env.PUBLIC_URL}/owner.html`} target="_blank" rel="noreferrer">
            새 탭으로 바로가기
          </a>
        </div>
      </section>
    </main>
  );
}

export default App;
