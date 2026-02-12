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
// Added PLANS to the import list from types.ts to resolve the reference error on line 131
import { User, ResumeData, AppRoute, PlanType, SubscriptionStatus, PLANS } from './types';
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
    // Monitorar o estado de autenticação de forma resiliente
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      setLoading(true);
      
      if (session?.user) {
        const isEmailConfirmed = !!session.user.email_confirmed_at;
        
        if (isEmailConfirmed) {
          try {
            // Tenta buscar dados adicionais, mas não trava se falhar
            const [profile, subData] = await Promise.all([
              supabaseService.getProfile(session.user.id).catch(() => null),
              stripeService.getSubscription(session.user.id).catch(() => null)
            ]);

            setUser({
              id: session.user.id,
              email: session.user.email!,
              name: profile?.name || session.user.email!.split('@')[0],
              plan: subData?.plan || 'free',
              subscriptionStatus: subData?.status || 'inactive',
              emailConfirmed: true
            });
            
            await loadUserResumes(session.user.id);
          } catch (err) {
            console.error("Erro ao carregar dados do usuário:", err);
            // Fallback para usuário básico se o banco falhar
            setUser({
              id: session.user.id,
              email: session.user.email!,
              name: session.user.email!.split('@')[0],
              plan: 'free',
              subscriptionStatus: 'inactive',
              emailConfirmed: true
            });
          }
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
    setLoading(true);
    await supabase.auth.signOut();
    setUser(null);
    setResumes([]);
    setLoading(false);
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
    if (!user || !user.emailConfirmed) return;
    try {
      // Fix: Now uses PLANS imported from types.ts
      const planDetails = PLANS[plan];
      await stripeService.createCheckoutSession(planDetails.priceId);
    } catch (err) {
      console.error("Erro no upgrade:", err);
      alert("Erro ao iniciar processo de pagamento.");
    }
  };

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50">
      <div className="flex flex-col items-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-brand-blue mb-4"></div>
        <span className="text-slate-400 font-bold text-[10px] uppercase tracking-[0.2em]">Sincronizando PROFILA...</span>
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
          <Route path={AppRoute.PLANS} element={<PlansPage user={user} />} />
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