
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { AppRoute, ResumeData, Experience, Education, User, PLANS } from '../types';
import { ChevronRight, ChevronLeft, Plus, Trash2, Zap, Loader2, Sparkles } from 'lucide-react';
import { polishResumeWithAI, improveDescriptionWithAI } from '../services/geminiService';

interface CreateResumeProps {
  onSave: (resume: ResumeData) => void;
  user: User;
  resumesCount: number;
  onOpenPlans: () => void;
}

const CreateResume: React.FC<CreateResumeProps> = ({ onSave, user, resumesCount, onOpenPlans }) => {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [refiningId, setRefiningId] = useState<string | null>(null);
  const navigate = useNavigate();
  
  const planDetails = PLANS[user.plan];

  useEffect(() => {
    if (resumesCount >= planDetails.maxResumes) {
        onOpenPlans();
        navigate(AppRoute.DASHBOARD);
    }
  }, [resumesCount, planDetails, navigate, onOpenPlans]);

  const [formData, setFormData] = useState<ResumeData>({
    id: Math.random().toString(36).substr(2, 9),
    title: '',
    personalInfo: {
      fullName: '',
      profession: '',
      phone: '',
      email: '',
      city: '',
      photo: ''
    },
    experiences: [{ id: '1', company: '', role: '', period: '', description: '', level: 'intermediario' }],
    education: [{ id: '1', course: '', institution: '', year: '' }],
    skills: [''],
    customization: {
      template: 'modern',
      primaryColor: '#4f46e5',
      showPhoto: true,
      fontFamily: 'Inter'
    },
    createdAt: Date.now()
  });

  const nextStep = () => setStep(prev => prev + 1);
  const prevStep = () => setStep(prev => prev - 1);

  const updatePersonalInfo = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      personalInfo: { ...prev.personalInfo, [field]: value }
    }));
  };

  const addExperience = () => {
    setFormData(prev => ({
      ...prev,
      experiences: [...prev.experiences, { id: Math.random().toString(), company: '', role: '', period: '', description: '', level: 'intermediario' }]
    }));
  };

  const updateExperience = (id: string, field: keyof Experience, value: string) => {
    setFormData(prev => ({
      ...prev,
      experiences: prev.experiences.map(exp => exp.id === id ? { ...exp, [field]: value } : exp)
    }));
  };

  const handleImproveWithAI = async (id: string) => {
    const exp = formData.experiences.find(e => e.id === id);
    if (!exp || !exp.description || exp.description.length < 5) return;

    setRefiningId(id);
    try {
      const improved = await improveDescriptionWithAI(exp.role, exp.description, exp.level);
      updateExperience(id, 'description', improved);
    } catch (error) {
      console.error("Erro ao melhorar com IA", error);
    } finally {
      setRefiningId(null);
    }
  };

  const removeExperience = (id: string) => {
    setFormData(prev => ({
      ...prev,
      experiences: prev.experiences.filter(exp => exp.id !== id)
    }));
  };

  const addEducation = () => {
    setFormData(prev => ({
      ...prev,
      education: [...prev.education, { id: Math.random().toString(), course: '', institution: '', year: '' }]
    }));
  };

  const updateEducation = (id: string, field: keyof Education, value: string) => {
    setFormData(prev => ({
      ...prev,
      education: prev.education.map(edu => edu.id === id ? { ...edu, [field]: value } : edu)
    }));
  };

  const updateSkill = (index: number, value: string) => {
    const newSkills = [...formData.skills];
    newSkills[index] = value;
    setFormData(prev => ({ ...prev, skills: newSkills }));
  };

  const addSkill = () => setFormData(prev => ({ ...prev, skills: [...prev.skills, ''] }));

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const enhancedResume = await polishResumeWithAI(formData);
      onSave(enhancedResume);
      navigate(AppRoute.CUSTOMIZE);
    } catch (error) {
      onSave(formData);
      navigate(AppRoute.CUSTOMIZE);
    } finally {
      setLoading(false);
    }
  };

  const renderStep = () => {
    switch (step) {
      case 1:
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold">Informações Pessoais</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-semibold">Nome Completo</label>
                <input 
                  type="text" 
                  value={formData.personalInfo.fullName}
                  onChange={(e) => updatePersonalInfo('fullName', e.target.value)}
                  className="w-full p-3 border border-slate-200 rounded-xl bg-slate-50"
                  placeholder="Ex: João da Silva"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-semibold">Profissão</label>
                <input 
                  type="text" 
                  value={formData.personalInfo.profession}
                  onChange={(e) => updatePersonalInfo('profession', e.target.value)}
                  className="w-full p-3 border border-slate-200 rounded-xl bg-slate-50"
                  placeholder="Ex: Designer de Produto"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-semibold">Telefone</label>
                <input 
                  type="text" 
                  value={formData.personalInfo.phone}
                  onChange={(e) => updatePersonalInfo('phone', e.target.value)}
                  className="w-full p-3 border border-slate-200 rounded-xl bg-slate-50"
                  placeholder="(11) 99999-9999"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-semibold">Email</label>
                <input 
                  type="email" 
                  value={formData.personalInfo.email}
                  onChange={(e) => updatePersonalInfo('email', e.target.value)}
                  className="w-full p-3 border border-slate-200 rounded-xl bg-slate-50"
                  placeholder="joao@exemplo.com"
                />
              </div>
              <div className="space-y-2 col-span-2">
                <label className="text-sm font-semibold">Cidade / Estado</label>
                <input 
                  type="text" 
                  value={formData.personalInfo.city}
                  onChange={(e) => updatePersonalInfo('city', e.target.value)}
                  className="w-full p-3 border border-slate-200 rounded-xl bg-slate-50"
                  placeholder="Ex: São Paulo, SP"
                />
              </div>
            </div>
          </div>
        );
      case 2:
        return (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold">Experiência Profissional</h2>
              <button onClick={addExperience} className="flex items-center text-indigo-600 font-bold text-sm">
                <Plus className="mr-1 h-4 w-4" /> Adicionar
              </button>
            </div>
            {formData.experiences.map((exp, index) => (
              <div key={exp.id} className="p-6 border border-slate-200 rounded-2xl relative bg-slate-50/30">
                <button 
                  onClick={() => removeExperience(exp.id)}
                  className="absolute top-4 right-4 text-slate-400 hover:text-red-500"
                >
                  <Trash2 className="h-5 w-5" />
                </button>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-semibold">Empresa</label>
                    <input 
                      type="text" value={exp.company}
                      onChange={(e) => updateExperience(exp.id, 'company', e.target.value)}
                      className="w-full p-3 border border-slate-200 rounded-xl bg-white"
                      placeholder="Nome da empresa"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-semibold">Cargo</label>
                    <input 
                      type="text" value={exp.role}
                      onChange={(e) => updateExperience(exp.id, 'role', e.target.value)}
                      className="w-full p-3 border border-slate-200 rounded-xl bg-white"
                      placeholder="Seu cargo"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-semibold">Nível de Experiência</label>
                    <select 
                      value={exp.level}
                      onChange={(e) => updateExperience(exp.id, 'level', e.target.value)}
                      className="w-full p-3 border border-slate-200 rounded-xl bg-white"
                    >
                      <option value="iniciante">Iniciante</option>
                      <option value="intermediario">Intermediário</option>
                      <option value="experiente">Experiente / Sênior</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-semibold">Período</label>
                    <input 
                      type="text" value={exp.period}
                      onChange={(e) => updateExperience(exp.id, 'period', e.target.value)}
                      className="w-full p-3 border border-slate-200 rounded-xl bg-white"
                      placeholder="Ex: Jan 2020 - Dez 2022"
                    />
                  </div>
                  <div className="space-y-2 col-span-2 relative">
                    <div className="flex justify-between items-center">
                      <label className="text-sm font-semibold">Descrição da Experiência</label>
                      <button 
                        onClick={() => handleImproveWithAI(exp.id)}
                        disabled={refiningId === exp.id || !exp.description || exp.description.length < 5}
                        className="text-xs flex items-center bg-indigo-50 text-indigo-600 px-3 py-1.5 rounded-lg font-bold hover:bg-indigo-100 transition-all disabled:opacity-50"
                      >
                        {refiningId === exp.id ? <Loader2 className="h-3 w-3 animate-spin mr-1.5" /> : <Sparkles className="h-3 w-3 mr-1.5" />}
                        {refiningId === exp.id ? 'Reescrevendo...' : 'Melhorar com IA'}
                      </button>
                    </div>
                    <textarea 
                      value={exp.description}
                      onChange={(e) => updateExperience(exp.id, 'description', e.target.value)}
                      className="w-full p-3 border border-slate-200 rounded-xl bg-white h-32 focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
                      placeholder="Ex: vendi produtos no varejo... (Clique no botão acima para tornar isso profissional!)"
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        );
      case 3:
        return (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold">Formação Acadêmica</h2>
              <button onClick={addEducation} className="flex items-center text-indigo-600 font-bold text-sm">
                <Plus className="mr-1 h-4 w-4" /> Adicionar
              </button>
            </div>
            {formData.education.map((edu) => (
              <div key={edu.id} className="p-6 border border-slate-200 rounded-2xl relative bg-slate-50/30">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-semibold">Curso</label>
                    <input 
                      type="text" value={edu.course}
                      onChange={(e) => updateEducation(edu.id, 'course', e.target.value)}
                      className="w-full p-3 border border-slate-200 rounded-xl bg-white"
                      placeholder="Ex: Graduação em Administração"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-semibold">Instituição</label>
                    <input 
                      type="text" value={edu.institution}
                      onChange={(e) => updateEducation(edu.id, 'institution', e.target.value)}
                      className="w-full p-3 border border-slate-200 rounded-xl bg-white"
                      placeholder="Nome da faculdade/escola"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-semibold">Ano de Conclusão</label>
                    <input 
                      type="text" value={edu.year}
                      onChange={(e) => updateEducation(edu.id, 'year', e.target.value)}
                      className="w-full p-3 border border-slate-200 rounded-xl bg-white"
                      placeholder="Ex: 2023"
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        );
      case 4:
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold">Habilidades e Competências</h2>
            <div className="flex flex-wrap gap-2">
              {formData.skills.map((skill, index) => (
                <div key={index} className="flex-1 min-w-[200px]">
                  <input 
                    type="text" value={skill}
                    onChange={(e) => updateSkill(index, e.target.value)}
                    className="w-full p-3 border border-slate-200 rounded-xl bg-slate-50"
                    placeholder="Ex: JavaScript, Gestão de Equipes..."
                  />
                </div>
              ))}
            </div>
            <button onClick={addSkill} className="text-indigo-600 font-bold text-sm">+ Adicionar mais</button>
            
            <div className="mt-12 p-8 bg-indigo-600 rounded-3xl text-white shadow-2xl shadow-indigo-200">
                <div className="flex items-center space-x-3 mb-4">
                    <Zap className="h-8 w-8 text-amber-300" />
                    <h3 className="text-xl font-bold">Tudo Pronto!</h3>
                </div>
                <p className="mb-6 opacity-90 leading-relaxed text-sm">Agora, nossa IA fará uma revisão final completa em todo o seu currículo para garantir que cada frase esteja perfeita e estrategicamente escrita para os recrutadores.</p>
                <button 
                    onClick={handleSubmit}
                    disabled={loading}
                    className="w-full py-4 bg-white text-indigo-600 font-black rounded-2xl shadow-xl hover:bg-slate-50 transition-all flex items-center justify-center disabled:opacity-70 group"
                >
                    {loading ? (
                        <><Loader2 className="animate-spin mr-2 h-5 w-5" /> Revisão Final Inteligente...</>
                    ) : (
                        <><Sparkles className="mr-2 h-5 w-5 fill-indigo-600 group-hover:scale-110 transition-transform" /> Finalizar e Polir com IA</>
                    )}
                </button>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      {/* Progress Bar */}
      <div className="mb-12">
        <div className="flex justify-between items-center mb-4 px-2">
          {[1, 2, 3, 4].map((s) => (
            <div key={s} className="flex flex-col items-center">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold transition-all duration-300 ${step >= s ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-100 scale-110' : 'bg-slate-200 text-slate-500'}`}>
                {s}
              </div>
              <span className={`text-[10px] uppercase tracking-wider mt-3 font-black ${step >= s ? 'text-indigo-600' : 'text-slate-400'}`}>
                {s === 1 ? 'Pessoal' : s === 2 ? 'Experiência' : s === 3 ? 'Formação' : 'Finalizar'}
              </span>
            </div>
          ))}
        </div>
        <div className="w-full bg-slate-200 h-1.5 rounded-full overflow-hidden mt-2">
          <div 
            className="bg-indigo-600 h-full transition-all duration-700 ease-out" 
            style={{ width: `${(step / 4) * 100}%` }}
          ></div>
        </div>
      </div>

      <div className="bg-white rounded-3xl p-8 border border-slate-200 shadow-sm min-h-[500px] flex flex-col justify-between">
        <div>
            {renderStep()}
        </div>

        {step < 4 && (
          <div className="flex justify-between mt-12 pt-8 border-t border-slate-100">
            <button 
              onClick={prevStep}
              disabled={step === 1}
              className="flex items-center px-6 py-2 text-slate-400 font-bold hover:text-slate-600 disabled:opacity-30 transition-colors"
            >
              <ChevronLeft className="mr-1 h-5 w-5" /> Voltar
            </button>
            <button 
              onClick={nextStep}
              className="flex items-center px-8 py-3 bg-indigo-600 text-white rounded-xl font-bold shadow-lg shadow-indigo-100 hover:bg-indigo-700 hover:-translate-y-0.5 transition-all"
            >
              Próximo Passo <ChevronRight className="ml-1 h-5 w-5" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default CreateResume;
