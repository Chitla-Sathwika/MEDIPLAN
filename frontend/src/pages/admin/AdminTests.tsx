import React, { useState, useEffect } from 'react';
import { Activity, Trash2, Edit, Plus, Loader2, Save, X } from 'lucide-react';
import api from '../../services/api';

export const AdminTests: React.FC = () => {
  const [tests, setTests] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingItem, setEditingItem] = useState<any | null>(null);

  // Form fields
  const [name, setName] = useState('');
  const [purpose, setPurpose] = useState('');
  const [sampleType, setSampleType] = useState('');
  const [normalRange, setNormalRange] = useState('');
  const [highMeaning, setHighMeaning] = useState('');
  const [lowMeaning, setLowMeaning] = useState('');
  const [preparation, setPreparation] = useState('');
  const [category, setCategory] = useState('');

  const fetchTests = async () => {
    setLoading(true);
    try {
      const res = await api.get('/tests?limit=50');
      setTests(res.data.tests);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTests();
  }, []);

  const handleEdit = (test: any) => {
    setEditingItem(test);
    setName(test.name);
    setPurpose(test.purpose);
    setSampleType(test.sampleType);
    setNormalRange(test.normalRange);
    setHighMeaning(test.highMeaning);
    setLowMeaning(test.lowMeaning);
    setPreparation(test.preparation);
    setCategory(test.category);
  };

  const handleCreateNew = () => {
    setEditingItem({ _id: 'new' });
    setName('');
    setPurpose('');
    setSampleType('');
    setNormalRange('');
    setHighMeaning('');
    setLowMeaning('');
    setPreparation('');
    setCategory('');
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Delete this medical test?')) return;
    try {
      await api.delete(`/tests/${id}`);
      fetchTests();
    } catch (err) {
      console.error(err);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const payload = {
      name, purpose, sampleType, normalRange, highMeaning, lowMeaning,
      preparation, category, keywords: [name.toLowerCase(), category.toLowerCase()]
    };

    try {
      if (editingItem?._id === 'new') {
        await api.post('/tests', payload);
      } else {
        await api.put(`/tests/${editingItem._id}`, payload);
      }
      setEditingItem(null);
      fetchTests();
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
        <h2 className="text-lg font-extrabold flex items-center gap-1.5"><Activity size={20} className="text-brand-500" /> Medical Tests Registry</h2>
        {!editingItem && (
          <button onClick={handleCreateNew} className="px-3.5 py-1.5 bg-brand-500 hover:bg-brand-600 text-white rounded-lg text-xs font-bold flex items-center gap-1">
            <Plus size={14} /> Add Test
          </button>
        )}
      </div>

      {editingItem ? (
        <form onSubmit={handleSubmit} className="bg-white dark:bg-slate-900 border dark:border-slate-800 rounded-3xl p-6 shadow-md grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="md:col-span-2 flex justify-between items-center border-b dark:border-slate-800 pb-3 mb-2">
            <h3 className="font-bold text-xs uppercase text-brand-500">{editingItem._id === 'new' ? 'New Diagnostic Test' : 'Edit Diagnostic Test'}</h3>
            <button type="button" onClick={() => setEditingItem(null)} className="text-slate-400 hover:text-slate-600"><X size={18} /></button>
          </div>
          <div>
            <label className="block text-[10px] font-bold text-slate-400 mb-1">Test Name</label>
            <input type="text" value={name} onChange={e => setName(e.target.value)} required className="w-full px-3 py-1.5 rounded-lg border dark:border-slate-800 bg-slate-50 dark:bg-slate-850 dark:text-white text-xs font-semibold focus:outline-none" />
          </div>
          <div>
            <label className="block text-[10px] font-bold text-slate-400 mb-1">Category</label>
            <input type="text" value={category} onChange={e => setCategory(e.target.value)} required className="w-full px-3 py-1.5 rounded-lg border dark:border-slate-800 bg-slate-50 dark:bg-slate-850 dark:text-white text-xs font-semibold focus:outline-none" />
          </div>
          <div>
            <label className="block text-[10px] font-bold text-slate-400 mb-1">Sample Type (e.g. Blood, Urine)</label>
            <input type="text" value={sampleType} onChange={e => setSampleType(e.target.value)} required className="w-full px-3 py-1.5 rounded-lg border dark:border-slate-800 bg-slate-50 dark:bg-slate-850 dark:text-white text-xs font-semibold focus:outline-none" />
          </div>
          <div>
            <label className="block text-[10px] font-bold text-slate-400 mb-1">Reference Normal Range</label>
            <input type="text" value={normalRange} onChange={e => setNormalRange(e.target.value)} required className="w-full px-3 py-1.5 rounded-lg border dark:border-slate-800 bg-slate-50 dark:bg-slate-850 dark:text-white text-xs font-semibold focus:outline-none" />
          </div>
          <div className="md:col-span-2">
            <label className="block text-[10px] font-bold text-slate-400 mb-1">Purpose</label>
            <textarea value={purpose} onChange={e => setPurpose(e.target.value)} required rows={2} className="w-full px-3 py-1.5 rounded-lg border dark:border-slate-800 bg-slate-50 dark:bg-slate-850 dark:text-white text-xs font-semibold focus:outline-none" />
          </div>
          <div className="md:col-span-2">
            <label className="block text-[10px] font-bold text-slate-400 mb-1">High Meaning</label>
            <textarea value={highMeaning} onChange={e => setHighMeaning(e.target.value)} required rows={2} className="w-full px-3 py-1.5 rounded-lg border dark:border-slate-800 bg-slate-50 dark:bg-slate-850 dark:text-white text-xs font-semibold focus:outline-none" />
          </div>
          <div className="md:col-span-2">
            <label className="block text-[10px] font-bold text-slate-400 mb-1">Low Meaning</label>
            <textarea value={lowMeaning} onChange={e => setLowMeaning(e.target.value)} required rows={2} className="w-full px-3 py-1.5 rounded-lg border dark:border-slate-800 bg-slate-50 dark:bg-slate-850 dark:text-white text-xs font-semibold focus:outline-none" />
          </div>
          <div className="md:col-span-2">
            <label className="block text-[10px] font-bold text-slate-400 mb-1">Patient Preparation (e.g. Fasting)</label>
            <input type="text" value={preparation} onChange={e => setPreparation(e.target.value)} required className="w-full px-3 py-1.5 rounded-lg border dark:border-slate-800 bg-slate-50 dark:bg-slate-850 dark:text-white text-xs font-semibold focus:outline-none" />
          </div>
          <div className="md:col-span-2 flex gap-2 pt-4">
            <button type="submit" className="px-5 py-2 bg-brand-500 hover:bg-brand-600 text-white rounded-xl text-xs font-bold flex items-center gap-1"><Save size={14} /> Save</button>
            <button type="button" onClick={() => setEditingItem(null)} className="px-5 py-2 bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-xl text-xs font-bold">Cancel</button>
          </div>
        </form>
      ) : (
        <div className="bg-white dark:bg-slate-900 border dark:border-slate-800 rounded-3xl overflow-hidden shadow-sm">
          <table className="w-full text-left text-xs border-collapse">
            <thead className="bg-slate-50 dark:bg-slate-850 border-b dark:border-slate-800 text-slate-400 font-bold uppercase">
              <tr>
                <th className="p-4">Name</th>
                <th className="p-4">Sample Type</th>
                <th className="p-4">Normal Range</th>
                <th className="p-4">Category</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y dark:divide-slate-800">
              {tests.map((tItem) => (
                <tr key={tItem._id} className="hover:bg-slate-50/50 dark:hover:bg-slate-850/40">
                  <td className="p-4 font-bold text-slate-800 dark:text-slate-200">{tItem.name}</td>
                  <td className="p-4 text-slate-500">{tItem.sampleType}</td>
                  <td className="p-4 text-brand-600 font-semibold">{tItem.normalRange}</td>
                  <td className="p-4 text-slate-500 font-medium">{tItem.category}</td>
                  <td className="p-4 text-right flex justify-end gap-1.5">
                    <button onClick={() => handleEdit(tItem)} className="p-2 text-blue-500 hover:bg-blue-50 dark:hover:bg-slate-800 rounded-lg"><Edit size={14} /></button>
                    <button onClick={() => handleDelete(tItem._id)} className="p-2 text-rose-500 hover:bg-rose-50 dark:hover:bg-slate-800 rounded-lg"><Trash2 size={14} /></button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};
export default AdminTests;
