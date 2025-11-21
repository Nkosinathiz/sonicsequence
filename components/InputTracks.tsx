import React, { useState, useEffect, useRef } from 'react';
import { Wand2, ChevronUp, ChevronDown, Plus, Trash2 } from 'lucide-react';
import { Track } from '../types';

interface InputTracksProps {
  targetCount: number;
  onSequence: (tracks: Track[]) => void;
  onBack: () => void;
}

export const InputTracks: React.FC<InputTracksProps> = ({ targetCount, onSequence, onBack }) => {
  const [tracks, setTracks] = useState<Track[]>([]);
  const listEndRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    if (tracks.length === 0) {
      const initialTracks = Array.from({ length: targetCount }, (_, i) => ({
        id: `t-${i}-${Date.now()}`,
        originalIndex: i,
        title: ''
      }));
      setTracks(initialTracks);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [targetCount]);

  const handleTrackChange = (index: number, value: string) => {
    const newTracks = [...tracks];
    newTracks[index].title = value;
    setTracks(newTracks);
  };

  const moveTrack = (index: number, direction: 'up' | 'down') => {
    if (direction === 'up' && index === 0) return;
    if (direction === 'down' && index === tracks.length - 1) return;

    const newTracks = [...tracks];
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    [newTracks[index], newTracks[targetIndex]] = [newTracks[targetIndex], newTracks[index]];
    setTracks(newTracks);
  };

  const addTrack = () => {
    const newTrack: Track = {
      id: `t-new-${Date.now()}`,
      originalIndex: tracks.length,
      title: ''
    };
    setTracks([...tracks, newTrack]);
    // Timeout ensures render happens before scroll
    setTimeout(() => {
      listEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  };

  const removeTrack = (index: number) => {
    const newTracks = tracks.filter((_, i) => i !== index);
    setTracks(newTracks);
  };

  const filledTracksCount = tracks.filter(t => t.title.trim().length > 0).length;
  const isReady = filledTracksCount >= 2;

  return (
    <div className="glass-panel p-8 rounded-xl w-full max-w-2xl mx-auto animate-fade-in flex flex-col h-[80vh] border-zinc-800">
      <div className="flex items-center justify-between mb-6 flex-shrink-0 border-b border-white/5 pb-4">
        <div>
          <h2 className="text-lg font-semibold text-white tracking-tight">Track Inventory</h2>
          <p className="text-zinc-500 text-xs">Input tracks in any order.</p>
        </div>
        <div className="text-right">
             <span className={`text-xl font-mono font-bold ${filledTracksCount === tracks.length && tracks.length > 0 ? 'text-primary-500' : 'text-zinc-600'}`}>
               {filledTracksCount}
               <span className="text-zinc-700 text-sm">/{tracks.length}</span>
             </span>
        </div>
      </div>

      <div className="overflow-y-auto pr-2 space-y-2 flex-grow scrollbar-thin scrollbar-thumb-zinc-700 scrollbar-track-transparent">
        {tracks.map((track, index) => (
          <div key={track.id} className="flex items-center gap-3 group animate-fade-in bg-zinc-900/30 hover:bg-zinc-900/60 rounded-md p-1 transition-colors border border-transparent hover:border-zinc-800">
            <span className="text-zinc-600 font-mono text-[10px] w-6 text-right select-none">
              {(index + 1).toString().padStart(2, '0')}
            </span>
            
            <div className="flex flex-col -space-y-1 opacity-0 group-hover:opacity-100 transition-opacity">
              <button 
                type="button"
                onClick={() => moveTrack(index, 'up')}
                disabled={index === 0}
                className="text-zinc-600 hover:text-white disabled:opacity-10 p-0.5 transition-colors"
              >
                <ChevronUp size={12} />
              </button>
              <button 
                type="button"
                onClick={() => moveTrack(index, 'down')}
                disabled={index === tracks.length - 1}
                className="text-zinc-600 hover:text-white disabled:opacity-10 p-0.5 transition-colors"
              >
                <ChevronDown size={12} />
              </button>
            </div>

            <input
              type="text"
              value={track.title}
              onChange={(e) => handleTrackChange(index, e.target.value)}
              placeholder={`Track Title`}
              className="flex-grow bg-transparent border-none px-2 py-2 text-sm focus:outline-none text-zinc-200 placeholder-zinc-700 font-medium"
              autoFocus={index === tracks.length - 1 && track.title === ''}
            />

            <button
              onClick={() => removeTrack(index)}
              className="opacity-0 group-hover:opacity-100 text-zinc-600 hover:text-red-500 p-2 transition-all"
              title="Remove Track"
            >
              <Trash2 size={14} />
            </button>
          </div>
        ))}
        <div ref={listEndRef} />
        
        <button 
          onClick={addTrack}
          className="w-full py-3 mt-2 border border-dashed border-zinc-800 rounded-md flex items-center justify-center gap-2 text-zinc-500 hover:text-white hover:border-zinc-600 hover:bg-zinc-900/50 transition-all text-xs font-medium uppercase tracking-wider"
        >
          <Plus size={14} /> Add Track
        </button>
      </div>

      <div className="mt-6 pt-4 border-t border-white/5 flex gap-4 flex-shrink-0">
        <button
          onClick={onBack}
          className="px-6 py-3 rounded-md text-zinc-500 hover:text-white font-medium transition-colors text-sm hover:bg-white/5"
        >
          Back
        </button>
        <button
          onClick={() => onSequence(tracks)}
          disabled={!isReady}
          className="flex-grow bg-primary-600 hover:bg-primary-500 text-white font-semibold py-3 rounded-md transition-all flex items-center justify-center gap-2 disabled:opacity-30 disabled:cursor-not-allowed shadow-lg shadow-primary-900/20 text-sm"
        >
          <Wand2 size={16} />
          Process Sequence
        </button>
      </div>
    </div>
  );
};