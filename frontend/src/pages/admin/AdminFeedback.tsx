import React, { useState, useEffect } from 'react';
import { MessageSquare, Trash2, Loader2, Star, Calendar } from 'lucide-react';
import api from '../../services/api';

export const AdminFeedback: React.FC = () => {
  const [feedbacks, setFeedbacks] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchFeedbacks = async () => {
    setLoading(true);
    try {
      const res = await api.get('/admin/feedback');
      setFeedbacks(res.data.feedback);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFeedbacks();
  }, []);

  const handleDelete = async (id: string) => {
    if (!window.confirm('Delete this feedback?')) return;
    try {
      await api.delete(`/admin/feedback/${id}`);
      fetchFeedbacks();
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) {
    return <div className="flex justify-center py-20"><Loader2 className="animate-spin text-brand-500" /></div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-lg font-extrabold flex items-center gap-1.5"><MessageSquare size={20} className="text-brand-500" /> Patient Feedback logs ({feedbacks.length})</h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {feedbacks.length === 0 ? (
          <div className="col-span-2 py-20 text-center text-slate-400 italic">No feedback entries submitted yet</div>
        ) : (
          feedbacks.map((fb) => {
            const fbDate = new Date(fb.createdAt).toLocaleDateString(undefined, {
              month: 'short',
              day: 'numeric',
              year: 'numeric'
            });

            return (
              <div key={fb._id} className="bg-white dark:bg-slate-900 border dark:border-slate-800 rounded-3xl p-5 shadow-sm hover:shadow-md transition flex flex-col justify-between gap-4">
                <div>
                  <div className="flex justify-between items-start flex-wrap gap-2">
                    <div>
                      <h4 className="font-bold text-slate-800 dark:text-slate-200">{fb.name}</h4>
                      <span className="text-[10px] text-slate-400 font-semibold">{fb.email}</span>
                    </div>
                    
                    {/* Stars */}
                    <div className="flex gap-0.5">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <Star key={star} size={14} className={star <= fb.rating ? 'text-medical-amber fill-medical-amber' : 'text-slate-200'} />
                      ))}
                    </div>
                  </div>

                  <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed mt-4 bg-slate-50/50 dark:bg-slate-950 p-3.5 rounded-xl border dark:border-slate-850 font-medium">
                    {fb.message}
                  </p>
                </div>

                <div className="flex justify-between items-center border-t dark:border-slate-800/60 pt-3 text-[10px] text-slate-400">
                  <span className="flex items-center gap-1">
                    <Calendar size={12} />
                    {fbDate}
                  </span>
                  
                  <button onClick={() => handleDelete(fb._id)} className="p-2 text-rose-500 hover:bg-rose-50 dark:hover:bg-slate-800 rounded-lg transition">
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
export default AdminFeedback;
