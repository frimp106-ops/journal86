import React, { useState, useRef, useEffect } from 'react';
import { Home, FileText, Mic, Circle, Play, Pause, SkipBack, SkipForward, Volume2, ChevronLeft, ChevronRight, Download } from 'lucide-react';

export default function Journal86() {
  const [activeTab, setActiveTab] = useState('home');
  const [selectedCalm, setSelectedCalm] = useState('ocean');
  const [isRecording, setIsRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [musicPlaying, setMusicPlaying] = useState(false);
  const [currentTrack, setCurrentTrack] = useState('Calm Piano Mix');
  const [progress, setProgress] = useState(154);
  const [volume, setVolume] = useState(70);
  const [selectedDate, setSelectedDate] = useState(null);
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [journalEntry, setJournalEntry] = useState('');
  const [selectedMood, setSelectedMood] = useState('');
  const [symptoms, setSymptoms] = useState({
    hotFlash: false,
    nightSweat: false,
    poorSleep: false,
    brainFog: false,
    moodSwing: false,
    period: false
  });
  
  const [medications, setMedications] = useState({
    hrt: false,
    vitaminD: false,
    calcium: false,
    eveningPrimrose: false,
    magnesium: false,
    blackCohosh: false
  });
  
  const [customMedication, setCustomMedication] = useState('');
  
  const recordingInterval = useRef(null);
  const audioContext = useRef(null);

  // Mock entries data
  const [entries, setEntries] = useState({
    '2026-02-14': {
      text: 'Feeling better today. Ocean sounds really helped with anxiety.',
      mood: 'Good',
      symptoms: ['hotFlash', 'poorSleep'],
      voiceNote: null
    },
    '2026-02-13': {
      text: 'Tough night. Had 5 hot flashes. Could not sleep at all.',
      mood: 'Low',
      symptoms: ['hotFlash', 'nightSweat', 'poorSleep'],
      voiceNote: '2:34'
    }
  });

  // Cassette sounds
  const playInsertSound = () => {
    if (!audioContext.current) {
      audioContext.current = new (window.AudioContext || window.webkitAudioContext)();
    }
    const ctx = audioContext.current;
    const oscillator = ctx.createOscillator();
    const gainNode = ctx.createGain();
    
    oscillator.connect(gainNode);
    gainNode.connect(ctx.destination);
    
    oscillator.frequency.setValueAtTime(200, ctx.currentTime);
    oscillator.frequency.exponentialRampToValueAtTime(100, ctx.currentTime + 0.1);
    
    gainNode.gain.setValueAtTime(0.3, ctx.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.15);
    
    oscillator.start(ctx.currentTime);
    oscillator.stop(ctx.currentTime + 0.15);
  };

  const playStopSound = () => {
    if (!audioContext.current) {
      audioContext.current = new (window.AudioContext || window.webkitAudioContext)();
    }
    const ctx = audioContext.current;
    const oscillator = ctx.createOscillator();
    const gainNode = ctx.createGain();
    
    oscillator.connect(gainNode);
    gainNode.connect(ctx.destination);
    
    oscillator.frequency.setValueAtTime(150, ctx.currentTime);
    oscillator.frequency.exponentialRampToValueAtTime(80, ctx.currentTime + 0.1);
    
    gainNode.gain.setValueAtTime(0.3, ctx.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.12);
    
    oscillator.start(ctx.currentTime);
    oscillator.stop(ctx.currentTime + 0.12);
  };

  const startRecording = () => {
    playInsertSound();
    setIsRecording(true);
    setRecordingTime(0);
    recordingInterval.current = setInterval(() => {
      setRecordingTime(prev => prev + 1);
    }, 1000);
  };

  const stopRecording = () => {
    playStopSound();
    setIsRecording(false);
    if (recordingInterval.current) {
      clearInterval(recordingInterval.current);
    }
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const dotColors = [
    '#D1D5DB', '#D1D5DB', '#FDE047', '#FB923C', 
    '#FDA4AF', '#FDE68A', '#FEF3C7', '#D1D5DB', 
    '#D1D5DB', '#D1D5DB'
  ];

  const calmOptions = [
    { id: 'ocean', name: 'Ocean', color: '#1D9E75', bgColor: '#E1F5EE' },
    { id: 'rain', name: 'Rain', color: '#378ADD', bgColor: '#E6F1FB' },
    { id: 'fire', name: 'Fire', color: '#D85A30', bgColor: '#FAECE7' },
    { id: 'breathe', name: 'Breathe', color: '#14B8A6', bgColor: '#E6FFFA' }
  ];

  const moods = ['Great', 'Good', 'Okay', 'Low', 'Struggling'];

  const symptomsList = [
    { id: 'hotFlash', label: 'Hot flash' },
    { id: 'nightSweat', label: 'Night sweat' },
    { id: 'poorSleep', label: 'Poor sleep' },
    { id: 'brainFog', label: 'Brain fog' },
    { id: 'moodSwing', label: 'Mood swing' },
    { id: 'period', label: 'Period' }
  ];

  const medicationsList = [
    { id: 'hrt', label: 'HRT' },
    { id: 'vitaminD', label: 'Vitamin D' },
    { id: 'calcium', label: 'Calcium' },
    { id: 'eveningPrimrose', label: 'Evening primrose' },
    { id: 'magnesium', label: 'Magnesium' },
    { id: 'blackCohosh', label: 'Black cohosh' }
  ];

  const playlists = [
    { name: 'Calm & Peaceful', tracks: '20 tracks · 60 min', gradient: 'linear-gradient(135deg, #E1F5EE 0%, #9FE1CB 100%)', iconColor: '#0F6E56' },
    { name: 'Uplifting Energy', tracks: '20 tracks · 60 min', gradient: 'linear-gradient(135deg, #FAEEDA 0%, #FAC775 100%)', iconColor: '#854F0B' },
    { name: 'Sleep & Rest', tracks: '15 tracks · 90 min', gradient: 'linear-gradient(135deg, #EEEDFE 0%, #CECBF6 100%)', iconColor: '#534AB7' }
  ];

  const navItems = [
    { id: 'home', label: 'Home', icon: Home },
    { id: 'journal', label: 'Journal', icon: FileText },
    { id: 'record', label: 'Record', icon: Mic },
    { id: 'listen', label: 'Listen', icon: Circle }
  ];

  // Calendar helpers
  const getDaysInMonth = (date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();
    
    return { daysInMonth, startingDayOfWeek };
  };

  const formatDateKey = (date) => {
    return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
  };

  const getMoodColor = (mood) => {
    const colors = {
      'Great': '#10B981',
      'Good': '#84CC16',
      'Okay': '#F59E0B',
      'Low': '#F97316',
      'Struggling': '#EF4444'
    };
    return colors[mood] || '#9CA3AF';
  };

  return (
    <div className="min-h-screen bg-stone-50 pb-20">
      <style>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        .vinyl-spin {
          animation: spin 3s linear infinite;
        }
        .vinyl-spin-paused {
          animation-play-state: paused;
        }
        @keyframes wave {
          0%, 100% { height: 8px; }
          50% { height: 24px; }
        }
        .waveform-bar {
          animation: wave 0.8s ease-in-out infinite;
        }
        @keyframes pulse {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.6; transform: scale(1.2); }
        }
        .dot-pulse {
          animation: pulse 2s ease-in-out infinite;
        }
        @keyframes rain-fall {
          0% { 
            transform: translateY(0); 
            opacity: 0.3; 
          }
          5% { 
            opacity: 1; 
          }
          95% { 
            opacity: 1; 
          }
          100% { 
            transform: translateY(200px); 
            opacity: 0.3; 
          }
        }
        .dot-rain {
          animation: rain-fall 3s ease-in infinite;
        }
        @keyframes fire-flicker {
          0% { 
            transform: translate(0, 0) scale(1); 
            opacity: 1; 
          }
          15% { 
            transform: translate(-2px, -3px) scale(1.05); 
            opacity: 0.95; 
          }
          30% { 
            transform: translate(2px, 2px) scale(0.98); 
            opacity: 0.9; 
          }
          45% { 
            transform: translate(-3px, -4px) scale(1.03); 
            opacity: 1; 
          }
          60% { 
            transform: translate(2px, 3px) scale(0.97); 
            opacity: 0.85; 
          }
          75% { 
            transform: translate(-2px, -2px) scale(1.04); 
            opacity: 0.95; 
          }
          90% { 
            transform: translate(3px, 1px) scale(0.99); 
            opacity: 0.9; 
          }
          100% { 
            transform: translate(0, 0) scale(1); 
            opacity: 1; 
          }
        }
        .dot-fire {
          animation: fire-flicker 2s ease-in-out infinite;
        }
        @keyframes breathe-pulse {
          0%, 100% { 
            opacity: 0.3; 
            transform: scale(0.9);
          }
          50% { 
            opacity: 1; 
            transform: scale(1.2);
          }
        }
        .dot-breathe {
          animation: breathe-pulse 4s ease-in-out infinite;
        }
        @keyframes cassette-spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        .cassette-spool-spin {
          animation: cassette-spin 2s linear infinite;
        }
      `}</style>

      {/* Header */}
      <div className="bg-stone-50 px-5 pt-3 pb-2 border-b border-stone-200">
        <div className="flex justify-between items-baseline mb-1">
          <div className="text-[11px] tracking-[2px] text-orange-500 font-semibold">MIXTAPE</div>
          <div className="text-[11px] text-stone-500">
            {new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
          </div>
        </div>
        <div className="flex justify-between items-baseline">
          <div className="text-[28px] font-light tracking-tight text-stone-900">Journal.86</div>
          <div className="text-2xl font-light text-orange-500">
            {new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false })}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="px-5">
        
        {/* HOME TAB */}
        {activeTab === 'home' && (
          <div className="pt-6">
            <div className="mb-6">
              <div className="text-sm text-stone-500">How are you feeling?</div>
            </div>

            {/* Dots with Animation */}
            <div className="bg-white rounded-2xl p-8 mb-6 border border-stone-200/50">
              <svg viewBox="0 0 240 200" className="w-full h-auto" style={{ overflow: 'visible' }}>
                <g>
                  {Array.from({ length: 10 }, (_, row) =>
                    Array.from({ length: 12 }, (_, col) => {
                      const animationClass = 
                        selectedCalm === 'ocean' ? 'dot-pulse' :
                        selectedCalm === 'rain' ? 'dot-rain' :
                        selectedCalm === 'fire' ? 'dot-fire' :
                        selectedCalm === 'breathe' ? 'dot-breathe' : '';
                      
                      // Generate random delay for rain and fire
                      const randomDelay = Math.random() * 3;
                      const fireRandomDelay = Math.random() * 1.5;
                      const breatheDelay = (row * 12 + col) * 0.01; // Synchronized wave
                      
                      const delay = 
                        selectedCalm === 'ocean' ? (row * 12 + col) * 0.02 :
                        selectedCalm === 'rain' ? randomDelay :
                        selectedCalm === 'fire' ? fireRandomDelay :
                        selectedCalm === 'breathe' ? breatheDelay : 0;
                      
                      return (
                        <circle
                          key={`home-${row}-${col}`}
                          cx={col * 20 + 10}
                          cy={row * 20 + 10}
                          r={4}
                          fill={dotColors[row]}
                          className={animationClass}
                          style={{ 
                            animationDelay: `${delay}s`,
                            transformOrigin: 'center'
                          }}
                        />
                      );
                    })
                  )}
                </g>
              </svg>
            </div>

            {/* Calm Selector */}
            <div className="mb-6">
              <div className="text-xs text-stone-500 mb-2">Choose your calm</div>
              <div className="grid grid-cols-2 gap-2">
                {calmOptions.map((option) => (
                  <button
                    key={option.id}
                    onClick={() => setSelectedCalm(option.id)}
                    className={`rounded-lg p-3 border transition-all ${
                      selectedCalm === option.id
                        ? 'border-2'
                        : 'border'
                    }`}
                    style={{
                      borderColor: selectedCalm === option.id ? option.color : '#E7E5E4',
                      backgroundColor: selectedCalm === option.id ? option.bgColor : 'white'
                    }}
                  >
                    <div className="text-sm font-normal text-stone-900">{option.name}</div>
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* JOURNAL TAB */}
        {activeTab === 'journal' && !selectedDate && (
          <div className="pt-6">
            {/* Calendar Month Navigation */}
            <div className="flex items-center justify-between mb-4">
              <button
                onClick={() => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1))}
                className="p-2 active:scale-95"
              >
                <ChevronLeft className="w-5 h-5 text-stone-600" />
              </button>
              <div className="text-[17px] font-medium text-stone-900">
                {currentMonth.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
              </div>
              <button
                onClick={() => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1))}
                className="p-2 active:scale-95"
              >
                <ChevronRight className="w-5 h-5 text-stone-600" />
              </button>
            </div>

            {/* Calendar */}
            <div className="bg-white rounded-2xl p-4 mb-5 border border-stone-200/50">
              <div className="grid grid-cols-7 gap-2 mb-3">
                {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((day, i) => (
                  <div key={i} className="text-center text-xs text-stone-400 font-medium">
                    {day}
                  </div>
                ))}
              </div>
              <div className="grid grid-cols-7 gap-2">
                {(() => {
                  const { daysInMonth, startingDayOfWeek } = getDaysInMonth(currentMonth);
                  const days = [];
                  
                  for (let i = 0; i < startingDayOfWeek; i++) {
                    days.push(<div key={`empty-${i}`} />);
                  }
                  
                  for (let day = 1; day <= daysInMonth; day++) {
                    const date = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day);
                    const dateKey = formatDateKey(date);
                    const entry = entries[dateKey];
                    const isToday = dateKey === formatDateKey(new Date());
                    
                    days.push(
                      <button
                        key={day}
                        onClick={() => setSelectedDate(date)}
                        className={`aspect-square rounded-lg flex flex-col items-center justify-center text-sm relative ${
                          isToday ? 'bg-orange-100 text-orange-900' : 'text-stone-900'
                        }`}
                      >
                        {day}
                        {entry && (
                          <div
                            className="w-1.5 h-1.5 rounded-full mt-1"
                            style={{ backgroundColor: getMoodColor(entry.mood) }}
                          />
                        )}
                      </button>
                    );
                  }
                  
                  return days;
                })()}
              </div>
            </div>

            {/* Download Report */}
            <button className="w-full bg-white border border-stone-200 rounded-xl p-4 mb-4 flex items-center justify-center gap-2 active:bg-stone-50">
              <Download className="w-5 h-5 text-stone-600" strokeWidth={1.5} />
              <span className="text-[15px] text-stone-900">Download report</span>
            </button>

            {/* Recent Entries */}
            <div className="mb-4">
              <div className="text-sm font-medium text-stone-900 mb-3">Recent entries</div>
              {Object.entries(entries).reverse().slice(0, 3).map(([date, entry]) => (
                <button
                  key={date}
                  onClick={() => setSelectedDate(new Date(date))}
                  className="w-full bg-white rounded-xl p-4 mb-2 border border-stone-200/50 text-left active:bg-stone-50"
                >
                  <div className="flex items-center gap-2 mb-1">
                    <div
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: getMoodColor(entry.mood) }}
                    />
                    <span className="text-xs text-stone-500">
                      {new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                    </span>
                    <span className="text-xs text-stone-400">• {entry.mood}</span>
                  </div>
                  <div className="text-sm text-stone-700 line-clamp-2">{entry.text}</div>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* JOURNAL ENTRY FORM */}
        {activeTab === 'journal' && selectedDate && (
          <div className="pt-6">
            <button
              onClick={() => setSelectedDate(null)}
              className="text-sm text-teal-600 mb-4"
            >
              ← Back to calendar
            </button>

            <div className="text-[24px] font-light tracking-tight text-stone-900 mb-6">
              {selectedDate.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
            </div>

            {/* Text Entry */}
            <div className="mb-4">
              <label className="text-sm text-stone-600 mb-2 block">How was your day?</label>
              <textarea
                value={journalEntry}
                onChange={(e) => setJournalEntry(e.target.value)}
                placeholder="Write your thoughts..."
                className="w-full bg-white border border-stone-200 rounded-xl p-4 min-h-[120px] text-[15px] focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500"
              />
            </div>

            {/* Symptoms */}
            <div className="mb-4">
              <label className="text-sm text-stone-600 mb-2 block">Symptoms today</label>
              <div className="grid grid-cols-2 gap-2">
                {symptomsList.map((symptom) => (
                  <button
                    key={symptom.id}
                    onClick={() => setSymptoms(prev => ({ ...prev, [symptom.id]: !prev[symptom.id] }))}
                    className={`p-3 rounded-lg border text-sm text-left ${
                      symptoms[symptom.id]
                        ? 'bg-orange-50 border-orange-500 text-orange-900'
                        : 'bg-white border-stone-200 text-stone-700'
                    }`}
                  >
                    {symptom.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Medications */}
            <div className="mb-4">
              <div className="flex items-center gap-2 mb-2">
                <label className="text-sm text-stone-600">
                  Log medication and supplements taken <span className="text-stone-400">(optional)</span>
                </label>
                <button
                  onClick={() => alert('This is a tracking tool only, not medical advice. Consult your healthcare provider before starting or stopping any medication.')}
                  className="w-4 h-4 rounded-full bg-stone-200 flex items-center justify-center active:scale-95"
                >
                  <span className="text-[10px] text-stone-600 font-semibold">i</span>
                </button>
              </div>
              <div className="grid grid-cols-2 gap-2 mb-2">
                {medicationsList.map((medication) => (
                  <button
                    key={medication.id}
                    onClick={() => setMedications(prev => ({ ...prev, [medication.id]: !prev[medication.id] }))}
                    className={`p-3 rounded-lg border text-sm text-left ${
                      medications[medication.id]
                        ? 'bg-teal-50 border-teal-500 text-teal-900'
                        : 'bg-white border-stone-200 text-stone-700'
                    }`}
                  >
                    {medication.label}
                  </button>
                ))}
              </div>
              <input
                type="text"
                value={customMedication}
                onChange={(e) => setCustomMedication(e.target.value)}
                placeholder="Other (e.g., Aspirin, Fish oil)"
                className="w-full bg-white border border-stone-200 rounded-lg p-3 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500"
              />
            </div>

            {/* Mood */}
            <div className="mb-6">
              <label className="text-sm text-stone-600 mb-2 block">Mood</label>
              <div className="flex gap-2">
                {moods.map((mood) => (
                  <button
                    key={mood}
                    onClick={() => setSelectedMood(mood)}
                    className={`flex-1 p-2 rounded-lg border text-xs ${
                      selectedMood === mood
                        ? 'border-teal-500 bg-teal-50 text-teal-900'
                        : 'bg-white border-stone-200 text-stone-700'
                    }`}
                  >
                    {mood}
                  </button>
                ))}
              </div>
            </div>

            {/* Save Button */}
            <button className="w-full bg-orange-500 text-white rounded-xl p-4 active:scale-[0.98] transition-transform">
              <div className="text-[17px] font-normal">Save entry</div>
            </button>
          </div>
        )}

        {/* RECORD TAB */}
        {activeTab === 'record' && (
          <div className="pt-6">
            <div className="mb-6">
              <div className="text-[28px] font-light tracking-tight text-stone-900">Voice note</div>
              <div className="text-sm text-stone-500 mt-1">
                {isRecording ? 'Recording...' : 'Record your thoughts'}
              </div>
            </div>

            <div className="bg-white rounded-2xl p-8 mb-5 border border-stone-200/50">
              <div className="relative" style={{ width: '100%', paddingBottom: '83.33%' }}>
                <svg 
                  viewBox="0 0 240 200" 
                  className="absolute inset-0 w-full h-full"
                >
                  {/* Dot Grid */}
                  <g>
                    {Array.from({ length: 10 }, (_, row) =>
                      Array.from({ length: 12 }, (_, col) => (
                        <circle
                          key={`record-${row}-${col}`}
                          cx={col * 20 + 10}
                          cy={row * 20 + 10}
                          r={4}
                          fill={dotColors[row]}
                        />
                      ))
                    )}
                  </g>
                  
                  {/* Cassette Tape */}
                  <g transform="translate(120, 100)">
                    <rect x="-90" y="-50" width="180" height="100" rx="4" fill="#1a1a1a" opacity="0.95"/>
                    <rect x="-80" y="-40" width="160" height="50" rx="2" fill="#2a2a2a" opacity="0.8"/>
                    <rect x="-70" y="-35" width="140" height="40" fill="#FAFAF9"/>
                    <text x="0" y="-20" textAnchor="middle" fontSize="8" fill="#FF8C42" fontWeight="600" letterSpacing="1">JOURNAL.86</text>
                    <text x="0" y="-8" textAnchor="middle" fontSize="6" fill="#78716C" letterSpacing="0.5">VOICE NOTE · MIXTAPE</text>
                    
                    {/* Left spool */}
                    <g transform="translate(-45, 20)">
                      <g className={isRecording ? 'cassette-spool-spin' : ''}>
                        <circle cx="0" cy="0" r="18" fill="#3a3a3a"/>
                        <circle cx="0" cy="0" r="15" fill="none" stroke="#FF8C42" strokeWidth="1" opacity="0.4"/>
                        <circle cx="0" cy="0" r="10" fill="none" stroke="#FB923C" strokeWidth="1" opacity="0.5"/>
                        <circle cx="0" cy="0" r="5" fill="#2a2a2a"/>
                        <line x1="-12" y1="0" x2="12" y2="0" stroke="#4a4a4a" strokeWidth="1"/>
                        <line x1="0" y1="-12" x2="0" y2="12" stroke="#4a4a4a" strokeWidth="1"/>
                        <circle cx="0" cy="0" r="3" fill="#1a1a1a"/>
                      </g>
                    </g>
                    
                    {/* Right spool */}
                    <g transform="translate(45, 20)">
                      <g className={isRecording ? 'cassette-spool-spin' : ''}>
                        <circle cx="0" cy="0" r="18" fill="#3a3a3a"/>
                        <circle cx="0" cy="0" r="15" fill="none" stroke="#14B8A6" strokeWidth="1" opacity="0.4"/>
                        <circle cx="0" cy="0" r="10" fill="none" stroke="#5DCAA5" strokeWidth="1" opacity="0.5"/>
                        <circle cx="0" cy="0" r="5" fill="#2a2a2a"/>
                        <line x1="-12" y1="0" x2="12" y2="0" stroke="#4a4a4a" strokeWidth="1"/>
                        <line x1="0" y1="-12" x2="0" y2="12" stroke="#4a4a4a" strokeWidth="1"/>
                        <circle cx="0" cy="0" r="3" fill="#1a1a1a"/>
                      </g>
                    </g>
                    
                    <rect x="-27" y="16" width="54" height="8" fill="#4a3520" opacity="0.6"/>
                    <circle cx="-75" cy="-42" r="2" fill="#2a2a2a"/>
                    <circle cx="75" cy="-42" r="2" fill="#2a2a2a"/>
                    <circle cx="-75" cy="42" r="2" fill="#2a2a2a"/>
                    <circle cx="75" cy="42" r="2" fill="#2a2a2a"/>
                  </g>
                </svg>
              </div>

              {/* Waveform */}
              <div className="flex justify-center gap-1 h-6 items-center mt-5 mb-5">
                {Array.from({ length: 10 }).map((_, i) => (
                  <div
                    key={i}
                    className={`w-1 bg-teal-500 rounded-full ${isRecording ? 'waveform-bar' : ''}`}
                    style={{
                      height: isRecording ? '8px' : '4px',
                      animationDelay: `${i * 0.1}s`,
                      opacity: isRecording ? (i < 8 ? 1 : 0.3) : 0.3
                    }}
                  />
                ))}
              </div>

              {/* Tape Controls */}
              <div className="bg-stone-800 rounded-lg p-3 mt-5">
                <div className="flex justify-center gap-2">
                  <div className="flex flex-col items-center gap-1">
                    <button className="w-9 h-9 bg-stone-700 border border-stone-600 rounded flex items-center justify-center active:scale-95 transition-transform">
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="#A8A29E">
                        <polygon points="11 19 2 12 11 5 11 19"/>
                        <polygon points="22 19 13 12 22 5 22 19"/>
                      </svg>
                    </button>
                    <span className="text-[9px] text-stone-400">Rewind</span>
                  </div>

                  <div className="flex flex-col items-center gap-1">
                    <button className="w-9 h-9 bg-stone-700 border border-stone-600 rounded flex items-center justify-center active:scale-95 transition-transform">
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="#A8A29E">
                        <polygon points="5 3 19 12 5 21 5 3"/>
                      </svg>
                    </button>
                    <span className="text-[9px] text-stone-400">Play</span>
                  </div>

                  <div className="flex flex-col items-center gap-1">
                    <button 
                      onClick={isRecording ? stopRecording : null}
                      className="w-9 h-9 bg-stone-700 border border-stone-600 rounded flex items-center justify-center active:scale-95 transition-transform"
                    >
                      <svg width="10" height="10" viewBox="0 0 24 24" fill="#A8A29E">
                        <rect x="4" y="4" width="16" height="16" rx="1"/>
                      </svg>
                    </button>
                    <span className="text-[9px] text-stone-400">Stop</span>
                  </div>

                  <div className="flex flex-col items-center gap-1">
                    <button 
                      onClick={isRecording ? stopRecording : startRecording}
                      className={`w-9 h-9 border rounded flex items-center justify-center active:scale-95 transition-transform ${
                        isRecording ? 'bg-stone-600 border-orange-500' : 'bg-stone-700 border-stone-600'
                      }`}
                    >
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="#EF4444">
                        <circle cx="12" cy="12" r="8"/>
                      </svg>
                    </button>
                    <span className="text-[9px] text-orange-500 font-medium">Record</span>
                  </div>

                  <div className="flex flex-col items-center gap-1">
                    <button className="w-9 h-9 bg-stone-700 border border-stone-600 rounded flex items-center justify-center active:scale-95 transition-transform">
                      <svg width="10" height="10" viewBox="0 0 24 24" fill="#A8A29E">
                        <rect x="6" y="4" width="4" height="16" rx="1"/>
                        <rect x="14" y="4" width="4" height="16" rx="1"/>
                      </svg>
                    </button>
                    <span className="text-[9px] text-stone-400">Pause</span>
                  </div>

                  <div className="flex flex-col items-center gap-1">
                    <button className="w-9 h-9 bg-stone-700 border border-stone-600 rounded flex items-center justify-center active:scale-95 transition-transform">
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="#A8A29E">
                        <polygon points="13 5 22 12 13 19 13 5"/>
                        <polygon points="2 5 11 12 2 19 2 5"/>
                      </svg>
                    </button>
                    <span className="text-[9px] text-stone-400">FF</span>
                  </div>

                  <div className="flex flex-col items-center gap-1">
                    <button 
                      onClick={() => {
                        if (recordingTime > 0 && !isRecording) {
                          setRecordingTime(0);
                        }
                      }}
                      disabled={recordingTime === 0 && !isRecording}
                      className={`w-9 h-9 border rounded flex items-center justify-center active:scale-95 transition-transform ${
                        recordingTime > 0 && !isRecording 
                          ? 'bg-stone-700 border-stone-600 cursor-pointer' 
                          : 'bg-stone-800 border-stone-700 opacity-30 cursor-not-allowed'
                      }`}
                    >
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="#A8A29E" stroke="#A8A29E" strokeWidth="1.5">
                        <path d="M5 3h14v2H5z"/>
                        <path d="M9 17v-7l6 3.5z"/>
                      </svg>
                    </button>
                    <span className={`text-[8px] ${recordingTime > 0 && !isRecording ? 'text-red-500 font-medium' : 'text-stone-600'}`}>Eject-DEL</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="text-center text-2xl font-light text-orange-500 mb-5 font-mono">
              {formatTime(recordingTime)}
            </div>

            <div className="bg-teal-500/5 rounded-lg p-4 border border-teal-500/20">
              <div className="text-xs text-teal-900 leading-relaxed text-center">
                Tap the red ● button to start recording
              </div>
            </div>
          </div>
        )}

        {/* LISTEN TAB */}
        {activeTab === 'listen' && (
          <div className="pt-6">
            <div className="mb-6">
              <div className="text-[28px] font-light tracking-tight text-stone-900">Listen</div>
              <div className="text-sm text-stone-500 mt-1">Music for your mood</div>
            </div>

            <div className="bg-white rounded-2xl p-8 mb-5 border border-stone-200/50">
              <div className="relative" style={{ width: '100%', paddingBottom: '83.33%' }}>
                <svg 
                  viewBox="0 0 240 200" 
                  className="absolute inset-0 w-full h-full"
                >
                  {/* Dot Grid */}
                  <g>
                    {Array.from({ length: 10 }, (_, row) =>
                      Array.from({ length: 12 }, (_, col) => (
                        <circle
                          key={`listen-${row}-${col}`}
                          cx={col * 20 + 10}
                          cy={row * 20 + 10}
                          r={4}
                          fill={dotColors[row]}
                        />
                      ))
                    )}
                  </g>
                  
                  {/* Vinyl Overlay */}
                  <g className={musicPlaying ? 'vinyl-spin' : 'vinyl-spin vinyl-spin-paused'} style={{ transformOrigin: '120px 100px' }}>
                    <circle cx="120" cy="100" r="75" fill="#1a1a1a" opacity="0.95"/>
                    <circle cx="120" cy="100" r="68" fill="none" stroke="#FDE047" strokeWidth="2" opacity="0.3"/>
                    <circle cx="120" cy="100" r="60" fill="none" stroke="#FB923C" strokeWidth="2" opacity="0.4"/>
                    <circle cx="120" cy="100" r="52" fill="none" stroke="#FDA4AF" strokeWidth="2" opacity="0.5"/>
                    <circle cx="120" cy="100" r="44" fill="none" stroke="#FDE68A" strokeWidth="2" opacity="0.4"/>
                    <circle cx="120" cy="100" r="64" fill="none" stroke="#2a2a2a" strokeWidth="0.5" opacity="0.6"/>
                    <circle cx="120" cy="100" r="56" fill="none" stroke="#2a2a2a" strokeWidth="0.5" opacity="0.6"/>
                    <circle cx="120" cy="100" r="48" fill="none" stroke="#2a2a2a" strokeWidth="0.5" opacity="0.6"/>
                    <circle cx="120" cy="100" r="32" fill="#FAFAF9"/>
                    <text x="120" y="95" textAnchor="middle" fontSize="9" fill="#FF8C42" fontWeight="600" letterSpacing="1">JOURNAL.86</text>
                    <text x="120" y="105" textAnchor="middle" fontSize="6" fill="#78716C" letterSpacing="0.5">MIXTAPE</text>
                    <circle cx="120" cy="100" r="6" fill="#1a1a1a"/>
                    <line x1="170" y1="65" x2="150" y2="85" stroke="#A8A29E" strokeWidth="1.5" strokeLinecap="round" opacity="0.6"/>
                    <circle cx="170" cy="65" r="3" fill="#A8A29E" opacity="0.6"/>
                  </g>
                </svg>
              </div>

              <div className="text-center mt-5 mb-5">
                <div className="text-[17px] font-normal text-stone-900 mb-1">{currentTrack}</div>
                <div className="text-xs text-stone-500">Relaxing instrumentals</div>
              </div>

              <div className="mb-4">
                <input
                  type="range"
                  min="0"
                  max="2712"
                  value={progress}
                  onChange={(e) => setProgress(e.target.value)}
                  className="w-full"
                />
                <div className="flex justify-between text-[11px] text-stone-400 mt-1">
                  <span>2:34</span>
                  <span>45:12</span>
                </div>
              </div>

              <div className="flex justify-center items-center gap-8">
                <button className="active:scale-95 transition-transform">
                  <SkipBack className="w-6 h-6 text-stone-500" strokeWidth={1.5} />
                </button>
                <button
                  onClick={() => setMusicPlaying(!musicPlaying)}
                  className="w-14 h-14 rounded-full bg-orange-500 flex items-center justify-center shadow-lg shadow-orange-500/25 active:scale-95 transition-transform"
                >
                  {musicPlaying ? (
                    <Pause className="w-6 h-6 text-white" fill="white" />
                  ) : (
                    <Play className="w-6 h-6 text-white ml-1" fill="white" />
                  )}
                </button>
                <button className="active:scale-95 transition-transform">
                  <SkipForward className="w-6 h-6 text-stone-500" strokeWidth={1.5} />
                </button>
              </div>
            </div>

            <div className="mb-4">
              <div className="text-[15px] font-medium text-stone-900 mb-3">Playlists</div>
              <div className="space-y-2">
                {playlists.map((playlist) => (
                  <button
                    key={playlist.name}
                    className="w-full bg-white rounded-xl p-4 border border-stone-200/50 flex items-center gap-3 active:bg-stone-50 transition-colors"
                  >
                    <div
                      className="w-10 h-10 rounded-lg flex items-center justify-center"
                      style={{ background: playlist.gradient }}
                    >
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={playlist.iconColor} strokeWidth="1.5">
                        <path d="M9.59 4.59A2 2 0 1 1 11 8H2m10.59 11.41A2 2 0 1 0 14 16H2m15.73-8.27A2.5 2.5 0 1 1 19.5 12H2"/>
                      </svg>
                    </div>
                    <div className="flex-1 text-left">
                      <div className="text-[15px] font-normal text-stone-900">{playlist.name}</div>
                      <div className="text-xs text-stone-500">{playlist.tracks}</div>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Bottom Navigation */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-stone-200/50 px-2 py-3">
        <div className="flex justify-around items-center max-w-2xl mx-auto">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className="flex flex-col items-center gap-1 active:scale-95 transition-transform"
              >
                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                  isActive ? 'bg-teal-500' : 'bg-stone-200'
                }`}>
                  <Icon
                    className={`w-4 h-4 ${isActive ? 'text-white' : 'text-stone-600'}`}
                    strokeWidth={1.5}
                  />
                </div>
                <span className={`text-[11px] ${
                  isActive ? 'text-teal-500 font-medium' : 'text-stone-600'
                }`}>
                  {item.label}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}

