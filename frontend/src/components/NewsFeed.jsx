import React, { useState, useEffect, useMemo } from 'react';
import SummaryCard from './SummaryCard';
import { getNews } from '../services/api';
import { Search, Loader2 } from 'lucide-react';

const NewsFeed = () => {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const fetchNews = async () => {
      setLoading(true);
      try {
        const data = await getNews(page, 18);
        setArticles(data.data);
        setTotalPages(data.total_pages);
      } catch (err) {
        console.error("Failed to fetch news", err);
      }
      setLoading(false);
    };
    
    fetchNews();
  }, [page]);

  const filteredArticles = useMemo(() => {
    return articles.filter(article => 
      article.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      article.raw_text.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [articles, searchQuery]);

  return (
    <div className="w-full">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <div>
          <h2 className="text-xl font-bold text-white mb-1">Cosmic News Feed</h2>
          <p className="text-gray-400 text-sm">Latest aerospace intelligence condensed for rapid consumption.</p>
        </div>
        
        <div className="relative w-full md:w-64">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={16} />
          <input
            type="text"
            placeholder="Search missions, terms..."
            className="w-full bg-space-800/80 border border-white/10 rounded-full pl-9 pr-4 py-2 text-sm text-white focus:outline-none focus:border-neon-cyan/50 transition-colors"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center items-center py-20">
          <Loader2 className="animate-spin text-neon-cyan" size={32} />
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredArticles.map(article => (
              <SummaryCard key={article.id} article={article} />
            ))}
          </div>
          
          {filteredArticles.length === 0 && (
            <div className="text-center py-10 text-gray-400">
              No articles found matching your search.
            </div>
          )}

          <div className="flex justify-center items-center mt-10 gap-4">
            <button 
              onClick={() => setPage(p => Math.max(1, p - 1))}
              disabled={page === 1}
              className="px-4 py-2 rounded glass-panel disabled:opacity-50 hover:bg-white/5 transition-colors text-sm"
            >
              Previous
            </button>
            <span className="text-sm text-gray-400">
              Page {page} of {totalPages}
            </span>
            <button 
              onClick={() => setPage(p => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
              className="px-4 py-2 rounded glass-panel disabled:opacity-50 hover:bg-white/5 transition-colors text-sm"
            >
              Next
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default NewsFeed;
