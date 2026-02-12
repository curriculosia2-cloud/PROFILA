
// Fix: Use namespace import to correctly populate global JSX.IntrinsicElements
import * as React from 'react';
import { Link } from 'react-router-dom';
import { ResumeData, User, AppRoute } from '../types';
import { Download, Share2, CheckCircle, Crown, Info, Sparkles } from 'lucide-react';

interface ExportResumeProps {
  resume: ResumeData;
  user: User;
}

const ExportResume: React.FC<ExportResumeProps> = ({ resume, user }) => {
  const handleDownload = () => {
    // In a real app, we would use a library like jsPDF here
    alert("Gerando seu PDF de alta fidelidade... O download iniciará em segundos.");
    setTimeout(() => {
        alert("Download concluído! Boa sorte na sua nova jornada.");
    }, 1500);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-16 selection:bg-brand-blue selection:text-white">
      <div className="text-center mb-16">
        <div className="inline-flex items-center justify-center w-24 h-24 bg-blue-50 text-brand-blue rounded-[2.5rem] mb-8 shadow-inner">
          <Sparkles className="h-10 w-10" />
        </div>
        <h1 className="text-5xl font-black text-brand-dark mb-4 tracking-tighter">Currículo Finalizado!</h1>
        <p className="text-lg text-slate-500 max-w-lg mx-auto font-medium leading-relaxed">
          Você agora possui um documento de nível executivo, estrategicamente construído para atrair as melhores propostas.
        </p>
      </div>

      <div className="bg-white rounded-[3rem] border border-slate-200 shadow-2xl overflow-hidden mb-12">
        <div className="p-10 md:p-16 flex flex-col md:flex-row items-center gap-16">
          <div className="w-56 h-72 bg-slate-50 rounded-3xl shadow-inner flex items-center justify-center relative border border-slate-100 overflow-hidden group">
             <div className="scale-[0.25] origin-center opacity-40 whitespace-nowrap group-hover:opacity-60 transition-opacity">
                <div className="text-brand-dark text-6xl font-black">{resume.personalInfo.fullName || 'SEU NOME'}</div>
             </div>
             {user.plan === 'free' && (
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-[0.05] rotate-45 text-brand-dark font-black text-xs tracking-widest uppercase">
                    PROFILA AI 2026
                </div>
             )}
             <div className="absolute inset-0 bg-gradient-to-t from-white/20 to-transparent pointer-events-none"></div>
          </div>
          
          <div className="flex-grow space-y-8">
            <div>
              <h3 className="text-3xl font-black text-brand-dark mb-2 tracking-tight">{resume.title || resume.personalInfo.profession || 'Minha Melhor Versão'}</h3>
              <p className="text-sm text-brand-blue font-black uppercase tracking-widest">Documento Otimizado para ATS • PDF HD</p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <button 
                onClick={handleDownload}
                className="flex-grow bg-brand-blue text-white py-5 rounded-2xl font-black text-lg flex items-center justify-center hover:bg-blue-700 transition-all shadow-xl shadow-blue-500/20 active:scale-95"
              >
                <Download className="mr-3 h-6 w-6" /> BAIXAR PDF AGORA
              </button>
              <button className="flex-none border border-slate-200 text-slate-400 p-5 rounded-2xl hover:bg-slate-50 transition-all">
                <Share2 className="h-6 w-6" />
              </button>
            </div>
          </div>
        </div>

        {user.plan === 'free' && (
           <div className="bg-[#0F172A] p-10 flex flex-col md:flex-row items-center justify-between gap-8 text-white">
              <div className="flex items-center space-x-6">
                <div className="bg-brand-blue p-3 rounded-2xl shadow-lg shadow-blue-500/20">
                    <Crown className="h-8 w-8 text-white" />
                </div>
                <div>
                    <h4 className="text-xl font-black mb-1">Deseja um documento 100% limpo?</h4>
                    <p className="text-slate-400 text-sm font-medium">Remova a marca d'água e desbloqueie modelos VIP hoje.</p>
                </div>
              </div>
              <Link 
                to={AppRoute.PLANS}
                className="whitespace-nowrap bg-white text-brand-dark px-10 py-4 rounded-xl font-black text-sm hover:bg-slate-100 transition-all"
              >
                UPGRADE PREMIUM
              </Link>
           </div>
        )}
      </div>

      <div className="bg-blue-50/50 rounded-3xl p-10 border border-blue-100 flex items-start space-x-6 text-brand-dark">
        <Info className="h-6 w-6 mt-0.5 flex-shrink-0 text-brand-blue" />
        <div className="space-y-4">
            <h5 className="font-black uppercase tracking-widest text-xs">Dica de Especialista</h5>
            <p className="text-sm font-medium leading-relaxed opacity-80">
                <strong>Estratégia de Nomeação:</strong> Salve seu arquivo como <code>Nome_Cargo_Empresa.pdf</code>. Isso demonstra atenção aos detalhes e ajuda o recrutador a identificar seu perfil instantaneamente em uma pasta cheia de currículos genéricos.
            </p>
        </div>
      </div>
    </div>
  );
};

export default ExportResume;
