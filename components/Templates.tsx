
// Fix: Use namespace import to correctly populate global JSX.IntrinsicElements
import * as React from 'react';
import { User as UserIcon } from 'lucide-react';
import { ResumeData } from '../types';

interface TemplateProps {
  data: ResumeData;
}

/**
 * Utilitário para aplicar o espaçamento definido pelo usuário
 */
const getSectionStyle = (spacing: number = 24) => ({
  marginBottom: `${spacing}px`
});

/**
 * Utilitário para formatar a descrição com bullets se houver quebras de linha
 */
const FormattedDescription = ({ text, className = "" }: { text: string, className?: string }) => {
  if (!text) return null;
  const lines = text.split('\n').filter(l => l.trim() !== '');
  if (lines.length > 1) {
    return (
      <ul className={`list-disc pl-4 space-y-1 ${className}`}>
        {lines.map((line, i) => <li key={i}>{line.trim().replace(/^[•\-\*]\s*/, '')}</li>)}
      </ul>
    );
  }
  return <p className={className}>{text}</p>;
};

// Helper for Photo Rendering
const ResumePhoto = ({ data, className = "w-32 h-32" }: { data: ResumeData, className?: string }) => {
  if (!data.customization.showPhoto) return null;
  
  const photoUrl = data.personalInfo.photoDataUrl;
  
  // 5. Adicionar console.log(photoUrl) para validar que não está null/undefined
  console.log("Debug WorkGen - Profile Photo URL:", photoUrl);

  const shapeClass = data.personalInfo.photoShape === 'circle' ? 'rounded-full' : 
                     data.personalInfo.photoShape === 'rounded' ? 'rounded-2xl' : 'rounded-none';

  // 4. Se photoUrl estiver vazio, mostrar placeholder
  if (!photoUrl || typeof photoUrl !== 'string' || photoUrl.trim() === '') {
    return (
      <div className={`flex items-center justify-center overflow-hidden border-2 border-slate-200 shadow-sm shrink-0 bg-slate-100 dark:bg-slate-800 ${className} ${shapeClass}`}>
        <UserIcon className="text-slate-300 dark:text-slate-600 w-1/2 h-1/2" />
      </div>
    );
  }
                     
  return (
    /* 2. No container: definir largura e altura fixas, overflow: hidden, centralização com flexbox */
    <div className={`flex items-center justify-center overflow-hidden border-2 border-slate-200/50 shadow-sm shrink-0 bg-white ${className} ${shapeClass}`}>
      {/* 2. Renderizar a foto com <img> padrão */}
      {/* 3. Aplicar CSS: width: 100%, height: 100%, object-fit: cover, object-position: center */}
      <img 
        src={photoUrl} 
        alt="Foto Perfil" 
        className="w-full h-full min-w-full min-h-full object-cover object-center block" 
        onError={(e) => {
          console.error("Erro ao carregar imagem:", photoUrl);
          e.currentTarget.style.display = 'none';
        }}
      />
    </div>
  );
};

// 1. CLASSIC - Tradicional e Confiável
export const ClassicTemplate: React.FC<TemplateProps> = ({ data }) => {
  const { personalInfo, experiences, education, skills, customization } = data;
  const sectionStyle = getSectionStyle(customization.sectionSpacing);

  return (
    <div className="flex flex-col h-full bg-white text-slate-800 px-[60px] py-[50px]" style={{ lineHeight: customization.lineSpacing }}>
      <header className="flex flex-col items-center text-center mb-10 border-b pb-8" style={{ borderColor: customization.primaryColor + '20' }}>
        <ResumePhoto data={data} className="w-28 h-28 mb-4" />
        <h1 className="text-3xl font-bold uppercase tracking-tight mb-2">{personalInfo.fullName}</h1>
        <p className="text-lg font-medium mb-4" style={{ color: customization.primaryColor }}>{personalInfo.profession}</p>
        <div className="text-[11px] flex flex-wrap justify-center gap-4 opacity-70 font-bold uppercase tracking-widest">
          <span>{personalInfo.email}</span>
          <span>•</span>
          <span>{personalInfo.phone}</span>
          <span>•</span>
          <span>{personalInfo.city}</span>
        </div>
      </header>
      
      {personalInfo.summary && (
        <section style={sectionStyle}>
          <h2 className="text-xs font-black uppercase tracking-[0.2em] mb-3 border-b-2 pb-1 inline-block" style={{ borderColor: customization.primaryColor }}>Resumo Profissional</h2>
          <p className="text-sm opacity-90 text-justify">{personalInfo.summary}</p>
        </section>
      )}

      <section style={sectionStyle}>
        <h2 className="text-xs font-black uppercase tracking-[0.2em] mb-4 border-b-2 pb-1 inline-block" style={{ borderColor: customization.primaryColor }}>Experiência Profissional</h2>
        <div className="space-y-6">
          {experiences.map((exp) => (
            <div key={exp.id}>
              <div className="flex justify-between items-baseline mb-1">
                <h3 className="font-bold text-sm">{exp.role}</h3>
                <span className="text-[10px] font-bold opacity-50 uppercase">{exp.period}</span>
              </div>
              <p className="text-xs font-black mb-2 uppercase tracking-wider" style={{ color: customization.primaryColor }}>{exp.company}</p>
              <FormattedDescription text={exp.description} className="text-sm opacity-90 leading-relaxed text-justify" />
            </div>
          ))}
        </div>
      </section>

      <div className="grid grid-cols-2 gap-10">
        <section style={sectionStyle}>
          <h2 className="text-xs font-black uppercase tracking-[0.2em] mb-4 border-b-2 pb-1 inline-block" style={{ borderColor: customization.primaryColor }}>Educação</h2>
          <div className="space-y-4">
            {education.map((edu) => (
              <div key={edu.id}>
                <h3 className="font-bold text-xs">{edu.course}</h3>
                <p className="text-[11px] opacity-70">{edu.institution} | {edu.year}</p>
              </div>
            ))}
          </div>
        </section>

        <section style={sectionStyle}>
          <h2 className="text-xs font-black uppercase tracking-[0.2em] mb-4 border-b-2 pb-1 inline-block" style={{ borderColor: customization.primaryColor }}>Habilidades</h2>
          <div className="flex flex-wrap gap-2">
            {skills.map((s, i) => <span key={i} className="px-2 py-1 bg-slate-50 border border-slate-100 rounded text-[9px] font-bold uppercase tracking-wider">{s}</span>)}
          </div>
        </section>
      </div>
    </div>
  );
};

// 2. CLEAN - Minimalismo e Clareza
export const CleanTemplate: React.FC<TemplateProps> = ({ data }) => {
  const { personalInfo, experiences, skills, customization } = data;
  const sectionStyle = getSectionStyle(customization.sectionSpacing);

  return (
    <div className="flex flex-col h-full bg-white text-slate-700 px-[60px] py-[60px]" style={{ lineHeight: customization.lineSpacing }}>
      <header className="flex justify-between items-start mb-12">
        <div className="max-w-[70%]">
          <h1 className="text-4xl font-bold tracking-tighter mb-2" style={{ color: customization.primaryColor }}>{personalInfo.fullName}</h1>
          <p className="text-sm font-black text-slate-400 uppercase tracking-[0.3em]">{personalInfo.profession}</p>
          <div className="mt-4 text-[10px] flex gap-4 font-bold opacity-60 uppercase">
             <span>{personalInfo.email}</span>
             <span>{personalInfo.phone}</span>
             <span>{personalInfo.city}</span>
          </div>
        </div>
        <ResumePhoto data={data} className="w-24 h-24" />
      </header>
      
      <div className="flex gap-12">
        <div className="flex-grow">
          <section style={sectionStyle}>
            <h2 className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-300 mb-6 border-b pb-2">Experiência</h2>
            <div className="space-y-8">
              {experiences.map((exp) => (
                <div key={exp.id}>
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="text-lg font-bold tracking-tight">{exp.role}</h3>
                    <span className="text-[9px] uppercase font-black opacity-30 mt-1">{exp.period}</span>
                  </div>
                  <p className="text-xs font-black mb-3" style={{ color: customization.primaryColor }}>{exp.company}</p>
                  <FormattedDescription text={exp.description} className="text-sm opacity-80 leading-relaxed" />
                </div>
              ))}
            </div>
          </section>
        </div>
        
        <aside className="w-[160px] shrink-0">
          {personalInfo.summary && (
            <section style={sectionStyle}>
              <h2 className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-300 mb-3 border-b pb-1">Perfil</h2>
              <p className="text-xs opacity-70 leading-relaxed">{personalInfo.summary}</p>
            </section>
          )}
          <section style={sectionStyle}>
            <h2 className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-300 mb-4 border-b pb-1">Expertise</h2>
            <div className="flex flex-col gap-2">
              {skills.map((s, i) => <div key={i} className="text-[10px] font-black text-slate-500 uppercase tracking-widest leading-none">• {s}</div>)}
            </div>
          </section>
        </aside>
      </div>
    </div>
  );
};

// 3. MODERN COLUMN - Dinâmico e Estruturado
export const ModernColumnTemplate: React.FC<TemplateProps> = ({ data }) => {
  const { personalInfo, experiences, skills, education, customization } = data;
  const sectionStyle = getSectionStyle(customization.sectionSpacing);

  return (
    <div className="flex h-full min-h-[inherit]" style={{ lineHeight: customization.lineSpacing }}>
      <aside className="w-[280px] bg-slate-900 text-white px-8 py-12 flex flex-col shrink-0">
        <div className="mb-10 text-center">
          <ResumePhoto data={data} className="w-32 h-32 mx-auto mb-6" />
          <h1 className="text-2xl font-black mb-2 tracking-tight leading-tight">{personalInfo.fullName}</h1>
          <p className="text-[10px] font-black opacity-50 uppercase tracking-[0.2em]">{personalInfo.profession}</p>
        </div>

        <section className="mb-10">
          <h2 className="text-[10px] font-black uppercase tracking-[0.3em] mb-4 text-brand-accent">Contato</h2>
          <div className="text-[11px] space-y-4 opacity-80 font-bold">
            <p className="flex flex-col"><span className="opacity-40 uppercase text-[9px] mb-1">Email</span>{personalInfo.email}</p>
            <p className="flex flex-col"><span className="opacity-40 uppercase text-[9px] mb-1">Telefone</span>{personalInfo.phone}</p>
            <p className="flex flex-col"><span className="opacity-40 uppercase text-[9px] mb-1">Localização</span>{personalInfo.city}</p>
          </div>
        </section>

        <section className="mb-10">
          <h2 className="text-[10px] font-black uppercase tracking-[0.3em] mb-4 text-brand-accent">Educação</h2>
          <div className="space-y-4">
            {education.map(edu => (
              <div key={edu.id} className="text-[11px]">
                <p className="font-black mb-1">{edu.course}</p>
                <p className="opacity-50 text-[10px] uppercase tracking-wider">{edu.institution} | {edu.year}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="mt-auto">
          <h2 className="text-[10px] font-black uppercase tracking-[0.3em] mb-4 text-brand-accent">Skills</h2>
          <div className="flex flex-wrap gap-2">
            {skills.map((s, i) => <span key={i} className="bg-white/10 px-2 py-1 rounded text-[9px] font-black uppercase tracking-wider border border-white/5">{s}</span>)}
          </div>
        </section>
      </aside>

      <main className="flex-1 px-12 py-12 bg-white text-slate-800 flex flex-col">
        <section style={sectionStyle}>
          <h2 className="text-[11px] font-black uppercase tracking-[0.4em] mb-4 flex items-center" style={{ color: customization.primaryColor }}>
            <span className="w-8 h-[2px] bg-current mr-4"></span> Perfil
          </h2>
          <p className="text-sm font-medium opacity-80 leading-relaxed text-justify">{personalInfo.summary}</p>
        </section>

        <section style={sectionStyle}>
          <h2 className="text-[11px] font-black uppercase tracking-[0.4em] mb-8 flex items-center" style={{ color: customization.primaryColor }}>
            <span className="w-8 h-[2px] bg-current mr-4"></span> Experiência
          </h2>
          <div className="space-y-8">
            {experiences.map((exp) => (
              <div key={exp.id}>
                <div className="flex justify-between items-baseline mb-1">
                  <h3 className="text-lg font-black tracking-tight">{exp.role}</h3>
                  <span className="text-[10px] font-black opacity-30 uppercase">{exp.period}</span>
                </div>
                <p className="text-[10px] font-black uppercase mb-3 opacity-60 tracking-widest">{exp.company}</p>
                <FormattedDescription text={exp.description} className="text-sm opacity-80 leading-relaxed text-justify" />
              </div>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
};

// 4. MODERN BLOCKS - Modular e Impactante
export const ModernBlocksTemplate: React.FC<TemplateProps> = ({ data }) => {
  const { personalInfo, experiences, skills, customization } = data;
  const sectionStyle = getSectionStyle(customization.sectionSpacing);

  return (
    <div className="flex flex-col h-full bg-white px-10 py-10" style={{ lineHeight: customization.lineSpacing }}>
      <header className="flex items-center gap-10 mb-10 p-10 text-white rounded-[2rem] shadow-sm overflow-hidden relative" style={{ backgroundColor: customization.primaryColor }}>
        <div className="absolute inset-0 bg-black/5 pointer-events-none"></div>
        <ResumePhoto data={data} className="w-32 h-32 relative z-10" />
        <div className="relative z-10">
          <h1 className="text-4xl font-black mb-2 tracking-tighter leading-none">{personalInfo.fullName}</h1>
          <p className="text-sm font-bold opacity-80 uppercase tracking-[0.3em]">{personalInfo.profession}</p>
          <div className="mt-4 flex gap-4 text-[10px] font-black opacity-60 uppercase tracking-widest">
            <span>{personalInfo.email}</span>
            <span>•</span>
            <span>{personalInfo.phone}</span>
          </div>
        </div>
      </header>
      
      <div className="grid grid-cols-12 gap-8">
        <div className="col-span-8 space-y-8">
          <section className="bg-slate-50 p-8 rounded-[2rem] border border-slate-100" style={sectionStyle}>
            <h2 className="font-black uppercase text-[10px] tracking-[0.3em] mb-6 opacity-40" style={{ color: customization.primaryColor }}>Trajetória Profissional</h2>
            <div className="space-y-8">
              {experiences.map(e => (
                <div key={e.id}>
                  <div className="flex justify-between items-baseline mb-1">
                     <h3 className="font-bold text-base">{e.role}</h3>
                     <span className="text-[9px] font-black opacity-30 uppercase">{e.period}</span>
                  </div>
                  <p className="text-[10px] font-black mb-4 uppercase tracking-widest" style={{ color: customization.primaryColor }}>{e.company}</p>
                  <FormattedDescription text={e.description} className="text-sm leading-relaxed opacity-80 text-justify" />
                </div>
              ))}
            </div>
          </section>
        </div>
        <div className="col-span-4 space-y-8">
           <section className="bg-slate-50 p-8 rounded-[2rem] border border-slate-100" style={sectionStyle}>
              <h2 className="font-black uppercase text-[10px] tracking-[0.3em] mb-4 opacity-40" style={{ color: customization.primaryColor }}>Perfil</h2>
              <p className="text-xs opacity-70 leading-relaxed text-justify">{personalInfo.summary}</p>
           </section>
           <section className="bg-slate-900 p-8 rounded-[2rem] text-white" style={sectionStyle}>
              <h2 className="font-black uppercase text-[10px] tracking-[0.3em] mb-6 text-brand-accent">Habilidades</h2>
              <div className="flex flex-wrap gap-2">
                {skills.map((s, i) => <span key={i} className="text-[9px] bg-white/10 px-3 py-1.5 rounded-xl border border-white/5 font-black uppercase tracking-wider text-white/90">{s}</span>)}
              </div>
           </section>
        </div>
      </div>
    </div>
  );
};

// 5. ELEGANT - Clássico e Refinado (Serifado)
export const ElegantTemplate: React.FC<TemplateProps> = ({ data }) => {
  const { personalInfo, experiences, education, customization } = data;
  const sectionStyle = getSectionStyle(customization.sectionSpacing);

  return (
    <div className="flex flex-col h-full bg-white text-slate-800 px-[70px] py-[60px] font-serif" style={{ lineHeight: customization.lineSpacing }}>
      <header className="text-center mb-16 flex flex-col items-center">
        <ResumePhoto data={data} className="w-36 h-36 mb-6" />
        <h1 className="text-5xl font-light tracking-[0.05em] mb-4" style={{ color: customization.primaryColor }}>{personalInfo.fullName}</h1>
        <p className="text-xs font-bold tracking-[0.5em] uppercase opacity-40">{personalInfo.profession}</p>
        <div className="mt-6 flex gap-6 text-[10px] opacity-50 italic">
          <span>{personalInfo.email}</span>
          <span>•</span>
          <span>{personalInfo.phone}</span>
          <span>•</span>
          <span>{personalInfo.city}</span>
        </div>
      </header>

      <div className="max-w-3xl mx-auto w-full space-y-12">
        {personalInfo.summary && (
          <section className="text-center" style={sectionStyle}>
            <p className="italic text-lg text-slate-600 leading-loose border-t border-b py-8 border-slate-50">{personalInfo.summary}</p>
          </section>
        )}

        <section style={sectionStyle}>
          <h2 className="text-center text-[10px] font-black uppercase tracking-[0.6em] mb-10 text-slate-300">Experiência Profissional</h2>
          <div className="space-y-12">
            {experiences.map(e => (
              <div key={e.id} className="group">
                <div className="flex flex-col items-center text-center mb-4">
                  <h3 className="text-2xl font-bold tracking-tight mb-1">{e.role}</h3>
                  <p className="text-[10px] uppercase tracking-[0.3em] opacity-40 italic">{e.company} • {e.period}</p>
                </div>
                <FormattedDescription text={e.description} className="text-sm leading-loose text-slate-700 max-w-2xl mx-auto text-justify opacity-90" />
              </div>
            ))}
          </div>
        </section>

        <section style={sectionStyle}>
          <h2 className="text-center text-[10px] font-black uppercase tracking-[0.6em] mb-8 text-slate-300">Formação Acadêmica</h2>
          <div className="grid grid-cols-2 gap-8">
            {education.map(edu => (
              <div key={edu.id} className="text-center">
                <h3 className="text-sm font-bold">{edu.course}</h3>
                <p className="text-[11px] opacity-50 italic">{edu.institution} | {edu.year}</p>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
};

// 6. TIMELINE - Moderno e Temporal
export const TimelineTemplate: React.FC<TemplateProps> = ({ data }) => {
  const { experiences, customization, personalInfo } = data;
  const sectionStyle = getSectionStyle(customization.sectionSpacing);

  return (
    <div className="flex flex-col h-full bg-white text-slate-800 px-[60px] py-[60px]" style={{ lineHeight: customization.lineSpacing }}>
      <header className="mb-16 border-l-[12px] pl-10 flex justify-between items-center" style={{ borderLeftColor: customization.primaryColor }}>
        <div>
          <h1 className="text-5xl font-black tracking-tighter mb-2">{personalInfo.fullName}</h1>
          <p className="text-slate-400 text-xl font-bold uppercase tracking-widest">{personalInfo.profession}</p>
          <div className="mt-4 flex gap-6 text-[11px] font-black opacity-40 uppercase tracking-widest">
            <span>{personalInfo.email}</span>
            <span>{personalInfo.phone}</span>
          </div>
        </div>
        <ResumePhoto data={data} className="w-28 h-28" />
      </header>

      <div className="relative pl-12 border-l-[3px] border-slate-100 ml-6" style={{ marginTop: customization.sectionSpacing }}>
        <div className="space-y-12">
          {experiences.map(e => (
            <div key={e.id} className="relative">
              <div className="absolute -left-[61px] top-1.5 w-6 h-6 rounded-full border-[5px] border-white shadow-sm" style={{ backgroundColor: customization.primaryColor }}></div>
              <div className="bg-slate-50/50 p-6 rounded-3xl border border-slate-100 hover:border-brand-blue/20 transition-all">
                <span className="text-[10px] font-black uppercase tracking-[0.3em] opacity-30 mb-2 block">{e.period}</span>
                <h3 className="text-xl font-black mb-1 tracking-tight">{e.role}</h3>
                <p className="text-sm font-black mb-4 uppercase tracking-widest" style={{ color: customization.primaryColor }}>{e.company}</p>
                <FormattedDescription text={e.description} className="text-sm opacity-80 leading-relaxed text-justify" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

// 7. TECH - Estética Futurista e Programador
export const TechTemplate: React.FC<TemplateProps> = ({ data }) => {
  const { skills, experiences, personalInfo, customization } = data;
  const sectionStyle = getSectionStyle(customization.sectionSpacing);

  return (
    <div className="p-0 h-full font-mono bg-[#0B0F1A] text-slate-300 px-12 py-12" style={{ lineHeight: customization.lineSpacing }}>
      <header className="mb-10 border-b border-white/5 pb-10 flex justify-between items-end">
        <div>
          <div className="flex items-center gap-3 text-brand-blue mb-4 text-xs font-black tracking-[0.3em]">
             <span className="w-2 h-2 bg-brand-blue rounded-full animate-pulse"></span>
             SYSTEM.ACTIVE
          </div>
          <h1 className="text-4xl font-black text-white mb-2 tracking-tighter">{personalInfo.fullName}</h1>
          <p className="text-brand-blue font-black uppercase tracking-widest text-lg opacity-80">&gt; {personalInfo.profession}</p>
        </div>
        <div className="border border-brand-blue/20 p-1">
          <ResumePhoto data={data} className="w-24 h-24 grayscale brightness-110" />
        </div>
      </header>
      
      <div className="grid grid-cols-12 gap-10">
        <div className="col-span-8 space-y-10">
          <section style={sectionStyle}>
            <h2 className="text-[10px] font-black uppercase tracking-[0.4em] text-brand-blue mb-6 border-l-4 pl-4" style={{ borderColor: customization.primaryColor }}>01. experiences()</h2>
            <div className="space-y-6">
              {experiences.map(e => (
                <div key={e.id} className="bg-white/5 p-6 border border-white/5 rounded-xl hover:bg-white/10 transition-all group">
                  <h3 className="text-sm font-bold text-white mb-1">
                    <span className="text-brand-blue mr-2">$</span>{e.role}
                  </h3>
                  <div className="flex gap-4 text-[9px] font-black opacity-40 mb-4 tracking-widest uppercase">
                    <span>@{e.company}</span>
                    <span>//</span>
                    <span>{e.period}</span>
                  </div>
                  <FormattedDescription text={e.description} className="text-xs leading-relaxed opacity-60" />
                </div>
              ))}
            </div>
          </section>
        </div>
        <aside className="col-span-4 space-y-10">
          <section style={sectionStyle}>
            <h2 className="text-[10px] font-black uppercase tracking-[0.4em] text-brand-blue mb-6">02. tech_stack</h2>
            <div className="flex flex-wrap gap-2">
              {skills.map((s, i) => <span key={i} className="px-3 py-1.5 bg-brand-blue/10 border border-brand-blue/30 text-brand-blue text-[9px] rounded font-black uppercase tracking-widest">{s}</span>)}
            </div>
          </section>
          <section style={sectionStyle}>
            <h2 className="text-[10px] font-black uppercase tracking-[0.4em] text-brand-blue mb-4">03. contact_info</h2>
            <div className="text-[10px] space-y-3 opacity-60 tracking-widest uppercase font-black">
              <p className="flex flex-col"><span className="text-[8px] opacity-40 mb-1">Mail</span>{personalInfo.email}</p>
              <p className="flex flex-col"><span className="text-[8px] opacity-40 mb-1">Loc</span>{personalInfo.city}</p>
            </div>
          </section>
        </aside>
      </div>
    </div>
  );
};

// 8. EXECUTIVE - Imponência e Foco em Resultados
export const ExecutiveTemplate: React.FC<TemplateProps> = ({ data }) => {
  const { personalInfo, experiences, customization, education } = data;
  const sectionStyle = getSectionStyle(customization.sectionSpacing);

  return (
    <div className="px-12 py-12 h-full flex flex-col bg-white text-slate-900 border-[16px] border-slate-50" style={{ lineHeight: customization.lineSpacing }}>
      <header className="flex justify-between items-end mb-12 border-b-[8px] border-slate-900 pb-10">
        <div className="flex items-end gap-10">
          <ResumePhoto data={data} className="w-36 h-48 border-0" />
          <div>
            <h1 className="text-6xl font-black tracking-tighter leading-[0.85] mb-4">{personalInfo.fullName}</h1>
            <p className="text-sm font-black uppercase tracking-[0.5em] opacity-40">{personalInfo.profession}</p>
          </div>
        </div>
        <div className="text-right text-[10px] font-black uppercase tracking-[0.3em] space-y-2 opacity-50 pb-2">
          <p>{personalInfo.city}</p>
          <p>{personalInfo.email}</p>
          <p>{personalInfo.phone}</p>
        </div>
      </header>

      <div className="space-y-12">
        {personalInfo.summary && (
          <section style={sectionStyle}>
            <h2 className="text-[11px] font-black uppercase tracking-[0.4em] mb-4 text-slate-300">Executive Summary</h2>
            <p className="text-lg font-bold leading-relaxed text-slate-800 text-justify">{personalInfo.summary}</p>
          </section>
        )}

        <section style={sectionStyle}>
          <h2 className="text-[11px] font-black uppercase tracking-[0.4em] mb-10 text-slate-300">Professional Experience</h2>
          <div className="space-y-12">
            {experiences.map(e => (
              <div key={e.id} className="grid grid-cols-12 gap-10">
                <div className="col-span-3 text-[10px] font-black uppercase tracking-[0.3em] opacity-30 pt-1.5">{e.period}</div>
                <div className="col-span-9">
                  <h3 className="text-2xl font-black mb-1 tracking-tight">{e.role}</h3>
                  <p className="text-sm font-black uppercase mb-5 tracking-[0.25em]" style={{ color: customization.primaryColor }}>{e.company}</p>
                  <FormattedDescription text={e.description} className="text-sm opacity-85 leading-relaxed text-justify font-medium" />
                </div>
              </div>
            ))}
          </div>
        </section>

        <section style={sectionStyle}>
           <h2 className="text-[11px] font-black uppercase tracking-[0.4em] mb-6 text-slate-300">Education Background</h2>
           <div className="grid grid-cols-2 gap-10">
              {education.map(edu => (
                <div key={edu.id} className="border-l-4 pl-6" style={{ borderColor: customization.primaryColor }}>
                   <h3 className="text-sm font-black mb-1">{edu.course}</h3>
                   <p className="text-[10px] font-black opacity-40 uppercase tracking-widest">{edu.institution} | {edu.year}</p>
                </div>
              ))}
           </div>
        </section>
      </div>
    </div>
  );
};

// 9. CREATIVE - Vibrante e Moderno
export const CreativeTemplate: React.FC<TemplateProps> = ({ data }) => {
  const { personalInfo, experiences, skills, customization } = data;
  const sectionStyle = getSectionStyle(customization.sectionSpacing);

  return (
    <div className="h-full flex flex-col bg-white overflow-hidden" style={{ lineHeight: customization.lineSpacing }}>
      <header className="h-[260px] relative flex items-center px-16 gap-12 text-white" style={{ backgroundColor: customization.primaryColor }}>
        <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2"></div>
        <div className="absolute bottom-0 left-0 w-[200px] h-[200px] bg-black/5 rounded-full translate-y-1/2 -translate-x-1/4"></div>
        
        <ResumePhoto data={data} className="w-36 h-36 relative z-10 border-white/20 shadow-2xl" />
        
        <div className="relative z-10">
          <h1 className="text-6xl font-black tracking-tighter mb-2 drop-shadow-sm">{personalInfo.fullName}</h1>
          <p className="text-2xl font-bold opacity-80 tracking-[0.2em] uppercase">{personalInfo.profession}</p>
          <div className="mt-6 flex gap-6 text-[11px] font-black opacity-70 uppercase tracking-widest">
            <span>{personalInfo.email}</span>
            <span>•</span>
            <span>{personalInfo.phone}</span>
          </div>
        </div>
      </header>

      <div className="flex-1 px-16 py-12 grid grid-cols-12 gap-12">
        <aside className="col-span-4 space-y-10">
          <section className="bg-slate-50 p-8 rounded-[2.5rem] border border-slate-100 shadow-inner" style={sectionStyle}>
            <h2 className="font-black uppercase text-[10px] tracking-[0.4em] mb-4 text-slate-400">Bio</h2>
            <p className="text-xs font-medium text-slate-600 leading-relaxed text-justify">{personalInfo.summary}</p>
          </section>
          <section style={sectionStyle}>
            <h2 className="font-black uppercase text-[10px] tracking-[0.4em] mb-6 text-slate-400">Superpowers</h2>
            <div className="flex flex-wrap gap-2.5">
              {skills.map((s, i) => <span key={i} className="px-4 py-2 bg-white border-2 border-slate-100 rounded-2xl text-[9px] font-black uppercase tracking-wider shadow-sm hover:border-brand-blue hover:text-brand-blue transition-all">{s}</span>)}
            </div>
          </section>
        </aside>
        <main className="col-span-8 space-y-10">
          <section style={sectionStyle}>
            <h2 className="text-[10px] font-black uppercase tracking-[0.5em] mb-10 text-slate-200">The Journey</h2>
            <div className="space-y-12">
              {experiences.map(e => (
                <div key={e.id} className="relative pl-8">
                  <div className="absolute left-0 top-1.5 w-1.5 h-full rounded-full bg-slate-50"></div>
                  <div className="absolute left-0 top-1.5 w-1.5 h-8 rounded-full" style={{ backgroundColor: customization.primaryColor }}></div>
                  
                  <div className="flex justify-between items-center mb-2">
                    <h3 className="text-2xl font-black tracking-tight">{e.role}</h3>
                    <span className="text-[9px] font-black opacity-30 uppercase tracking-[0.2em]">{e.period}</span>
                  </div>
                  <p className="text-xs font-black mb-5 uppercase tracking-[0.3em]" style={{ color: customization.primaryColor }}>{e.company}</p>
                  <FormattedDescription text={e.description} className="text-sm leading-relaxed opacity-75 font-medium text-justify" />
                </div>
              ))}
            </div>
          </section>
        </main>
      </div>
    </div>
  );
};

// 10. ATS SIMPLE - Focado em Performance de Triagem
export const AtsSimpleTemplate: React.FC<TemplateProps> = ({ data }) => {
  const { personalInfo, experiences, skills, education, customization } = data;
  return (
    <div className="px-16 py-12 h-full text-black bg-white space-y-8 max-w-[800px] mx-auto leading-normal text-sm font-sans">
      <div className="text-center border-b-2 border-black pb-6">
        <h1 className="text-3xl font-bold uppercase mb-2">{personalInfo.fullName}</h1>
        <div className="text-sm font-medium space-x-3">
          <span>{personalInfo.city}</span> | <span>{personalInfo.phone}</span> | <span>{personalInfo.email}</span>
        </div>
      </div>

      <section>
        <h2 className="text-sm font-bold uppercase border-b border-black mb-3">Professional Summary</h2>
        <p className="text-sm text-justify">{personalInfo.summary}</p>
      </section>

      <section>
        <h2 className="text-sm font-bold uppercase border-b border-black mb-4">Professional Experience</h2>
        <div className="space-y-6">
          {experiences.map(e => (
            <div key={e.id}>
              <div className="flex justify-between font-bold text-sm">
                <span>{e.company}</span>
                <span>{e.period}</span>
              </div>
              <div className="italic text-sm mb-2">{e.role}</div>
              <FormattedDescription text={e.description} className="text-sm text-justify" />
            </div>
          ))}
        </div>
      </section>

      <section>
        <h2 className="text-sm font-bold uppercase border-b border-black mb-3">Education</h2>
        {education.map(edu => (
          <div key={edu.id} className="flex justify-between text-sm mb-1">
            <span><span className="font-bold">{edu.institution}</span>, {edu.course}</span>
            <span>{edu.year}</span>
          </div>
        ))}
      </section>

      <section>
        <h2 className="text-sm font-bold uppercase border-b border-black mb-3">Technical Skills</h2>
        <p className="text-sm font-medium">{skills.join(', ')}</p>
      </section>
    </div>
  );
};

// 11. COMPACT - Denso e Profissional
export const CompactTemplate: React.FC<TemplateProps> = ({ data }) => {
  const { personalInfo, experiences, skills, customization, education } = data;
  const sectionStyle = getSectionStyle(customization.sectionSpacing / 1.5);

  return (
    <div className="flex flex-col h-full bg-white text-[11px] px-12 py-10" style={{ lineHeight: 1.4, fontFamily: customization.fontFamily }}>
      <header className="flex justify-between items-center mb-8 border-b-2 pb-6" style={{ borderColor: customization.primaryColor + '40' }}>
        <div className="flex items-center gap-6">
          <ResumePhoto data={data} className="w-20 h-20" />
          <div>
            <h1 className="text-2xl font-black uppercase tracking-tight mb-0.5" style={{ color: customization.primaryColor }}>{personalInfo.fullName}</h1>
            <p className="font-black opacity-60 uppercase tracking-widest text-[9px]">{personalInfo.profession}</p>
          </div>
        </div>
        <div className="text-right opacity-60 font-black uppercase tracking-widest space-y-0.5 text-[9px]">
          <p>{personalInfo.email}</p>
          <p>{personalInfo.phone}</p>
          <p>{personalInfo.city}</p>
        </div>
      </header>

      <div className="grid grid-cols-12 gap-10">
        <div className="col-span-8 space-y-6">
          <section style={sectionStyle}>
            <h2 className="font-black uppercase border-b mb-3 tracking-widest pb-1 opacity-40">Professional Experience</h2>
            <div className="space-y-6">
              {experiences.map(e => (
                <div key={e.id}>
                  <div className="flex justify-between font-black mb-1">
                    <span className="text-[11px] uppercase">{e.role} @ {e.company}</span>
                    <span className="opacity-40">{e.period}</span>
                  </div>
                  <FormattedDescription text={e.description} className="opacity-80 text-justify leading-relaxed" />
                </div>
              ))}
            </div>
          </section>
        </div>
        <aside className="col-span-4 space-y-6">
           <section style={sectionStyle}>
              <h2 className="font-black uppercase border-b mb-3 tracking-widest pb-1 opacity-40">Education</h2>
              <div className="space-y-3">
                {education.map(edu => (
                  <div key={edu.id}>
                    <p className="font-black">{edu.course}</p>
                    <p className="opacity-50 uppercase text-[8px]">{edu.institution} • {edu.year}</p>
                  </div>
                ))}
              </div>
           </section>
           <section style={sectionStyle}>
              <h2 className="font-black uppercase border-b mb-3 tracking-widest pb-1 opacity-40">Skills</h2>
              <div className="flex flex-wrap gap-1.5 pt-1">
                {skills.map((s, i) => <span key={i} className="px-2 py-1 bg-slate-50 border border-slate-100 rounded font-black text-slate-500 uppercase text-[8px]">{s}</span>)}
              </div>
           </section>
        </aside>
      </div>
    </div>
  );
};

// 12. INTERNATIONAL - Padrão Global Executivo
export const InternationalTemplate: React.FC<TemplateProps> = ({ data }) => {
  const { personalInfo, experiences, skills, customization, education } = data;
  const sectionStyle = getSectionStyle(customization.sectionSpacing);

  return (
    <div className="flex flex-col h-full bg-white px-16 py-16 text-slate-800" style={{ lineHeight: customization.lineSpacing, fontFamily: customization.fontFamily }}>
      <header className="mb-12 flex justify-between items-start border-b pb-10">
        <div className="max-w-[70%]">
          <h1 className="text-5xl font-bold mb-2 tracking-tighter">{personalInfo.fullName}</h1>
          <p className="text-xl opacity-50 font-medium tracking-wide mb-6">{personalInfo.profession}</p>
          <div className="flex flex-wrap gap-x-6 gap-y-2 text-[10px] font-black text-slate-400 uppercase tracking-[0.3em]">
             <span className="flex items-center"><span className="w-2 h-2 rounded-full bg-slate-200 mr-2"></span> {personalInfo.email}</span>
             <span className="flex items-center"><span className="w-2 h-2 rounded-full bg-slate-200 mr-2"></span> {personalInfo.phone}</span>
             <span className="flex items-center"><span className="w-2 h-2 rounded-full bg-slate-200 mr-2"></span> {personalInfo.city}</span>
          </div>
        </div>
        <ResumePhoto data={data} className="w-32 h-40" />
      </header>

      <div className="space-y-10">
         <section style={sectionStyle}>
           <h2 className="text-[10px] font-black uppercase tracking-[0.4em] mb-4 opacity-30" style={{ color: customization.primaryColor }}>Executive Summary</h2>
           <p className="text-base leading-relaxed opacity-85 text-justify">{personalInfo.summary}</p>
         </section>

         <section style={sectionStyle}>
           <h2 className="text-[10px] font-black uppercase tracking-[0.4em] mb-8 opacity-30" style={{ color: customization.primaryColor }}>Professional Experience</h2>
           <div className="space-y-10">
             {experiences.map(e => (
               <div key={e.id}>
                 <div className="flex justify-between items-baseline mb-2">
                    <h3 className="font-bold text-lg tracking-tight">{e.role} | <span className="opacity-50 text-base">{e.company}</span></h3>
                    <span className="text-[10px] font-black opacity-30 uppercase tracking-widest">{e.period}</span>
                 </div>
                 <FormattedDescription text={e.description} className="text-sm opacity-85 leading-relaxed text-justify" />
               </div>
             ))}
           </div>
         </section>

         <div className="grid grid-cols-2 gap-16">
            <section style={sectionStyle}>
               <h2 className="text-[10px] font-black uppercase tracking-[0.4em] mb-6 opacity-30" style={{ color: customization.primaryColor }}>Education</h2>
               <div className="space-y-6">
                  {education.map(edu => (
                    <div key={edu.id}>
                       <h4 className="font-bold text-sm mb-1">{edu.course}</h4>
                       <p className="text-xs opacity-60 font-medium">{edu.institution}, {edu.year}</p>
                    </div>
                  ))}
               </div>
            </section>
            <section style={sectionStyle}>
               <h2 className="text-[10px] font-black uppercase tracking-[0.4em] mb-6 opacity-30" style={{ color: customization.primaryColor }}>Areas of Expertise</h2>
               <div className="grid grid-cols-2 gap-y-3 pt-1">
                 {skills.map((s, i) => <span key={i} className="text-[10px] font-black uppercase tracking-widest opacity-60 flex items-center"><span className="w-1.5 h-1.5 bg-slate-200 rounded-full mr-3"></span> {s}</span>)}
               </div>
            </section>
         </div>
      </div>
    </div>
  );
};

// Main renderer component
export const TemplateRenderer: React.FC<TemplateProps> = ({ data }) => {
  // Aplicar família de fonte ao container pai via Style
  const containerStyle = {
    fontFamily: data.customization.fontFamily || 'Inter, sans-serif'
  };

  return (
    <div style={containerStyle} className="h-full">
      {(() => {
        switch (data.customization.template) {
          case 'clean': return <CleanTemplate data={data} />;
          case 'modern-column': return <ModernColumnTemplate data={data} />;
          case 'modern-blocks': return <ModernBlocksTemplate data={data} />;
          case 'elegant': return <ElegantTemplate data={data} />;
          case 'timeline': return <TimelineTemplate data={data} />;
          case 'tech': return <TechTemplate data={data} />;
          case 'executive': return <ExecutiveTemplate data={data} />;
          case 'creative': return <CreativeTemplate data={data} />;
          case 'ats-simple': return <AtsSimpleTemplate data={data} />;
          case 'compact': return <CompactTemplate data={data} />;
          case 'international': return <InternationalTemplate data={data} />;
          case 'classic':
          default: return <ClassicTemplate data={data} />;
        }
      })()}
    </div>
  );
};
