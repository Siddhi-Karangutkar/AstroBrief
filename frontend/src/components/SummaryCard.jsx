import React, { useState } from 'react';
import { ExternalLink, ChevronDown, ChevronUp } from 'lucide-react';

const SummaryCard = ({ article }) => {
  const [expanded, setExpanded] = useState(false);

  const reduction = article.original_length > 0 
    ? Math.round(100 - (article.summary_length / article.original_length * 100)) 
    : 0;

  return (
    <div className="glass-card rounded-xl p-5 flex flex-col h-full">
      <div className="flex justify-between items-start mb-3">
        <div className="flex items-center gap-2 text-xs">
          <span className="text-neon-cyan font-mono">{article.publish_date}</span>
          <span className="bg-white/10 px-2 py-0.5 rounded text-gray-300">Space News</span>
        </div>
        {article.source_url && (
          <a href={article.source_url} target="_blank" rel="noreferrer" className="text-gray-400 hover:text-neon-cyan transition-colors">
            <ExternalLink size={16} />
          </a>
        )}
      </div>
      
      <h3 className="text-lg font-semibold text-white mb-3 line-clamp-2">
        {article.title}
      </h3>
      
      <div className="mb-4 text-gray-300 text-sm leading-relaxed flex-grow">
        {article.extractive_summary}
      </div>
      
      <div className="mt-auto pt-4 border-t border-white/10">
        <div className="flex justify-between items-center mb-2">
          <span className="text-xs text-gray-400">
            Original: {article.original_length} words | Summary: {article.summary_length} words
          </span>
          <span className="text-xs font-semibold text-neon-cyan bg-neon-cyan/10 px-2 py-1 rounded">
            -{reduction}% Reduction
          </span>
        </div>
        
        <button 
          onClick={() => setExpanded(!expanded)}
          className="flex items-center justify-center gap-1 w-full py-2 text-sm text-gray-400 hover:text-white transition-colors bg-white/5 hover:bg-white/10 rounded"
        >
          {expanded ? (
            <><ChevronUp size={16} /> Hide Original Text</>
          ) : (
            <><ChevronDown size={16} /> View Original Text</>
          )}
        </button>
        
        {expanded && (
          <div className="mt-3 p-3 bg-space-900/80 rounded text-xs text-gray-400 max-h-60 overflow-y-auto font-serif leading-relaxed">
            {article.raw_text}
          </div>
        )}
      </div>
    </div>
  );
};

export default SummaryCard;
