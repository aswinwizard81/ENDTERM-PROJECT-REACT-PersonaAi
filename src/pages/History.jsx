import React, { useEffect, useState } from 'react';
import { db, auth } from '../services/firebase';
import { collection, query, where, getDocs, orderBy, doc, deleteDoc } from 'firebase/firestore';
import { Link } from 'react-router-dom';

const History = () => {
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchSessions = async () => {
    try {
      if (!auth.currentUser) return;
      const q = query(
        collection(db, "sessions"),
        where("uid", "==", auth.currentUser.uid),
        orderBy("timestamp", "desc")
      );
      const querySnapshot = await getDocs(q);
      const data = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setSessions(data);
    } catch (error) {
      console.error("Fetch error:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSessions();
  }, []);

  // DELETE FUNCTION
  const handleDelete = async (sessionId) => {
    if (window.confirm("Are you sure you want to delete this session?")) {
      try {
        await deleteDoc(doc(db, "sessions", sessionId));
        // Update local state so it disappears instantly
        setSessions(sessions.filter(s => s.id !== sessionId));
      } catch (error) {
        console.error("Delete error:", error);
      }
    }
  };

  return (
    <div className="gradient-mesh min-h-screen p-8 text-white">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-12">
          <h2 className="text-4xl font-black text-glow">Speech History</h2>
          <Link to="/" className="text-blue-400 font-bold uppercase tracking-widest text-[10px]">← Lab</Link>
        </div>

        {loading ? (
          <div className="text-center mt-20 font-mono text-slate-500 animate-pulse uppercase">Retrieving...</div>
        ) : sessions.length === 0 ? (
          <div className="text-center mt-20 opacity-50">No history found. Go record some speech!</div>
        ) : (
          <div className="grid gap-4">
            {sessions.map((s) => (
              <div key={s.id} className="glass-card rounded-3xl p-6 flex justify-between items-center border border-white/5 group hover:border-blue-500/30 transition-all">
                <div className="flex-1">
                  <p className="text-[10px] text-slate-500 uppercase font-black mb-1">
                    {new Date(s.timestamp?.toDate()).toLocaleDateString('en-IN', { month: 'short', day: 'numeric', year: 'numeric' })}
                  </p>
                  <p className="text-slate-300 italic line-clamp-1 font-light">"{s.transcript}"</p>
                </div>
                
                <div className="flex gap-8 items-center ml-6">
                  <div className="text-center">
                    <p className="text-xl font-black text-white">{s.wordCount}</p>
                    <p className="text-[8px] text-slate-500 uppercase font-bold">Words</p>
                  </div>
                  
                  {/* DELETE BUTTON */}
                  <button 
                    onClick={() => handleDelete(s.id)}
                    className="p-3 bg-red-500/10 text-red-500 rounded-2xl hover:bg-red-500 hover:text-white transition-all opacity-0 group-hover:opacity-100"
                    title="Delete Session"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                      <path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5m2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5m3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0z"/>
                      <path d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1zM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4zM2.5 3h11V2h-11z"/>
                    </svg>
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default History;