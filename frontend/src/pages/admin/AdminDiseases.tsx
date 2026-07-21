import React, { useState, useEffect } from 'react';
import { AlertTriangle, Trash2, Edit, Plus, Loader2, Save, X } from 'lucide-react';
import api from '../../services/api';

export const AdminDiseases: React.FC = () => {
  const [diseases, setDiseases] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingItem, setEditingItem] = useState<any | null>(null);

  // Form fields
  const [name, setName] = useState('');
  const [symptoms, setSymptoms] = useState('');
  const [causes, setCauses] = useState('');
  const [riskFactors, setRiskFactors] = useState('');
  const [diagnosis, setDiagnosis] = useState('');
  const [treatment, setTreatment] = useState('');
  const [prevention, setPrevention] = useState('');
  const [emergencySymptoms, setEmergencySymptoms] = useState('');

  const fetchDiseases = async () => {
    setLoading(true);
    try {
      const res = await api.get('/diseases?limit=50');
      setDiseases(res.data.diseases);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDiseases();
  }, []);

  const handleEdit = (disease: any) => {
    setEditingItem(disease);
    setName(disease.name);
    setSymptoms(disease.symptoms);
    setCauses(disease.causes);
    setRiskFactors(disease.riskFactors);
    setDiagnosis(disease.diagnosis);
    setTreatment(disease.treatment);
    setPrevention(disease.prevention);
    setEmergencySymptoms(disease.emergencySymptoms);
  };

  const handleCreateNew = () => {
    setEditingItem({ _id: 'new' });
    setName('');
    setSymptoms('');
    setCauses('');
    setRiskFactors('');
    setDiagnosis('');
    setTreatment('');
    setPrevention('');
    setEmergencySymptoms('');
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Delete this disease file?')) return;
    try {
      await api.delete(`/diseases/${id}`);
      fetchDiseases();
    } catch (err) {
      console.error(err);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const payload = {
      name, symptoms, causes, riskFactors, diagnosis, treatment,
      prevention, emergencySymptoms, keywords: [name.toLowerCase()]
    };

    try {
      if (editingItem?._id === 'new') {
        await api.post('/diseases', payload);
      } else {
        await api.put(`/diseases/${editingItem._id}`, payload);
      }
      setEditingItem(null);
      fetchDiseases();
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
        <h2 className="text-lg font-extrabold flex items-center gap-1.5"><AlertTriangle size={20} className="text-brand-500" /> Diseases Registry</h2>
        {!editingItem && (
          <button onClick={handleCreateNew} className="px-3.5 py-1.5 bg-brand-500 hover:bg-brand-600 text-white rounded-lg text-xs font-bold flex items-center gap-1">
            <Plus size={14} /> Add Disease
          </button>
        )}
      </div>

      {editingItem ? (
        <form onSubmit={handleSubmit} className="bg-white dark:bg-slate-900 border dark:border-slate-800 rounded-3xl p-6 shadow-md grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="md:col-span-2 flex justify-between items-center border-b dark:border-slate-800 pb-3 mb-2">
            <h3 className="font-bold text-xs uppercase text-brand-500">{editingItem._id === 'new' ? 'New Pathology File' : 'Edit Pathology File'}</h3>
            <button type="button" onClick={() => setEditingItem(null)} className="text-slate-400 hover:text-slate-600"><X size={18} /></button>
          </div>
          <div className="md:col-span-2">
            <label className="block text-[10px] font-bold text-slate-400 mb-1">Disease Name</label>
            <input type="text" value={name} onChange={e => setName(e.target.value)} required className="w-full px-3 py-1.5 rounded-lg border dark:border-slate-800 bg-slate-50 dark:bg-slate-850 dark:text-white text-xs font-semibold focus:outline-none" />
          </div>
          <div className="md:col-span-2">
            <label className="block text-[10px] font-bold text-slate-400 mb-1">Symptoms</label>
            <textarea value={symptoms} onChange={e => setSymptoms(e.target.value)} required rows={2} className="w-full px-3 py-1.5 rounded-lg border dark:border-slate-800 bg-slate-50 dark:bg-slate-850 dark:text-white text-xs font-semibold focus:outline-none" />
          </div>
          <div className="md:col-span-2">
            <label className="block text-[10px] font-bold text-slate-400 mb-1">Causes</label>
            <textarea value={causes} onChange={e => setCauses(e.target.value)} required rows={2} className="w-full px-3 py-1.5 rounded-lg border dark:border-slate-800 bg-slate-50 dark:bg-slate-850 dark:text-white text-xs font-semibold focus:outline-none" />
          </div>
          <div className="md:col-span-2">
            <label className="block text-[10px] font-bold text-slate-400 mb-1">Risk Factors</label>
            <textarea value={riskFactors} onChange={e => setRiskFactors(e.target.value)} required rows={2} className="w-full px-3 py-1.5 rounded-lg border dark:border-slate-800 bg-slate-50 dark:bg-slate-850 dark:text-white text-xs font-semibold focus:outline-none" />
          </div>
          <div>
            <label className="block text-[10px] font-bold text-slate-400 mb-1">Diagnosis Methods</label>
            <textarea value={diagnosis} onChange={e => setDiagnosis(e.target.value)} required rows={2} className="w-full px-3 py-1.5 rounded-lg border dark:border-slate-800 bg-slate-50 dark:bg-slate-850 dark:text-white text-xs font-semibold focus:outline-none" />
          </div>
          <div>
            <label className="block text-[10px] font-bold text-slate-400 mb-1">Treatment Options</label>
            <textarea value={treatment} onChange={e => setTreatment(e.target.value)} required rows={2} className="w-full px-3 py-1.5 rounded-lg border dark:border-slate-800 bg-slate-50 dark:bg-slate-850 dark:text-white text-xs font-semibold focus:outline-none" />
          </div>
          <div className="md:col-span-2">
            <label className="block text-[10px] font-bold text-slate-400 mb-1">Prevention</label>
            <textarea value={prevention} onChange={e => setPrevention(e.target.value)} required rows={2} className="w-full px-3 py-1.5 rounded-lg border dark:border-slate-800 bg-slate-50 dark:bg-slate-850 dark:text-white text-xs font-semibold focus:outline-none" />
          </div>
          <div className="md:col-span-2">
            <label className="block text-[10px] font-bold text-slate-400 mb-1">Emergency Red Flags</label>
            <textarea value={emergencySymptoms} onChange={e => setEmergencySymptoms(e.target.value)} required rows={2} className="w-full px-3 py-1.5 rounded-lg border dark:border-slate-800 bg-slate-50 dark:bg-slate-850 dark:text-white text-xs font-semibold focus:outline-none" />
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
                <th className="p-4">Primary Symptoms</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y dark:divide-slate-800">
              {diseases.map((dis) => (
                <tr key={dis._id} className="hover:bg-slate-50/50 dark:hover:bg-slate-850/40">
                  <td className="p-4 font-bold text-slate-800 dark:text-slate-200">{dis.name}</td>
                  <td className="p-4 text-slate-500 truncate max-w-sm">{dis.symptoms}</td>
                  <td className="p-4 text-right flex justify-end gap-1.5">
                    <button onClick={() => handleEdit(dis)} className="p-2 text-blue-500 hover:bg-blue-50 dark:hover:bg-slate-800 rounded-lg"><Edit size={14} /></button>
                    <button onClick={() => handleDelete(dis._id)} className="p-2 text-rose-500 hover:bg-rose-50 dark:hover:bg-slate-800 rounded-lg"><Trash2 size={14} /></button>
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
export default AdminDiseases;
