import React, { useState, useRef, useEffect } from 'react';
import { Home, Heart, FileText, Wind, Mic, Circle, Play, Pause, SkipBack, SkipForward, Volume2 } from 'lucide-react';

export default function Journal86() {
  const [activeTab, setActiveTab] = useState('home');
  const [isPlaying, setIsPlaying] = useState(true);
  const [isRecording, setIsRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [selectedCalm, setSelectedCalm] = useState(null);
  const [musicPlaying, setMusicPlaying] = useState(false);
  const [currentTrack, setCurrentTrack] = useState('Calm Piano Mix');
  const [progress, setProgress] = useState(154);
  const [volume, setVolume] = useState(70);
  
  const recordingInterval = useRef(null);
  const audioContext = useRef(null);

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

  // Recording controls
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

  // Dot grid data
  const dotColors = [
    '#D1D5DB', '#D1D5DB', '#FDE047', '#FB923C', 
    '#FDA4AF', '#FDE68A', '#FEF3C7', '#D1D5DB', 
    '#D1D5DB', '#D1D5DB'
  ];

  const calmExperiences = [
    {
      id: 'ocean',
      name: 'Flo: Ocean',
      subtitle: 'Gentle waves',
      icon: Wind,
      color: '#1D9E75',
      bgColor: '#E1F5EE',
      vinylGrooves: ['#5DCAA5', '#1D9E75', '#0F6E56', '#5DCAA5', '#9FE1CB']
    },
    {
      id: 'rain',
      name: 'Flo: Rain',
      subtitle: 'Soft rainfall',
      icon: Wind,
      color: '#378ADD',
      bgColor: '#E6F1FB',
      vinylGrooves: ['#85B7EB', '#378ADD', '#185FA5', '#85B7EB', '#B5D4F4']
    },
    {
      id: 'fire',
      name: 'Flo: Fire',
      subtitle: 'Crackling warmth',
      icon: Wind,
      color: '#D85A30',
      bgColor: '#FAECE7',
      vinylGrooves: ['#F0997B', '#D85A30', '#993C1D', '#F0997B', '#F5C4B3']
    }
  ];

  const playlists = [
    {
      name: 'Calm & Peaceful',
      tracks: '20 tracks · 60 min',
      gradient: 'linear-gradient(135deg, #E1F5EE 0%, #9FE1CB 100%)',
      iconColor: '#0F6E56'
    },
    {
      name: 'Uplifting Energy',
      tracks: '20 tracks · 60 min',
      gradient: 'linear-gradient(135deg, #FAEEDA 0%, #FAC775 100%)',
      iconColor: '#854F0B'
    },
    {
      name: 'Sleep & Rest',
      tracks: '15 tracks · 90 min',
      gradient: 'linear-gradient(135deg, #EEEDFE 0%, #CECBF6 100%)',
      iconColor: '#534AB7'
    }
  ];

  const navItems = [
    { id: 'home', label: 'Home', icon: Home },
    { id: 'mood', label: 'Mood', icon: Heart },
    { id: 'track', label: 'Track', icon: FileText },
    { id: 'calm', label: 'Calm', icon: Wind },
    { id: 'record', label: 'Record', icon: Mic },
    { id: 'listen', label: 'Listen', icon: Circle }
  ];

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
        @keyframes cassette-spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        .cassette-spool-spin {
          animation: cassette-spin 2s linear infinite;
        }
      `}</style>

      {/* Header */}
      <div className="bg-stone-50 px-5 pt-3 pb-2">
        <div className="flex justify-between items-baseline mb-1">
          <div className="text-[11px] tracking-[2px] text-orange-500 font-semibold">MIXTAPE</div>
          <div className="text-[11px] text-stone-500">14 Feb</div>
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
            <div className="bg-white rounded-2xl p-8 mb-5 border border-stone-200/50">
              <div className="relative" style={{ width: '100%', paddingBottom: '83.33%' }}>
                <svg 
                  viewBox="0 0 240 200" 
                  className="absolute inset-0 w-full h-full"
                >
                  {/* Animated Dot Grid */}
                  <g>
                    {Array.from({ length: 10 }, (_, row) =>
                      Array.from({ length: 12 }, (_, col) => (
                        <circle
                          key={`home-${row}-${col}`}
                          cx={col * 20 + 10}
                          cy={row * 20 + 10}
                          r={4}
                          fill={dotColors[row]}
                          className={isPlaying ? 'dot-pulse' : ''}
                          style={{ animationDelay: `${(row * 12 + col) * 0.02}s` }}
                        />
                      ))
                    )}
                  </g>
                </svg>
              </div>
              
              <div className="text-center mt-4">
                <div className="text-[15px] text-stone-900 font-normal mb-1">Flo mode</div>
                <div className="text-xs text-stone-400">Select entry</div>
              </div>
            </div>

            <div className="flex justify-center mb-8">
              <button
                onClick={() => setIsPlaying(!isPlaying)}
                className="w-16 h-16 rounded-full bg-orange-500 flex items-center justify-center shadow-lg shadow-orange-500/25 active:scale-95 transition-transform"
              >
                {isPlaying ? (
                  <Pause className="w-6 h-6 text-white" fill="white" />
                ) : (
                  <Play className="w-6 h-6 text-white ml-1" fill="white" />
                )}
              </button>
            </div>
          </div>
        )}

        {/* MOOD TAB */}
        {activeTab === 'mood' && (
          <div className="pt-6">
            <div className="mb-6">
              <div className="text-[28px] font-light tracking-tight text-stone-900">Mood</div>
              <div className="text-sm text-stone-500 mt-1">How are you feeling today?</div>
            </div>

            <div className="space-y-3">
              {['Great', 'Good', 'Okay', 'Low', 'Struggling'].map((mood, idx) => (
                <button
                  key={mood}
                  className="w-full bg-white rounded-xl p-5 border border-stone-200/50 text-left active:bg-stone-50 transition-colors"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-stone-100 flex items-center justify-center">
                      <Heart className="w-5 h-5 text-stone-600" strokeWidth={1.5} />
                    </div>
                    <div className="flex-1">
                      <div className="text-[17px] text-stone-900 font-normal">{mood}</div>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* TRACK TAB */}
        {activeTab === 'track' && (
          <div className="pt-6">
            <div className="mb-6">
              <div className="text-[28px] font-light tracking-tight text-stone-900">Track</div>
              <div className="text-sm text-stone-500 mt-1">Your journal entries</div>
            </div>

            <div className="space-y-3">
              {['Side A', 'Side B', 'Side M'].map((side) => (
                <button
                  key={side}
                  className="w-full bg-white rounded-xl p-5 border border-stone-200/50 text-left active:bg-stone-50 transition-colors"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-stone-100 flex items-center justify-center">
                      <FileText className="w-5 h-5 text-stone-600" strokeWidth={1.5} />
                    </div>
                    <div className="flex-1">
                      <div className="text-[17px] text-stone-900 font-normal">{side}</div>
                      <div className="text-xs text-stone-500">Tap to view entries</div>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* CALM TAB */}
        {activeTab === 'calm' && (
          <div className="pt-6">
            {!selectedCalm ? (
              <>
                <div className="mb-6">
                  <div className="text-[28px] font-light tracking-tight text-stone-900">Calm with Flo</div>
                  <div className="text-sm text-stone-500 mt-1">Choose your experience</div>
                </div>

                <div className="space-y-3 mb-4">
                  {calmExperiences.map((exp) => (
                    <button
                      key={exp.id}
                      onClick={() => setSelectedCalm(exp)}
                      className="w-full bg-white rounded-xl p-5 border border-stone-200/50 active:bg-stone-50 transition-colors"
                    >
                      <div className="flex items-center gap-4">
                        <div 
                          className="w-12 h-12 rounded-full flex items-center justify-center"
                          style={{ backgroundColor: exp.bgColor }}
                        >
                          <exp.icon className="w-6 h-6" strokeWidth={1.5} style={{ color: exp.color }} />
                        </div>
                        <div className="flex-1 text-left">
                          <div className="text-[17px] text-stone-900 font-normal">{exp.name}</div>
                          <div className="text-xs text-stone-500">{exp.subtitle}</div>
                        </div>
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#A8A29E" strokeWidth="1.5">
                          <polyline points="9 18 15 12 9 6"/>
                        </svg>
                      </div>
                    </button>
                  ))}
                </div>

                <div className="text-center py-3 bg-orange-500/5 rounded-lg">
                  <div className="text-xs text-stone-600">Unlock all Flo experiences with Pro</div>
                </div>
              </>
            ) : (
              <>
                <div className="mb-6">
                  <button 
                    onClick={() => setSelectedCalm(null)}
                    className="text-sm text-teal-600 mb-2"
                  >
                    ← Back
                  </button>
                  <div className="text-[28px] font-light tracking-tight text-stone-900">{selectedCalm.name}</div>
                  <div className="text-sm text-stone-500 mt-1">{selectedCalm.subtitle}</div>
                </div>

                <div className="bg-white rounded-2xl p-10 mb-6 border border-stone-200/50">
                  <div className="relative" style={{ width: '100%', paddingBottom: '100%' }}>
                    <svg viewBox="0 0 240 240" className="absolute inset-0 w-full h-full">
                      <g className="vinyl-spin" style={{ transformOrigin: '120px 120px' }}>
                        <circle cx="120" cy="120" r="119" fill="#1a1a1a"/>
                        {selectedCalm.vinylGrooves.map((color, idx) => (
                          <circle 
                            key={idx}
                            cx="120" 
                            cy="120" 
                            r={110 - idx * 20} 
                            fill="none" 
                            stroke={color} 
                            strokeWidth="3" 
                            opacity={0.3 + idx * 0.1}
                          />
                        ))}
                        <circle cx="120" cy="120" r="50" fill={selectedCalm.bgColor}/>
                        <text x="120" y="115" textAnchor="middle" fontSize="11" fill={selectedCalm.color} fontWeight="600">FLO</text>
                        <text x="120" y="128" textAnchor="middle" fontSize="8" fill={selectedCalm.color}>{selectedCalm.id.toUpperCase()}</text>
                        <circle cx="120" cy="120" r="10" fill={selectedCalm.color}/>
                      </g>
                    </svg>
                  </div>

                  <div className="flex justify-center mt-5 mb-5">
                    <button
                      className="w-14 h-14 rounded-full flex items-center justify-center shadow-lg active:scale-95 transition-transform"
                      style={{ backgroundColor: selectedCalm.color, boxShadow: `0 4px 16px ${selectedCalm.color}40` }}
                    >
                      <Pause className="w-6 h-6 text-white" fill="white" />
                    </button>
                  </div>

                  <div className="flex items-center gap-3">
                    <Volume2 className="w-4 h-4 text-stone-500" strokeWidth={1.5} />
                    <input
                      type="range"
                      min="0"
                      max="100"
                      value={volume}
                      onChange={(e) => setVolume(e.target.value)}
                      className="flex-1"
                    />
                    <span className="text-xs text-stone-500 min-w-[32px]">{volume}%</span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  {calmExperiences.filter(e => e.id !== selectedCalm.id).map((exp) => (
                    <button
                      key={exp.id}
                      onClick={() => setSelectedCalm(exp)}
                      className="bg-white rounded-xl p-4 border border-stone-200/50 text-center active:bg-stone-50 transition-colors"
                    >
                      <div 
                        className="w-10 h-10 rounded-full mx-auto mb-2 flex items-center justify-center"
                        style={{ backgroundColor: exp.bgColor }}
                      >
                        <exp.icon className="w-5 h-5" strokeWidth={1.5} style={{ color: exp.color }} />
                      </div>
                      <div className="text-xs text-stone-900">{exp.name.split(': ')[1]}</div>
                    </button>
                  ))}
                </div>
              </>
            )}
          </div>
        )}

        {/* RECORD TAB */}
        {activeTab === 'record' && (
          <div className="pt-6">
            <div className="mb-6">
              <div className="text-[28px] font-light tracking-tight text-stone-900">Talk to Flo</div>
              <div className="text-sm text-stone-500 mt-1">
                {isRecording ? 'Flo is listening' : 'Flo is here for you'}
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
                  
                  {/* Cassette Tape Overlay */}
                  <g transform="translate(120, 100)">
                    {/* Cassette body */}
                    <rect x="-90" y="-50" width="180" height="100" rx="4" fill="#1a1a1a" opacity="0.95"/>
                    
                    {/* Top window */}
                    <rect x="-80" y="-40" width="160" height="50" rx="2" fill="#2a2a2a" opacity="0.8"/>
                    
                    {/* Label */}
                    <rect x="-70" y="-35" width="140" height="40" fill="#FAFAF9"/>
                    <text x="0" y="-20" textAnchor="middle" fontSize="8" fill="#FF8C42" fontWeight="600" letterSpacing="1">JOURNAL.86</text>
                    <text x="0" y="-8" textAnchor="middle" fontSize="6" fill="#78716C" letterSpacing="0.5">SIDE A · MIXTAPE</text>
                    
                    {/* Left spool - with transform origin at center */}
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
                    
                    {/* Right spool - with transform origin at center */}
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
                    
                    {/* Tape between spools */}
                    <rect x="-27" y="16" width="54" height="8" fill="#4a3520" opacity="0.6"/>
                    
                    {/* Screws */}
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

              {/* Tape Recorder Control Buttons */}
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

            <div className="bg-white rounded-2xl p-8 mb-5 border border-stone-200/50 text-center">
              <div className="relative mx-auto mb-6" style={{ width: '100%', maxWidth: '240px' }}>
                <svg viewBox="0 0 240 200" className="w-full h-auto" style={{ overflow: 'visible' }}>
                  {/* Dot Grid Background */}
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

              <div className="mb-5">
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
                      <Wind className="w-5 h-5" strokeWidth={1.5} style={{ color: playlist.iconColor }} />
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

