// App.js
import React from 'react';
import MBTITest from './MBTITest'; // MBTITest 컴포넌트 import

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <h1>MBTI 테스트 애플리케이션</h1>
      </header>
      <main>
        <MBTITest /> {/* MBTITest 컴포넌트 렌더링 */}
      </main>
    </div>
  );
}

export default App;
