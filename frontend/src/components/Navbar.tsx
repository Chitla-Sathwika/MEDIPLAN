import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useLanguage } from '../contexts/LanguageContext';
import { useTheme } from '../contexts/ThemeContext';
import { Sun, Moon, Globe, Bell, Menu, X, ShieldAlert, LogOut, User as UserIcon, BookOpen, Clock, FileText } from 'lucide-react';
import api from '../services/api';

export const Navbar: React.FC = () => {
  const { logout, updateUserPreferences, isAuthenticated, isAdmin } = useAuth();
  const { language, setLanguage, t } = useLanguage();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const location = useLocation();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [langDropdownOpen, setLangDropdownOpen] = useState(false);
  const [notiPanelOpen, setNotiPanelOpen] = useState(false);
  const [notifications, setNotifications] = useState<any[]>([]);

  const langRef = useRef<HTMLDivElement>(null);
  const notiRef = useRef<HTMLDivElement>(null);

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (langRef.current && !langRef.current.contains(event.target as Node)) {
        setLangDropdownOpen(false);
      }
      if (notiRef.current && !notiRef.current.contains(event.target as Node)) {
        setNotiPanelOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Fetch notifications
  useEffect(() => {
    if (isAuthenticated) {
      api.get('/users/notifications')
        .then(res => setNotifications(res.data.notifications))
        .catch(err => console.error('Failed to fetch notifications:', err));
    }
  }, [isAuthenticated, location]);

  const handleLanguageChange = (lang: 'en' | 'hi' | 'te') => {
    if (isAuthenticated) {
      updateUserPreferences({ language: lang }).catch(err => console.error(err));
    } else {
      setLanguage(lang);
    }
    setLangDropdownOpen(false);
  };

  const handleThemeToggle = () => {
    const nextTheme = theme === 'light' ? 'dark' : 'light';
    if (isAuthenticated) {
      updateUserPreferences({ theme: nextTheme }).catch(err => console.error(err));
    } else {
      toggleTheme();
    }
  };

  const markAsRead = async (id: string) => {
    try {
      await api.put(`/users/notifications/${id}/read`);
      setNotifications(prev => prev.map(n => n._id === id ? { ...n, read: true } : n));
    } catch (err) {
      console.error(err);
    }
  };

  const deleteNotification = async (id: string) => {
    try {
      await api.delete(`/users/notifications/${id}`);
      setNotifications(prev => prev.filter(n => n._id !== id));
    } catch (err) {
      console.error(err);
    }
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  const navLinks = [
    { name: t('home'), path: '/', icon: BookOpen },
    ...(isAuthenticated ? [
      { name: t('upload'), path: '/upload', icon: FileText },
      { name: t('history'), path: '/history', icon: Clock },
      { name: t('bookmarks'), path: '/bookmarks', icon: BookOpen },
      { name: t('profile'), path: '/profile', icon: UserIcon }
    ] : [])
  ];

  return (
    <nav className="sticky top-0 z-50 w-full glass-panel border-b border-slate-200/50 dark:border-slate-800/50 bg-white/80 dark:bg-slate-900/80 transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center">
            <Link to="/" className="flex items-center gap-2">
              <span className="h-9 w-9 rounded-lg bg-gradient-to-tr from-brand-500 to-brand-700 flex items-center justify-center text-white font-extrabold text-xl shadow-md shadow-brand-500/20">
                M
              </span>
              <span className="font-extrabold text-xl tracking-tight bg-gradient-to-r from-brand-600 to-brand-800 dark:from-brand-400 dark:to-brand-200 bg-clip-text text-transparent">
                {t('appName')}
              </span>
            </Link>
          </div>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-4">
            {navLinks.map(link => {
              const Icon = link.icon;
              const isActive = location.pathname === link.path;
              return (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-colors duration-150 ${
                    isActive
                      ? 'text-brand-600 dark:text-brand-400 bg-brand-50 dark:bg-brand-950/30'
                      : 'text-slate-600 hover:text-brand-600 dark:text-slate-300 dark:hover:text-brand-400 hover:bg-slate-50 dark:hover:bg-slate-800/40'
                  }`}
                >
                  <Icon size={16} />
                  {link.name}
                </Link>
              );
            })}
          </div>

          {/* Controls / Actions */}
          <div className="hidden md:flex items-center gap-2">
            {/* Admin Panel Badge */}
            {isAdmin && (
              <Link
                to="/admin"
                className="flex items-center gap-1 text-xs font-semibold bg-medical-amber/15 text-medical-amber dark:text-amber-400 px-2.5 py-1.5 rounded-full border border-medical-amber/35 hover:bg-medical-amber/25 transition-all"
              >
                <ShieldAlert size={14} />
                {t('adminPanel')}
              </Link>
            )}

            {/* Notifications Bell */}
            {isAuthenticated && (
              <div className="relative" ref={notiRef}>
                <button
                  onClick={() => setNotiPanelOpen(!notiPanelOpen)}
                  className="p-2 text-slate-600 hover:text-brand-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:text-brand-400 dark:hover:bg-slate-800 rounded-lg transition"
                >
                  <Bell size={20} />
                  {unreadCount > 0 && (
                    <span className="absolute top-1.5 right-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-medical-rose text-[9px] font-bold text-white">
                      {unreadCount}
                    </span>
                  )}
                </button>

                {/* Notifications Dropdown Panel */}
                {notiPanelOpen && (
                  <div className="absolute right-0 mt-2 w-80 rounded-xl bg-white dark:bg-slate-900 shadow-xl border border-slate-100 dark:border-slate-800 overflow-hidden ring-1 ring-black/5 z-50">
                    <div className="px-4 py-3 bg-slate-50 dark:bg-slate-800/50 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
                      <span className="font-semibold text-sm text-slate-700 dark:text-slate-200">Notifications</span>
                      {unreadCount > 0 && <span className="text-xs bg-brand-100 dark:bg-brand-950 text-brand-700 dark:text-brand-300 px-2 py-0.5 rounded-full font-bold">{unreadCount} New</span>}
                    </div>
                    <div className="max-h-72 overflow-y-auto">
                      {notifications.length === 0 ? (
                        <div className="py-6 text-center text-xs text-slate-400 dark:text-slate-500">No notifications</div>
                      ) : (
                        notifications.map(n => (
                          <div key={n._id} className={`p-3 border-b border-slate-50 dark:border-slate-800/30 flex items-start justify-between gap-2 hover:bg-slate-50/50 dark:hover:bg-slate-800/20 ${!n.read ? 'bg-brand-50/20 dark:bg-brand-950/10' : ''}`}>
                            <div className="flex-1" onClick={() => !n.read && markAsRead(n._id)}>
                              <h4 className="text-xs font-bold text-slate-800 dark:text-slate-200">{n.title}</h4>
                              <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">{n.message}</p>
                            </div>
                            <button onClick={() => deleteNotification(n._id)} className="text-slate-400 hover:text-medical-rose text-[10px] p-1 font-semibold">&times;</button>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Language Switcher */}
            <div className="relative" ref={langRef}>
              <button
                onClick={() => setLangDropdownOpen(!langDropdownOpen)}
                className="flex items-center gap-1 px-3 py-2 text-slate-600 hover:text-brand-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:text-brand-400 dark:hover:bg-slate-800 rounded-lg transition text-sm font-medium"
              >
                <Globe size={18} />
                <span className="uppercase">{language}</span>
              </button>

              {langDropdownOpen && (
                <div className="absolute right-0 mt-2 w-32 rounded-lg bg-white dark:bg-slate-900 shadow-xl border border-slate-100 dark:border-slate-800 py-1 overflow-hidden z-50">
                  <button onClick={() => handleLanguageChange('en')} className="w-full text-left px-4 py-2 text-xs text-slate-700 hover:bg-slate-50 dark:text-slate-300 dark:hover:bg-slate-800/80 font-medium">English</button>
                  <button onClick={() => handleLanguageChange('hi')} className="w-full text-left px-4 py-2 text-xs text-slate-700 hover:bg-slate-50 dark:text-slate-300 dark:hover:bg-slate-800/80 font-medium">हिंदी (Hindi)</button>
                  <button onClick={() => handleLanguageChange('te')} className="w-full text-left px-4 py-2 text-xs text-slate-700 hover:bg-slate-50 dark:text-slate-300 dark:hover:bg-slate-800/80 font-medium">తెలుగు (Telugu)</button>
                </div>
              )}
            </div>

            {/* Theme Toggle */}
            <button
              onClick={handleThemeToggle}
              className="p-2 text-slate-600 hover:text-brand-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:text-brand-400 dark:hover:bg-slate-800 rounded-lg transition"
            >
              {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
            </button>

            {/* Auth Buttons */}
            {isAuthenticated ? (
              <button
                onClick={() => { logout(); navigate('/login'); }}
                className="flex items-center gap-1.5 px-3 py-2 text-sm font-semibold text-medical-rose hover:bg-rose-50 dark:hover:bg-rose-950/20 rounded-lg transition"
              >
                <LogOut size={16} />
                {t('logout')}
              </button>
            ) : (
              <div className="flex items-center gap-2 pl-2">
                <Link to="/login" className="text-sm font-semibold text-slate-600 hover:text-brand-600 dark:text-slate-300 dark:hover:text-brand-400 px-3 py-2 rounded-lg">{t('login')}</Link>
                <Link to="/signup" className="text-sm font-bold text-white bg-gradient-to-r from-brand-500 to-brand-600 hover:from-brand-600 hover:to-brand-700 px-4 py-2 rounded-lg shadow-md shadow-brand-500/10 hover:shadow-brand-500/20 transition-all">{t('signup')}</Link>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="flex md:hidden items-center gap-2">
            <button onClick={handleThemeToggle} className="p-2 text-slate-600 dark:text-slate-300 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition">
              {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
            </button>

            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-slate-600 dark:text-slate-300 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition"
            >
              {mobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-slate-200/50 dark:border-slate-800/50 bg-white dark:bg-slate-900/95 p-4 flex flex-col gap-3 shadow-lg">
          {navLinks.map(link => {
            const Icon = link.icon;
            return (
              <Link
                key={link.path}
                to={link.path}
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center gap-2 p-2.5 rounded-lg text-sm font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800/60"
              >
                <Icon size={18} />
                {link.name}
              </Link>
            );
          })}

          {isAdmin && (
            <Link
              to="/admin"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center gap-2 p-2.5 rounded-lg text-sm font-bold text-medical-amber hover:bg-amber-50 dark:hover:bg-amber-950/20"
            >
              <ShieldAlert size={18} />
              {t('adminPanel')}
            </Link>
          )}

          {/* Languages mobile selector */}
          <div className="flex items-center justify-around border-t border-b border-slate-100 dark:border-slate-800 py-3 my-1">
            <button onClick={() => handleLanguageChange('en')} className={`text-xs font-bold px-3 py-1.5 rounded-md ${language === 'en' ? 'bg-brand-500 text-white' : 'text-slate-600 dark:text-slate-400'}`}>EN</button>
            <button onClick={() => handleLanguageChange('hi')} className={`text-xs font-bold px-3 py-1.5 rounded-md ${language === 'hi' ? 'bg-brand-500 text-white' : 'text-slate-600 dark:text-slate-400'}`}>Hindi</button>
            <button onClick={() => handleLanguageChange('te')} className={`text-xs font-bold px-3 py-1.5 rounded-md ${language === 'te' ? 'bg-brand-500 text-white' : 'text-slate-600 dark:text-slate-400'}`}>Telugu</button>
          </div>

          {isAuthenticated ? (
            <button
              onClick={() => { logout(); setMobileMenuOpen(false); navigate('/login'); }}
              className="w-full text-center p-3 rounded-lg text-sm font-bold text-medical-rose bg-rose-50 dark:bg-rose-950/15"
            >
              {t('logout')}
            </button>
          ) : (
            <div className="flex flex-col gap-2 pt-2">
              <Link to="/login" onClick={() => setMobileMenuOpen(false)} className="w-full text-center p-3 rounded-lg text-sm font-semibold border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300">{t('login')}</Link>
              <Link to="/signup" onClick={() => setMobileMenuOpen(false)} className="w-full text-center p-3 rounded-lg text-sm font-bold text-white bg-brand-500">{t('signup')}</Link>
            </div>
          )}
        </div>
      )}
    </nav>
  );
};
