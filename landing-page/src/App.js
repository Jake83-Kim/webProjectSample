import './App.css';

function App() {
  const handleOwnerPage = () => {
    window.open(`${process.env.PUBLIC_URL}/owner.html`, '_blank', 'noopener,noreferrer');
  };

  return (
    <main className="app-shell">
      <section className="app-hero">
        <p className="app-kicker">BAROGO OWNER PANEL</p>
        <h1>사장님 운영 페이지를 사이드 메뉴형 대시보드로 시작합니다.</h1>
        <p className="app-description">
          첫 진입 화면은 대시보드로 구성하고, 반응형 레이아웃 안에서 예약 문의, 쿠폰, 구인, 발주 같은
          주요 기능으로 빠르게 이동할 수 있게 연결했습니다.
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
