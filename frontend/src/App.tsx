import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from './contexts/ThemeContext';
import { LanguageProvider } from './contexts/LanguageContext';
import { AuthProvider } from './contexts/AuthContext';

// Layouts
import { DefaultLayout } from './layouts/DefaultLayout';
import { AuthLayout } from './layouts/AuthLayout';
import { AdminLayout } from './layouts/AdminLayout';

// Pages
import { Home } from './pages/Home';
import { Login } from './pages/Login';
import { Signup } from './pages/Signup';
import { ForgotPassword } from './pages/ForgotPassword';
import { SearchResults } from './pages/SearchResults';
import { MedicineDetails } from './pages/MedicineDetails';
import { TestDetails } from './pages/TestDetails';
import { DiseaseDetails } from './pages/DiseaseDetails';
import { ReportUpload } from './pages/ReportUpload';
import { History } from './pages/History';
import { Bookmarks } from './pages/Bookmarks';
import { Profile } from './pages/Profile';

// Admin Pages
import { AdminDashboard } from './pages/admin/AdminDashboard';
import { AdminMedicines } from './pages/admin/AdminMedicines';
import { AdminTests } from './pages/admin/AdminTests';
import { AdminDiseases } from './pages/admin/AdminDiseases';
import { AdminUsers } from './pages/admin/AdminUsers';
import { AdminFeedback } from './pages/admin/AdminFeedback';

const App: React.FC = () => {
  return (
    <ThemeProvider>
      <LanguageProvider>
        <AuthProvider>
          <BrowserRouter>
            <Routes>
              {/* Public & User Protected Route Shell */}
              <Route path="/" element={<DefaultLayout />}>
                <Route index element={<Home />} />
                <Route path="search" element={<SearchResults />} />
                <Route path="medicines/:id" element={<MedicineDetails />} />
                <Route path="tests/:id" element={<TestDetails />} />
                <Route path="diseases/:id" element={<DiseaseDetails />} />
                <Route path="upload" element={<ReportUpload />} />
                <Route path="history" element={<History />} />
                <Route path="bookmarks" element={<Bookmarks />} />
                <Route path="profile" element={<Profile />} />
              </Route>

              {/* Authentication Routes */}
              <Route path="/" element={<AuthLayout />}>
                <Route path="login" element={<Login />} />
                <Route path="signup" element={<Signup />} />
                <Route path="forgot-password" element={<ForgotPassword />} />
              </Route>

              {/* Admin Panel Console Routes */}
              <Route path="/admin" element={<AdminLayout />}>
                <Route index element={<AdminDashboard />} />
                <Route path="medicines" element={<AdminMedicines />} />
                <Route path="tests" element={<AdminTests />} />
                <Route path="diseases" element={<AdminDiseases />} />
                <Route path="users" element={<AdminUsers />} />
                <Route path="feedback" element={<AdminFeedback />} />
              </Route>

              {/* Fallback route */}
              <Route path="*" element={
                <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 dark:bg-slate-950 p-4">
                  <h1 className="text-4xl font-extrabold text-brand-600 mb-2">404</h1>
                  <p className="text-slate-600 dark:text-slate-400 mb-4 font-semibold text-sm">Page Not Found</p>
                  <a href="/" className="px-4 py-2 bg-brand-500 hover:bg-brand-600 text-white rounded-lg font-bold text-xs shadow-md">Back to Safety</a>
                </div>
              } />
            </Routes>
          </BrowserRouter>
        </AuthProvider>
      </LanguageProvider>
    </ThemeProvider>
  );
};

export default App;
