
// Fix: Use namespace import to correctly populate global JSX.IntrinsicElements
import * as React from 'react';
import { Link } from 'react-router-dom';
import { CheckCircle, Zap, Layout as LayoutIcon, Download, ArrowRight, ShieldCheck, MousePointer2, Trophy, Target, Sparkles } from 'lucide-react';
import { AppRoute } from '../types';

const Landing: React.FC = () => {
  return (
    <div className="overflow-hidden bg-white">
      {/* Hero Section */}
      <section className="relative pt-32 pb-40 bg-[#0F172A] selection:bg-brand-blue selection:text-white">
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden opacity-20 pointer-events-none">
          <div className="absolute -top-[10%] -left-[10%] w-[40%] h-[40%] bg-brand-blue rounded-full blur-[120px]"></div>
          <div className="absolute top-[20%] -right-[5%] w-[30%] h-[30%] bg-blue-400 rounded-full blur-[100px]"></div>
        </div>

        <div className="max-w-7xl mx-auto px-4 text-center relative z-10">
          <div className="inline-flex items-center space-x-3 bg-white/10 backdrop-blur-md border border-white/10 text-blue-400 px-6 py-2 rounded-full text-xs font-extrabold uppercase tracking-[0.2em] mb-12">
            <Zap className="h-4 w-4 animate-pulse" />
            <span>AI Resume Intelligence 2026</span>
          </div>
          
          <h1 className="text-6xl md:text-8xl font-black text-white mb-8 tracking-tighter leading-[0.95]">
            O CURRÍCULO QUE <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-blue to-blue-400">ABRE PORTAS</span>
          </h1>
          
          <p className="text-xl text-slate-400 max-w-2xl mx-auto mb-14 font-medium leading-relaxed">
            Nossa IA transforma sua trajetória em uma proposta irresistível para recrutadores. Otimizado para algoritmos ATS e pronto em menos de 2 minutos.
          </p>

          <div className="flex flex-col sm:flex-row justify-center items-center gap-6">
            <Link 
              to={AppRoute.REGISTER}
              className="w-full sm:w-auto bg-brand-blue text-white px-10 py-5 rounded-2xl font-black text-lg hover:bg-blue-600 transition-all shadow-2xl shadow-blue-500/30 flex items-center justify-center group"
            >
              CRIAR MEU CURRÍCULO AGORA <ArrowRight className="ml-3 h-5 w-5 group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link 
              to={AppRoute.PLANS}
              className="w-full sm:w-auto bg-white/5 text-white border border-white/10 px-10 py-5 rounded-2xl font-black text-lg hover:bg-white/10 transition-all flex items-center justify-center"
            >
              VER PLANOS E PREÇOS
            </Link>
          </div>
          
          <div className="mt-8 text-slate-500 text-sm font-bold uppercase tracking-widest flex items-center justify-center space-x-4">
            <span className="flex items-center"><CheckCircle className="h-4 w-4 mr-1 text-green-500" /> Sem cartão de crédito</span>
            <span className="flex items-center"><CheckCircle className="h-4 w-4 mr-1 text-green-500" /> Teste grátis</span>
          </div>
          
          <div className="mt-24 relative max-w-5xl mx-auto">
            <div className="absolute -inset-1 bg-gradient-to-r from-brand-blue to-blue-400 rounded-[2.5rem] blur opacity-30"></div>
            <div className="relative bg-slate-800 rounded-[2.5rem] border border-white/10 shadow-2xl p-4">
              <img 
                src="https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=2426&auto=format&fit=crop" 
                alt="Plataforma PROFILA" 
                className="rounded-[2rem] w-full"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-32 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center max-w-3xl mx-auto mb-24">
            <h2 className="text-4xl md:text-5xl font-black text-brand-dark mb-6 tracking-tight">Não apenas um documento, <br/><span className="text-brand-blue">sua melhor versão.</span></h2>
            <p className="text-lg text-slate-500 font-medium leading-relaxed">
              Recrutadores gastam apenas 6 segundos em cada currículo. Com o PROFILA, você garante que esses 6 segundos se transformem em uma entrevista.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            {[
              { 
                title: "Vença os Algoritmos", 
                desc: "90% dos currículos são descartados por softwares (ATS) antes de chegar a um humano. Nossa IA garante que você passe por eles.",
                icon: <Target className="h-10 w-10 text-brand-blue" />
              },
              { 
                title: "Escrita Executiva", 
                desc: "Nossa IA reescreve suas tarefas simples como conquistas de alto nível, usando os verbos de ação que o mercado valoriza.",
                icon: <Sparkles className="h-10 w-10 text-brand-blue" />
              },
              { 
                title: "Design de Impacto", 
                desc: "Modelos criados por especialistas em RH para transmitir autoridade, profissionalismo e modernidade instantaneamente.",
                icon: <Trophy className="h-10 w-10 text-brand-blue" />
              }
            ].map((item, i) => (
              <div key={i} className="text-center">
                <div className="mb-6 p-5 bg-slate-50 rounded-3xl inline-block">{item.icon}</div>
                <h3 className="text-2xl font-black text-brand-dark mb-4">{item.title}</h3>
                <p className="text-slate-500 font-medium leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Teaser */}
      <section id="pricing" className="py-32 bg-brand-dark text-white">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h2 className="text-4xl md:text-6xl font-black mb-8 tracking-tighter">Preços para quem <br/> <span className="text-brand-blue">pensa grande.</span></h2>
          <p className="text-slate-400 mb-16 max-w-xl mx-auto text-lg">Escolha o plano que melhor se adapta ao seu momento profissional.</p>
          
          <Link 
            to={AppRoute.PLANS}
            className="inline-flex items-center bg-brand-blue text-white px-12 py-6 rounded-2xl font-black text-xl hover:bg-blue-600 transition-all shadow-2xl shadow-blue-500/20"
          >
            VER TODOS OS PLANOS
          </Link>
          <p className="mt-8 text-slate-500 text-xs font-bold uppercase tracking-widest">Cancele a qualquer momento. Sem pegadinhas.</p>
        </div>
      </section>
    </div>
  );
};

export default Landing;
