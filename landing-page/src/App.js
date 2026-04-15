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

const entryGroups = [
  {
    label: 'BAROGO FLOWS',
    title: '기존 바로고 시안',
    description:
      '운영자용, 사용자용, 질의 작성 플로우까지 기존에 정리해둔 바로고 서비스 시안을 그대로 이어서 확인할 수 있습니다.',
    cards: [
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
          '저장 없이 화면만 먼저 확인할 수 있는 5단계 질의 작성 흐름입니다. 이전과 다음 이동으로 입력 경험을 살펴볼 수 있습니다.',
        href: `${process.env.PUBLIC_URL}/user-qa.html`,
        action: '질의/응답 열기',
      },
    ],
  },
  {
    label: 'CHURCH COMMUNITY',
    title: '교회 커뮤니티 진입 허브',
    description:
      '교회 커뮤니티 서비스 컨셉을 관리자 웹과 신도용 앱으로 나누어 구성했습니다. 첨부해주신 레퍼런스처럼 버튼 중심의 또렷한 대비와 부드러운 여백을 적용했습니다.',
    cards: [
      {
        label: 'ADMIN WEB',
        title: '교회 관리자용 웹 서비스',
        description:
          '교회 계정, 회원 승인, 그룹 운영, 커뮤니티 관리, 공지와 행사 등록, 통계와 CS까지 운영 흐름을 한 페이지로 정리했습니다.',
        href: `${process.env.PUBLIC_URL}/church-admin.html`,
        action: '관리자 화면 열기',
      },
      {
        label: 'MEMBER APP',
        title: '교회 커뮤니티 사용자 앱',
        description:
          '신도 가입과 인증, 커뮤니티 탐색, 일정 보기, 교회 소개, 마이페이지, 고객지원까지 사용자 관점으로 소개합니다.',
        href: `${process.env.PUBLIC_URL}/church-user.html`,
        action: '사용자 화면 열기',
        highlight: true,
      },
    ],
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
              placeholder="비밀번호를 입력해 주세요"
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
        <p className="app-kicker">SERVICE CONCEPT HUB</p>
        <h1>서비스별 진입로를 한 화면에서 빠르게 선택하고, 역할에 맞는 시안을 바로 열어볼 수 있도록 구성했습니다.</h1>
        <p className="app-description">
          기존 바로고 시안은 그대로 유지하고, 새로 요청하신 교회 커뮤니티 서비스는 관리자 웹과 사용자 앱으로
          분리해 추가했습니다. 운영 도구와 사용자 경험을 한 번에 비교할 수 있도록 섹션별 카드 허브로 정리했습니다.
        </p>

        <div className="group-stack">
          {entryGroups.map((group) => (
            <section key={group.label} className="entry-group">
              <div className="group-copy">
                <p className="entry-label">{group.label}</p>
                <h2>{group.title}</h2>
                <p>{group.description}</p>
              </div>

              <div
                className={`entry-grid ${
                  group.cards.length === 3 ? 'entry-grid-triple' : 'entry-grid-double'
                }`}
              >
                {group.cards.map((card) => (
                  <article key={card.href} className={`entry-card${card.highlight ? ' highlight' : ''}`}>
                    <p className="entry-label">{card.label}</p>
                    <h3>{card.title}</h3>
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
          ))}
        </div>
      </section>
    </main>
  );
}

export default App;
