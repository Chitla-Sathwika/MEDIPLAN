import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { useLanguage } from '../contexts/LanguageContext';
import { useAuth } from '../contexts/AuthContext';
import { Pill, Activity, AlertTriangle, Bookmark, BookmarkCheck, Search, ArrowRight, Loader2 } from 'lucide-react';
import api from '../services/api';

export const SearchResults: React.FC = () => {
  const [searchParams] = useSearchParams();
  const query = searchParams.get('q') || '';
  const navigate = useNavigate();
  const { language } = useLanguage();
  const { isAuthenticated } = useAuth();

  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<any[]>([]);
  const [bookmarks, setBookmarks] = useState<string[]>([]); // Track itemIds bookmarked

  // 1. Fetch Search Results
  useEffect(() => {
    const fetchResults = async () => {
      if (!query.trim()) return;
      setLoading(true);
      try {
        const res = await api.get(`/search?q=${encodeURIComponent(query)}&lang=${language}`);
        setResults(res.data.results || []);

        // Log search query in user history if authenticated
        if (isAuthenticated) {
          api.post('/users/history', { query }).catch(err => console.error(err));
        }
      } catch (error) {
        console.error('Failed to fetch search results:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchResults();
  }, [query, language, isAuthenticated]);

  // 2. Fetch User Bookmarks to highlight marked items
  useEffect(() => {
    if (isAuthenticated) {
      api.get('/users/bookmarks')
        .then(res => {
          const ids = res.data.bookmarks.map((b: any) => b.itemId);
          setBookmarks(ids);
        })
        .catch(err => console.error('Failed to fetch bookmarks:', err));
    }
  }, [isAuthenticated]);

  const handleBookmarkToggle = async (e: React.MouseEvent, type: string, itemId: string) => {
    e.stopPropagation(); // Avoid triggering card navigation
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    const isBookmarked = bookmarks.includes(itemId);

    try {
      if (isBookmarked) {
        await api.delete('/users/bookmarks', { data: { itemType: type, itemId } });
        setBookmarks(prev => prev.filter(id => id !== itemId));
      } else {
        await api.post('/users/bookmarks', { itemType: type, itemId });
        setBookmarks(prev => [...prev, itemId]);
      }
    } catch (error) {
      console.error('Error toggling bookmark:', error);
    }
  };

  const handleCardClick = (type: string, id: string) => {
    if (type === 'medicine') navigate(`/medicines/${id}`);
    else if (type === 'test') navigate(`/tests/${id}`);
    else if (type === 'disease') navigate(`/diseases/${id}`);
  };

  return (
    <div className="max-w-4xl mx-auto py-4">
      {/* Header Info */}
      <div className="mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-extrabold text-slate-800 dark:text-white flex items-center gap-2">
            <Search className="text-brand-500" size={24} />
            Search Results
          </h2>
          <p className="text-xs text-slate-500 mt-1 font-semibold">
            Showing results for query: <span className="text-brand-600 dark:text-brand-400">"{query}"</span>
          </p>
        </div>
        <div className="text-xs text-slate-400 font-medium">
          Found {results.length} matches
        </div>
      </div>

      {/* Loading State */}
      {loading ? (
        <div className="flex flex-col items-center justify-center py-20 text-slate-400 gap-2">
          <Loader2 className="animate-spin text-brand-500" size={32} />
          <span className="text-xs font-bold">Scanning Medical Registries...</span>
        </div>
      ) : results.length === 0 ? (
        /* Empty State Card */
        <div className="bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800/80 rounded-2xl p-8 text-center flex flex-col items-center max-w-lg mx-auto shadow-md">
          <div className="h-14 w-14 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-400 mb-4">
            <Search size={28} />
          </div>
          <h3 className="font-extrabold text-sm sm:text-base text-slate-800 dark:text-white">
            No Records Found
          </h3>
          <p className="text-xs text-slate-400 dark:text-slate-500 mt-2 leading-relaxed">
            We could not find any matches for "{query}". Try checking spellings or search generic terms (like "Paracetamol" or "CBC").
          </p>
          <button
            onClick={() => navigate('/')}
            className="mt-6 px-4 py-2 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 rounded-lg text-xs font-bold text-slate-700 dark:text-slate-300 transition"
          >
            Return to Dashboard
          </button>
        </div>
      ) : (
        /* Results list */
        <div className="space-y-4">
          {results.map((result, idx) => {
            const type = result.type;
            const data = result.data;
            const isBookmarked = bookmarks.includes(data._id);

            let Icon = Pill;
            let typeColor = 'bg-blue-100 text-blue-700 dark:bg-blue-950/40 dark:text-blue-400';
            let briefText = '';

            if (type === 'medicine') {
              Icon = Pill;
              briefText = `Uses: ${data.uses} | Brand: ${data.brandName}`;
            } else if (type === 'test') {
              Icon = Activity;
              typeColor = 'bg-teal-100 text-teal-700 dark:bg-teal-950/40 dark:text-teal-400';
              briefText = `Purpose: ${data.purpose} | Sample: ${data.sampleType}`;
            } else if (type === 'disease') {
              Icon = AlertTriangle;
              typeColor = 'bg-amber-100 text-amber-700 dark:bg-amber-950/40 dark:text-amber-400';
              briefText = `Symptoms: ${data.symptoms}`;
            }

            return (
              <div
                key={idx}
                onClick={() => handleCardClick(type, data._id)}
                className="group p-5 bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800/80 rounded-2xl flex items-center justify-between gap-4 cursor-pointer hover:border-brand-500/30 dark:hover:border-brand-500/30 hover:shadow-lg dark:hover:shadow-none hover:shadow-slate-100/50 transition duration-200"
              >
                <div className="flex items-start gap-4">
                  {/* Entity Icon Container */}
                  <div className={`h-12 w-12 rounded-xl flex items-center justify-center shrink-0 border border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-850 group-hover:scale-105 transition-transform duration-200`}>
                    <Icon size={20} className="text-slate-600 dark:text-slate-300" />
                  </div>

                  {/* Summary text */}
                  <div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <h4 className="font-extrabold text-sm sm:text-base text-slate-800 dark:text-white group-hover:text-brand-500 transition-colors">
                        {data.name}
                      </h4>
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full capitalize ${typeColor}`}>
                        {type}
                      </span>
                    </div>
                    <p className="text-xs text-slate-400 mt-1 line-clamp-1 leading-relaxed">
                      {briefText}
                    </p>
                  </div>
                </div>

                {/* Right controls */}
                <div className="flex items-center gap-2">
                  {/* Bookmark Button */}
                  <button
                    onClick={(e) => handleBookmarkToggle(e, type, data._id)}
                    className="p-2 rounded-lg text-slate-400 hover:text-brand-500 hover:bg-slate-50 dark:hover:bg-slate-800 transition"
                  >
                    {isBookmarked ? (
                      <BookmarkCheck size={18} className="text-brand-500" />
                    ) : (
                      <Bookmark size={18} />
                    )}
                  </button>
                  {/* Arrow Indicator */}
                  <div className="p-2 text-slate-300 group-hover:text-brand-500 group-hover:translate-x-0.5 transition duration-200">
                    <ArrowRight size={18} />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
