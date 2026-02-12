
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

  useEffect(() => {
    // Inicialização local resiliente
    const initApp = () => {
      const savedUser = localStorage.getItem('profila_user');
      const savedResumes = localStorage.getItem('profila_resumes');
      
      if (savedUser) {
        setUser(JSON.parse(savedUser));
      }
      
      if (savedResumes) {
        setResumes(JSON.parse(savedResumes));
      }
      
      setLoading(false);
    };

    initApp();
  }, []);

  const handleLogin = (userData: User) => {
    setUser(userData);
    localStorage.setItem('profila_user', JSON.stringify(userData));
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('profila_user');
  };

  const handleSaveResume = (resume: ResumeData) => {
    const updatedResumes = resumes.find(r => r.id === resume.id)
      ? resumes.map(r => r.id === resume.id ? resume : r)
      : [resume, ...resumes];
    
    setResumes(updatedResumes);
    localStorage.setItem('profila_resumes', JSON.stringify(updatedResumes));
    setCurrentResume(resume);
  };

  const handleDeleteResume = (id: string) => {
    const updated = resumes.filter(r => r.id !== id);
    setResumes(updated);
    localStorage.setItem('profila_resumes', JSON.stringify(updated));
  };

  const handleUpgrade = (plan: PlanType) => {
    if (!user) return;
    const updatedUser = { ...user, plan };
    setUser(updatedUser);
    localStorage.setItem('profila_user', JSON.stringify(updatedUser));
    setIsPlanModalOpen(false);
    alert(`Plano atualizado para ${plan}! (Simulação de pagamento concluída)`);
  };

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950">
      <div className="flex flex-col items-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-brand-blue mb-4"></div>
        <span className="text-slate-400 font-bold text-[10px] uppercase tracking-[0.2em]">Iniciando PROFILA...</span>
      </div>
    </div>
  );

  return (
    <Router>
      <Layout user={user} onLogout={handleLogout}>
        <Routes>
          <Route path={AppRoute.LANDING} element={<Landing />} />
          <Route path={AppRoute.LOGIN} element={user ? <Navigate to={AppRoute.DASHBOARD} /> : <Login onLogin={handleLogin} />} />
          <Route path={AppRoute.REGISTER} element={user ? <Navigate to={AppRoute.DASHBOARD} /> : <Register onRegister={handleLogin} />} />
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
          
          <Route path={AppRoute.PLANS} element={<PlansPage user={user} onUpgrade={handleUpgrade} />} />
          <Route path={AppRoute.BILLING_SUCCESS} element={<BillingSuccess />} />
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
