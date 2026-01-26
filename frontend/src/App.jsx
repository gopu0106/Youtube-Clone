import React, { useState } from 'react';
import Header from './components/Header';
import Sidebar from './components/Sidebar';
import Home from './pages/Home';
import VideoPlayer from './pages/VideoPlayer';
import Auth from './pages/Auth';
import ChannelStudio from './pages/ChannelStudio';
import { AuthProvider } from './context/AuthContext';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

function App() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

  return (
    <AuthProvider>
      <Router>
        <div className="app">
          <Header toggleSidebar={toggleSidebar} />
          <div style={{ display: 'flex', marginTop: '56px' }}>
            <Sidebar isOpen={isSidebarOpen} />
            <main style={{ 
              flex: 1, 
              padding: '20px', 
              marginLeft: isSidebarOpen ? '240px' : '72px', 
              transition: 'margin-left 0.3s ease',
              minHeight: 'calc(100vh - 56px)' 
            }}>
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/video/:id" element={<VideoPlayer />} />
                <Route path="/auth" element={<Auth />} />
                <Route path="/studio" element={<ChannelStudio />} />
              </Routes>
            </main>
          </div>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
