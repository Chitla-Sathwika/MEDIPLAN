import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Bookmark, Pill, Activity, AlertTriangle, Trash2, ArrowRight, Loader2 } from 'lucide-react';
import api from '../services/api';

export const Bookmarks: React.FC = () => {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [bookmarks, setBookmarks] = useState<any[]>([]);
  const [activeTab, setActiveTab] = useState<'all' | 'medicine' | 'test' | 'disease'>('all');

  useEffect(() => {
    if (isAuthenticated) {
      api.get('/users/bookmarks')
        .then(res => setBookmarks(res.data.bookmarks))
        .catch(err => console.error('Failed to load bookmarks:', err))
        .finally(() => setLoading(false));
    }
  }, [isAuthenticated]);

  const deleteBookmark = async (itemType: string, itemId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      await api.delete('/users/bookmarks', { data: { itemType, itemId } });
      setBookmarks(prev => prev.filter(b => b.itemId !== itemId));
    } catch (error) {
      console.error('Error removing bookmark:', error);
    }
  };

  const handleCardClick = (type: string, id: string) => {
    if (type === 'medicine') navigate(`/medicines/${id}`);
    else if (type === 'test') navigate(`/tests/${id}`);
    else if (type === 'disease') navigate(`/diseases/${id}`);
  };

  const filteredBookmarks = bookmarks.filter(b => {
    if (activeTab === 'all') return true;
    return b.itemType === activeTab;
  });

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-32 text-slate-400 gap-2">
        <Loader2 className="animate-spin text-brand-500" size={32} />
        <span className="text-xs font-bold">Synchronizing Bookmarks...</span>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto py-2">
      <h2 className="text-xl sm:text-2xl font-extrabold text-slate-800 dark:text-white mb-6 flex items-center gap-2">
        <Bookmark className="text-brand-500" size={24} />
        Saved Bookmarks
      </h2>

      {/* Tabs */}
      <div className="flex border-b border-slate-200 dark:border-slate-800 pb-px mb-6 gap-2 flex-wrap">
        {(['all', 'medicine', 'test', 'disease'] as const).map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-2 text-xs font-bold border-b-2 capitalize transition-all ${
              activeTab === tab
                ? 'border-brand-500 text-brand-600 dark:text-brand-400'
                : 'border-transparent text-slate-500 hover:text-slate-700'
            }`}
          >
            {tab === 'all' ? 'All Items' : tab === 'medicine' ? 'Medicines' : tab === 'test' ? 'Medical Tests' : 'Diseases'}
          </button>
        ))}
      </div>

      {filteredBookmarks.length === 0 ? (
        <div className="bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800 rounded-3xl p-10 text-center max-w-md mx-auto">
          <Bookmark className="text-slate-300 mx-auto mb-4" size={40} />
          <h3 className="font-extrabold text-sm text-slate-850 dark:text-white">No Bookmarks Found</h3>
          <p className="text-xs text-slate-400 mt-2">You have not bookmarked any items in this category yet.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {filteredBookmarks.map((bookmark) => {
            const item = bookmark.itemDetails;
            if (!item) return null;

            let Icon = Pill;
            let typeColor = 'bg-blue-100 text-blue-700 dark:bg-blue-950/40 dark:text-blue-400';
            
            if (bookmark.itemType === 'test') {
              Icon = Activity;
              typeColor = 'bg-teal-100 text-teal-700 dark:bg-teal-950/40 dark:text-teal-400';
            } else if (bookmark.itemType === 'disease') {
              Icon = AlertTriangle;
              typeColor = 'bg-amber-100 text-amber-700 dark:bg-amber-950/40 dark:text-amber-400';
            }

            return (
              <div
                key={bookmark._id}
                onClick={() => handleCardClick(bookmark.itemType, bookmark.itemId)}
                className="p-4 bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800 rounded-2xl flex items-center justify-between gap-4 cursor-pointer hover:border-brand-500/20 hover:shadow-md transition duration-150"
              >
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-xl bg-slate-50 dark:bg-slate-850 border dark:border-slate-800/40 flex items-center justify-center text-slate-500 shrink-0">
                    <Icon size={18} />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="text-xs font-bold text-slate-800 dark:text-white">
                        {item.name}
                      </h4>
                      <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full capitalize ${typeColor}`}>
                        {bookmark.itemType}
                      </span>
                    </div>
                    <p className="text-[10px] text-slate-400 mt-1 line-clamp-1">
                      {item.uses || item.purpose || item.symptoms}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={(e) => deleteBookmark(bookmark.itemType, bookmark.itemId, e)}
                    className="p-2 text-slate-400 hover:text-medical-rose hover:bg-slate-50 dark:hover:bg-slate-850 rounded-lg transition"
                  >
                    <Trash2 size={14} />
                  </button>
                  <ArrowRight size={14} className="text-slate-300" />
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
export default Bookmarks;
