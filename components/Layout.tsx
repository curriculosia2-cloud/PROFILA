
// Fix: Use namespace import to correctly populate global JSX.IntrinsicElements
import * as React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { User, AppRoute } from '../types';
import { TrendingUp, LogOut, User as UserIcon, Menu, X, Mail } from 'lucide-react';

interface LayoutProps {
  children: React.ReactNode;
  user: User | null;
  onLogout: () => void;
}

const Layout: React.FC<LayoutProps> = ({ children, user, onLogout }) => {
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);

  return (
    <div className="min-h-screen flex flex-col bg-brand-light">
      <nav className="glass sticky top-0 z-50 border-b border-slate-200/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-20 items-center">
            <Link to={AppRoute.LANDING} className="flex items-center space-x-2.5 group">
              <div className="bg-brand-blue p-2 rounded-xl transition-transform group-hover:scale-110">
                <TrendingUp className="h-6 w-6 text-white" />
              </div>
              <span className="text-xl font-extrabold tracking-[0.1em] text-brand-dark">PROFILA</span>
            </Link>

            <div className="hidden md:flex items-center space-x-10">
              {user ? (
                <>
                  <Link to={AppRoute.DASHBOARD} className="text-slate-600 hover:text-brand-blue font-semibold text-sm transition-colors">MEU PAINEL</Link>
                  <div className="flex items-center space-x-6 border-l border-slate-200 pl-6">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center border border-slate-200">
                        <UserIcon className="h-5 w-5 text-brand-dark" />
                      </div>
                      <div className="flex flex-col">
                        <span className="text-sm font-bold text-brand-dark leading-tight">{user.name}</span>
                        <span className="text-[10px] text-brand-blue font-bold uppercase tracking-wider">{user.plan}</span>
                      </div>
                    </div>
                    <button 
                      onClick={onLogout}
                      className="p-2.5 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all"
                      title="Sair"
                    >
                      <LogOut className="h-5 w-5" />
                    </button>
                  </div>
                </>
              ) : (
                <>
                  <Link to={AppRoute.LOGIN} className="text-slate-600 hover:text-brand-blue font-bold text-sm tracking-wide">ENTRAR</Link>
                  <Link 
                    to={AppRoute.REGISTER}
                    className="bg-brand-blue text-white px-7 py-3 rounded-2xl font-bold text-sm hover:bg-blue-700 transition-all shadow-lg shadow-blue-500/20"
                  >
                    CRIAR CONTA
                  </Link>
                </>
              )}
            </div>

            <div className="md:hidden">
              <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="p-2 text-brand-dark">
                {isMenuOpen ? <X size={28} /> : <Menu size={28} />}
              </button>
            </div>
          </div>
        </div>

        {isMenuOpen && (
          <div className="md:hidden bg-white border-b border-slate-100 p-6 space-y-4 animate-in slide-in-from-top duration-300">
             {user ? (
                <>
                  <Link to={AppRoute.DASHBOARD} className="block text-brand-dark font-bold text-lg">Meu Painel</Link>
                  <div className="h-px bg-slate-100 my-2" />
                  <button onClick={onLogout} className="block text-red-500 font-bold text-lg">Sair da Conta</button>
                </>
             ) : (
                <>
                  <Link to={AppRoute.LOGIN} className="block text-slate-600 font-bold text-lg">Entrar</Link>
                  <Link to={AppRoute.REGISTER} className="block bg-brand-blue text-white text-center py-4 rounded-2xl font-bold text-lg">Começar Agora</Link>
                </>
             )}
          </div>
        )}
      </nav>

      <main className="flex-grow">
        {children}
      </main>

      <footer className="bg-brand-dark text-slate-400 pt-20 pb-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-16">
            {/* Coluna 1: Logo e Institucional */}
            <div className="space-y-6">
              <div className="flex items-center space-x-3">
                <div className="bg-brand-blue p-2 rounded-xl">
                  <TrendingUp className="h-5 w-5 text-white" />
                </div>
                <span className="text-xl font-black tracking-[0.15em] text-white">PROFILA</span>
              </div>
              <p className="text-base leading-relaxed max-w-xs opacity-80">
                A tecnologia que faltava para transformar sua carreira. Currículos inteligentes criados em segundos.
              </p>
            </div>

            {/* Coluna 2: Links Rápidos */}
            <div className="space-y-6 md:pl-12">
              <h4 className="text-white font-bold text-sm uppercase tracking-widest">Plataforma</h4>
              <ul className="space-y-4 text-sm font-medium">
                <li><Link to={AppRoute.PLANS} className="hover:text-white transition-colors">Preços</Link></li>
                <li><Link to={AppRoute.LANDING} className="hover:text-white transition-colors">Política de Privacidade</Link></li>
                <li><Link to={AppRoute.LANDING} className="hover:text-white transition-colors">Termos de Uso</Link></li>
              </ul>
            </div>

            {/* Coluna 3: Contato */}
            <div className="space-y-6">
              <h4 className="text-white font-bold text-sm uppercase tracking-widest">Contato</h4>
              <div className="flex items-center space-x-3 text-sm font-medium">
                <Mail className="h-5 w-5 text-brand-blue" />
                <a href="mailto:suporte@profila.com" className="hover:text-white transition-colors">suporte@profila.com</a>
              </div>
            </div>
          </div>

          <div className="pt-8 border-t border-slate-800 flex flex-col md:flex-row justify-between items-center text-[10px] font-bold uppercase tracking-[0.2em] text-slate-500">
            <span>© 2026 PROFILA. Todos os direitos reservados.</span>
            <span className="mt-4 md:mt-0">Built with Excellence in Brazil</span>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Layout;
