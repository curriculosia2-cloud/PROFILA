
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

const App: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [resumes, setResumes] = useState<ResumeData[]>([]);
  const [currentResume, setCurrentResume] = useState<ResumeData | null>(null);
  const [loading, setLoading] = useState(true);
  const [isPlanModalOpen, setIsPlanModalOpen] = useState(false);

  useEffect(() => {
    const savedUser = localStorage.getItem('profila_user');
    const savedResumes = localStorage.getItem('profila_resumes');
    
    if (savedUser) setUser(JSON.parse(savedUser));
    if (savedResumes) setResumes(JSON.parse(savedResumes));
    
    setLoading(false);
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
      : [...resumes, resume];
    
    setResumes(updatedResumes);
    localStorage.setItem('profila_resumes', JSON.stringify(updatedResumes));
    setCurrentResume(resume);
  };

  const handleUpgrade = (plan: PlanType) => {
    if (!user) return;
    
    // Simulating Stripe success
    const updatedUser = { ...user, plan };
    setUser(updatedUser);
    localStorage.setItem('profila_user', JSON.stringify(updatedUser));
    setIsPlanModalOpen(false);
    alert(`Parabéns! Você agora é um membro ${plan.toUpperCase()}.`);
  };

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-600"></div>
    </div>
  );

  return (
    <Router>
      <Layout user={user} onLogout={handleLogout}>
        <Routes>
          <Route path={AppRoute.LANDING} element={<Landing />} />
          <Route path={AppRoute.LOGIN} element={user ? <Navigate to={AppRoute.DASHBOARD} /> : <Login onLogin={handleLogin} />} />
          <Route path={AppRoute.REGISTER} element={user ? <Navigate to={AppRoute.DASHBOARD} /> : <Register onRegister={handleLogin} />} />
          
          <Route path={AppRoute.DASHBOARD} element={user ? <Dashboard resumes={resumes} user={user} setCurrentResume={setCurrentResume} onOpenPlans={() => setIsPlanModalOpen(true)} /> : <Navigate to={AppRoute.LOGIN} />} />
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
