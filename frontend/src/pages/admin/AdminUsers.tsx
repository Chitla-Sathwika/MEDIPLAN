import React, { useState, useEffect } from 'react';
import { Users, Trash2, Loader2, Calendar } from 'lucide-react';
import api from '../../services/api';

export const AdminUsers: React.FC = () => {
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const res = await api.get('/admin/users');
      setUsers(res.data.users);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleDelete = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this user profile? All history and bookmarks relating to this user will be removed.')) return;
    try {
      await api.delete(`/admin/users/${id}`);
      fetchUsers();
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
        <h2 className="text-lg font-extrabold flex items-center gap-1.5"><Users size={20} className="text-brand-500" /> User Directory ({users.length})</h2>
      </div>

      <div className="bg-white dark:bg-slate-900 border dark:border-slate-800 rounded-3xl overflow-hidden shadow-sm">
        {users.length === 0 ? (
          <div className="py-20 text-center text-slate-400 italic">No registered patient accounts found</div>
        ) : (
          <table className="w-full text-left text-xs border-collapse">
            <thead className="bg-slate-50 dark:bg-slate-850 border-b dark:border-slate-800 text-slate-400 font-bold uppercase">
              <tr>
                <th className="p-4">Name</th>
                <th className="p-4">Email</th>
                <th className="p-4">Language</th>
                <th className="p-4">Theme</th>
                <th className="p-4">Registered Date</th>
                <th className="p-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y dark:divide-slate-800">
              {users.map((u) => {
                const regDate = new Date(u.createdAt).toLocaleDateString(undefined, {
                  month: 'short',
                  day: 'numeric',
                  year: 'numeric'
                });

                return (
                  <tr key={u._id} className="hover:bg-slate-50/50 dark:hover:bg-slate-850/40">
                    <td className="p-4 font-bold text-slate-850 dark:text-slate-200">{u.name}</td>
                    <td className="p-4 text-slate-500">{u.email}</td>
                    <td className="p-4 text-slate-500 uppercase font-medium">{u.language}</td>
                    <td className="p-4 text-slate-500 capitalize">{u.theme}</td>
                    <td className="p-4 text-slate-500 flex items-center gap-1 mt-2.5">
                      <Calendar size={12} />
                      {regDate}
                    </td>
                    <td className="p-4 text-right">
                      <button onClick={() => handleDelete(u._id)} className="p-2 text-rose-500 hover:bg-rose-50 dark:hover:bg-slate-800 rounded-lg transition"><Trash2 size={14} /></button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};
export default AdminUsers;
