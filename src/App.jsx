import { BrowserRouter, Routes, Route } from 'react-router-dom';
import DashboardHome from './pages/DashboardHome';
import imagotipo from './assets/imagotipo.png';

function App() {
  return (
    <BrowserRouter>
      <div className="app">
        <header className="app-header">
          <div className="header-logo-pill">
            <img className="header-logo" src={imagotipo} alt="Imagotipo Ember" />
          </div>
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