
import * as React from 'react';
import { useState, useEffect } from 'react';
import { HashRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout';
import Landing from './pages/Landing';
import Login from './pages/Login';
import Register from './pages/Register';
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';
import VerifyEmail from './pages/VerifyEmail';
import Dashboard from './pages/Dashboard';
import CreateResume from './pages/CreateResume';
import CustomizeResume from './pages/CustomizeResume';
import ExportResume from './pages/ExportResume';
import PlansPage from './pages/PlansPage';
import BillingSuccess from './pages/BillingSuccess';
import PlanModal from './components/PlanModal';
import AIAssistant from './components/AIAssistant';
import { User, ResumeData, AppRoute, PlanType, PLANS } from './types';
import { supabase, supabaseService } from './services/supabase';

const PrivateRoute = ({ children, user }: any) => {
  if (!user) return <Navigate to={AppRoute.LOGIN} />;
  return <>{children}</>;
};

const App: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [resumes, setResumes] = useState<ResumeData[]>([]);
  const [currentResume, setCurrentResume] = useState<ResumeData | null>(null);
  const [loading, setLoading] = useState(true);
  const [isPlanModalOpen, setIsPlanModalOpen] = useState(false);

  // Monitora autenticação do Supabase
  useEffect(() => {
    const checkUser = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (session?.user) {
        const profile = await supabaseService.getProfile(session.user.id);
        const userData: User = {
          id: session.user.id,
          email: session.user.email!,
          name: profile?.name || session.user.user_metadata?.full_name || session.user.email?.split('@')[0],
          plan: profile?.plan || 'free',
          subscriptionStatus: 'active', // Simplificado para este MVP
          emailConfirmed: session.user.email_confirmed_at ? true : false
        };
        setUser(userData);
        localStorage.setItem('profila_user', JSON.stringify(userData));
        
        // Carrega currículos do Supabase
        const dbResumes = await supabaseService.getResumes();
        if (dbResumes.length > 0) {
          setResumes(dbResumes);
          localStorage.setItem('profila_resumes', JSON.stringify(dbResumes));
        } else {
          // Fallback para local se não houver nada no DB
          const savedResumes = localStorage.getItem('profila_resumes');
          if (savedResumes) setResumes(JSON.parse(savedResumes));
        }
      } else {
        // Fallback para LocalStorage se deslogado
        const savedUser = localStorage.getItem('profila_user');
        if (savedUser) setUser(JSON.parse(savedUser));
        const savedResumes = localStorage.getItem('profila_resumes');
        if (savedResumes) setResumes(JSON.parse(savedResumes));
      }
      setLoading(false);
    };

    checkUser();

    const { data: authListener } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === 'SIGNED_IN' && session?.user) {
        const profile = await supabaseService.getProfile(session.user.id);
        const userData: User = {
          id: session.user.id,
          email: session.user.email!,
          name: profile?.name || session.user.user_metadata?.full_name || session.user.email?.split('@')[0],
          plan: profile?.plan || 'free',
          subscriptionStatus: 'active',
          emailConfirmed: true
        };
        setUser(userData);
        localStorage.setItem('profila_user', JSON.stringify(userData));
        const dbResumes = await supabaseService.getResumes();
        setResumes(dbResumes);
      } else if (event === 'SIGNED_OUT') {
        setUser(null);
        setResumes([]);
        localStorage.removeItem('profila_user');
        localStorage.removeItem('profila_resumes');
      }
    });

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);

  const handleLogin = (userData: User) => {
    setUser(userData);
    localStorage.setItem('profila_user', JSON.stringify(userData));
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setUser(null);
    setResumes([]);
    localStorage.removeItem('profila_user');
    localStorage.removeItem('profila_resumes');
    window.location.href = '#/';
  };

  const handleSaveResume = async (resume: ResumeData) => {
    // Tenta salvar no Supabase se estiver logado
    if (user) {
      try {
        const saved = await supabaseService.saveResume(resume);
        if (saved) {
           const updatedResume = { 
             ...resume, 
             id: saved.id, 
             createdAt: new Date(saved.created_at).getTime() 
           };
           const updatedResumes = resumes.find(r => r.id === updatedResume.id)
            ? resumes.map(r => r.id === updatedResume.id ? updatedResume : r)
            : [updatedResume, ...resumes];
          
          setResumes(updatedResumes);
          localStorage.setItem('profila_resumes', JSON.stringify(updatedResumes));
          setCurrentResume(updatedResume);
          return;
        }
      } catch (err) {
        console.error("Erro ao salvar no Supabase, salvando localmente:", err);
      }
    }

    // Fallback local
    const updatedResumes = resumes.find(r => r.id === resume.id)
      ? resumes.map(r => r.id === resume.id ? resume : r)
      : [resume, ...resumes];
    
    setResumes(updatedResumes);
    localStorage.setItem('profila_resumes', JSON.stringify(updatedResumes));
    setCurrentResume(resume);
  };

  const handleDeleteResume = async (id: string) => {
    if (user) {
      try {
        await supabaseService.deleteResume(id);
      } catch (err) {
        console.error("Erro ao excluir no Supabase:", err);
      }
    }
    const updated = resumes.filter(r => r.id !== id);
    setResumes(updated);
    localStorage.setItem('profila_resumes', JSON.stringify(updated));
  };

  const handleUpgrade = async (plan: PlanType) => {
    if (!user) return;
    if (user.id) {
      try {
        await supabaseService.updateProfile(user.id, { plan });
      } catch (err) {
        console.error("Erro ao atualizar plano no Supabase:", err);
      }
    }
    const updatedUser = { ...user, plan };
    setUser(updatedUser);
    localStorage.setItem('profila_user', JSON.stringify(updatedUser));
    setIsPlanModalOpen(false);
  };

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950">
      <div className="flex flex-col items-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-brand-blue mb-4"></div>
        <span className="text-slate-400 font-bold text-[10px] uppercase tracking-[0.2em]">Sincronizando com a Nuvem...</span>
      </div>
    </div>
  );

  return (
    <Router>
      <Layout user={user} onLogout={handleLogout}>
        <Routes>
          <Route path={AppRoute.LANDING} element={<Landing />} />
          <Route path={AppRoute.LOGIN} element={<Login onLogin={handleLogin} />} />
          <Route path={AppRoute.REGISTER} element={<Register onRegister={handleLogin} />} />
          <Route path={AppRoute.FORGOT_PASSWORD} element={<ForgotPassword />} />
          <Route path={AppRoute.RESET_PASSWORD} element={<ResetPassword />} />
          <Route path={AppRoute.VERIFY_EMAIL} element={<VerifyEmail userEmail={user?.email} />} />
          
          <Route path={AppRoute.DASHBOARD} element={
            <PrivateRoute user={user}>
              <Dashboard 
                resumes={resumes} 
                user={user!} 
                setCurrentResume={setCurrentResume} 
                onOpenPlans={() => setIsPlanModalOpen(true)} 
                onDeleteResume={handleDeleteResume}
              />
            </PrivateRoute>
          } />
          
          <Route path={AppRoute.CREATE} element={
            <PrivateRoute user={user}>
              <CreateResume 
                onSave={handleSaveResume} 
                user={user!} 
                resumesCount={resumes.length} 
                onOpenPlans={() => setIsPlanModalOpen(true)} 
              />
            </PrivateRoute>
          } />
          
          <Route path={AppRoute.CUSTOMIZE} element={
            <PrivateRoute user={user}>
              {currentResume ? <CustomizeResume resume={currentResume} onSave={handleSaveResume} user={user!} onOpenPlans={() => setIsPlanModalOpen(true)} /> : <Navigate to={AppRoute.DASHBOARD} />}
            </PrivateRoute>
          } />
          
          <Route path={AppRoute.EXPORT} element={
            <PrivateRoute user={user}>
              {currentResume ? <ExportResume resume={currentResume} user={user!} /> : <Navigate to={AppRoute.DASHBOARD} />}
            </PrivateRoute>
          } />
          
          <Route path={AppRoute.PLANS} element={<PlansPage user={user} />} />
          <Route path={AppRoute.BILLING_SUCCESS} element={<BillingSuccess />} />
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>

        <PlanModal 
          isOpen={isPlanModalOpen} 
          onClose={() => setIsPlanModalOpen(false)} 
          currentPlan={user?.plan || 'free'}
          onUpgrade={handleUpgrade}
        />
        
        <AIAssistant />
      </Layout>
    </Router>
  );
};

export default App;
