
import * as React from 'react';
import { Link } from 'react-router-dom';
import { Zap, ArrowRight, Trophy, Target, Sparkles, CheckCircle, FileText, Cpu, Layout as LayoutIcon, MousePointer2 } from 'lucide-react';
import { AppRoute } from '../types';

const Landing: React.FC = () => {
  return (
    <div className="overflow-hidden bg-white dark:bg-brand-dark transition-colors duration-300">
      {/* Hero Section */}
      <section className="relative pt-32 pb-40">
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden opacity-30 pointer-events-none">
          <div className="absolute top-[10%] left-[10%] w-[500px] h-[500px] bg-blue-500/20 rounded-full blur-[120px]"></div>
          <div className="absolute bottom-[10%] right-[10%] w-[500px] h-[500px] bg-purple-500/10 rounded-full blur-[120px]"></div>
        </div>

        <div className="max-w-7xl mx-auto px-4 text-center relative z-10">
          <div className="inline-flex items-center space-x-2 bg-brand-blue/10 border border-brand-blue/20 text-brand-blue dark:text-blue-400 px-4 py-2 rounded-full text-[10px] font-black uppercase tracking-[0.2em] mb-12 animate-in fade-in slide-in-from-top duration-700">
            <Zap className="h-3 w-3 fill-current" />
            <span>AI-POWERED RESUME BUILDER</span>
          </div>
          
          <h1 className="text-5xl md:text-8xl font-black text-brand-dark dark:text-white mb-8 tracking-tighter leading-[0.9] font-display">
            Seu currículo pronto <br />
            em <span className="text-transparent bg-clip-text bg-gradient-brand">minutos com IA.</span>
          </h1>
          
          <p className="text-lg md:text-xl text-slate-500 dark:text-slate-400 max-w-2xl mx-auto mb-14 font-medium leading-relaxed">
            O WorkGen utiliza inteligência artificial avançada para transformar sua experiência em um currículo irresistível para recrutadores e sistemas ATS.
          </p>

          <div className="flex flex-col sm:flex-row justify-center items-center gap-6">
            <Link 
              to={AppRoute.REGISTER}
              className="w-full sm:w-auto bg-gradient-brand text-white px-10 py-5 rounded-2xl font-black text-lg btn-glow transition-all flex items-center justify-center group"
            >
              CRIAR MEU CURRÍCULO <ArrowRight className="ml-3 h-5 w-5 group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link 
              to={AppRoute.PLANS}
              className="w-full sm:w-auto bg-slate-100 dark:bg-white/5 text-slate-600 dark:text-white border border-slate-200 dark:border-white/10 px-10 py-5 rounded-2xl font-black text-lg hover:bg-slate-200 dark:hover:bg-white/10 transition-all flex items-center justify-center"
            >
              VER PLANOS
            </Link>
          </div>
          
          {/* Mockup de Interface em vez de Foto de Stock */}
          <div className="mt-28 relative max-w-5xl mx-auto">
            <div className="absolute -inset-4 bg-gradient-brand rounded-[3rem] blur-3xl opacity-10"></div>
            
            <div className="relative bg-slate-50 dark:bg-slate-900 rounded-[2.5rem] border border-slate-200 dark:border-white/10 shadow-2xl p-4 md:p-6 overflow-hidden aspect-[16/9] flex gap-4">
              {/* Fake Sidebar */}
              <div className="hidden md:flex flex-col w-20 bg-white dark:bg-slate-800 rounded-3xl p-4 gap-6 border border-slate-100 dark:border-white/5">
                <div className="w-10 h-10 bg-brand-blue rounded-xl mx-auto"></div>
                <div className="w-8 h-8 bg-slate-100 dark:bg-white/5 rounded-lg mx-auto"></div>
                <div className="w-8 h-8 bg-slate-100 dark:bg-white/5 rounded-lg mx-auto"></div>
                <div className="w-8 h-8 bg-slate-100 dark:bg-white/5 rounded-lg mx-auto mt-auto"></div>
              </div>

              {/* Fake Content Area */}
              <div className="flex-1 flex flex-col gap-4">
                <div className="h-16 bg-white dark:bg-slate-800 rounded-3xl border border-slate-100 dark:border-white/5 flex items-center px-6 justify-between">
                  <div className="flex gap-2">
                    <div className="w-24 h-3 bg-slate-100 dark:bg-white/5 rounded-full"></div>
                    <div className="w-12 h-3 bg-slate-100 dark:bg-white/5 rounded-full"></div>
                  </div>
                  <div className="w-10 h-10 bg-slate-50 dark:bg-white/5 rounded-full"></div>
                </div>
                
                <div className="flex-1 flex gap-4 overflow-hidden">
                  {/* Editor Simulation */}
                  <div className="flex-1 bg-white dark:bg-slate-800 rounded-[2rem] border border-slate-100 dark:border-white/5 p-8 text-left">
                    <div className="w-20 h-4 bg-brand-blue/20 rounded-full mb-6"></div>
                    <div className="space-y-4">
                      <div className="h-10 w-3/4 bg-slate-50 dark:bg-slate-950 rounded-xl border border-slate-100 dark:border-white/5"></div>
                      <div className="h-10 w-1/2 bg-slate-50 dark:bg-slate-950 rounded-xl border border-slate-100 dark:border-white/5"></div>
                      <div className="h-32 w-full bg-slate-50 dark:bg-slate-950 rounded-2xl border border-slate-100 dark:border-white/5 relative">
                        <div className="absolute top-4 left-4 w-4/5 h-2 bg-slate-200 dark:bg-white/5 rounded-full"></div>
                        <div className="absolute top-8 left-4 w-3/5 h-2 bg-slate-200 dark:bg-white/5 rounded-full"></div>
                        <div className="absolute bottom-4 right-4 flex items-center text-brand-blue text-[8px] font-black uppercase tracking-widest gap-2 animate-pulse">
                          <Cpu size={10} /> AI ANALYZING
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Preview Simulation */}
                  <div className="hidden lg:block w-72 bg-white dark:bg-slate-950 rounded-[2rem] border border-slate-100 dark:border-white/10 shadow-lg relative overflow-hidden">
                    <div className="p-6">
                      <div className="w-16 h-16 bg-slate-100 dark:bg-slate-800 rounded-full mb-4"></div>
                      <div className="w-32 h-3 bg-slate-200 dark:bg-slate-800 rounded-full mb-2"></div>
                      <div className="w-20 h-2 bg-slate-100 dark:bg-slate-800 rounded-full mb-8"></div>
                      <div className="space-y-3">
                        <div className="h-1.5 w-full bg-slate-100 dark:bg-slate-800 rounded-full"></div>
                        <div className="h-1.5 w-full bg-slate-100 dark:bg-slate-800 rounded-full"></div>
                        <div className="h-1.5 w-4/5 bg-slate-100 dark:bg-slate-800 rounded-full"></div>
                      </div>
                    </div>
                    {/* Floating Tooltip */}
                    <div className="absolute top-1/2 left-0 -translate-x-1/2 bg-gradient-brand p-3 rounded-2xl shadow-xl flex items-center gap-2 animate-bounce">
                      <Sparkles size={14} className="text-white" />
                      <span className="text-white text-[9px] font-black uppercase tracking-widest">Premium Template</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Cursor Decoration */}
              <div className="absolute bottom-20 right-1/4 animate-pulse pointer-events-none">
                <MousePointer2 className="text-brand-blue h-8 w-8 drop-shadow-lg" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-32 bg-slate-50 dark:bg-brand-dark/50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            {[
              { 
                title: "Otimização ATS", 
                desc: "Garantimos que seu currículo seja lido e aprovado pelos robôs de triagem das grandes empresas.",
                icon: <Target className="h-10 w-10 text-brand-blue" />
              },
              { 
                title: "IA Generativa", 
                desc: "Nossa IA escreve descrições profissionais de alto impacto baseadas no seu cargo e nível.",
                icon: <Sparkles className="h-10 w-10 text-brand-purple" />
              },
              { 
                title: "Design Premium", 
                desc: "Modelos criados por especialistas em design e recrutamento para atrair olhares.",
                icon: <Trophy className="h-10 w-10 text-brand-accent" />
              }
            ].map((item, i) => (
              <div key={i} className="bg-white dark:bg-slate-900 p-10 rounded-[2.5rem] border border-slate-100 dark:border-white/5 shadow-sm hover:shadow-xl transition-all group">
                <div className="mb-6">{item.icon}</div>
                <h3 className="text-2xl font-black text-brand-dark dark:text-white mb-4">{item.title}</h3>
                <p className="text-slate-500 dark:text-slate-400 font-medium leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Final */}
      <section className="py-32 bg-gradient-brand text-white overflow-hidden relative">
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-white/10 rounded-full blur-[100px] -mr-40 -mt-40"></div>
        <div className="max-w-4xl mx-auto px-4 text-center relative z-10">
          <h2 className="text-5xl font-black mb-8 tracking-tighter">Pronto para o seu próximo passo?</h2>
          <p className="text-xl opacity-80 mb-12 font-medium">Junte-se à elite profissional e conquiste a vaga que você merece.</p>
          <Link 
            to={AppRoute.REGISTER}
            className="inline-flex items-center bg-white text-brand-blue px-12 py-6 rounded-2xl font-black text-xl hover:bg-slate-100 transition-all shadow-2xl"
          >
            COMEÇAR AGORA
          </Link>
        </div>
      </section>
    </div>
  );
};

export default Landing;
