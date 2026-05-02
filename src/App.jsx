import { BrowserRouter, Routes, Route } from 'react-router-dom';
import DashboardHome from './pages/DashboardHome';

function App() {
  return (
    <BrowserRouter>
      <div className="app">
        <header className="app-header">
          <h1>EMBER Monitor</h1>
        </header>
        <main className="app-main">
          <Routes>
            <Route path="/" element={<DashboardHome />} />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  );
}

export default App;