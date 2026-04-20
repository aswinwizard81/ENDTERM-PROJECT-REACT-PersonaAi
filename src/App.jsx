import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { auth } from './services/firebase';
import { onAuthStateChanged } from 'firebase/auth';

import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import History from './pages/History';

function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (u) => {
      setUser(u);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  if (loading) return <div className="gradient-mesh min-h-screen flex items-center justify-center font-black text-blue-400 animate-pulse uppercase tracking-[0.5em]">Initializing...</div>;

  return (
    <Router>
      <Routes>
        <Route path="/" element={user ? <Dashboard user={user} /> : <Login />} />
        <Route path="/history" element={user ? <History /> : <Login />} />
      </Routes>
    </Router>
  );
}
export default App;