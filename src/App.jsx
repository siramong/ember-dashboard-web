import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Navigation } from './components/Navigation';
import { NetworkPage } from './pages/NetworkPage';
import { CabinPage } from './pages/CabinPage';
import { SystemPage } from './pages/SystemPage';

function App() {
  return (
    <BrowserRouter>
      <div className="app">
        <header className="app-header">
          <h1>EMBER Dashboard</h1>
        </header>
        <Navigation />
        <main className="app-main">
          <Routes>
            <Route path="/" element={<NetworkPage />} />
            <Route path="/cabin" element={<CabinPage />} />
            <Route path="/system" element={<SystemPage />} />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  );
}

export default App;