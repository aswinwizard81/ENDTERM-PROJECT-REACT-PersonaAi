import React from 'react';
import { auth, googleProvider } from '../services/firebase';
import { signInWithPopup } from 'firebase/auth';

const Login = () => {
  const handleLogin = async () => {
    try { await signInWithPopup(auth, googleProvider); } 
    catch (err) { console.error(err); }
  };

  return (
    <div className="gradient-mesh min-h-screen flex items-center justify-center p-6">
      <div className="glass-card rounded-[3rem] p-12 max-w-md w-full text-center">
        <h1 className="text-5xl font-black text-glow bg-gradient-to-r from-blue-400 to-emerald-400 bg-clip-text text-transparent mb-4">Persona.ai</h1>
        <p className="text-slate-400 mb-10 font-light italic text-sm">Unlock your public speaking potential.</p>
        <button onClick={handleLogin} className="w-full bg-white text-black py-4 rounded-full font-bold flex items-center justify-center gap-3 hover:scale-105 transition-all shadow-xl">
          <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/layout/google.svg" className="w-5" alt="G"/>
          Sign in with Google
        </button>
      </div>
    </div>
  );
};
export default Login;