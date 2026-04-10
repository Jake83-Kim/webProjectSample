import './App.css';

function App() {
  const handleLearnMore = () => {
    window.open(`${process.env.PUBLIC_URL}/about.html`, '_blank', 'noopener,noreferrer');
  };

  return (
    <div className="App">
      <header className="App-header">
        <h1>안녕하세요, [JAKE]입니다.</h1>
        <button type="button" onClick={handleLearnMore}>
          더 알아보기
        </button>
      </header>
    </div>
  );
}

export default App;