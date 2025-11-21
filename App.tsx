import React, { useState } from "react";
import { AppState, AlbumData, Track, SequenceResult } from "./types";
import { InputDetails } from "./components/InputDetails";
import { InputTracks } from "./components/InputTracks";
import { ResultsView } from "./components/ResultsView";
import { StepIndicator } from "./components/StepIndicator";
import { sequenceAlbum } from "./services/geminiService";
import { Loader2, AlertCircle } from "lucide-react";
import { Analytics } from "@vercel/analytics/next";

const App: React.FC = () => {
  const [appState, setAppState] = useState<AppState>(AppState.INPUT_DETAILS);
  const [albumData, setAlbumData] = useState<Partial<AlbumData>>({});
  const [targetTrackCount, setTargetTrackCount] = useState<number>(0);
  const [result, setResult] = useState<SequenceResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleDetailsSubmit = (data: Partial<AlbumData>, count: number) => {
    setAlbumData(data);
    setTargetTrackCount(count);
    setAppState(AppState.INPUT_TRACKS);
  };

  const handleSequence = async (tracks: Track[]) => {
    setAppState(AppState.PROCESSING);

    // Construct full album object
    const fullAlbumData: AlbumData = {
      artist: albumData.artist || "Unknown Artist",
      title: albumData.title || "Untitled Album",
      genre: albumData.genre || "Unspecified",
      tracks: tracks,
    };

    setAlbumData(fullAlbumData);

    try {
      const sequenceResult = await sequenceAlbum(fullAlbumData);
      setResult(sequenceResult);
      setAppState(AppState.RESULTS);
    } catch (e) {
      console.error(e);
      setError(
        "Failed to sequence album. Please check your API key or try again."
      );
      setAppState(AppState.ERROR);
    }
  };

  const resetApp = () => {
    setAppState(AppState.INPUT_DETAILS);
    setAlbumData({});
    setResult(null);
    setError(null);
  };

  const getStepNumber = () => {
    switch (appState) {
      case AppState.INPUT_DETAILS:
        return 1;
      case AppState.INPUT_TRACKS:
        return 2;
      case AppState.PROCESSING:
        return 3;
      case AppState.RESULTS:
        return 4;
      default:
        return 1;
    }
  };

  return (
    <div className="min-h-screen bg-[#09090b] text-zinc-200 font-sans relative overflow-hidden flex flex-col">
      {/* Professional Ambient Light - Top Center Spotlight */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[80vw] h-[500px] bg-[radial-gradient(circle,rgba(255,255,255,0.03)_0%,transparent_70%)] blur-[100px]"></div>
      </div>

      {/* Header */}
      <header className="sticky top-0 z-50 backdrop-blur-md bg-[#09090b]/80 border-b border-white/5">
        <div className="max-w-5xl mx-auto px-6 h-16 flex items-center justify-between">
          <div
            className="flex items-center cursor-pointer group"
            onClick={resetApp}
          >
            <span className="font-mono font-bold text-lg tracking-tight text-white group-hover:text-primary-400 transition-colors">
              SONIC<span className="text-zinc-500">SEQUENCE</span>
            </span>
          </div>
          {process.env.API_KEY ? (
            <div className="flex items-center gap-2 px-3 py-1 bg-zinc-900/50 rounded-full border border-zinc-800/50">
              <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.4)]"></div>
              <span className="text-[10px] font-medium text-zinc-400 uppercase tracking-wider">
                Ready
              </span>
            </div>
          ) : (
            <div className="flex items-center gap-2 px-3 py-1 bg-red-950/20 rounded-full border border-red-900/30">
              <div className="w-1.5 h-1.5 rounded-full bg-red-500"></div>
              <span className="text-[10px] font-medium text-red-500 uppercase tracking-wider">
                No API Key
              </span>
            </div>
          )}
        </div>
      </header>

      <main className="flex-grow w-full max-w-5xl mx-auto px-6 py-12 flex flex-col items-center relative z-10">
        {appState !== AppState.RESULTS && appState !== AppState.PROCESSING && (
          <StepIndicator currentStep={getStepNumber()} />
        )}

        {/* Views */}
        {appState === AppState.INPUT_DETAILS && (
          <InputDetails onNext={handleDetailsSubmit} />
        )}

        {appState === AppState.INPUT_TRACKS && (
          <InputTracks
            targetCount={targetTrackCount}
            onSequence={handleSequence}
            onBack={() => setAppState(AppState.INPUT_DETAILS)}
          />
        )}

        {appState === AppState.PROCESSING && (
          <div className="text-center flex flex-col items-center justify-center py-20 animate-fade-in">
            <div className="relative mb-10">
              <div className="absolute inset-0 bg-primary-500/10 blur-3xl rounded-full"></div>
              <Loader2
                size={48}
                className="text-white animate-spin relative z-10"
              />
            </div>
            <h2 className="text-2xl font-medium text-white mb-2 tracking-tight">
              Analyzing Structure
            </h2>
            <p className="text-zinc-500 max-w-md mx-auto text-sm font-light">
              Processing metadata, calculating optimal flow, and structuring the
              narrative arc for "{albumData.title}".
            </p>
          </div>
        )}

        {appState === AppState.RESULTS && result && (
          <ResultsView
            result={result}
            albumData={albumData as AlbumData}
            onReset={resetApp}
          />
        )}
        
         <Analytics />

        {appState === AppState.ERROR && (
          <div className="glass-panel p-8 rounded-xl text-center max-w-md border-red-900/50 shadow-[0_0_30px_rgba(220,38,38,0.1)]">
            <div className="flex justify-center mb-4">
              <AlertCircle className="text-red-500" size={40} />
            </div>
            <h3 className="text-lg font-bold text-white mb-2">
              Processing Error
            </h3>
            <p className="text-zinc-400 mb-6 text-sm">{error}</p>
            <button
              onClick={resetApp}
              className="bg-zinc-800 hover:bg-zinc-700 text-white px-6 py-2 rounded-md transition-colors text-sm font-medium"
            >
              Try Again
            </button>
          </div>
        )}


        {/* Global Google AdSense Section */}
        <div className="w-full mt-12 flex flex-col items-center animate-fade-in pb-4">
          <div className="w-full max-w-[728px] h-[90px] bg-[#09090b] border border-zinc-800 rounded flex items-center justify-center relative overflow-hidden">
            {/* Placeholder Visuals */}
            <div
              className="absolute inset-0 opacity-20"
              style={{
                backgroundImage:
                  "radial-gradient(#27272a 1px, transparent 1px)",
                backgroundSize: "8px 8px",
              }}
            ></div>
            <div className="z-10 flex flex-col items-center text-zinc-700 gap-1">
              <span className="text-xs font-mono uppercase tracking-widest">
                Google AdSense
              </span>
              <span className="text-[9px]">Space Reserved</span>
            </div>
            {
              <script
                async
                src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-6341427315547889"
                crossorigin="anonymous"
              ></script>
            }
          </div>
          <span className="mt-2 text-[9px] text-zinc-700 uppercase tracking-widest">
            Advertisement
          </span>
        </div>
      </main>

      {/* Footer */}
      <footer className="py-6 text-center text-zinc-700 text-[10px] border-t border-zinc-900/50 relative z-10 uppercase tracking-widest">
        <p>SonicSequence AI © 2025</p>
      </footer>
    </div>
  );
};

export default App;
