
import * as React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { User, AppRoute } from '../types';
import { LogOut, User as UserIcon, Menu, X, Sun, Moon, Mail } from 'lucide-react';
import BrandIcon from './BrandIcon';

interface LayoutProps {
  children: React.ReactNode;
  user: User | null;
  onLogout: () => void;
}

const Layout: React.FC<LayoutProps> = ({ children, user, onLogout }) => {
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);
  const [isDarkMode, setIsDarkMode] = React.useState(false);

  React.useEffect(() => {
    const savedTheme = localStorage.getItem('workgen-theme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    
    if (savedTheme === 'dark' || (!savedTheme && prefersDark)) {
      setIsDarkMode(true);
      document.documentElement.classList.add('dark');
    }
  }, []);

  const toggleTheme = () => {
    const newTheme = !isDarkMode;
    setIsDarkMode(newTheme);
    if (newTheme) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('workgen-theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('workgen-theme', 'light');
    }
  };

  return (
    <div className="min-h-screen flex flex-col transition-colors duration-300">
      <nav className="glass sticky top-0 z-50 border-b border-slate-200/60 dark:border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-20 items-center">
            <Link to={AppRoute.LANDING} className="flex items-center space-x-3 group">
              <div className="transition-transform group-hover:scale-110 duration-300">
                <BrandIcon size={32} />
              </div>
              <span className="text-2xl font-black logo-text text-brand-dark dark:text-white">
                Work<span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500">Gen</span>
              </span>
            </Link>

            <div className="hidden md:flex items-center space-x-8">
              <button 
                onClick={toggleTheme}
                className="p-2.5 rounded-xl bg-slate-100 dark:bg-white/5 text-slate-500 dark:text-slate-400 hover:text-brand-blue transition-all border border-slate-200 dark:border-white/10"
              >
                {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
              </button>

              {user ? (
                <>
                  <Link to={AppRoute.DASHBOARD} className="text-slate-600 dark:text-slate-400 hover:text-brand-blue dark:hover:text-white font-bold text-sm uppercase tracking-wider transition-colors">Painel</Link>
                  <div className="flex items-center space-x-6 border-l border-slate-200 dark:border-white/10 pl-6">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 rounded-full bg-slate-100 dark:bg-white/5 flex items-center justify-center border border-slate-200 dark:border-white/10">
                        <UserIcon className="h-5 w-5 text-brand-dark dark:text-slate-300" />
                      </div>
                      <div className="flex flex-col">
                        <span className="text-sm font-bold text-brand-dark dark:text-white leading-tight">{user.name}</span>
                        <span className="text-[10px] text-brand-accent font-black uppercase tracking-widest">{user.plan}</span>
                      </div>
                    </div>
                    <button 
                      onClick={onLogout}
                      className="p-2.5 text-slate-400 hover:text-red-500 transition-all"
                    >
                      <LogOut className="h-5 w-5" />
                    </button>
                  </div>
                </>
              ) : (
                <>
                  <Link to={AppRoute.LOGIN} className="text-slate-600 dark:text-slate-400 hover:text-brand-blue dark:hover:text-white font-bold text-sm tracking-widest">ENTRAR</Link>
                  <Link 
                    to={AppRoute.REGISTER}
                    className="bg-gradient-brand text-white px-7 py-3 rounded-2xl font-black text-sm btn-glow transition-all"
                  >
                    COMEÇAR GRÁTIS
                  </Link>
                </>
              )}
            </div>

            <div className="md:hidden flex items-center space-x-4">
              <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="p-2 text-brand-dark dark:text-white">
                {isMenuOpen ? <X size={28} /> : <Menu size={28} />}
              </button>
            </div>
          </div>
        </div>

        {isMenuOpen && (
          <div className="md:hidden bg-white dark:bg-brand-dark border-b border-slate-100 dark:border-white/5 p-6 space-y-4">
             {user ? (
                <>
                  <Link to={AppRoute.DASHBOARD} className="block text-brand-dark dark:text-white font-black text-lg">Painel</Link>
                  <button onClick={onLogout} className="block text-red-500 font-black text-lg">Sair</button>
                </>
             ) : (
                <>
                  <Link to={AppRoute.LOGIN} className="block text-slate-600 dark:text-slate-400 font-black text-lg">Entrar</Link>
                  <Link to={AppRoute.REGISTER} className="block bg-gradient-brand text-white text-center py-4 rounded-2xl font-black text-lg">Começar Agora</Link>
                </>
             )}
          </div>
        )}
      </nav>

      <main className="flex-grow">
        {children}
      </main>

      <footer className="bg-white dark:bg-brand-dark text-slate-400 py-16 border-t border-slate-100 dark:border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="flex justify-center items-center space-x-3 mb-8">
            <BrandIcon size={24} />
            <span className="text-2xl font-black text-brand-dark dark:text-white">
              Work<span className="text-brand-purple">Gen</span>
            </span>
          </div>
          <p className="text-sm max-w-md mx-auto mb-6">
            Acelerando carreiras com inteligência artificial de ponta. Crie o currículo dos seus sonhos hoje.
          </p>
          <div className="flex flex-col items-center space-y-6 mb-10">
            <div className="flex justify-center space-x-8 text-xs font-black uppercase tracking-widest">
              <Link to={AppRoute.PLANS} className="hover:text-brand-blue transition-colors">Preços</Link>
              <a href="mailto:workgen@profila.site" className="hover:text-brand-blue transition-colors flex items-center"><Mail className="w-3 h-3 mr-1.5" /> Suporte</a>
              <a href="#" className="hover:text-brand-blue transition-colors">Privacidade</a>
              <a href="#" className="hover:text-brand-blue transition-colors">Termos</a>
            </div>
            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400/60">
              Contato: <a href="mailto:workgen@profila.site" className="text-brand-blue hover:underline">workgen@profila.site</a>
            </p>
          </div>
          <div className="text-[10px] font-black uppercase tracking-[0.3em] opacity-40">
            © 2026 WorkGen AI. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Layout;
