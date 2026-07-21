import React, { useState, useEffect } from 'react';
import { LayoutDashboard, Users, Pill, Activity, AlertTriangle, FileText, MessageSquare, Upload, CheckCircle2, AlertOctagon, Loader2 } from 'lucide-react';
import api from '../../services/api';

export const AdminDashboard: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<any>(null);
  
  // Bulk import states
  const [importType, setImportType] = useState<'medicines' | 'tests' | 'diseases'>('medicines');
  const [jsonInput, setJsonInput] = useState('');
  const [importSuccess, setImportSuccess] = useState<string | null>(null);
  const [importError, setImportError] = useState<string | null>(null);
  const [isImporting, setIsImporting] = useState(false);

  // Fetch stats on load
  const fetchStats = async () => {
    try {
      const res = await api.get('/admin/dashboard-stats');
      setStats(res.data.stats);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  const handleBulkImport = async (e: React.FormEvent) => {
    e.preventDefault();
    setImportSuccess(null);
    setImportError(null);
    setIsImporting(true);

    try {
      // Validate JSON input format
      let parsedData;
      try {
        parsedData = JSON.parse(jsonInput);
      } catch (jsonErr) {
        throw new Error('Invalid JSON format. Please verify brackets, keys, and quotation marks.');
      }

      if (!Array.isArray(parsedData)) {
        throw new Error('Bulk import payload must be a JSON array of objects.');
      }

      const res = await api.post('/admin/import', {
        type: importType,
        data: parsedData
      });

      setImportSuccess(res.data.message || 'Bulk import completed successfully.');
      setJsonInput('');
      fetchStats(); // Update dashboard cards count
    } catch (err: any) {
      setImportError(err.message || err.response?.data?.message || 'Bulk import failed.');
    } finally {
      setIsImporting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-slate-400 gap-2">
        <Loader2 className="animate-spin text-brand-500" size={32} />
        <span className="text-xs font-bold font-sans">Compiling Analytics Data...</span>
      </div>
    );
  }

  const statCards = [
    { title: 'Total Registered Users', value: stats?.totalUsers || 0, icon: Users, color: 'text-blue-500 bg-blue-50 dark:bg-blue-950/20' },
    { title: 'Total Medicines', value: stats?.totalMedicines || 0, icon: Pill, color: 'text-indigo-500 bg-indigo-50 dark:bg-indigo-950/20' },
    { title: 'Total Diagnostic Tests', value: stats?.totalTests || 0, icon: Activity, color: 'text-teal-500 bg-teal-50 dark:bg-teal-950/20' },
    { title: 'Total Diseases Files', value: stats?.totalDiseases || 0, icon: AlertTriangle, color: 'text-amber-500 bg-amber-50 dark:bg-amber-950/20' },
    { title: 'Reports Analyzed', value: stats?.totalReports || 0, icon: FileText, color: 'text-purple-500 bg-purple-50 dark:bg-purple-950/20' },
    { title: 'User Feedbacks', value: stats?.totalFeedback || 0, icon: MessageSquare, color: 'text-rose-500 bg-rose-50 dark:bg-rose-950/20' }
  ];

  return (
    <div className="space-y-8">
      {/* Page Title */}
      <div className="flex items-center gap-2">
        <LayoutDashboard className="text-brand-500" size={24} />
        <h2 className="text-xl font-extrabold text-slate-800 dark:text-white">Dashboard Overview</h2>
      </div>

      {/* Stats Cards grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {statCards.map((card, idx) => {
          const Icon = card.icon;
          return (
            <div key={idx} className="p-6 bg-white dark:bg-slate-900 border border-slate-200/50 dark:border-slate-800 rounded-2xl flex items-center justify-between shadow-sm">
              <div>
                <p className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">{card.title}</p>
                <h4 className="text-2xl sm:text-3xl font-extrabold text-slate-850 dark:text-white mt-2">{card.value}</h4>
              </div>
              <div className={`h-12 w-12 rounded-xl flex items-center justify-center shrink-0 ${card.color}`}>
                <Icon size={22} />
              </div>
            </div>
          );
        })}
      </div>

      {/* Bulk Import panel */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200/50 dark:border-slate-800 rounded-3xl p-6 shadow-md max-w-3xl">
        <h3 className="font-extrabold text-slate-850 dark:text-white text-sm mb-4 flex items-center gap-1.5">
          <Upload className="text-brand-500" size={16} />
          Bulk JSON Database Import
        </h3>

        {importSuccess && (
          <div className="flex items-center gap-2.5 p-3.5 mb-4 rounded-xl bg-medical-emerald/15 text-medical-emerald text-xs font-bold border border-medical-emerald/25">
            <CheckCircle2 size={18} />
            <span>{importSuccess}</span>
          </div>
        )}

        {importError && (
          <div className="flex items-center gap-2.5 p-3.5 mb-4 rounded-xl bg-medical-rose/10 text-medical-rose text-xs font-bold border border-medical-rose/25">
            <AlertOctagon size={18} className="shrink-0" />
            <span>{importError}</span>
          </div>
        )}

        <form onSubmit={handleBulkImport} className="space-y-4">
          <div className="flex items-center gap-6 flex-wrap">
            <div>
              <label className="block text-[11px] font-bold text-slate-400 uppercase mb-2">Import Target Registry</label>
              <div className="flex gap-2">
                {(['medicines', 'tests', 'diseases'] as const).map(type => (
                  <button
                    key={type}
                    type="button"
                    onClick={() => setImportType(type)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold border capitalize transition ${importType === type ? 'bg-brand-500 border-brand-500 text-white' : 'border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300'}`}
                  >
                    {type}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div>
            <label className="block text-[11px] font-bold text-slate-400 uppercase mb-2">JSON Content (Array format)</label>
            <textarea
              value={jsonInput}
              onChange={e => setJsonInput(e.target.value)}
              required
              rows={8}
              placeholder='[
  {
    "name": "New Medicine Example",
    "genericName": "Chemical Name",
    "brandName": "Brand ABC",
    ...
  }
]'
              className="w-full px-4 py-2.5 rounded-xl border dark:border-slate-800 bg-slate-50/50 dark:bg-slate-850 dark:text-white text-xs font-mono focus:outline-none focus:ring-2 focus:ring-brand-500 resize-y"
            />
          </div>

          <button
            type="submit"
            disabled={isImporting || !jsonInput.trim()}
            className="px-6 py-2.5 bg-slate-900 hover:bg-slate-800 text-white dark:bg-slate-800 dark:hover:bg-slate-700 font-bold rounded-xl text-xs transition disabled:opacity-50"
          >
            {isImporting ? 'Parsing and Importing...' : 'Trigger Bulk Import'}
          </button>
        </form>
      </div>
    </div>
  );
};
export default AdminDashboard;
