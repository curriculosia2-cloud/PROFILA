
import React from 'react';
import { ResumeData } from '../types';

interface TemplateProps {
  data: ResumeData;
}

// 1. CLASSIC (Gratuito)
export const ClassicTemplate: React.FC<TemplateProps> = ({ data }) => {
  const { personalInfo, experiences, education, skills, customization } = data;
  return (
    <div className="flex flex-col h-full text-slate-800">
      <header className="text-center mb-8 pb-6 border-b-2" style={{ borderColor: customization.primaryColor }}>
        <h1 className="text-4xl font-bold uppercase mb-2 tracking-tight">{personalInfo.fullName}</h1>
        <p className="text-xl font-medium mb-4" style={{ color: customization.primaryColor }}>{personalInfo.profession}</p>
        <div className="text-xs space-x-4 opacity-70">
          <span>{personalInfo.email}</span>
          <span>•</span>
          <span>{personalInfo.phone}</span>
          <span>•</span>
          <span>{personalInfo.city}</span>
        </div>
      </header>
      
      {personalInfo.summary && (
        <section className="mb-8">
          <h2 className="text-sm font-black uppercase mb-3 tracking-widest border-l-4 pl-3" style={{ borderLeftColor: customization.primaryColor }}>Resumo</h2>
          <p className="text-sm leading-relaxed">{personalInfo.summary}</p>
        </section>
      )}

      <div className="space-y-8">
        <section>
          <h2 className="text-sm font-black uppercase mb-4 tracking-widest border-l-4 pl-3" style={{ borderLeftColor: customization.primaryColor }}>Experiência</h2>
          <div className="space-y-6">
            {experiences.map((exp) => (
              <div key={exp.id}>
                <div className="flex justify-between items-baseline mb-1">
                  <h3 className="font-bold text-base">{exp.role}</h3>
                  <span className="text-xs opacity-60 italic">{exp.period}</span>
                </div>
                <p className="text-xs font-bold mb-2 uppercase tracking-wide" style={{ color: customization.primaryColor }}>{exp.company}</p>
                <p className="text-sm opacity-80 leading-relaxed">{exp.description}</p>
              </div>
            ))}
          </div>
        </section>

        <section>
          <h2 className="text-sm font-black uppercase mb-4 tracking-widest border-l-4 pl-3" style={{ borderLeftColor: customization.primaryColor }}>Educação</h2>
          <div className="space-y-4">
            {education.map((edu) => (
              <div key={edu.id}>
                <div className="flex justify-between items-center">
                  <h3 className="font-bold">{edu.course}</h3>
                  <span className="text-xs opacity-60">{edu.year}</span>
                </div>
                <p className="text-sm opacity-80">{edu.institution}</p>
              </div>
            ))}
          </div>
        </section>

        <section>
          <h2 className="text-sm font-black uppercase mb-4 tracking-widest border-l-4 pl-3" style={{ borderLeftColor: customization.primaryColor }}>Habilidades</h2>
          <div className="flex flex-wrap gap-2">
            {skills.map((s, i) => <span key={i} className="px-3 py-1 bg-slate-50 border rounded-full text-xs font-bold">{s}</span>)}
          </div>
        </section>
      </div>
    </div>
  );
};

// 2. CLEAN (Gratuito)
export const CleanTemplate: React.FC<TemplateProps> = ({ data }) => {
  const { personalInfo, experiences, education, skills, customization } = data;
  return (
    <div className="flex flex-col h-full text-slate-700">
      <div className="mb-12">
        <h1 className="text-5xl font-extrabold mb-1 tracking-tighter" style={{ color: customization.primaryColor }}>{personalInfo.fullName}</h1>
        <p className="text-lg font-bold text-slate-400 uppercase tracking-widest">{personalInfo.profession}</p>
      </div>
      
      <div className="flex gap-12">
        <div className="flex-1 space-y-10">
          <section>
            <h2 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-300 mb-4">Trajetória Profissional</h2>
            <div className="space-y-8">
              {experiences.map((exp) => (
                <div key={exp.id}>
                  <h3 className="text-lg font-bold mb-1">{exp.role}</h3>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-xs font-bold" style={{ color: customization.primaryColor }}>{exp.company}</span>
                    <span className="text-[10px] uppercase font-black opacity-40">{exp.period}</span>
                  </div>
                  <p className="text-sm opacity-80 leading-relaxed font-medium">{exp.description}</p>
                </div>
              ))}
            </div>
          </section>
        </div>
        
        <aside className="w-48 space-y-10">
          <section>
            <h2 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-300 mb-4">Contato</h2>
            <div className="text-xs space-y-2 font-bold opacity-70">
              <p>{personalInfo.email}</p>
              <p>{personalInfo.phone}</p>
              <p>{personalInfo.city}</p>
            </div>
          </section>

          <section>
            <h2 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-300 mb-4">Habilidades</h2>
            <div className="space-y-2">
              {skills.map((s, i) => <div key={i} className="text-xs font-bold border-l-2 pl-2" style={{ borderLeftColor: customization.primaryColor }}>{s}</div>)}
            </div>
          </section>
        </aside>
      </div>
    </div>
  );
};

// 3. MODERN COLUMN (Pro)
export const ModernColumnTemplate: React.FC<TemplateProps> = ({ data }) => {
  const { personalInfo, experiences, education, skills, customization } = data;
  return (
    <div className="flex h-full min-h-[inherit]">
      <aside className="w-64 bg-slate-900 text-white p-8 flex flex-col">
        <div className="mb-10 text-center">
          {customization.showPhoto && (
            <div className="w-32 h-32 rounded-full bg-slate-800 mx-auto mb-6 border-4 border-slate-700 overflow-hidden flex items-center justify-center">
              <span className="text-slate-500 text-4xl">👤</span>
            </div>
          )}
          <h1 className="text-2xl font-black mb-1">{personalInfo.fullName}</h1>
          <p className="text-xs font-bold opacity-60 uppercase tracking-widest">{personalInfo.profession}</p>
        </div>

        <section className="mb-10">
          <h2 className="text-[10px] font-black uppercase tracking-[0.2em] mb-4 text-blue-400">Contato</h2>
          <div className="text-xs space-y-3 opacity-80">
            <p className="flex flex-col"><span className="opacity-50">Email</span>{personalInfo.email}</p>
            <p className="flex flex-col"><span className="opacity-50">Phone</span>{personalInfo.phone}</p>
            <p className="flex flex-col"><span className="opacity-50">Local</span>{personalInfo.city}</p>
          </div>
        </section>

        <section className="mt-auto">
          <h2 className="text-[10px] font-black uppercase tracking-[0.2em] mb-4 text-blue-400">Habilidades</h2>
          <div className="flex flex-wrap gap-2">
            {skills.map((s, i) => <span key={i} className="bg-slate-800 px-2 py-1 rounded text-[9px] font-bold uppercase tracking-wider">{s}</span>)}
          </div>
        </section>
      </aside>

      <main className="flex-1 p-12 bg-white text-slate-800">
        <section className="mb-12">
          <h2 className="text-xs font-black uppercase tracking-widest mb-4 flex items-center" style={{ color: customization.primaryColor }}>
            <span className="w-8 h-px bg-current mr-3"></span> Resumo Profissional
          </h2>
          <p className="text-sm leading-relaxed font-medium opacity-80">{personalInfo.summary}</p>
        </section>

        <section className="mb-12">
          <h2 className="text-xs font-black uppercase tracking-widest mb-6 flex items-center" style={{ color: customization.primaryColor }}>
            <span className="w-8 h-px bg-current mr-3"></span> Experiência
          </h2>
          <div className="space-y-10">
            {experiences.map((exp) => (
              <div key={exp.id}>
                <div className="flex justify-between items-baseline mb-2">
                  <h3 className="text-lg font-black">{exp.role}</h3>
                  <span className="text-[10px] font-black opacity-40 uppercase tracking-tighter">{exp.period}</span>
                </div>
                <p className="text-xs font-bold uppercase mb-3 opacity-60">{exp.company}</p>
                <p className="text-sm leading-relaxed opacity-75">{exp.description}</p>
              </div>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
};

// Simplified placeholders for the rest of the 12 templates to fit in the response context 
// While maintaining high quality and unique styles for each.

// 4. MODERN BLOCKS (Pro)
export const ModernBlocksTemplate: React.FC<TemplateProps> = ({ data }) => {
  const { personalInfo, experiences, education, skills, customization } = data;
  return (
    <div className="p-8 h-full bg-white">
      <div className="p-8 mb-8 text-white rounded-3xl" style={{ backgroundColor: customization.primaryColor }}>
        <h1 className="text-4xl font-black mb-1">{personalInfo.fullName}</h1>
        <p className="text-lg font-bold opacity-80 uppercase tracking-widest">{personalInfo.profession}</p>
      </div>
      <div className="grid grid-cols-3 gap-8">
        <div className="col-span-2 space-y-8">
          <section className="bg-slate-50 p-6 rounded-2xl">
            <h2 className="font-black uppercase text-xs mb-4" style={{ color: customization.primaryColor }}>Experiência</h2>
            <div className="space-y-6">
              {experiences.map(e => (
                <div key={e.id}>
                  <h3 className="font-bold text-sm">{e.role}</h3>
                  <p className="text-[10px] opacity-50 uppercase mb-2">{e.company} | {e.period}</p>
                  <p className="text-xs leading-relaxed">{e.description}</p>
                </div>
              ))}
            </div>
          </section>
        </div>
        <div className="space-y-8">
          <section className="bg-slate-50 p-6 rounded-2xl">
            <h2 className="font-black uppercase text-xs mb-4" style={{ color: customization.primaryColor }}>Skills</h2>
            <div className="flex flex-wrap gap-2">
              {skills.map((s, i) => <span key={i} className="text-[10px] bg-white px-2 py-1 rounded-lg border font-bold">{s}</span>)}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};

// 5. ELEGANT (Pro)
export const ElegantTemplate: React.FC<TemplateProps> = ({ data }) => {
  const { personalInfo, experiences, customization } = data;
  return (
    <div className="p-12 h-full flex flex-col font-serif">
      <header className="text-center mb-12 border-b-2 border-slate-100 pb-8">
        <h1 className="text-5xl font-light tracking-widest italic mb-2">{personalInfo.fullName}</h1>
        <p className="text-sm font-bold tracking-[0.3em] uppercase opacity-50">{personalInfo.profession}</p>
      </header>
      <div className="max-w-3xl mx-auto w-full space-y-12">
        <section>
          <h2 className="text-center text-[10px] font-black uppercase tracking-[0.4em] mb-8" style={{ color: customization.primaryColor }}>Resumo Profissional</h2>
          <p className="text-center italic leading-relaxed text-slate-600">{personalInfo.summary}</p>
        </section>
        <section>
          <h2 className="text-[10px] font-black uppercase tracking-[0.4em] mb-8" style={{ color: customization.primaryColor }}>Experiência</h2>
          <div className="space-y-12">
            {experiences.map(e => (
              <div key={e.id} className="text-center">
                <h3 className="text-xl font-bold mb-1">{e.role}</h3>
                <p className="text-xs uppercase tracking-widest opacity-40 mb-4">{e.company} • {e.period}</p>
                <p className="text-sm leading-relaxed text-slate-700">{e.description}</p>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
};

// 6. TIMELINE (Pro)
export const TimelineTemplate: React.FC<TemplateProps> = ({ data }) => {
  const { experiences, customization, personalInfo } = data;
  return (
    <div className="p-10 h-full">
      <header className="mb-12 border-l-4 pl-6" style={{ borderLeftColor: customization.primaryColor }}>
        <h1 className="text-4xl font-black">{personalInfo.fullName}</h1>
        <p className="text-slate-400 font-bold uppercase">{personalInfo.profession}</p>
      </header>
      <div className="relative pl-8 border-l-2 border-slate-100 space-y-12 ml-4">
        {experiences.map(e => (
          <div key={e.id} className="relative">
            <div className="absolute -left-[37px] top-1.5 w-4 h-4 rounded-full border-4 border-white shadow-sm" style={{ backgroundColor: customization.primaryColor }}></div>
            <span className="text-[10px] font-black uppercase tracking-widest opacity-40 mb-2 block">{e.period}</span>
            <h3 className="text-lg font-black mb-1">{e.role}</h3>
            <p className="text-xs font-bold mb-3" style={{ color: customization.primaryColor }}>{e.company}</p>
            <p className="text-sm opacity-70 leading-relaxed">{e.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

// 7. TECH (Premium)
export const TechTemplate: React.FC<TemplateProps> = ({ data }) => {
  const { skills, experiences, personalInfo, customization } = data;
  return (
    <div className="p-8 h-full font-mono bg-[#0F172A] text-slate-300">
      <header className="mb-8 border-b border-slate-800 pb-6">
        <h1 className="text-3xl font-black text-white mb-2">{personalInfo.fullName}</h1>
        <p className="text-brand-blue font-bold uppercase tracking-tighter">&gt; {personalInfo.profession}</p>
      </header>
      <div className="grid grid-cols-3 gap-6">
        <div className="col-span-2 space-y-8">
          <section>
            <h2 className="text-xs font-black uppercase tracking-widest text-brand-blue mb-4">log_experiences()</h2>
            <div className="space-y-6">
              {experiences.map(e => (
                <div key={e.id} className="bg-slate-900/50 p-4 border border-slate-800 rounded-lg">
                  <h3 className="text-sm font-bold text-white">&gt; {e.role}</h3>
                  <p className="text-[10px] opacity-40 mb-2">@{e.company} // {e.period}</p>
                  <p className="text-xs leading-relaxed opacity-70">{e.description}</p>
                </div>
              ))}
            </div>
          </section>
        </div>
        <section>
          <h2 className="text-xs font-black uppercase tracking-widest text-brand-blue mb-4">stack.json</h2>
          <div className="flex flex-wrap gap-2">
            {skills.map((s, i) => <span key={i} className="px-2 py-1 bg-brand-blue/10 border border-brand-blue/30 text-brand-blue text-[9px] rounded uppercase font-bold">{s}</span>)}
          </div>
        </section>
      </div>
    </div>
  );
};

// 8. EXECUTIVE (Premium)
export const ExecutiveTemplate: React.FC<TemplateProps> = ({ data }) => {
  const { personalInfo, experiences, customization } = data;
  return (
    <div className="p-12 h-full border-[16px] border-slate-100 flex flex-col">
      <header className="flex justify-between items-end mb-16 border-b-4 border-slate-900 pb-8">
        <div>
          <h1 className="text-5xl font-black tracking-tighter leading-none mb-2">{personalInfo.fullName}</h1>
          <p className="text-xs font-black uppercase tracking-[0.3em] opacity-40">{personalInfo.profession}</p>
        </div>
        <div className="text-right text-[10px] font-bold uppercase tracking-widest space-y-1">
          <p>{personalInfo.city}</p>
          <p>{personalInfo.email}</p>
          <p>{personalInfo.phone}</p>
        </div>
      </header>
      <section className="mb-12">
        <h2 className="text-xs font-black uppercase tracking-[0.2em] mb-4" style={{ color: customization.primaryColor }}>Executive Summary</h2>
        <p className="text-base font-medium leading-relaxed text-slate-800">{personalInfo.summary}</p>
      </section>
      <section>
        <h2 className="text-xs font-black uppercase tracking-[0.2em] mb-8" style={{ color: customization.primaryColor }}>Career History</h2>
        <div className="space-y-10">
          {experiences.map(e => (
            <div key={e.id} className="grid grid-cols-4 gap-8">
              <div className="text-[10px] font-black uppercase opacity-40">{e.period}</div>
              <div className="col-span-3">
                <h3 className="text-lg font-black mb-1">{e.role}</h3>
                <p className="text-xs font-bold uppercase mb-4" style={{ color: customization.primaryColor }}>{e.company}</p>
                <p className="text-sm opacity-80 leading-relaxed">{e.description}</p>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

// 9. CREATIVE (Premium)
export const CreativeTemplate: React.FC<TemplateProps> = ({ data }) => {
  const { personalInfo, experiences, skills, customization } = data;
  return (
    <div className="h-full flex flex-col">
      <header className="h-48 relative flex items-center px-12 overflow-hidden" style={{ backgroundColor: customization.primaryColor }}>
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2"></div>
        <div className="relative z-10 text-white">
          <h1 className="text-5xl font-black tracking-tight">{personalInfo.fullName}</h1>
          <p className="text-xl font-medium opacity-80">{personalInfo.profession}</p>
        </div>
      </header>
      <div className="flex-1 p-12 grid grid-cols-12 gap-12">
        <aside className="col-span-4 space-y-10">
          <section className="bg-slate-50 p-6 rounded-3xl">
            <h2 className="font-black uppercase text-xs mb-4">Contatos</h2>
            <div className="text-xs space-y-3 font-bold opacity-60">
              <p>{personalInfo.email}</p>
              <p>{personalInfo.phone}</p>
              <p>{personalInfo.city}</p>
            </div>
          </section>
          <section>
            <h2 className="font-black uppercase text-xs mb-4">Competências</h2>
            <div className="flex flex-wrap gap-2">
              {skills.map((s, i) => <span key={i} className="px-3 py-1 bg-white border border-slate-200 rounded-xl text-[10px] font-black">{s}</span>)}
            </div>
          </section>
        </aside>
        <main className="col-span-8 space-y-12">
          <section>
            <h2 className="text-xs font-black uppercase tracking-widest mb-6">Experiência Criativa</h2>
            <div className="space-y-10">
              {experiences.map(e => (
                <div key={e.id}>
                  <div className="flex justify-between items-center mb-1">
                    <h3 className="text-lg font-bold">{e.role}</h3>
                    <span className="text-[10px] font-black opacity-30">{e.period}</span>
                  </div>
                  <p className="text-xs font-bold mb-4" style={{ color: customization.primaryColor }}>{e.company}</p>
                  <p className="text-sm leading-relaxed opacity-70">{e.description}</p>
                </div>
              ))}
            </div>
          </section>
        </main>
      </div>
    </div>
  );
};

// 10. ATS SIMPLE (Premium)
export const AtsSimpleTemplate: React.FC<TemplateProps> = ({ data }) => {
  const { personalInfo, experiences, education, skills } = data;
  return (
    <div className="p-12 h-full text-black bg-white space-y-8 max-w-[800px] mx-auto">
      <div className="text-center">
        <h1 className="text-2xl font-bold uppercase">{personalInfo.fullName}</h1>
        <div className="text-sm space-x-2">
          <span>{personalInfo.city}</span> | <span>{personalInfo.phone}</span> | <span>{personalInfo.email}</span>
        </div>
      </div>
      <section>
        <h2 className="text-sm font-bold uppercase border-b border-black mb-2">Summary</h2>
        <p className="text-sm leading-tight">{personalInfo.summary}</p>
      </section>
      <section>
        <h2 className="text-sm font-bold uppercase border-b border-black mb-3">Professional Experience</h2>
        <div className="space-y-4">
          {experiences.map(e => (
            <div key={e.id}>
              <div className="flex justify-between font-bold text-sm">
                <span>{e.company}</span>
                <span>{e.period}</span>
              </div>
              <div className="italic text-sm">{e.role}</div>
              <p className="text-sm mt-1">{e.description}</p>
            </div>
          ))}
        </div>
      </section>
      <section>
        <h2 className="text-sm font-bold uppercase border-b border-black mb-2">Technical Skills</h2>
        <p className="text-sm">{skills.join(', ')}</p>
      </section>
    </div>
  );
};

// 11. COMPACT (Premium)
export const CompactTemplate: React.FC<TemplateProps> = ({ data }) => {
  const { personalInfo, experiences, skills, customization } = data;
  return (
    <div className="p-6 h-full text-slate-800 text-[11px]">
      <div className="flex justify-between items-center mb-4 border-b pb-2">
        <div>
          <h1 className="text-lg font-black uppercase" style={{ color: customization.primaryColor }}>{personalInfo.fullName}</h1>
          <p className="font-bold opacity-60 uppercase">{personalInfo.profession}</p>
        </div>
        <div className="text-right opacity-60 font-bold uppercase">
          {personalInfo.email} | {personalInfo.phone}
        </div>
      </div>
      <div className="grid grid-cols-4 gap-6">
        <div className="col-span-3 space-y-6">
          <section>
            <h2 className="font-black uppercase border-b mb-2">Work Experience</h2>
            <div className="space-y-3">
              {experiences.map(e => (
                <div key={e.id}>
                  <div className="flex justify-between font-bold">
                    <span>{e.role} @ {e.company}</span>
                    <span className="opacity-40">{e.period}</span>
                  </div>
                  <p className="leading-tight opacity-80">{e.description}</p>
                </div>
              ))}
            </div>
          </section>
        </div>
        <aside>
           <h2 className="font-black uppercase border-b mb-2">Skills</h2>
           <div className="flex flex-col gap-1">
             {skills.map((s, i) => <span key={i} className="font-bold">• {s}</span>)}
           </div>
        </aside>
      </div>
    </div>
  );
};

// 12. INTERNATIONAL (Premium)
export const InternationalTemplate: React.FC<TemplateProps> = ({ data }) => {
  const { personalInfo, experiences, education, skills, customization } = data;
  return (
    <div className="p-16 h-full text-slate-800">
      <div className="mb-12">
        <h1 className="text-4xl font-bold mb-2">{personalInfo.fullName}</h1>
        <p className="text-lg opacity-60">{personalInfo.profession}</p>
        <div className="flex gap-4 mt-4 text-xs font-bold text-slate-400 uppercase tracking-widest">
           <span>{personalInfo.email}</span>
           <span>•</span>
           <span>{personalInfo.phone}</span>
           <span>•</span>
           <span>{personalInfo.city}</span>
        </div>
      </div>
      <div className="space-y-12">
         <section>
           <h2 className="text-sm font-black uppercase tracking-[0.2em] mb-4" style={{ color: customization.primaryColor }}>Professional Profile</h2>
           <p className="text-sm leading-relaxed">{personalInfo.summary}</p>
         </section>
         <section>
           <h2 className="text-sm font-black uppercase tracking-[0.2em] mb-6" style={{ color: customization.primaryColor }}>Employment History</h2>
           <div className="space-y-8">
             {experiences.map(e => (
               <div key={e.id}>
                 <div className="flex justify-between mb-1">
                    <h3 className="font-bold text-base">{e.role}, {e.company}</h3>
                    <span className="text-xs opacity-40">{e.period}</span>
                 </div>
                 <p className="text-sm opacity-70 leading-relaxed">{e.description}</p>
               </div>
             ))}
           </div>
         </section>
         <section>
           <h2 className="text-sm font-black uppercase tracking-[0.2em] mb-4" style={{ color: customization.primaryColor }}>Key Expertise</h2>
           <div className="grid grid-cols-3 gap-y-2">
             {skills.map((s, i) => <span key={i} className="text-xs font-bold">• {s}</span>)}
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
