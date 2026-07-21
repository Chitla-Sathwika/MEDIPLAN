import React from 'react';
import { Outlet, Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeContext';
import { ShieldCheck, LayoutDashboard, Pill, Activity, AlertTriangle, Users, MessageSquare, ArrowLeft, LogOut, Sun, Moon } from 'lucide-react';

export const AdminLayout: React.FC = () => {
  const { user, logout, loading, isAdmin } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const location = useLocation();

  // Route guarding
  React.useEffect(() => {
    if (!loading && (!user || !isAdmin)) {
      navigate('/login');
    }
  }, [user, isAdmin, loading, navigate]);

  if (loading || !user || !isAdmin) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950 text-slate-500">
        <div className="flex flex-col items-center gap-2">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-brand-500 border-r-2"></div>
          <span className="text-xs font-semibold">Authorizing Admin Session...</span>
        </div>
      </div>
    );
  }

  const sidebarLinks = [
    { name: 'Dashboard', path: '/admin', icon: LayoutDashboard },
    { name: 'Medicines', path: '/admin/medicines', icon: Pill },
    { name: 'Medical Tests', path: '/admin/tests', icon: Activity },
    { name: 'Diseases', path: '/admin/diseases', icon: AlertTriangle },
    { name: 'Users List', path: '/admin/users', icon: Users },
    { name: 'Feedbacks', path: '/admin/feedback', icon: MessageSquare }
  ];

  return (
    <div className="min-h-screen flex bg-slate-100 dark:bg-slate-950 text-slate-800 dark:text-slate-100 transition-colors">
      {/* Sidebar */}
      <aside className="w-64 bg-slate-900 text-slate-300 flex flex-col border-r border-slate-800 hidden md:flex shrink-0">
        {/* Sidebar Brand */}
        <div className="h-16 flex items-center px-6 gap-2 border-b border-slate-800 bg-slate-950">
          <ShieldCheck className="text-medical-teal" size={24} />
          <span className="font-bold text-white tracking-wide text-sm">MediPlain Console</span>
        </div>

        {/* Sidebar Nav */}
        <nav className="flex-1 px-4 py-6 space-y-1">
          {sidebarLinks.map(link => {
            const Icon = link.icon;
            const isActive = location.pathname === link.path;
            return (
              <Link
                key={link.path}
                to={link.path}
                className={`flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium transition-all ${
                  isActive
                    ? 'bg-brand-600 text-white shadow-md shadow-brand-600/10'
                    : 'hover:bg-slate-800 hover:text-white text-slate-400'
                }`}
              >
                <Icon size={18} />
                {link.name}
              </Link>
            );
          })}
        </nav>

        {/* Sidebar Footer */}
        <div className="p-4 border-t border-slate-800 bg-slate-950/40 space-y-2">
          <Link to="/" className="flex items-center gap-2 text-xs text-slate-400 hover:text-white px-3 py-2 rounded-lg transition">
            <ArrowLeft size={14} />
            Back to Patient Portal
          </Link>
          <button
            onClick={() => { logout(); navigate('/login'); }}
            className="w-full flex items-center gap-2 text-xs text-rose-400 hover:text-rose-300 px-3 py-2 rounded-lg hover:bg-rose-950/20 transition"
          >
            <LogOut size={14} />
            Logout Session
          </button>
        </div>
      </aside>

      {/* Main Content Pane */}
      <div className="flex-1 flex flex-col min-w-0 overflow-y-auto">
        {/* Top Header */}
        <header className="h-16 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between px-6 shrink-0 transition-colors">
          <div className="flex items-center gap-4">
            {/* Mobile Sidebar Link Trigger placeholder */}
            <h1 className="font-bold text-lg text-slate-900 dark:text-white">Admin Control Desk</h1>
          </div>

          <div className="flex items-center gap-4">
            {/* Theme Trigger */}
            <button
              onClick={toggleTheme}
              className="p-2 text-slate-600 hover:text-brand-600 dark:text-slate-300 dark:hover:text-brand-400 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition"
            >
              {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
            </button>

            {/* Admin Profile indicator */}
            <div className="flex items-center gap-2">
              <span className="h-8 w-8 rounded-full bg-brand-500 text-white flex items-center justify-center font-bold text-xs">
                {user.name.charAt(0)}
              </span>
              <div className="text-left hidden sm:block">
                <p className="text-xs font-bold text-slate-800 dark:text-slate-200">{user.name}</p>
                <p className="text-[10px] text-slate-500">Administrator</p>
              </div>
            </div>
          </div>
        </header>

        {/* Content Shell */}
        <main className="p-6 md:p-8 flex-1">
          {/* Quick mobile sidebar toggle warning */}
          <div className="md:hidden mb-4 p-3 bg-medical-rose/15 text-medical-rose text-xs font-semibold rounded-lg">
            Note: Admin dashboard panels are best viewed on desktop resolutions.
          </div>
          
          <Outlet />
        </main>
      </div>
    </div>
  );
};
