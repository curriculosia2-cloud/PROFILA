
import React, { useState, useEffect } from 'react';
import { HashRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout';
import Landing from './pages/Landing';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import CreateResume from './pages/CreateResume';
import CustomizeResume from './pages/CustomizeResume';
import ExportResume from './pages/ExportResume';
import PlanModal from './components/PlanModal';
import { User, ResumeData, AppRoute, PlanType } from './types';
import { supabase, supabaseService } from './services/supabase';

const App: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [resumes, setResumes] = useState<ResumeData[]>([]);
  const [currentResume, setCurrentResume] = useState<ResumeData | null>(null);
  const [loading, setLoading] = useState(true);
  const [isPlanModalOpen, setIsPlanModalOpen] = useState(false);

  useEffect(() => {
    // 1. Handle Auth State Changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (session?.user) {
        const profile = await supabaseService.getProfile(session.user.id);
        const userData: User = {
          id: session.user.id,
          email: session.user.email!,
          name: profile?.name || session.user.email!.split('@')[0],
          plan: profile?.plan || 'free'
        };
        setUser(userData);
        loadUserResumes(session.user.id);
      } else {
        setUser(null);
        setResumes([]);
      }
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const loadUserResumes = async (userId: string) => {
    try {
      const data = await supabaseService.getResumes(userId);
      setResumes(data);
    } catch (err) {
      console.error("Erro ao carregar currículos:", err);
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setUser(null);
    setResumes([]);
  };

  const handleSaveResume = async (resume: ResumeData) => {
    if (!user) return;
    try {
      const saved = await supabaseService.saveResume(user.id, resume);
      const updatedResumes = resumes.find(r => r.id === saved.id)
        ? resumes.map(r => r.id === saved.id ? saved : r)
        : [saved, ...resumes];
      
      setResumes(updatedResumes);
      setCurrentResume(saved);
    } catch (err) {
      console.error("Erro ao salvar currículo no banco:", err);
    }
  };

  const handleUpgrade = async (plan: PlanType) => {
    if (!user) return;
    try {
      await supabaseService.updateProfile(user.id, { plan });
      setUser({ ...user, plan });
      setIsPlanModalOpen(false);
      alert(`Parabéns! Você agora é um membro ${plan.toUpperCase()}.`);
    } catch (err) {
      console.error("Erro no upgrade:", err);
    }
  };

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50">
      <div className="flex flex-col items-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-brand-blue mb-4"></div>
        <span className="text-slate-400 font-bold text-xs uppercase tracking-widest">Iniciando PROFILA...</span>
      </div>
    </div>
  );

  return (
    <Router>
      <Layout user={user} onLogout={handleLogout}>
        <Routes>
          <Route path={AppRoute.LANDING} element={<Landing />} />
          <Route path={AppRoute.LOGIN} element={user ? <Navigate to={AppRoute.DASHBOARD} /> : <Login onLogin={() => {}} />} />
          <Route path={AppRoute.REGISTER} element={user ? <Navigate to={AppRoute.DASHBOARD} /> : <Register onRegister={() => {}} />} />
          
          <Route path={AppRoute.DASHBOARD} element={user ? <Dashboard resumes={resumes} user={user} setCurrentResume={setCurrentResume} onOpenPlans={() => setIsPlanModalOpen(true)} onRefreshResumes={() => loadUserResumes(user.id)} /> : <Navigate to={AppRoute.LOGIN} />} />
          <Route path={AppRoute.CREATE} element={user ? <CreateResume onSave={handleSaveResume} user={user} resumesCount={resumes.length} onOpenPlans={() => setIsPlanModalOpen(true)} /> : <Navigate to={AppRoute.LOGIN} />} />
          <Route path={AppRoute.CUSTOMIZE} element={user && currentResume ? <CustomizeResume resume={currentResume} onSave={handleSaveResume} user={user} onOpenPlans={() => setIsPlanModalOpen(true)} /> : <Navigate to={AppRoute.DASHBOARD} />} />
          <Route path={AppRoute.EXPORT} element={user && currentResume ? <ExportResume resume={currentResume} user={user} /> : <Navigate to={AppRoute.DASHBOARD} />} />
        </Routes>

        <PlanModal 
          isOpen={isPlanModalOpen} 
          onClose={() => setIsPlanModalOpen(false)} 
          currentPlan={user?.plan || 'free'}
          onUpgrade={handleUpgrade}
        />
      </Layout>
    </Router>
  );
};

export default App;
