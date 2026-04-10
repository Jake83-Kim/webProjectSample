import './App.css';

function App() {
  const handleOwnerPage = () => {
    window.open(`${process.env.PUBLIC_URL}/owner.html`, '_blank', 'noopener,noreferrer');
  };

  return (
    <div className="App">
      <header className="App-header">
        <h1>안녕하세요, [JAKE]입니다.</h1>
        <button type="button" onClick={handleOwnerPage}>
          사장님 페이지
        </button>
      </header>
    </div>
  );
}

export default App;