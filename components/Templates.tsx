
// Fix: Use namespace import to correctly populate global JSX.IntrinsicElements
import * as React from 'react';
import { ResumeData } from '../types';

interface TemplateProps {
  data: ResumeData;
}

// Estilos comuns para manter consistência
const commonStyles = {
  container: "flex flex-col h-full bg-white text-slate-800 px-[50px] py-[40px] leading-[1.6]",
  section: "mb-[28px]",
  sectionTitle: "text-sm font-black uppercase tracking-[0.15em] mb-[12px] border-l-4 pl-3",
  block: "mb-[20px]",
  text: "text-sm opacity-85",
};

// Helper for Photo Rendering
const ResumePhoto = ({ data, className = "w-32 h-32" }: { data: ResumeData, className?: string }) => {
  if (!data.customization.showPhoto || !data.personalInfo.photoDataUrl) return null;
  
  const shapeClass = data.personalInfo.photoShape === 'circle' ? 'rounded-full' : 
                     data.personalInfo.photoShape === 'rounded' ? 'rounded-[2rem]' : 'rounded-none';
                     
  return (
    <div className={`${className} ${shapeClass} overflow-hidden border-4 border-white shadow-lg shrink-0 bg-slate-100`}>
      <img src={data.personalInfo.photoDataUrl} alt="Foto Perfil" className="w-full h-full object-cover" />
    </div>
  );
};

// 1. CLASSIC
export const ClassicTemplate: React.FC<TemplateProps> = ({ data }) => {
  const { personalInfo, experiences, education, skills, customization } = data;
  return (
    <div className={commonStyles.container}>
      <header className="flex items-center gap-8 mb-[40px] pb-8 border-b-2" style={{ borderColor: customization.primaryColor }}>
        <ResumePhoto data={data} className="w-36 h-36" />
        <div className={customization.showPhoto ? "text-left" : "text-center w-full"}>
          <h1 className="text-4xl font-black uppercase mb-3 tracking-tighter">{personalInfo.fullName}</h1>
          <p className="text-xl font-semibold mb-4 tracking-wide" style={{ color: customization.primaryColor }}>{personalInfo.profession}</p>
          <div className="text-xs space-x-4 opacity-70 font-bold">
            <span>{personalInfo.email}</span>
            <span>•</span>
            <span>{personalInfo.phone}</span>
            <span>•</span>
            <span>{personalInfo.city}</span>
          </div>
        </div>
      </header>
      
      {personalInfo.summary && (
        <section className={commonStyles.section}>
          <h2 className={commonStyles.sectionTitle} style={{ borderLeftColor: customization.primaryColor }}>Resumo</h2>
          <p className={commonStyles.text}>{personalInfo.summary}</p>
        </section>
      )}

      <section className={commonStyles.section}>
        <h2 className={commonStyles.sectionTitle} style={{ borderLeftColor: customization.primaryColor }}>Experiência Profissional</h2>
        <div className="space-y-[20px]">
          {experiences.map((exp) => (
            <div key={exp.id} className="group">
              <div className="flex justify-between items-baseline mb-1">
                <h3 className="font-bold text-base tracking-tight">{exp.role}</h3>
                <span className="text-xs opacity-60 font-black italic">{exp.period}</span>
              </div>
              <p className="text-xs font-black mb-2 uppercase tracking-widest" style={{ color: customization.primaryColor }}>{exp.company}</p>
              <p className={commonStyles.text}>{exp.description}</p>
            </div>
          ))}
        </div>
      </section>

      <section className={commonStyles.section}>
        <h2 className={commonStyles.sectionTitle} style={{ borderLeftColor: customization.primaryColor }}>Formação Acadêmica</h2>
        <div className="space-y-[15px]">
          {education.map((edu) => (
            <div key={edu.id}>
              <div className="flex justify-between items-center mb-1">
                <h3 className="font-bold">{edu.course}</h3>
                <span className="text-xs font-black opacity-50">{edu.year}</span>
              </div>
              <p className="text-sm opacity-70 font-medium">{edu.institution}</p>
            </div>
          ))}
        </div>
      </section>

      <section>
        <h2 className={commonStyles.sectionTitle} style={{ borderLeftColor: customization.primaryColor }}>Habilidades</h2>
        <div className="flex flex-wrap gap-2 pt-1">
          {skills.map((s, i) => <span key={i} className="px-3 py-1.5 bg-slate-50 border rounded-lg text-[10px] font-black uppercase tracking-wider">{s}</span>)}
        </div>
      </section>
    </div>
  );
};

// 2. CLEAN
export const CleanTemplate: React.FC<TemplateProps> = ({ data }) => {
  const { personalInfo, experiences, skills, customization } = data;
  return (
    <div className={`${commonStyles.container} text-slate-700`}>
      <header className="flex items-start justify-between mb-[48px]">
        <div>
          <h1 className="text-5xl font-extrabold mb-3 tracking-tighter" style={{ color: customization.primaryColor }}>{personalInfo.fullName}</h1>
          <p className="text-lg font-black text-slate-400 uppercase tracking-[0.2em]">{personalInfo.profession}</p>
        </div>
        <ResumePhoto data={data} className="w-24 h-24" />
      </header>
      
      <div className="flex gap-[40px]">
        <div className="flex-1">
          <section className={commonStyles.section}>
            <h2 className="text-[11px] font-black uppercase tracking-[0.25em] text-slate-300 mb-[16px]">Histórico de Carreira</h2>
            <div className="space-y-[32px]">
              {experiences.map((exp) => (
                <div key={exp.id}>
                  <h3 className="text-xl font-bold mb-1 tracking-tight">{exp.role}</h3>
                  <div className="flex justify-between items-center mb-3">
                    <span className="text-sm font-black" style={{ color: customization.primaryColor }}>{exp.company}</span>
                    <span className="text-[10px] uppercase font-black opacity-40">{exp.period}</span>
                  </div>
                  <p className="text-sm opacity-80 leading-[1.6] font-medium">{exp.description}</p>
                </div>
              ))}
            </div>
          </section>
        </div>
        
        <aside className="w-[180px] space-y-[32px]">
          <section>
            <h2 className="text-[11px] font-black uppercase tracking-[0.25em] text-slate-300 mb-[12px]">Conexão</h2>
            <div className="text-xs space-y-2.5 font-bold opacity-70">
              <p className="break-all">{personalInfo.email}</p>
              <p>{personalInfo.phone}</p>
              <p>{personalInfo.city}</p>
            </div>
          </section>

          <section>
            <h2 className="text-[11px] font-black uppercase tracking-[0.25em] text-slate-300 mb-[12px]">Habilidades</h2>
            <div className="space-y-3">
              {skills.map((s, i) => <div key={i} className="text-xs font-black border-l-2 pl-3" style={{ borderLeftColor: customization.primaryColor }}>{s}</div>)}
            </div>
          </section>
        </aside>
      </div>
    </div>
  );
};

// 3. MODERN COLUMN
export const ModernColumnTemplate: React.FC<TemplateProps> = ({ data }) => {
  const { personalInfo, experiences, skills, customization } = data;
  return (
    <div className="flex h-full min-h-[inherit]">
      <aside className="w-[260px] bg-slate-900 text-white px-[32px] py-[40px] flex flex-col">
        <div className="mb-[40px] text-center">
          <div className="flex justify-center mb-6">
            <ResumePhoto data={data} className="w-36 h-36" />
          </div>
          {!data.personalInfo.photoDataUrl && customization.showPhoto && (
            <div className="w-36 h-36 rounded-full bg-slate-800 mx-auto mb-6 flex items-center justify-center">
              <span className="text-slate-600 text-5xl">👤</span>
            </div>
          )}
          <h1 className="text-2xl font-black mb-2 tracking-tight leading-none">{personalInfo.fullName}</h1>
          <p className="text-[10px] font-black opacity-50 uppercase tracking-[0.2em]">{personalInfo.profession}</p>
        </div>

        <section className="mb-[40px]">
          <h2 className="text-[10px] font-black uppercase tracking-[0.25em] mb-[16px] text-blue-400">Contato</h2>
          <div className="text-[11px] space-y-4 opacity-80 font-bold">
            <p className="flex flex-col"><span className="opacity-40 uppercase text-[9px] mb-1">Email</span>{personalInfo.email}</p>
            <p className="flex flex-col"><span className="opacity-40 uppercase text-[9px] mb-1">Telefone</span>{personalInfo.phone}</p>
            <p className="flex flex-col"><span className="opacity-40 uppercase text-[9px] mb-1">Localização</span>{personalInfo.city}</p>
          </div>
        </section>

        <section className="mt-auto">
          <h2 className="text-[10px] font-black uppercase tracking-[0.25em] mb-[16px] text-blue-400">Competências</h2>
          <div className="flex flex-wrap gap-2">
            {skills.map((s, i) => <span key={i} className="bg-slate-800 px-2.5 py-1.5 rounded-lg text-[9px] font-black uppercase tracking-wider">{s}</span>)}
          </div>
        </section>
      </aside>

      <main className="flex-1 px-[50px] py-[40px] bg-white text-slate-800 leading-[1.6]">
        <section className={commonStyles.section}>
          <h2 className="text-[11px] font-black uppercase tracking-[0.3em] mb-[12px] flex items-center" style={{ color: customization.primaryColor }}>
            <span className="w-10 h-0.5 bg-current mr-4"></span> Perfil Profissional
          </h2>
          <p className="text-sm font-medium opacity-80 leading-[1.6]">{personalInfo.summary}</p>
        </section>

        <section className={commonStyles.section}>
          <h2 className="text-[11px] font-black uppercase tracking-[0.3em] mb-[24px] flex items-center" style={{ color: customization.primaryColor }}>
            <span className="w-10 h-0.5 bg-current mr-4"></span> Trajetória
          </h2>
          <div className="space-y-[32px]">
            {experiences.map((exp) => (
              <div key={exp.id}>
                <div className="flex justify-between items-baseline mb-1">
                  <h3 className="text-lg font-black tracking-tight">{exp.role}</h3>
                  <span className="text-[10px] font-black opacity-30 uppercase tracking-wider">{exp.period}</span>
                </div>
                <p className="text-xs font-black uppercase mb-3 opacity-60 tracking-widest">{exp.company}</p>
                <p className="text-sm opacity-80 font-medium">{exp.description}</p>
              </div>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
};

// 4. MODERN BLOCKS
export const ModernBlocksTemplate: React.FC<TemplateProps> = ({ data }) => {
  const { personalInfo, experiences, skills, customization } = data;
  return (
    <div className={commonStyles.container}>
      <header className="flex items-center gap-10 mb-[40px] p-10 text-white rounded-[2rem] shadow-xl" style={{ backgroundColor: customization.primaryColor }}>
        <ResumePhoto data={data} className="w-32 h-32" />
        <div>
          <h1 className="text-4xl font-black mb-2 tracking-tighter">{personalInfo.fullName}</h1>
          <p className="text-lg font-bold opacity-80 uppercase tracking-[0.25em]">{personalInfo.profession}</p>
        </div>
      </header>
      <div className="grid grid-cols-12 gap-[30px]">
        <div className="col-span-8 space-y-[28px]">
          <section className="bg-slate-50 p-8 rounded-[2rem] border border-slate-100">
            <h2 className="font-black uppercase text-[11px] tracking-[0.2em] mb-[16px]" style={{ color: customization.primaryColor }}>Experiência Profissional</h2>
            <div className="space-y-[24px]">
              {experiences.map(e => (
                <div key={e.id}>
                  <h3 className="font-bold text-base mb-1">{e.role}</h3>
                  <p className="text-[10px] font-black opacity-40 uppercase tracking-widest mb-3">{e.company} | {e.period}</p>
                  <p className="text-sm leading-[1.6] font-medium opacity-80">{e.description}</p>
                </div>
              ))}
            </div>
          </section>
        </div>
        <div className="col-span-4 space-y-[28px]">
          <section className="bg-slate-50 p-8 rounded-[2rem] border border-slate-100 h-full">
            <h2 className="font-black uppercase text-[11px] tracking-[0.2em] mb-[16px]" style={{ color: customization.primaryColor }}>Expertise</h2>
            <div className="flex flex-wrap gap-2">
              {skills.map((s, i) => <span key={i} className="text-[10px] bg-white px-3 py-1.5 rounded-xl border border-slate-200 font-black uppercase tracking-wider shadow-sm">{s}</span>)}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};

// 5. ELEGANT
export const ElegantTemplate: React.FC<TemplateProps> = ({ data }) => {
  const { personalInfo, experiences, customization } = data;
  return (
    <div className={`${commonStyles.container} font-serif`}>
      <header className="text-center mb-[60px] border-b border-slate-100 pb-12 flex flex-col items-center">
        <ResumePhoto data={data} className="w-40 h-40 mb-8" />
        <h1 className="text-5xl font-light tracking-[0.1em] italic mb-4">{personalInfo.fullName}</h1>
        <p className="text-xs font-bold tracking-[0.4em] uppercase opacity-40">{personalInfo.profession}</p>
      </header>
      <div className="max-w-3xl mx-auto w-full space-y-[48px]">
        <section className="text-center">
          <h2 className="text-[10px] font-black uppercase tracking-[0.5em] mb-[20px]" style={{ color: customization.primaryColor }}>Sumário Profissional</h2>
          <p className="italic leading-[1.8] text-lg text-slate-600 font-medium">{personalInfo.summary}</p>
        </section>
        <section>
          <h2 className="text-center text-[10px] font-black uppercase tracking-[0.5em] mb-[32px]" style={{ color: customization.primaryColor }}>Histórico Profissional</h2>
          <div className="space-y-[48px]">
            {experiences.map(e => (
              <div key={e.id} className="text-center group">
                <h3 className="text-2xl font-bold mb-2 tracking-tight group-hover:italic transition-all">{e.role}</h3>
                <p className="text-[10px] uppercase tracking-[0.3em] opacity-40 mb-5">{e.company} • {e.period}</p>
                <p className="text-sm leading-[1.7] text-slate-700 max-w-2xl mx-auto font-medium">{e.description}</p>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
};

// 6. TIMELINE
export const TimelineTemplate: React.FC<TemplateProps> = ({ data }) => {
  const { experiences, customization, personalInfo } = data;
  return (
    <div className={commonStyles.container}>
      <header className="mb-[48px] border-l-8 pl-8 flex justify-between items-center" style={{ borderLeftColor: customization.primaryColor }}>
        <div>
          <h1 className="text-5xl font-black tracking-tighter mb-2">{personalInfo.fullName}</h1>
          <p className="text-slate-400 text-xl font-bold uppercase tracking-widest">{personalInfo.profession}</p>
        </div>
        <ResumePhoto data={data} className="w-28 h-28" />
      </header>
      <div className="relative pl-[40px] border-l-4 border-slate-100 space-y-[40px] ml-6">
        {experiences.map(e => (
          <div key={e.id} className="relative">
            <div className="absolute -left-[54px] top-2 w-6 h-6 rounded-full border-4 border-white shadow-lg" style={{ backgroundColor: customization.primaryColor }}></div>
            <span className="text-[11px] font-black uppercase tracking-[0.25em] opacity-40 mb-3 block">{e.period}</span>
            <h3 className="text-xl font-black mb-1 tracking-tight">{e.role}</h3>
            <p className="text-sm font-black mb-4 uppercase tracking-widest" style={{ color: customization.primaryColor }}>{e.company}</p>
            <p className="text-sm opacity-75 font-medium leading-[1.6]">{e.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

// 7. TECH
export const TechTemplate: React.FC<TemplateProps> = ({ data }) => {
  const { skills, experiences, personalInfo } = data;
  return (
    <div className="p-0 h-full font-mono bg-[#0F172A] text-slate-300 px-[50px] py-[40px] leading-[1.6]">
      <header className="mb-[40px] border-b border-slate-800 pb-10 flex justify-between items-end">
        <div>
          <h1 className="text-4xl font-black text-white mb-3 tracking-tighter">{personalInfo.fullName}</h1>
          <p className="text-brand-blue font-black uppercase tracking-widest text-lg opacity-80">&gt; {personalInfo.profession}</p>
        </div>
        <div className="grayscale contrast-125 border-2 border-brand-blue/30">
          <ResumePhoto data={data} className="w-24 h-24" />
        </div>
      </header>
      <div className="grid grid-cols-12 gap-[30px]">
        <div className="col-span-8 space-y-[32px]">
          <section>
            <h2 className="text-xs font-black uppercase tracking-[0.2em] text-brand-blue mb-[16px]">log_experiences()</h2>
            <div className="space-y-[24px]">
              {experiences.map(e => (
                <div key={e.id} className="bg-slate-900/80 p-6 border border-slate-800 rounded-2xl group hover:border-brand-blue/30 transition-all">
                  <h3 className="text-base font-bold text-white mb-1">&gt; {e.role}</h3>
                  <p className="text-[10px] font-black opacity-40 mb-4 tracking-widest">@{e.company} // {e.period}</p>
                  <p className="text-sm leading-[1.6] opacity-70">{e.description}</p>
                </div>
              ))}
            </div>
          </section>
        </div>
        <section className="col-span-4">
          <h2 className="text-xs font-black uppercase tracking-[0.2em] text-brand-blue mb-[16px]">stack.json</h2>
          <div className="flex flex-wrap gap-2.5">
            {skills.map((s, i) => <span key={i} className="px-3 py-2 bg-brand-blue/10 border border-brand-blue/30 text-brand-blue text-[10px] rounded-xl uppercase font-black tracking-widest">{s}</span>)}
          </div>
        </section>
      </div>
    </div>
  );
};

// 8. EXECUTIVE
export const ExecutiveTemplate: React.FC<TemplateProps> = ({ data }) => {
  const { personalInfo, experiences, customization } = data;
  return (
    <div className="px-[50px] py-[40px] h-full border-[20px] border-slate-100 flex flex-col bg-white text-slate-900 leading-[1.6]">
      <header className="flex justify-between items-end mb-[48px] border-b-8 border-slate-900 pb-10">
        <div className="flex items-end gap-8">
          <ResumePhoto data={data} className="w-32 h-40" />
          <div>
            <h1 className="text-6xl font-black tracking-tighter leading-none mb-3">{personalInfo.fullName}</h1>
            <p className="text-sm font-black uppercase tracking-[0.4em] opacity-40">{personalInfo.profession}</p>
          </div>
        </div>
        <div className="text-right text-[11px] font-black uppercase tracking-[0.25em] space-y-2 opacity-60">
          <p>{personalInfo.city}</p>
          <p>{personalInfo.email}</p>
          <p>{personalInfo.phone}</p>
        </div>
      </header>
      <section className={commonStyles.section}>
        <h2 className="text-xs font-black uppercase tracking-[0.3em] mb-[16px] border-l-4 pl-4" style={{ borderColor: customization.primaryColor }}>Executivo Sênior</h2>
        <p className="text-lg font-bold leading-[1.6] text-slate-800">{personalInfo.summary}</p>
      </section>
      <section>
        <h2 className="text-xs font-black uppercase tracking-[0.3em] mb-[32px] border-l-4 pl-4" style={{ borderColor: customization.primaryColor }}>Histórico Executivo</h2>
        <div className="space-y-[40px]">
          {experiences.map(e => (
            <div key={e.id} className="grid grid-cols-5 gap-[30px]">
              <div className="text-[11px] font-black uppercase tracking-[0.2em] opacity-30 pt-1.5">{e.period}</div>
              <div className="col-span-4">
                <h3 className="text-2xl font-black mb-1 tracking-tight">{e.role}</h3>
                <p className="text-sm font-black uppercase mb-4 tracking-[0.2em]" style={{ color: customization.primaryColor }}>{e.company}</p>
                <p className="text-sm opacity-80 font-medium leading-[1.6]">{e.description}</p>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

// 9. CREATIVE
export const CreativeTemplate: React.FC<TemplateProps> = ({ data }) => {
  const { personalInfo, experiences, skills, customization } = data;
  return (
    <div className="h-full flex flex-col bg-white">
      <header className="h-[220px] relative flex items-center px-[50px] gap-10 overflow-hidden" style={{ backgroundColor: customization.primaryColor }}>
        <div className="absolute top-0 right-0 w-[300px] h-[300px] bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2"></div>
        <div className="relative z-10">
          <ResumePhoto data={data} className="w-32 h-32 border-white/40" />
        </div>
        <div className="relative z-10 text-white">
          <h1 className="text-6xl font-black tracking-tighter mb-2">{personalInfo.fullName}</h1>
          <p className="text-2xl font-bold opacity-80 tracking-widest">{personalInfo.profession}</p>
        </div>
      </header>
      <div className="flex-1 px-[50px] py-[40px] grid grid-cols-12 gap-[40px] leading-[1.6]">
        <aside className="col-span-4 space-y-[40px]">
          <section className="bg-slate-50 p-8 rounded-[2.5rem] border border-slate-100 shadow-inner">
            <h2 className="font-black uppercase text-[11px] tracking-[0.3em] mb-[16px]">Conexão</h2>
            <div className="text-[11px] space-y-4 font-black opacity-60 break-all uppercase tracking-widest">
              <p>{personalInfo.email}</p>
              <p>{personalInfo.phone}</p>
              <p>{personalInfo.city}</p>
            </div>
          </section>
          <section>
            <h2 className="font-black uppercase text-[11px] tracking-[0.3em] mb-[16px]">DNA Criativo</h2>
            <div className="flex flex-wrap gap-2.5">
              {skills.map((s, i) => <span key={i} className="px-4 py-2 bg-white border-2 border-slate-100 rounded-[1.25rem] text-[10px] font-black uppercase tracking-wider shadow-sm">{s}</span>)}
            </div>
          </section>
        </aside>
        <main className="col-span-8 space-y-[48px]">
          <section>
            <h2 className="text-[11px] font-black uppercase tracking-[0.4em] mb-[28px] text-slate-300">Portfólio de Experiências</h2>
            <div className="space-y-[40px]">
              {experiences.map(e => (
                <div key={e.id} className="group">
                  <div className="flex justify-between items-center mb-1">
                    <h3 className="text-2xl font-black tracking-tight group-hover:text-brand-blue transition-colors">{e.role}</h3>
                    <span className="text-[10px] font-black opacity-30 uppercase tracking-[0.2em]">{e.period}</span>
                  </div>
                  <p className="text-xs font-black mb-4 uppercase tracking-[0.3em]" style={{ color: customization.primaryColor }}>{e.company}</p>
                  <p className="text-sm leading-[1.7] opacity-75 font-medium">{e.description}</p>
                </div>
              ))}
            </div>
          </section>
        </main>
      </div>
    </div>
  );
};

// 10. ATS SIMPLE (ATS typically doesn't have photos, but we'll allow it if forced)
export const AtsSimpleTemplate: React.FC<TemplateProps> = ({ data }) => {
  const { personalInfo, experiences, skills } = data;
  return (
    <div className="px-[50px] py-[40px] h-full text-black bg-white space-y-[28px] max-w-[800px] mx-auto leading-[1.5] text-sm font-serif">
      <div className="text-center mb-[40px]">
        <h1 className="text-3xl font-bold uppercase tracking-widest mb-2">{personalInfo.fullName}</h1>
        <div className="text-[13px] font-medium space-x-3">
          <span>{personalInfo.city}</span> | <span>{personalInfo.phone}</span> | <span className="underline">{personalInfo.email}</span>
        </div>
      </div>
      <section>
        <h2 className="text-[14px] font-bold uppercase border-b-2 border-black mb-[12px] tracking-tight">Professional Summary</h2>
        <p className="leading-relaxed text-justify">{personalInfo.summary}</p>
      </section>
      <section>
        <h2 className="text-[14px] font-bold uppercase border-b-2 border-black mb-[16px] tracking-tight">Experience</h2>
        <div className="space-y-[24px]">
          {experiences.map(e => (
            <div key={e.id}>
              <div className="flex justify-between font-bold">
                <span>{e.company}</span>
                <span>{e.period}</span>
              </div>
              <div className="italic mb-2">{e.role}</div>
              <p className="mt-2 text-justify">{e.description}</p>
            </div>
          ))}
        </div>
      </section>
      <section>
        <h2 className="text-[14px] font-bold uppercase border-b-2 border-black mb-[12px] tracking-tight">Technical Skills & Competencies</h2>
        <p className="font-medium">{skills.join(' • ')}</p>
      </section>
    </div>
  );
};

// 11. COMPACT
export const CompactTemplate: React.FC<TemplateProps> = ({ data }) => {
  const { personalInfo, experiences, skills, customization } = data;
  return (
    <div className={`${commonStyles.container} text-[11px] px-[50px] py-[40px] leading-[1.5]`}>
      <div className="flex justify-between items-center mb-[32px] border-b-2 pb-6">
        <div className="flex items-center gap-6">
          <ResumePhoto data={data} className="w-20 h-20" />
          <div>
            <h1 className="text-2xl font-black uppercase tracking-tight mb-1" style={{ color: customization.primaryColor }}>{personalInfo.fullName}</h1>
            <p className="font-black opacity-60 uppercase tracking-widest">{personalInfo.profession}</p>
          </div>
        </div>
        <div className="text-right opacity-60 font-black uppercase tracking-widest space-y-1">
          <p>{personalInfo.email}</p>
          <p>{personalInfo.phone}</p>
        </div>
      </div>
      <div className="grid grid-cols-4 gap-[30px]">
        <div className="col-span-3 space-y-[28px]">
          <section>
            <h2 className="font-black uppercase border-b-2 mb-[16px] tracking-widest pb-1">Professional Experience</h2>
            <div className="space-y-[20px]">
              {experiences.map(e => (
                <div key={e.id}>
                  <div className="flex justify-between font-black mb-1">
                    <span className="text-[12px]">{e.role} @ {e.company}</span>
                    <span className="opacity-40">{e.period}</span>
                  </div>
                  <p className="leading-relaxed opacity-85 text-justify">{e.description}</p>
                </div>
              ))}
            </div>
          </section>
        </div>
        <aside>
           <h2 className="font-black uppercase border-b-2 mb-[16px] tracking-widest pb-1">Expertise</h2>
           <div className="flex flex-col gap-2 pt-1">
             {skills.map((s, i) => <span key={i} className="font-black text-slate-500 uppercase leading-none">• {s}</span>)}
           </div>
        </aside>
      </div>
    </div>
  );
};

// 12. INTERNATIONAL
export const InternationalTemplate: React.FC<TemplateProps> = ({ data }) => {
  const { personalInfo, experiences, skills, customization } = data;
  return (
    <div className={`${commonStyles.container} px-[60px] py-[50px] leading-[1.7]`}>
      <div className="mb-[48px] flex justify-between items-start">
        <div>
          <h1 className="text-5xl font-bold mb-3 tracking-tighter">{personalInfo.fullName}</h1>
          <p className="text-xl opacity-60 font-medium tracking-wide">{personalInfo.profession}</p>
          <div className="flex gap-6 mt-6 text-[10px] font-black text-slate-400 uppercase tracking-[0.3em]">
             <span>{personalInfo.email}</span>
             <span className="opacity-20">/</span>
             <span>{personalInfo.phone}</span>
             <span className="opacity-20">/</span>
             <span>{personalInfo.city}</span>
          </div>
        </div>
        <ResumePhoto data={data} className="w-32 h-40" />
      </div>
      <div className="space-y-[40px]">
         <section>
           <h2 className="text-[11px] font-black uppercase tracking-[0.4em] mb-[16px]" style={{ color: customization.primaryColor }}>Executive Profile</h2>
           <p className="text-base leading-[1.7] opacity-80 text-justify">{personalInfo.summary}</p>
         </section>
         <section>
           <h2 className="text-[11px] font-black uppercase tracking-[0.4em] mb-[24px]" style={{ color: customization.primaryColor }}>Career Background</h2>
           <div className="space-y-[32px]">
             {experiences.map(e => (
               <div key={e.id}>
                 <div className="flex justify-between mb-2">
                    <h3 className="font-bold text-lg tracking-tight">{e.role}, <span className="opacity-60">{e.company}</span></h3>
                    <span className="text-[11px] font-black opacity-30 uppercase tracking-widest">{e.period}</span>
                 </div>
                 <p className="text-sm opacity-80 leading-[1.7] font-medium text-justify">{e.description}</p>
               </div>
             ))}
           </div>
         </section>
         <section>
           <h2 className="text-[11px] font-black uppercase tracking-[0.4em] mb-[16px]" style={{ color: customization.primaryColor }}>Areas of Expertise</h2>
           <div className="grid grid-cols-3 gap-y-4 pt-2">
             {skills.map((s, i) => <span key={i} className="text-xs font-black uppercase tracking-widest opacity-60">• {s}</span>)}
           </div>
         </section>
      </div>
    </div>
  );
};

// Main renderer component
export const TemplateRenderer: React.FC<TemplateProps> = ({ data }) => {
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
};
