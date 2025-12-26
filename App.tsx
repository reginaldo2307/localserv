
import React, { useState, useEffect } from 'react';
import { HashRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Auth from './pages/Auth';
import Explore from './pages/Explore';
import ServiceDetails from './pages/ServiceDetails';
import CreateAd from './pages/CreateAd';
import Dashboard from './pages/Dashboard';
import Profile from './pages/Profile';
import { User } from './types';
import { supabase } from './services/supabase';

import AdminLogin from './pages/admin/AdminLogin';
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminServices from './pages/admin/AdminServices';
import AdminUsers from './pages/admin/AdminUsers';
import AdminReports from './pages/admin/AdminReports';
import AdminMonetization from './pages/admin/AdminMonetization';
import Plans from './pages/Plans';

interface AuthUser extends User {
  loadingProfile?: boolean;
}

const App: React.FC = () => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    // Absolute timeout to prevent infinite loading screen
    const forceStopLoading = setTimeout(() => {
      if (isMounted && loading) {
        console.warn('Auth: Timeout reached, forced stop loading');
        setLoading(false);
      }
    }, 6000);

    const checkSessionAndProfile = async (session: any) => {
      if (!session?.user) {
        if (isMounted) {
          setUser(null);
          setLoading(false);
        }
        return;
      }

      try {
        console.log('Auth: Checking profile for', session.user.id);
        const { data: profile, error } = await supabase
          .from('profiles')
          .select('is_admin, blocked')
          .eq('id', session.user.id)
          .maybeSingle();

        if (error) throw error;

        if (profile?.blocked) {
          console.warn('Auth: User is blocked');
          await supabase.auth.signOut();
          if (isMounted) {
            setUser(null);
            alert('Sua conta foi suspensa.');
          }
        } else if (isMounted) {
          console.log('Auth: Profile loaded, is_admin:', !!profile?.is_admin);
          setUser({
            id: session.user.id,
            name: session.user.user_metadata?.name || session.user.email?.split('@')[0] || 'Usuário',
            email: session.user.email || '',
            role: profile?.is_admin ? 'admin' : 'provider',
            is_admin: !!profile?.is_admin,
            loadingProfile: false
          });
        }
      } catch (err) {
        console.error('Auth: Profile fetch error:', err);
        if (isMounted) {
          setUser({
            id: session.user.id,
            name: session.user.user_metadata?.name || session.user.email?.split('@')[0] || 'Usuário',
            email: session.user.email || '',
            role: 'provider',
            is_admin: false,
            loadingProfile: false
          });
        }
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    // Initial check
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (isMounted) {
        if (session) {
          checkSessionAndProfile(session);
        } else {
          setLoading(false);
        }
      }
    });

    // Listen for changes
    const { data: authListener } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('Auth: Event', event);
        if (event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED') {
          checkSessionAndProfile(session);
        } else if (event === 'SIGNED_OUT') {
          if (isMounted) {
            setUser(null);
            setLoading(false);
          }
        }
      }
    );

    return () => {
      isMounted = false;
      clearTimeout(forceStopLoading);
      authListener.subscription.unsubscribe();
    };
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setUser(null);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 dark:bg-slate-900 gap-4">
        <div className="h-12 w-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
        <p className="text-slate-600 dark:text-slate-400 font-bold">Verificando acesso...</p>
      </div>
    );
  }

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Explore user={user} onLogout={handleLogout} />} />
        <Route path="/auth" element={user ? <Navigate to="/" /> : <Auth />} />
        <Route path="/service/:id" element={<ServiceDetails user={user} onLogout={handleLogout} />} />
        <Route path="/plans" element={<Plans user={user} onLogout={handleLogout} />} />

        {/* Protected Routes */}
        <Route
          path="/create"
          element={user ? <CreateAd user={user} onLogout={handleLogout} /> : <Navigate to="/auth" />}
        />
        <Route
          path="/dashboard"
          element={user ? <Dashboard user={user} onLogout={handleLogout} /> : <Navigate to="/auth" />}
        />
        <Route
          path="/profile"
          element={user ? <Profile user={user} onLogout={handleLogout} /> : <Navigate to="/auth" />}
        />

        {/* Admin Routes */}
        <Route
          path="/admin/login"
          element={user?.is_admin ? <Navigate to="/admin" /> : <AdminLogin />}
        />
        <Route
          path="/admin"
          element={user?.is_admin ? <AdminDashboard user={user} onLogout={handleLogout} /> : <Navigate to="/admin/login" />}
        />
        <Route
          path="/admin/services"
          element={user?.is_admin ? <AdminServices user={user} onLogout={handleLogout} /> : <Navigate to="/admin/login" />}
        />
        <Route
          path="/admin/users"
          element={user?.is_admin ? <AdminUsers user={user} onLogout={handleLogout} /> : <Navigate to="/admin/login" />}
        />
        <Route
          path="/admin/reports"
          element={user?.is_admin ? <AdminReports user={user} onLogout={handleLogout} /> : <Navigate to="/admin/login" />}
        />
        <Route
          path="/admin/monetization"
          element={user?.is_admin ? <AdminMonetization user={user} onLogout={handleLogout} /> : <Navigate to="/admin/login" />}
        />

        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Router>
  );
};

export default App;
