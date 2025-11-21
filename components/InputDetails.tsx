import React, { useState } from 'react';
import { ArrowRight, Disc } from 'lucide-react';
import { AlbumData } from '../types';

interface InputDetailsProps {
  onNext: (data: Partial<AlbumData>, trackCount: number) => void;
}

export const InputDetails: React.FC<InputDetailsProps> = ({ onNext }) => {
  const [artist, setArtist] = useState('');
  const [title, setTitle] = useState('');
  const [genre, setGenre] = useState('');
  const [trackCount, setTrackCount] = useState<string>('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const count = parseInt(trackCount);
    if (title && count > 0) {
      onNext({ artist, title, genre }, count);
    }
  };

  return (
    <div className="glass-panel p-8 rounded-xl w-full max-w-lg mx-auto animate-fade-in relative overflow-hidden border-zinc-800">
      <div className="flex items-center gap-4 mb-8 border-b border-white/5 pb-6">
        <div className="p-2.5 bg-zinc-900 rounded-lg border border-zinc-800">
          <Disc className="text-white" size={20} />
        </div>
        <div>
          <h2 className="text-lg font-semibold text-white tracking-tight">Project Setup</h2>
          <p className="text-zinc-500 text-xs">Define album parameters.</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label className="block text-[10px] font-bold uppercase tracking-widest text-zinc-500 mb-2">Artist</label>
          <input
            type="text"
            value={artist}
            onChange={(e) => setArtist(e.target.value)}
            placeholder="e.g. The Midnight"
            className="w-full bg-zinc-900/50 border border-zinc-800 rounded-md px-4 py-3 focus:outline-none focus:border-primary-500 focus:bg-zinc-900 text-white placeholder-zinc-700 transition-all text-sm"
          />
        </div>

        <div>
          <label className="block text-[10px] font-bold uppercase tracking-widest text-zinc-500 mb-2">Album Title</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="e.g. Endless Summer"
            required
            className="w-full bg-zinc-900/50 border border-zinc-800 rounded-md px-4 py-3 focus:outline-none focus:border-primary-500 focus:bg-zinc-900 text-white placeholder-zinc-700 transition-all text-sm"
          />
        </div>

        <div className="grid grid-cols-2 gap-5">
           <div>
            <label className="block text-[10px] font-bold uppercase tracking-widest text-zinc-500 mb-2">Genre</label>
            <input
              type="text"
              value={genre}
              onChange={(e) => setGenre(e.target.value)}
              placeholder="e.g. Synthwave"
              className="w-full bg-zinc-900/50 border border-zinc-800 rounded-md px-4 py-3 focus:outline-none focus:border-primary-500 focus:bg-zinc-900 text-white placeholder-zinc-700 transition-all text-sm"
            />
          </div>
          <div>
            <label className="block text-[10px] font-bold uppercase tracking-widest text-zinc-500 mb-2">Track Count</label>
            <input
              type="number"
              value={trackCount}
              onChange={(e) => setTrackCount(e.target.value)}
              placeholder="e.g. 12"
              min="2"
              max="30"
              required
              className="w-full bg-zinc-900/50 border border-zinc-800 rounded-md px-4 py-3 focus:outline-none focus:border-primary-500 focus:bg-zinc-900 text-white placeholder-zinc-700 transition-all text-sm"
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={!title || !trackCount}
          className="w-full mt-4 bg-white text-black hover:bg-zinc-200 font-semibold py-3.5 rounded-md transition-all flex items-center justify-center gap-2 disabled:opacity-30 disabled:cursor-not-allowed text-sm"
        >
          Continue <ArrowRight size={16} />
        </button>
      </form>
    </div>
  );
};