import React, { useState } from 'react';
import { summarizeText } from '../services/api';
import { Wand2, Loader2, Sparkles, SlidersHorizontal, Activity } from 'lucide-react';

const SAMPLE_TEXT = `The James Webb Space Telescope (JWST) has successfully deployed its massive sunshield, a critical milestone for the $10 billion observatory. After a tense multi-day process involving hundreds of single-point failures, NASA confirmed that all five layers of the Kapton sunshield are fully tensioned and locked into place. This shield, roughly the size of a tennis court, is essential for keeping the telescope's sensitive infrared instruments cold enough to detect faint light from the universe's first galaxies. Engineers at the Space Telescope Science Institute in Baltimore erupted in cheers as the final telemetry confirmed the successful deployment. The next major phase will involve unfolding the telescope's golden primary mirror, which was folded to fit inside the Ariane 5 rocket that launched it into space on Christmas Day.`;

const LivePlayground = () => {
  const [inputText, setInputText] = useState('');
  const [mode, setMode] = useState('extractive');
  const [sentenceCount, setSentenceCount] = useState(3);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [latency, setLatency] = useState(0);

  const handleSummarize = async () => {
    if (!inputText.trim()) return;
    
    setLoading(true);
    const start = performance.now();
    try {
      const data = await summarizeText(inputText, mode, sentenceCount);
      const end = performance.now();
      setLatency(Math.round(end - start));
      setResult(data);
    } catch (err) {
      console.error(err);
      setResult({ summary: "Error generating summary.", reduction_rate: "0%" });
    }
    setLoading(false);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 w-full">
      {/* Input Pane */}
      <div className="glass-panel rounded-xl p-6 flex flex-col h-full">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold text-white flex items-center gap-2">
            <SlidersHorizontal size={18} className="text-neon-cyan" />
            Input Pipeline
          </h2>
          <button 
            onClick={() => setInputText(SAMPLE_TEXT)}
            className="text-xs bg-space-800 hover:bg-space-700 px-3 py-1.5 rounded-full border border-white/10 transition-colors"
          >
            Load NASA Sample
          </button>
        </div>
        
        <textarea
          className="w-full flex-grow min-h-[250px] bg-space-900/50 border border-white/10 rounded-lg p-4 text-sm text-gray-200 focus:outline-none focus:border-neon-cyan/50 resize-none font-serif leading-relaxed mb-6"
          placeholder="Paste aerospace telemetry, mission reports, or press releases here..."
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
        />
        
        <div className="bg-space-800/50 rounded-lg p-4 border border-white/5 space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-300">Engine Selection</span>
            <div className="flex bg-space-900 rounded-lg p-1 border border-white/5">
              <button 
                onClick={() => setMode('extractive')}
                className={`px-4 py-1.5 rounded-md text-xs font-medium transition-colors ${mode === 'extractive' ? 'bg-white/10 text-neon-cyan' : 'text-gray-500 hover:text-gray-300'}`}
              >
                Extractive
              </button>
              <button 
                onClick={() => setMode('abstractive')}
                className={`px-4 py-1.5 rounded-md text-xs font-medium transition-colors ${mode === 'abstractive' ? 'bg-white/10 text-neon-purple' : 'text-gray-500 hover:text-gray-300'}`}
              >
                Abstractive
              </button>
            </div>
          </div>
          
          {mode === 'extractive' && (
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-300">Compression Density (Sentences)</span>
              <div className="flex items-center gap-3">
                <span className="text-xs text-gray-500">2</span>
                <input 
                  type="range" 
                  min="2" max="5" 
                  value={sentenceCount} 
                  onChange={(e) => setSentenceCount(parseInt(e.target.value))}
                  className="w-24 accent-neon-cyan"
                />
                <span className="text-xs text-gray-500">5</span>
                <span className="text-sm font-mono text-neon-cyan bg-neon-cyan/10 px-2 py-0.5 rounded ml-2">{sentenceCount}</span>
              </div>
            </div>
          )}
        </div>
        
        <button 
          onClick={handleSummarize}
          disabled={loading || !inputText.trim()}
          className="mt-6 w-full py-3 rounded-lg bg-gradient-to-r from-neon-cyan/80 to-neon-purple/80 hover:from-neon-cyan hover:to-neon-purple text-white font-semibold flex items-center justify-center gap-2 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-[0_0_15px_rgba(0,242,254,0.3)] hover:shadow-[0_0_25px_rgba(0,242,254,0.5)]"
        >
          {loading ? <Loader2 className="animate-spin" size={18} /> : <Wand2 size={18} />}
          Condense Content
        </button>
      </div>

      {/* Output Pane */}
      <div className="glass-panel rounded-xl p-6 flex flex-col h-full">
        <h2 className="text-lg font-semibold text-white flex items-center gap-2 mb-4">
          <Sparkles size={18} className={mode === 'extractive' ? 'text-neon-cyan' : 'text-neon-purple'} />
          Synthesized Output
        </h2>
        
        <div className="flex-grow bg-space-900/50 border border-white/10 rounded-lg p-5">
          {result ? (
            <div className="text-gray-200 font-serif leading-relaxed text-sm h-full overflow-y-auto">
              {result.summary}
            </div>
          ) : (
            <div className="h-full flex items-center justify-center text-gray-600 text-sm">
              Awaiting input sequence...
            </div>
          )}
        </div>
        
        <div className="mt-6 grid grid-cols-3 gap-3">
          <div className="bg-space-800/80 rounded-lg p-3 border border-white/5 flex flex-col items-center justify-center text-center">
            <span className="text-[10px] text-gray-400 uppercase tracking-wider mb-1">Reduction Rate</span>
            <span className="text-lg font-mono text-white">
              {result ? result.reduction_rate : '--'}
            </span>
          </div>
          
          <div className="bg-space-800/80 rounded-lg p-3 border border-white/5 flex flex-col items-center justify-center text-center">
            <span className="text-[10px] text-gray-400 uppercase tracking-wider mb-1">Processing Latency</span>
            <span className="text-lg font-mono text-white flex items-center gap-1">
              <Activity size={14} className="text-green-400" />
              {result ? `${latency}ms` : '--'}
            </span>
          </div>
          
          <div className="bg-space-800/80 rounded-lg p-3 border border-white/5 flex flex-col items-center justify-center text-center">
            <span className="text-[10px] text-gray-400 uppercase tracking-wider mb-1">Algorithm</span>
            <span className="text-sm font-semibold text-white">
              {result ? (mode === 'extractive' ? 'TF-IDF' : 'Seq2Seq') : '--'}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LivePlayground;
