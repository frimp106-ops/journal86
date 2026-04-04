import React, { useState, useEffect } from 'react';
import { Camera, Heart, Moon, Sun, Zap, Brain, Coffee, Calendar, Download, Settings, User, LogOut, TrendingUp } from 'lucide-react';

// Main App Component
export default function Journal86App() {
  // Authentication State
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  
  // Navigation State
  const [currentView, setCurrentView] = useState('home');
  const [activeTab, setActiveTab] = useState('player');
  
  // Journal State
  const [journalEntries, setJournalEntries] = useState([]);
  const [currentSide, setCurrentSide] = useState('A'); // A, B, or M
  const [entryText, setEntryText] = useState('');
  
  // Mood State
  const [currentMood, setCurrentMood] = useState(3);
  const [moodHistory, setMoodHistory] = useState([
    { date: '2026-04-04', mood: 3, color: 'green' },
    { date: '2026-04-03', mood: 4, color: 'orange' },
    { date: '2026-04-02', mood: 2, color: 'teal' },
    { date: '2026-04-01', mood: 5, color: 'pink' },
    { date: '2026-03-31', mood: 3, color: 'green' },
    { date: '2026-03-30', mood: 4, color: 'orange' },
    { date: '2026-03-29', mood: 2, color: 'teal' },
  ]);
  
  // Symptom State
  const [symptoms, setSymptoms] = useState({
    hotFlashes: { intensity: 0, tracked: false },
    sleep: { intensity: 0, tracked: false },
    moodSwings: { intensity: 0, tracked: false },
    fatigue: { intensity: 0, tracked: false },
    brainFog: { intensity: 0, tracked: false },
    anxiety: { intensity: 0, tracked: false },
  });
  
  // Period Tracking
  const [periodData, setPeriodData] = useState({
    lastPeriod: null,
    cycleLength: 28,
    flow: null,
  });
  
  // Goals State
  const [goals, setGoals] = useState([
    { id: 1, name: 'Sleep 7+ hours', completed: false, icon: '😴' },
    { id: 2, name: 'Movement/Exercise', completed: false, icon: '🚶' },
    { id: 3, name: 'Calm Practice', completed: false, icon: '🧘' },
  ]);
  
  // Visualization State
  const [audioLevels, setAudioLevels] = useState(Array(120).fill(0));
  const [knightPosition, setKnightPosition] = useState(0);
  const [knightDirection, setKnightDirection] = useState(1);
  const [isPlaying, setIsPlaying] = useState(false);
  
  // Subscription State
  const [subscriptionTier, setSubscriptionTier] = useState('free'); // free, pro
  const [entriesThisMonth, setEntriesThisMonth] = useState(3);
  
  // Knight Rider Animation
  useEffect(() => {
    if (!isPlaying) return;
    
    const interval = setInterval(() => {
      setKnightPosition(prev => {
        const cols = 12;
        let newPos = prev + knightDirection;
        
        if (newPos >= cols - 1) {
          setKnightDirection(-1);
          return cols - 1;
        } else if (newPos <= 0) {
          setKnightDirection(1);
          return 0;
        }
        return newPos;
      });
      
      setAudioLevels(prev => 
        prev.map((_, i) => {
          const col = i % 12;
          const distance = Math.abs(col - knightPosition);
          if (distance === 0) return 1;
          if (distance === 1) return 0.6;
          if (distance === 2) return 0.3;
          return 0.1;
        })
      );
    }, 350);
    
    return () => clearInterval(interval);
  }, [isPlaying, knightPosition, knightDirection]);
  
  // Mood Ripple Visualization
  useEffect(() => {
    if (isPlaying || currentView !== 'player') return;
    
    setAudioLevels(prev => 
      prev.map((_, i) => {
        const row = Math.floor(i / 12);
        const col = i % 12;
        const centerRow = 5;
        const centerCol = 6;
        const distance = Math.sqrt(
          Math.pow(col - centerCol, 2) + Math.pow(row - centerRow, 2)
        );
        const maxDistance = Math.sqrt(
          Math.pow(centerCol, 2) + Math.pow(centerRow, 2)
        );
        const normalizedDistance = distance / maxDistance;
        const moodRadius = (currentMood / 5) * maxDistance;
        return distance <= moodRadius ? (1 - normalizedDistance) * 0.8 : 0.1;
      })
    );
  }, [currentMood, isPlaying, currentView]);
  
  // Helper Functions
  const saveMood = (level) => {
    setCurrentMood(level);
    const today = new Date().toISOString().split('T')[0];
    const colors = ['blue', 'teal', 'green', 'orange', 'pink'];
    setMoodHistory(prev => [
      { date: today, mood: level, color: colors[level - 1] },
      ...prev.filter(m => m.date !== today).slice(0, 6)
    ]);
  };
  
  const saveJournalEntry = () => {
    if (subscriptionTier === 'free' && entriesThisMonth >= 10) {
      alert('Free tier limit reached! Upgrade to Pro for unlimited entries.');
      return;
    }
    
    const entry = {
      id: Date.now(),
      side: currentSide,
      content: entryText,
      mood: currentMood,
      date: new Date().toISOString(),
    };
    
    setJournalEntries(prev => [entry, ...prev]);
    setEntryText('');
    setEntriesThisMonth(prev => prev + 1);
    alert('Entry saved!');
  };
  
  const trackSymptom = (symptomName, intensity) => {
    setSymptoms(prev => ({
      ...prev,
      [symptomName]: { intensity, tracked: true }
    }));
  };
  
  const toggleGoal = (goalId) => {
    setGoals(prev => prev.map(goal => 
      goal.id === goalId ? { ...goal, completed: !goal.completed } : goal
    ));
  };
  
  const downloadInformation = () => {
    if (subscriptionTier === 'free') {
      alert('Download feature available in Pro tier! Upgrade to export your information.');
      return;
    }
    
    // Generate simple text export
    const exportData = `
JOURNAL.86 - PERSONAL WELLNESS TRACKING INFORMATION
Generated: ${new Date().toLocaleDateString()}

MOOD HISTORY (Last 7 Days):
${moodHistory.map(m => `${m.date}: ${m.mood}/5`).join('\n')}

JOURNAL ENTRIES:
${journalEntries.slice(0, 5).map(e => `
Side ${e.side} - ${new Date(e.date).toLocaleDateString()}
${e.content}
`).join('\n---\n')}

SYMPTOMS TRACKED:
${Object.entries(symptoms).filter(([_, s]) => s.tracked).map(([name, s]) => 
  `${name}: ${s.intensity}/5`
).join('\n')}

This document contains self-tracked information only.
    `.trim();
    
    // Create download
    const blob = new Blob([exportData], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `journal86-export-${new Date().toISOString().split('T')[0]}.txt`;
    a.click();
  };
  
  // Login/Signup
  const handleAuth = (email, password, isSignup) => {
    // Simulate authentication
    setCurrentUser({ email, name: email.split('@')[0] });
    setIsAuthenticated(true);
  };
  
  const handleLogout = () => {
    setIsAuthenticated(false);
    setCurrentUser(null);
    setCurrentView('home');
  };
  
  // AUTHENTICATION SCREEN
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-stone-50 via-orange-50 to-stone-100 flex items-center justify-center p-4">
        <style>{`
          @import url('https://fonts.googleapis.com/css2?family=VT323&display=swap');
          
          body {
            margin: 0;
            font-family: 'Inter', -apple-system, sans-serif;
          }
          
          .pixel-time {
            font-family: 'VT323', monospace;
            letter-spacing: 0.1em;
          }
          
          .scanlines {
            background: linear-gradient(
              to bottom,
              transparent 50%,
              rgba(0, 0, 0, 0.02) 50%
            );
            background-size: 100% 4px;
            pointer-events: none;
          }
          
          .neon-accent {
            text-shadow: 0 0 8px rgba(249, 115, 22, 0.6);
          }
        `}</style>
        
        <div className="w-full max-w-md">
          {/* Logo */}
          <div className="text-center mb-8">
            <div className="text-5xl font-light text-stone-800 tracking-tight mb-2">
              Journal<span className="text-orange-500 neon-accent">.</span>86
            </div>
            <div className="text-sm text-stone-500">Your Wellness Mixtape</div>
          </div>
          
          {/* Auth Card */}
          <div className="bg-white rounded-2xl shadow-xl p-8 relative overflow-hidden">
            <div className="absolute inset-0 scanlines opacity-30" />
            
            <div className="relative z-10">
              <h2 className="text-2xl font-light text-stone-800 mb-6">Welcome Back</h2>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm text-stone-600 mb-2">Email</label>
                  <input
                    type="email"
                    placeholder="you@example.com"
                    className="w-full px-4 py-3 rounded-lg border border-stone-200 focus:border-orange-500 focus:outline-none"
                  />
                </div>
                
                <div>
                  <label className="block text-sm text-stone-600 mb-2">Password</label>
                  <input
                    type="password"
                    placeholder="••••••••"
                    className="w-full px-4 py-3 rounded-lg border border-stone-200 focus:border-orange-500 focus:outline-none"
                  />
                </div>
                
                <button
                  onClick={() => handleAuth('demo@journal86.com', 'demo', false)}
                  className="w-full bg-orange-500 text-white py-3 rounded-lg font-medium hover:bg-orange-600 transition-colors"
                >
                  Sign In
                </button>
                
                <div className="text-center text-sm text-stone-500">
                  Don't have an account?{' '}
                  <button
                    onClick={() => handleAuth('demo@journal86.com', 'demo', true)}
                    className="text-orange-500 hover:underline"
                  >
                    Sign up
                  </button>
                </div>
              </div>
              
              {/* Disclaimer */}
              <div className="mt-8 p-4 bg-orange-50 rounded-lg border border-orange-200">
                <div className="text-xs text-stone-600">
                  <strong>Important:</strong> JOURNAL.86 is a personal wellness tracking tool.
                  We do NOT provide medical advice, diagnosis, or treatment.
                  Always consult a healthcare professional for medical guidance.
                </div>
              </div>
            </div>
          </div>
          
          {/* Footer */}
          <div className="text-center mt-6 text-xs text-stone-500">
            Not medical advice. Consult a healthcare professional.
          </div>
        </div>
      </div>
    );
  }
  
  // MAIN APP
  return (
    <div className="min-h-screen bg-gradient-to-br from-stone-50 via-orange-50 to-stone-100">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=VT323&display=swap');
        
        body {
          margin: 0;
          font-family: 'Inter', -apple-system, sans-serif;
        }
        
        .pixel-time {
          font-family: 'VT323', monospace;
          letter-spacing: 0.1em;
        }
        
        .scanlines {
          background: linear-gradient(
            to bottom,
            transparent 50%,
            rgba(0, 0, 0, 0.02) 50%
          );
          background-size: 100% 4px;
          pointer-events: none;
        }
        
        .neon-accent {
          text-shadow: 0 0 8px rgba(249, 115, 22, 0.6);
        }
        
        .speaker-dot {
          transition: all 0.3s ease-out;
        }
      `}</style>
      
      <div className="max-w-2xl mx-auto p-4 pb-24">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <div className="text-xs uppercase tracking-wider text-orange-600 font-light mb-1">Mixtape</div>
            <div className="text-3xl font-light text-stone-800 tracking-tight">
              Journal<span className="text-orange-500 neon-accent">.</span>86
            </div>
          </div>
          <div className="text-right">
            <div className="text-xs text-stone-500 font-light">
              {new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
            </div>
            <div className="pixel-time text-2xl font-bold text-orange-500">
              {new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false })}
            </div>
          </div>
        </div>
        
        {/* Dot Grid Visualization */}
        <div className="bg-gradient-to-br from-stone-50 to-stone-100 rounded-2xl p-12 mb-8 relative overflow-hidden shadow-inner border border-stone-200">
          <div className="absolute inset-0 scanlines rounded-2xl" />
          
          {/* Circular Dot Grid */}
          <div className="relative w-full aspect-square flex items-center justify-center mb-6">
            {audioLevels.map((level, i) => {
              const row = Math.floor(i / 12);
              const col = i % 12;
              const centerRow = 5;
              const centerCol = 6;
              const distanceFromCenter = Math.sqrt(
                Math.pow(col - centerCol, 2) + Math.pow(row - centerRow, 2)
              );
              
              if (distanceFromCenter > 5.5) return null;
              
              const x = (col - centerCol) * 8.33;
              const y = (row - centerRow) * 10;
              
              let dotColor = 'bg-stone-800';
              
              if (isPlaying) {
                const distance = Math.abs(col - knightPosition);
                if (distance === 0) dotColor = 'bg-red-500';
                else if (distance === 1) dotColor = 'bg-orange-500';
                else if (distance === 2) dotColor = 'bg-yellow-500';
                else dotColor = 'bg-stone-700';
              } else {
                if (currentMood === 1) dotColor = 'bg-blue-400';
                else if (currentMood === 2) dotColor = 'bg-teal-400';
                else if (currentMood === 3) dotColor = 'bg-green-400';
                else if (currentMood === 4) dotColor = 'bg-orange-400';
                else if (currentMood === 5) dotColor = 'bg-pink-400';
              }
              
              return (
                <div
                  key={i}
                  className={`speaker-dot w-2.5 h-2.5 rounded-full ${dotColor} absolute`}
                  style={{
                    left: `calc(50% + ${x}%)`,
                    top: `calc(50% + ${y}%)`,
                    transform: 'translate(-50%, -50%)',
                    opacity: Math.max(0.15, level),
                    scale: `${1 + level * 0.3}`,
                  }}
                />
              );
            })}
          </div>
          
          {/* Status */}
          <div className="text-center relative z-10">
            <div className="text-sm font-light text-stone-600 mb-1">
              {isPlaying ? '🚗 Knight Rider Mode' : '○ Mood Visualization'}
            </div>
            <div className="text-xs text-stone-400">
              {isPlaying ? 'Press Stop' : `Mood: ${['Low', 'Fair', 'Neutral', 'Good', 'Great'][currentMood - 1]}`}
            </div>
          </div>
        </div>
        
        {/* Main Content */}
        {currentView === 'home' && (
          <div className="space-y-6">
            {/* Quick Stats */}
            <div className="grid grid-cols-3 gap-4">
              <div className="bg-white rounded-xl p-4 shadow-sm">
                <div className="text-2xl font-bold text-orange-500">{entriesThisMonth}</div>
                <div className="text-xs text-stone-500">Entries</div>
                {subscriptionTier === 'free' && (
                  <div className="text-xs text-stone-400 mt-1">{10 - entriesThisMonth} left</div>
                )}
              </div>
              <div className="bg-white rounded-xl p-4 shadow-sm">
                <div className="text-2xl font-bold text-green-500">{currentMood}</div>
                <div className="text-xs text-stone-500">Mood</div>
              </div>
              <div className="bg-white rounded-xl p-4 shadow-sm">
                <div className="text-2xl font-bold text-blue-500">
                  {Object.values(symptoms).filter(s => s.tracked).length}
                </div>
                <div className="text-xs text-stone-500">Tracked</div>
              </div>
            </div>
            
            {/* Quick Actions */}
            <div className="bg-white rounded-2xl p-6 shadow-sm">
              <h3 className="text-lg font-light text-stone-800 mb-4">Quick Actions</h3>
              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={() => setCurrentView('journal')}
                  className="p-4 bg-orange-50 rounded-xl hover:bg-orange-100 transition-colors"
                >
                  <div className="text-2xl mb-2">📝</div>
                  <div className="text-sm font-medium text-stone-700">New Entry</div>
                </button>
                <button
                  onClick={() => setCurrentView('mood')}
                  className="p-4 bg-green-50 rounded-xl hover:bg-green-100 transition-colors"
                >
                  <div className="text-2xl mb-2">💗</div>
                  <div className="text-sm font-medium text-stone-700">Track Mood</div>
                </button>
                <button
                  onClick={() => setCurrentView('symptoms')}
                  className="p-4 bg-blue-50 rounded-xl hover:bg-blue-100 transition-colors"
                >
                  <div className="text-2xl mb-2">🌡️</div>
                  <div className="text-sm font-medium text-stone-700">Symptoms</div>
                </button>
                <button
                  onClick={() => setCurrentView('goals')}
                  className="p-4 bg-purple-50 rounded-xl hover:bg-purple-100 transition-colors"
                >
                  <div className="text-2xl mb-2">🎯</div>
                  <div className="text-sm font-medium text-stone-700">Goals</div>
                </button>
              </div>
            </div>
            
            {/* Subscription Status */}
            {subscriptionTier === 'free' && (
              <div className="bg-gradient-to-r from-orange-500 to-pink-500 rounded-2xl p-6 text-white shadow-lg">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="text-lg font-medium mb-2">Upgrade to Pro</h3>
                    <p className="text-sm opacity-90 mb-4">
                      Unlimited entries, download your information, extended history
                    </p>
                    <div className="text-2xl font-bold">$4.99/month</div>
                  </div>
                  <button className="px-6 py-2 bg-white text-orange-500 rounded-lg font-medium hover:bg-orange-50 transition-colors">
                    Upgrade
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
        
        {currentView === 'journal' && (
          <div className="bg-white rounded-2xl p-6 shadow-sm">
            <h2 className="text-2xl font-light text-stone-800 mb-6">New Entry</h2>
            
            {/* Side Selector */}
            <div className="flex gap-2 mb-6">
              <button
                onClick={() => setCurrentSide('A')}
                className={`flex-1 py-3 rounded-lg font-medium transition-colors ${
                  currentSide === 'A'
                    ? 'bg-orange-500 text-white'
                    : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
                }`}
              >
                <Sun className="inline w-4 h-4 mr-2" />
                Side A (Morning)
              </button>
              <button
                onClick={() => setCurrentSide('B')}
                className={`flex-1 py-3 rounded-lg font-medium transition-colors ${
                  currentSide === 'B'
                    ? 'bg-orange-500 text-white'
                    : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
                }`}
              >
                <Moon className="inline w-4 h-4 mr-2" />
                Side B (Evening)
              </button>
              <button
                onClick={() => setCurrentSide('M')}
                className={`flex-1 py-3 rounded-lg font-medium transition-colors ${
                  currentSide === 'M'
                    ? 'bg-orange-500 text-white'
                    : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
                }`}
              >
                <Heart className="inline w-4 h-4 mr-2" />
                Side M (Wellbeing)
              </button>
            </div>
            
            {/* Entry Area */}
            <textarea
              value={entryText}
              onChange={(e) => setEntryText(e.target.value)}
              placeholder={
                currentSide === 'A'
                  ? 'Good morning! How are you feeling today?'
                  : currentSide === 'B'
                  ? 'How was your day? Any reflections?'
                  : 'How are you feeling? Any symptoms or thoughts to track?'
              }
              className="w-full h-64 p-4 rounded-lg border border-stone-200 focus:border-orange-500 focus:outline-none resize-none"
            />
            
            {/* Actions */}
            <div className="flex gap-3 mt-4">
              <button
                onClick={saveJournalEntry}
                className="flex-1 bg-orange-500 text-white py-3 rounded-lg font-medium hover:bg-orange-600 transition-colors"
              >
                Save Entry
              </button>
              <button
                onClick={() => setCurrentView('home')}
                className="px-6 bg-stone-100 text-stone-600 py-3 rounded-lg font-medium hover:bg-stone-200 transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        )}
        
        {currentView === 'mood' && (
          <div className="bg-white rounded-2xl p-6 shadow-sm">
            <h2 className="text-2xl font-light text-stone-800 mb-6">Track Your Mood</h2>
            
            {/* Mood Selector */}
            <div className="space-y-4 mb-8">
              {[
                { level: 1, label: 'Low', color: 'blue', emoji: '😔' },
                { level: 2, label: 'Fair', color: 'teal', emoji: '😐' },
                { level: 3, label: 'Neutral', color: 'green', emoji: '🙂' },
                { level: 4, label: 'Good', color: 'orange', emoji: '😊' },
                { level: 5, label: 'Great', color: 'pink', emoji: '😄' },
              ].map(({ level, label, color, emoji }) => (
                <button
                  key={level}
                  onClick={() => saveMood(level)}
                  className={`w-full p-4 rounded-xl border-2 transition-all ${
                    currentMood === level
                      ? `border-${color}-500 bg-${color}-50`
                      : 'border-stone-200 hover:border-stone-300'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">{emoji}</span>
                      <span className="font-medium text-stone-700">{label}</span>
                    </div>
                    {currentMood === level && (
                      <div className={`w-3 h-3 rounded-full bg-${color}-500`} />
                    )}
                  </div>
                </button>
              ))}
            </div>
            
            {/* Mood History */}
            <div className="mb-6">
              <h3 className="text-sm font-medium text-stone-600 mb-3">Last 7 Days</h3>
              <div className="flex gap-2">
                {moodHistory.map((m, i) => (
                  <div key={i} className="flex-1 text-center">
                    <div className={`w-full h-16 bg-${m.color}-400 rounded-lg mb-2`} />
                    <div className="text-xs text-stone-500">
                      {new Date(m.date).toLocaleDateString('en-US', { weekday: 'short' })}
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            <button
              onClick={() => setCurrentView('home')}
              className="w-full bg-stone-100 text-stone-600 py-3 rounded-lg font-medium hover:bg-stone-200 transition-colors"
            >
              Done
            </button>
          </div>
        )}
        
        {currentView === 'symptoms' && (
          <div className="bg-white rounded-2xl p-6 shadow-sm">
            <h2 className="text-2xl font-light text-stone-800 mb-6">Track Symptoms</h2>
            
            <div className="space-y-6">
              {[
                { key: 'hotFlashes', label: 'Hot Flashes', icon: '🔥' },
                { key: 'sleep', label: 'Sleep Issues', icon: '😴' },
                { key: 'moodSwings', label: 'Mood Swings', icon: '🎭' },
                { key: 'fatigue', label: 'Fatigue', icon: '😮‍💨' },
                { key: 'brainFog', label: 'Brain Fog', icon: '🧠' },
                { key: 'anxiety', label: 'Anxiety', icon: '😰' },
              ].map(({ key, label, icon }) => (
                <div key={key}>
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <span className="text-xl">{icon}</span>
                      <span className="font-medium text-stone-700">{label}</span>
                    </div>
                    <span className="text-sm text-stone-500">
                      {symptoms[key].intensity}/5
                    </span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="5"
                    value={symptoms[key].intensity}
                    onChange={(e) => trackSymptom(key, parseInt(e.target.value))}
                    className="w-full"
                  />
                </div>
              ))}
            </div>
            
            <button
              onClick={() => setCurrentView('home')}
              className="w-full mt-6 bg-orange-500 text-white py-3 rounded-lg font-medium hover:bg-orange-600 transition-colors"
            >
              Save Symptoms
            </button>
          </div>
        )}
        
        {currentView === 'goals' && (
          <div className="bg-white rounded-2xl p-6 shadow-sm">
            <h2 className="text-2xl font-light text-stone-800 mb-6">Today's Goals</h2>
            
            <div className="space-y-4">
              {goals.map((goal) => (
                <button
                  key={goal.id}
                  onClick={() => toggleGoal(goal.id)}
                  className={`w-full p-4 rounded-xl border-2 transition-all text-left ${
                    goal.completed
                      ? 'border-green-500 bg-green-50'
                      : 'border-stone-200 hover:border-stone-300'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">{goal.icon}</span>
                      <span className={`font-medium ${
                        goal.completed ? 'text-green-700 line-through' : 'text-stone-700'
                      }`}>
                        {goal.name}
                      </span>
                    </div>
                    {goal.completed && (
                      <div className="w-6 h-6 rounded-full bg-green-500 flex items-center justify-center text-white text-sm">
                        ✓
                      </div>
                    )}
                  </div>
                </button>
              ))}
            </div>
            
            <button
              onClick={() => setCurrentView('home')}
              className="w-full mt-6 bg-stone-100 text-stone-600 py-3 rounded-lg font-medium hover:bg-stone-200 transition-colors"
            >
              Done
            </button>
          </div>
        )}
        
        {currentView === 'settings' && (
          <div className="bg-white rounded-2xl p-6 shadow-sm">
            <h2 className="text-2xl font-light text-stone-800 mb-6">Settings</h2>
            
            <div className="space-y-6">
              {/* Account */}
              <div>
                <h3 className="text-sm font-medium text-stone-600 mb-3">Account</h3>
                <div className="p-4 bg-stone-50 rounded-lg">
                  <div className="text-sm text-stone-700">{currentUser?.email}</div>
                  <div className="text-xs text-stone-500 mt-1">
                    {subscriptionTier === 'free' ? 'Free Tier' : 'Pro Tier'}
                  </div>
                </div>
              </div>
              
              {/* Download */}
              <div>
                <h3 className="text-sm font-medium text-stone-600 mb-3">Export</h3>
                <button
                  onClick={downloadInformation}
                  className="w-full p-4 bg-orange-50 rounded-lg hover:bg-orange-100 transition-colors flex items-center justify-between"
                >
                  <div className="flex items-center gap-3">
                    <Download className="w-5 h-5 text-orange-500" />
                    <span className="font-medium text-stone-700">Download My Information</span>
                  </div>
                  {subscriptionTier === 'free' && (
                    <span className="text-xs text-orange-500 font-medium">Pro</span>
                  )}
                </button>
              </div>
              
              {/* Logout */}
              <button
                onClick={handleLogout}
                className="w-full p-4 bg-red-50 rounded-lg hover:bg-red-100 transition-colors flex items-center gap-3"
              >
                <LogOut className="w-5 h-5 text-red-500" />
                <span className="font-medium text-red-700">Log Out</span>
              </button>
            </div>
            
            <button
              onClick={() => setCurrentView('home')}
              className="w-full mt-6 bg-stone-100 text-stone-600 py-3 rounded-lg font-medium hover:bg-stone-200 transition-colors"
            >
              Back
            </button>
          </div>
        )}
      </div>
      
      {/* Bottom Navigation */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-stone-200 shadow-lg">
        <div className="max-w-2xl mx-auto px-4">
          <div className="flex items-center justify-around py-3">
            <button
              onClick={() => setCurrentView('home')}
              className={`flex flex-col items-center gap-1 ${
                currentView === 'home' ? 'text-orange-500' : 'text-stone-400'
              }`}
            >
              <TrendingUp className="w-6 h-6" />
              <span className="text-xs">Home</span>
            </button>
            <button
              onClick={() => setCurrentView('journal')}
              className={`flex flex-col items-center gap-1 ${
                currentView === 'journal' ? 'text-orange-500' : 'text-stone-400'
              }`}
            >
              <Coffee className="w-6 h-6" />
              <span className="text-xs">Journal</span>
            </button>
            <button
              onClick={() => setIsPlaying(!isPlaying)}
              className={`flex flex-col items-center gap-1 ${
                isPlaying ? 'text-orange-500' : 'text-stone-400'
              }`}
            >
              <Zap className="w-6 h-6" />
              <span className="text-xs">Play</span>
            </button>
            <button
              onClick={() => setCurrentView('mood')}
              className={`flex flex-col items-center gap-1 ${
                currentView === 'mood' ? 'text-orange-500' : 'text-stone-400'
              }`}
            >
              <Heart className="w-6 h-6" />
              <span className="text-xs">Mood</span>
            </button>
            <button
              onClick={() => setCurrentView('settings')}
              className={`flex flex-col items-center gap-1 ${
                currentView === 'settings' ? 'text-orange-500' : 'text-stone-400'
              }`}
            >
              <Settings className="w-6 h-6" />
              <span className="text-xs">Settings</span>
            </button>
          </div>
        </div>
      </div>
      
      {/* Footer Disclaimer */}
      <div className="fixed bottom-16 left-0 right-0 pointer-events-none">
        <div className="max-w-2xl mx-auto px-4">
          <div className="text-center text-xs text-stone-400 bg-white/80 backdrop-blur-sm py-2 rounded-lg">
            Not medical advice. Consult a healthcare professional.
          </div>
        </div>
      </div>
    </div>
  );
}
