
// Fix: Use namespace import to correctly populate global JSX.IntrinsicElements
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
import { User, ResumeData, AppRoute, PlanType, SubscriptionStatus } from './types';
import { supabase, supabaseService } from './services/supabase';
import { stripeService } from './services/stripeService';

const PrivateRoute = ({ children, user }: any) => {
  if (!user) return <Navigate to={AppRoute.LOGIN} />;
  if (!user.emailConfirmed) return <Navigate to={AppRoute.VERIFY_EMAIL} />;
  return <>{children}</>;
};

const App: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [resumes, setResumes] = useState<ResumeData[]>([]);
  const [currentResume, setCurrentResume] = useState<ResumeData | null>(null);
  const [loading, setLoading] = useState(true);
  const [isPlanModalOpen, setIsPlanModalOpen] = useState(false);

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (session?.user) {
        const isEmailConfirmed = !!session.user.email_confirmed_at;
        
        if (isEmailConfirmed) {
          const profile = await supabaseService.getProfile(session.user.id);
          const subData = await stripeService.getSubscription(session.user.id);

          const userData: User = {
            id: session.user.id,
            email: session.user.email!,
            name: profile?.name || session.user.email!.split('@')[0],
            plan: subData?.plan || 'free',
            subscriptionStatus: subData?.status || 'inactive',
            emailConfirmed: true
          };
          setUser(userData);
          loadUserResumes(session.user.id);
        } else {
          setUser({
            id: session.user.id,
            email: session.user.email!,
            name: session.user.email!.split('@')[0],
            plan: 'free',
            subscriptionStatus: 'inactive',
            emailConfirmed: false
          });
          setResumes([]);
        }
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
    if (!user || !user.emailConfirmed) return;
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
    // No modo real, redirecionamos para o Stripe, mas mantemos o callback para mock/local
    if (!user || !user.emailConfirmed) return;
    try {
      await stripeService.createCheckoutSession(plan === 'pro' ? 'price_PRO_PLACEHOLDER' : 'price_PREMIUM_PLACEHOLDER');
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
      <Layout user={user && user.emailConfirmed ? user : null} onLogout={handleLogout}>
        <Routes>
          <Route path={AppRoute.LANDING} element={<Landing />} />
          <Route path={AppRoute.LOGIN} element={user && user.emailConfirmed ? <Navigate to={AppRoute.DASHBOARD} /> : <Login onLogin={() => {}} />} />
          <Route path={AppRoute.REGISTER} element={user && user.emailConfirmed ? <Navigate to={AppRoute.DASHBOARD} /> : <Register onRegister={() => {}} />} />
          <Route path={AppRoute.FORGOT_PASSWORD} element={<ForgotPassword />} />
          <Route path={AppRoute.RESET_PASSWORD} element={<ResetPassword />} />
          <Route path={AppRoute.VERIFY_EMAIL} element={<VerifyEmail userEmail={user?.email} />} />
          
          <Route path={AppRoute.DASHBOARD} element={<PrivateRoute user={user}><Dashboard resumes={resumes} user={user!} setCurrentResume={setCurrentResume} onOpenPlans={() => setIsPlanModalOpen(true)} onRefreshResumes={() => loadUserResumes(user!.id)} /></PrivateRoute>} />
          <Route path={AppRoute.CREATE} element={<PrivateRoute user={user}><CreateResume onSave={handleSaveResume} user={user!} resumesCount={resumes.length} onOpenPlans={() => setIsPlanModalOpen(true)} /></PrivateRoute>} />
          <Route path={AppRoute.CUSTOMIZE} element={<PrivateRoute user={user}>{currentResume ? <CustomizeResume resume={currentResume} onSave={handleSaveResume} user={user!} onOpenPlans={() => setIsPlanModalOpen(true)} /> : <Navigate to={AppRoute.DASHBOARD} />}</PrivateRoute>} />
          <Route path={AppRoute.EXPORT} element={<PrivateRoute user={user}>{currentResume ? <ExportResume resume={currentResume} user={user!} /> : <Navigate to={AppRoute.DASHBOARD} />}</PrivateRoute>} />
          <Route path={AppRoute.PLANS} element={<PlansPage currentPlan={user?.plan || 'free'} subscriptionStatus={user?.subscriptionStatus || 'inactive'} />} />
          <Route path={AppRoute.BILLING_SUCCESS} element={<BillingSuccess />} />
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
