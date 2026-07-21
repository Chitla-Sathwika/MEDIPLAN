import React, { useState, useEffect } from 'react';
import { Pill, Trash2, Edit, Plus, Loader2, Save, X } from 'lucide-react';
import api from '../../services/api';

export const AdminMedicines: React.FC = () => {
  const [medicines, setMedicines] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingItem, setEditingItem] = useState<any | null>(null);
  
  // Form fields
  const [name, setName] = useState('');
  const [genericName, setGenericName] = useState('');
  const [brandName, setBrandName] = useState('');
  const [strength, setStrength] = useState('');
  const [dosage, setDosage] = useState('');
  const [uses, setUses] = useState('');
  const [sideEffects, setSideEffects] = useState('');
  const [warnings, setWarnings] = useState('');
  const [precautions, setPrecautions] = useState('');
  const [storage, setStorage] = useState('');
  const [manufacturer, setManufacturer] = useState('');
  const [prescriptionRequired, setPrescriptionRequired] = useState(false);
  const [category, setCategory] = useState('');

  const fetchMedicines = async () => {
    setLoading(true);
    try {
      const res = await api.get('/medicines?limit=50');
      setMedicines(res.data.medicines);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMedicines();
  }, []);

  const handleEdit = (med: any) => {
    setEditingItem(med);
    setName(med.name);
    setGenericName(med.genericName);
    setBrandName(med.brandName);
    setStrength(med.strength);
    setDosage(med.dosage);
    setUses(med.uses);
    setSideEffects(med.sideEffects);
    setWarnings(med.warnings);
    setPrecautions(med.precautions);
    setStorage(med.storage);
    setManufacturer(med.manufacturer);
    setPrescriptionRequired(med.prescriptionRequired);
    setCategory(med.category);
  };

  const handleCreateNew = () => {
    setEditingItem({ _id: 'new' });
    setName('');
    setGenericName('');
    setBrandName('');
    setStrength('');
    setDosage('');
    setUses('');
    setSideEffects('');
    setWarnings('');
    setPrecautions('');
    setStorage('');
    setManufacturer('');
    setPrescriptionRequired(false);
    setCategory('');
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Delete this medicine?')) return;
    try {
      await api.delete(`/medicines/${id}`);
      fetchMedicines();
    } catch (err) {
      console.error(err);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const payload = {
      name, genericName, brandName, strength, dosage, uses,
      sideEffects, warnings, precautions, storage, manufacturer,
      prescriptionRequired, category, keywords: [name.toLowerCase(), category.toLowerCase()]
    };

    try {
      if (editingItem?._id === 'new') {
        await api.post('/medicines', payload);
      } else {
        await api.put(`/medicines/${editingItem._id}`, payload);
      }
      setEditingItem(null);
      fetchMedicines();
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
        <h2 className="text-lg font-extrabold flex items-center gap-1.5"><Pill size={20} className="text-brand-500" /> Medicines Registry</h2>
        {!editingItem && (
          <button onClick={handleCreateNew} className="px-3.5 py-1.5 bg-brand-500 hover:bg-brand-600 text-white rounded-lg text-xs font-bold flex items-center gap-1">
            <Plus size={14} /> Add Medicine
          </button>
        )}
      </div>

      {editingItem ? (
        <form onSubmit={handleSubmit} className="bg-white dark:bg-slate-900 border dark:border-slate-800 rounded-3xl p-6 shadow-md grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="md:col-span-2 flex justify-between items-center border-b dark:border-slate-800 pb-3 mb-2">
            <h3 className="font-bold text-xs uppercase text-brand-500">{editingItem._id === 'new' ? 'New Medicine Monograph' : 'Edit Medicine Monograph'}</h3>
            <button type="button" onClick={() => setEditingItem(null)} className="text-slate-400 hover:text-slate-600"><X size={18} /></button>
          </div>
          <div>
            <label className="block text-[10px] font-bold text-slate-400 mb-1">Medicine Name</label>
            <input type="text" value={name} onChange={e => setName(e.target.value)} required className="w-full px-3 py-1.5 rounded-lg border dark:border-slate-800 bg-slate-50 dark:bg-slate-850 dark:text-white text-xs font-semibold focus:outline-none" />
          </div>
          <div>
            <label className="block text-[10px] font-bold text-slate-400 mb-1">Generic Name</label>
            <input type="text" value={genericName} onChange={e => setGenericName(e.target.value)} required className="w-full px-3 py-1.5 rounded-lg border dark:border-slate-800 bg-slate-50 dark:bg-slate-850 dark:text-white text-xs font-semibold focus:outline-none" />
          </div>
          <div>
            <label className="block text-[10px] font-bold text-slate-400 mb-1">Brand Name(s)</label>
            <input type="text" value={brandName} onChange={e => setBrandName(e.target.value)} required className="w-full px-3 py-1.5 rounded-lg border dark:border-slate-800 bg-slate-50 dark:bg-slate-850 dark:text-white text-xs font-semibold focus:outline-none" />
          </div>
          <div>
            <label className="block text-[10px] font-bold text-slate-400 mb-1">Strength</label>
            <input type="text" value={strength} onChange={e => setStrength(e.target.value)} required className="w-full px-3 py-1.5 rounded-lg border dark:border-slate-800 bg-slate-50 dark:bg-slate-850 dark:text-white text-xs font-semibold focus:outline-none" />
          </div>
          <div>
            <label className="block text-[10px] font-bold text-slate-400 mb-1">Manufacturer</label>
            <input type="text" value={manufacturer} onChange={e => setManufacturer(e.target.value)} required className="w-full px-3 py-1.5 rounded-lg border dark:border-slate-800 bg-slate-50 dark:bg-slate-850 dark:text-white text-xs font-semibold focus:outline-none" />
          </div>
          <div>
            <label className="block text-[10px] font-bold text-slate-400 mb-1">Category</label>
            <input type="text" value={category} onChange={e => setCategory(e.target.value)} required className="w-full px-3 py-1.5 rounded-lg border dark:border-slate-800 bg-slate-50 dark:bg-slate-850 dark:text-white text-xs font-semibold focus:outline-none" />
          </div>
          <div className="md:col-span-2">
            <label className="block text-[10px] font-bold text-slate-400 mb-1">Uses</label>
            <textarea value={uses} onChange={e => setUses(e.target.value)} required rows={2} className="w-full px-3 py-1.5 rounded-lg border dark:border-slate-800 bg-slate-50 dark:bg-slate-850 dark:text-white text-xs font-semibold focus:outline-none" />
          </div>
          <div className="md:col-span-2">
            <label className="block text-[10px] font-bold text-slate-400 mb-1">Dosage Instructions</label>
            <input type="text" value={dosage} onChange={e => setDosage(e.target.value)} required className="w-full px-3 py-1.5 rounded-lg border dark:border-slate-800 bg-slate-50 dark:bg-slate-850 dark:text-white text-xs font-semibold focus:outline-none" />
          </div>
          <div className="md:col-span-2">
            <label className="block text-[10px] font-bold text-slate-400 mb-1">Warnings</label>
            <textarea value={warnings} onChange={e => setWarnings(e.target.value)} required rows={2} className="w-full px-3 py-1.5 rounded-lg border dark:border-slate-800 bg-slate-50 dark:bg-slate-850 dark:text-white text-xs font-semibold focus:outline-none" />
          </div>
          <div className="md:col-span-2">
            <label className="block text-[10px] font-bold text-slate-400 mb-1">Storage Conditions</label>
            <input type="text" value={storage} onChange={e => setStorage(e.target.value)} required className="w-full px-3 py-1.5 rounded-lg border dark:border-slate-800 bg-slate-50 dark:bg-slate-850 dark:text-white text-xs font-semibold focus:outline-none" />
          </div>
          <div className="flex items-center gap-2 pt-4">
            <input type="checkbox" checked={prescriptionRequired} onChange={e => setPrescriptionRequired(e.target.checked)} id="rxReq" className="h-4 w-4" />
            <label htmlFor="rxReq" className="text-xs font-bold text-slate-700 dark:text-slate-350 cursor-pointer">Prescription Required (Rx)</label>
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
                <th className="p-4">Brand</th>
                <th className="p-4">Category</th>
                <th className="p-4">Rx</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y dark:divide-slate-800">
              {medicines.map((med) => (
                <tr key={med._id} className="hover:bg-slate-50/50 dark:hover:bg-slate-850/40">
                  <td className="p-4 font-bold text-slate-800 dark:text-slate-200">{med.name}</td>
                  <td className="p-4 text-slate-500">{med.brandName}</td>
                  <td className="p-4 text-slate-500 font-medium">{med.category}</td>
                  <td className="p-4">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${med.prescriptionRequired ? 'bg-rose-50 text-rose-600' : 'bg-emerald-50 text-emerald-600'}`}>{med.prescriptionRequired ? 'Rx' : 'OTC'}</span>
                  </td>
                  <td className="p-4 text-right flex justify-end gap-1.5">
                    <button onClick={() => handleEdit(med)} className="p-2 text-blue-500 hover:bg-blue-50 dark:hover:bg-slate-800 rounded-lg"><Edit size={14} /></button>
                    <button onClick={() => handleDelete(med._id)} className="p-2 text-rose-500 hover:bg-rose-50 dark:hover:bg-slate-800 rounded-lg"><Trash2 size={14} /></button>
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
export default AdminMedicines;
