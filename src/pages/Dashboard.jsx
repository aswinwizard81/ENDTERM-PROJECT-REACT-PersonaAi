import React, { useState } from 'react';
import { auth, db } from '../services/firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { useSpeech } from '../hooks/useSpeech';
import { useAnalysis } from '../hooks/useAnalysis';
import { Link } from 'react-router-dom';

const Dashboard = ({ user }) => {
  const { isListening, transcript, setTranscript, startListening, stopListening } = useSpeech();
  const { totalFillerCount, wordCount } = useAnalysis(transcript);

  const [isEditing, setIsEditing] = useState(false);
  const [aiFeedback, setAiFeedback] = useState(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isInterviewMode, setIsInterviewMode] = useState(false);
  const [currentQIndex, setCurrentQIndex] = useState(0);
  const [customQuestion, setCustomQuestion] = useState("");

  const interviewQuestions = [
    "Tell me about yourself and your journey as a developer.",
    "What is the most challenging technical project you have worked on?",
    "How do you handle disagreements within a team setting?",
    "Why should we hire you over other candidates today?"
  ];

  const speak = (text) => {
    window.speechSynthesis.cancel();
    const msg = new SpeechSynthesisUtterance(text);
    msg.rate = 0.95;
    window.speechSynthesis.speak(msg);
  };

  // --- ADVANCED HEURISTIC SCORING ENGINE ---
  const generateAIAnalysis = () => {
    if (!transcript) return;
    setIsAnalyzing(true);

    setTimeout(() => {
      const lowerText = transcript.toLowerCase();
      
      // 1. Structure Detection (Logical flow)
      const structureWeight = (
        (lowerText.includes("firstly") || lowerText.includes("initially") ? 1 : 0) +
        (lowerText.includes("because") || lowerText.includes("therefore") ? 1 : 0) +
        (lowerText.includes("finally") || lowerText.includes("result") ? 1 : 0)
      );

      // 2. Action/Impact Words (Ownership)
      const impactWords = ["implemented", "optimized", "solved", "developed", "collaborated", "achieved"];
      const impactScore = impactWords.filter(word => lowerText.includes(word)).length;

      // 3. Technical Depth (Domain knowledge)
      const techLexicon = ["react", "state", "hooks", "api", "firebase", "component", "frontend", "backend", "database"];
      const techScore = techLexicon.filter(word => lowerText.includes(word)).length;

      // 4. Complexity & Confidence (Sentence length and Hedge words)
      const weakWords = ["maybe", "i think", "sort of", "kind of", "stuff"];
      const weakPenalty = weakWords.filter(word => lowerText.includes(word)).length;
      
      // --- FINAL SCORE CALCULATION ---
      let rawScore = 5.0; // Base baseline
      rawScore += (structureWeight * 1.2); // Up to +3.6
      rawScore += (impactScore * 0.6);     // Bonus for action verbs
      rawScore += (techScore * 0.5);       // Bonus for technical terms
      rawScore -= (totalFillerCount * 0.4); // Penalty for "ums"
      rawScore -= (weakPenalty * 0.8);     // Penalty for low confidence

      const finalScore = Math.min(Math.max(Math.round(rawScore), 1), 10);

      // --- DYNAMIC CONTENT GENERATION ---
      let critique = "";
      let suggestion = "";

      if (weakPenalty > 1) {
        critique = "You sound hesitant. The frequent use of 'maybe' or 'I think' weakens your authority.";
        suggestion = "Use definitive phrases like 'I am confident' or 'My approach was' to show leadership.";
      } else if (structureWeight < 2) {
        critique = "Your answer lacks a clear beginning, middle, and end.";
        suggestion = "Try to set the context (Situation), explain your Action, and state the Result (STAR method).";
      } else if (techScore < 1 && wordCount > 20) {
        critique = "Good general explanation, but you missed an opportunity to show technical depth.";
        suggestion = "Explicitly mention the technologies or libraries you used to implement the solution.";
      } else {
        critique = "Outstanding response. You balanced structural logic with specific technical achievements.";
        suggestion = "Keep this rhythm. To improve further, try to mention a specific metric of success.";
      }

      setAiFeedback({ score: finalScore, critique, suggestion });
      setIsAnalyzing(false);
    }, 1800);
  };

  const handleStartInterview = () => {
    setIsInterviewMode(true);
    setTranscript("");
    setAiFeedback(null);
    speak(interviewQuestions[0]);
    setTimeout(() => startListening(), 2000);
  };

  return (
    <div className="gradient-mesh min-h-screen w-full p-6 md:p-12 font-sans overflow-x-hidden">
      <div className="max-w-7xl mx-auto">
        
        {/* IMPROVED VISIBILITY LOGO */}
        <header className="flex justify-between items-end mb-12">
          <div>
            <h1 className="text-6xl font-black tracking-tighter italic text-white drop-shadow-[0_0_20px_rgba(59,130,246,0.8)] mb-2">
              Persona<span className="text-blue-400">.ai</span>
            </h1>
            <nav className="mt-4 flex gap-6 items-center">
              <span className="text-blue-400 text-xs font-black uppercase tracking-[0.2em] border-b-2 border-blue-400 pb-1">Training Lab</span>
              <Link to="/history" className="text-slate-400 hover:text-white text-xs font-black uppercase tracking-[0.2em] transition-all">Sessions</Link>
            </nav>
          </div>
          <div className="text-right">
            <p className="text-slate-500 text-[10px] font-black uppercase tracking-widest mb-1 italic">V2.0 Heuristic Engine</p>
            <button onClick={() => auth.signOut()} className="text-[10px] text-slate-600 font-bold hover:text-red-400 uppercase">Sign Out</button>
          </div>
        </header>

        <div className="flex flex-col lg:flex-row gap-8">
          
          {/* MAIN RECORDING AREA */}
          <div className="lg:w-[70%] glass-card rounded-[3rem] p-10 flex flex-col h-[650px] relative border border-white/5 shadow-2xl">
            {isInterviewMode && (
              <div className="absolute top-0 left-0 w-full bg-blue-600/10 border-b border-blue-500/20 px-10 py-3 flex justify-between items-center backdrop-blur-md z-10 text-[9px] font-black text-blue-300 tracking-[0.3em] uppercase">
                Mock Interview Simulation Active
                <button onClick={() => setIsInterviewMode(false)} className="text-white/30 hover:text-white">Close</button>
              </div>
            )}

            <div className={`flex justify-between items-center mb-8 ${isInterviewMode ? 'mt-12' : ''}`}>
              <div className="flex items-center gap-4">
                <div className={`w-3 h-3 rounded-full ${isListening ? 'pulse-record bg-red-500 shadow-[0_0_15px_red]' : 'bg-slate-700'}`} />
                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">{isListening ? "Listening..." : "Analysis Ready"}</span>
              </div>
              <div className="flex gap-3">
                {!isListening && transcript && (
                  <button onClick={() => setIsEditing(!isEditing)} className="px-5 py-2 rounded-xl text-[10px] font-bold bg-slate-800 text-slate-400 uppercase">Correct Text</button>
                )}
                <button onClick={isListening ? stopListening : startListening} className={`px-12 py-4 rounded-full font-black text-xs uppercase tracking-widest transition-all ${isListening ? 'bg-red-500/20 text-red-500 border border-red-500/50' : 'bg-blue-600 text-white shadow-xl shadow-blue-600/30'}`}>
                  {isListening ? "End Session" : "Start Mic"}
                </button>
              </div>
            </div>

            {isInterviewMode && !isListening && !transcript ? (
               <div className="flex-1 flex flex-col justify-center items-center text-center animate-fadeIn px-12">
                 <h2 className="text-4xl font-light text-white mb-10 italic leading-tight">"{customQuestion || interviewQuestions[currentQIndex]}"</h2>
                 <button onClick={() => startListening()} className="px-10 py-4 rounded-full border border-blue-500/30 text-blue-400 font-black text-[10px] uppercase tracking-widest hover:bg-blue-600/10 transition-all shadow-lg shadow-blue-500/5">Respond Now</button>
               </div>
            ) : isEditing ? (
              <textarea value={transcript} onChange={(e) => setTranscript(e.target.value)} className="flex-1 bg-slate-950/40 rounded-[2rem] border border-blue-500/10 p-8 text-2xl text-slate-200 italic outline-none resize-none shadow-inner" />
            ) : (
              <div className="flex-1 overflow-y-auto text-3xl leading-relaxed text-slate-300 font-light italic pr-4 custom-scrollbar">
                {transcript || "The AI is waiting for your input to begin evaluation..."}
              </div>
            )}
          </div>

          {/* SIDEBAR */}
          <div className="lg:w-[30%] flex flex-col gap-6">
            <div className="glass-card rounded-[2.5rem] p-8 border border-blue-500/10 bg-blue-600/5">
               <h3 className="text-blue-400 text-[10px] font-black uppercase mb-4 tracking-widest">Simulations</h3>
               <button onClick={isInterviewMode ? () => setIsInterviewMode(false) : handleStartInterview} className={`w-full py-4 rounded-2xl font-bold text-[10px] uppercase tracking-widest transition-all ${isInterviewMode ? 'bg-slate-800 text-slate-500' : 'bg-blue-600 text-white shadow-xl'}`}>{isInterviewMode ? "Switch to Practice" : "Launch Interview Mode"}</button>
               {!isInterviewMode && (
                 <div className="mt-6 pt-6 border-t border-white/5">
                   <p className="text-[9px] text-slate-500 uppercase font-black mb-3 tracking-widest">Custom Simulation</p>
                   <div className="relative">
                     <input type="text" value={customQuestion} onChange={(e) => setCustomQuestion(e.target.value)} placeholder="Type a custom question..." className="w-full bg-slate-950/40 border border-white/10 rounded-xl px-4 py-4 text-xs text-slate-300 outline-none focus:border-blue-500/40" />
                     <button onClick={() => { setIsInterviewMode(true); setTranscript(""); setAiFeedback(null); speak(customQuestion); setTimeout(() => startListening(), 2000); }} className="absolute right-3 top-1/2 -translate-y-1/2 p-2 bg-blue-600 rounded-lg text-[10px] shadow-lg">🚀</button>
                   </div>
                 </div>
               )}
            </div>

            <div className="glass-card rounded-[2.5rem] p-8 bg-white/5 text-center">
              <h3 className="text-slate-500 text-[10px] font-bold uppercase mb-2 tracking-widest">Volume Metrics</h3>
              <p className="text-7xl font-black text-white">{wordCount}</p>
              <p className="text-[8px] text-slate-600 font-bold uppercase mt-2">Total Words Analyzed</p>
            </div>

            {/* UPGRADED AI REVIEW CARD */}
            <div className="glass-card rounded-[2.5rem] p-8 bg-blue-600/5 border border-blue-500/10 flex-1 flex flex-col shadow-inner">
              <h3 className="text-blue-400 text-[10px] font-black uppercase mb-6 tracking-widest">Heuristic Evaluation</h3>
              {!aiFeedback && !isAnalyzing ? (
                <div className="flex-1 flex flex-col justify-center items-center text-center opacity-40 px-6">
                   <p className="text-xs italic mb-4">Awaiting response completion for coaching insights.</p>
                   {!isListening && transcript && <button onClick={generateAIAnalysis} className="text-blue-400 font-bold text-[10px] uppercase tracking-widest border border-blue-400/20 px-6 py-2 rounded-lg hover:bg-blue-400 hover:text-white transition-all shadow-lg">Analyze Speech</button>}
                </div>
              ) : isAnalyzing ? (
                <div className="flex-1 flex flex-col justify-center items-center"><div className="w-8 h-8 border-2 border-blue-400 border-t-transparent rounded-full animate-spin mb-6 shadow-[0_0_15px_rgba(59,130,246,0.3)]" /><p className="text-[10px] font-bold text-blue-400 animate-pulse uppercase tracking-[0.2em]">Calculating Weighted Metrics...</p></div>
              ) : (
                <div className="flex-1 animate-fadeIn">
                  <div className="flex justify-between items-center mb-6">
                    <span className="text-[10px] text-slate-500 uppercase font-bold tracking-widest">Engine Score</span>
                    <span className="text-blue-400 font-black text-5xl tracking-tighter">{aiFeedback.score}/10</span>
                  </div>
                  <p className="text-slate-200 text-sm leading-relaxed italic mb-8 font-light">"{aiFeedback.critique}"</p>
                  <div className="p-6 bg-blue-600/10 rounded-3xl border border-blue-500/20 shadow-xl">
                    <p className="text-blue-300 text-[11px] font-medium leading-relaxed italic">
                      <span className="block not-italic font-black text-[8px] uppercase mb-2 opacity-50 tracking-[0.2em] text-blue-400">Coaching Strategy</span>
                      {aiFeedback.suggestion}
                    </p>
                  </div>
                  <button onClick={() => setAiFeedback(null)} className="mt-6 w-full text-[9px] text-slate-700 hover:text-white font-black uppercase tracking-widest transition-colors">Reset Coach</button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;