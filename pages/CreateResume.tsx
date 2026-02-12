
// Fix: Use namespace import to correctly populate global JSX.IntrinsicElements
import * as React from 'react';
import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { AppRoute, ResumeData, Experience, Education, User, PLANS } from '../types';
import { ChevronRight, ChevronLeft, Plus, Trash2, Zap, Loader2, Sparkles, Camera, Image as ImageIcon } from 'lucide-react';
import { polishResumeWithAI, improveDescriptionWithAI } from '../services/geminiService';
import PhotoCropModal from '../components/PhotoCropModal';

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
  const [tempImage, setTempImage] = useState<string | null>(null);
  const [showCropper, setShowCropper] = useState(false);
  
  const fileInputRef = useRef<HTMLInputElement>(null);
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
      photoDataUrl: '',
      photoShape: 'circle'
    },
    experiences: [{ id: '1', company: '', role: '', period: '', description: '', level: 'intermediario' }],
    education: [{ id: '1', course: '', institution: '', year: '' }],
    skills: [''],
    customization: {
      template: 'classic',
      primaryColor: '#2563EB',
      showPhoto: true,
      fontFamily: 'Inter',
      lineSpacing: 1.2,
      sectionSpacing: 24
    },
    createdAt: Date.now()
  });

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      alert("A imagem deve ter menos de 5MB.");
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      setTempImage(reader.result as string);
      setShowCropper(true);
    };
    reader.readAsDataURL(file);
  };

  const handleCropComplete = (dataUrl: string) => {
    setFormData(prev => ({
      ...prev,
      personalInfo: { ...prev.personalInfo, photoDataUrl: dataUrl }
    }));
    setShowCropper(false);
    setTempImage(null);
  };

  const nextStep = () => setStep(prev => prev + 1);
  const prevStep = () => setStep(prev => prev - 1);

  const updatePersonalInfo = (field: string, value: any) => {
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
          <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="flex flex-col md:flex-row gap-10">
              {/* Photo Upload Area */}
              <div className="flex flex-col items-center space-y-4">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest text-center w-full">Foto Profissional</label>
                <div 
                  onClick={() => fileInputRef.current?.click()}
                  className="group relative w-40 h-40 bg-slate-50 border-2 border-dashed border-slate-200 rounded-[2.5rem] flex flex-col items-center justify-center cursor-pointer hover:border-brand-blue hover:bg-blue-50/50 transition-all overflow-hidden"
                >
                  {formData.personalInfo.photoDataUrl ? (
                    <>
                      <img src={formData.personalInfo.photoDataUrl} alt="Preview" className="w-full h-full object-cover" />
                      <div className="absolute inset-0 bg-brand-dark/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                        <Camera className="text-white h-8 w-8" />
                      </div>
                    </>
                  ) : (
                    <div className="text-center p-4">
                      <div className="bg-white w-12 h-12 rounded-2xl shadow-sm flex items-center justify-center mx-auto mb-3 text-slate-300 group-hover:text-brand-blue group-hover:scale-110 transition-all">
                        <ImageIcon size={24} />
                      </div>
                      <span className="text-[10px] font-black text-slate-400 uppercase tracking-tight group-hover:text-brand-blue">Enviar Foto</span>
                    </div>
                  )}
                </div>
                <input 
                  type="file" ref={fileInputRef} className="hidden" 
                  accept="image/jpeg,image/png,image/webp" 
                  onChange={handleFileChange} 
                />
                {formData.personalInfo.photoDataUrl && (
                  <button 
                    onClick={() => updatePersonalInfo('photoDataUrl', '')}
                    className="text-[10px] font-black text-red-500 uppercase tracking-widest hover:underline"
                  >
                    Remover Foto
                  </button>
                )}
              </div>

              {/* Basic Fields */}
              <div className="flex-1 space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Nome Completo</label>
                    <input 
                      type="text" 
                      value={formData.personalInfo.fullName}
                      onChange={(e) => updatePersonalInfo('fullName', e.target.value)}
                      className="w-full p-4 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-2 focus:ring-brand-blue outline-none transition-all font-medium"
                      placeholder="Ex: João da Silva"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Cargo Atual / Alvo</label>
                    <input 
                      type="text" 
                      value={formData.personalInfo.profession}
                      onChange={(e) => updatePersonalInfo('profession', e.target.value)}
                      className="w-full p-4 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-2 focus:ring-brand-blue outline-none transition-all font-medium"
                      placeholder="Ex: Designer de Produto"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Telefone</label>
                    <input 
                      type="text" 
                      value={formData.personalInfo.phone}
                      onChange={(e) => updatePersonalInfo('phone', e.target.value)}
                      className="w-full p-4 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-2 focus:ring-brand-blue outline-none transition-all font-medium"
                      placeholder="(11) 99999-9999"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Email</label>
                    <input 
                      type="email" 
                      value={formData.personalInfo.email}
                      onChange={(e) => updatePersonalInfo('email', e.target.value)}
                      className="w-full p-4 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-2 focus:ring-brand-blue outline-none transition-all font-medium"
                      placeholder="joao@exemplo.com"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Localização</label>
                  <input 
                    type="text" 
                    value={formData.personalInfo.city}
                    onChange={(e) => updatePersonalInfo('city', e.target.value)}
                    className="w-full p-4 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-2 focus:ring-brand-blue outline-none transition-all font-medium"
                    placeholder="Ex: São Paulo, SP"
                  />
                </div>
              </div>
            </div>

            {/* AI Summary Suggestion Area */}
            <div className="p-8 bg-slate-50 rounded-[2.5rem] border border-slate-100">
               <div className="flex justify-between items-center mb-4">
                  <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Breve Resumo (IA vai expandir isso)</label>
               </div>
               <textarea 
                  value={formData.personalInfo.summary}
                  onChange={(e) => updatePersonalInfo('summary', e.target.value)}
                  className="w-full p-4 bg-white border border-slate-100 rounded-2xl focus:ring-2 focus:ring-brand-blue outline-none transition-all font-medium h-32"
                  placeholder="Conte um pouco sobre suas principais ambições e pontos fortes..."
                />
            </div>
          </div>
        );
      case 2:
        return (
          <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-black text-brand-dark tracking-tight">Trajetória Profissional</h2>
              <button onClick={addExperience} className="flex items-center bg-blue-50 text-brand-blue px-4 py-2 rounded-xl font-black text-[10px] uppercase tracking-widest hover:bg-blue-100 transition-all">
                <Plus className="mr-2 h-4 w-4" /> ADICIONAR
              </button>
            </div>
            <div className="space-y-6">
              {formData.experiences.map((exp) => (
                <div key={exp.id} className="p-8 border border-slate-100 rounded-[2.5rem] relative bg-slate-50/30 group hover:border-brand-blue/30 transition-all">
                  <button 
                    onClick={() => removeExperience(exp.id)}
                    className="absolute top-6 right-6 text-slate-300 hover:text-red-500 p-2 hover:bg-red-50 rounded-xl transition-all"
                  >
                    <Trash2 className="h-5 w-5" />
                  </button>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Empresa</label>
                      <input 
                        type="text" value={exp.company}
                        onChange={(e) => updateExperience(exp.id, 'company', e.target.value)}
                        className="w-full p-4 bg-white border border-slate-100 rounded-2xl focus:ring-2 focus:ring-brand-blue outline-none transition-all font-medium"
                        placeholder="Nome da empresa"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Cargo</label>
                      <input 
                        type="text" value={exp.role}
                        onChange={(e) => updateExperience(exp.id, 'role', e.target.value)}
                        className="w-full p-4 bg-white border border-slate-100 rounded-2xl focus:ring-2 focus:ring-brand-blue outline-none transition-all font-medium"
                        placeholder="Seu cargo"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Nível</label>
                      <select 
                        value={exp.level}
                        onChange={(e) => updateExperience(exp.id, 'level', e.target.value as any)}
                        className="w-full p-4 bg-white border border-slate-100 rounded-2xl focus:ring-2 focus:ring-brand-blue outline-none transition-all font-bold text-slate-600 appearance-none"
                      >
                        <option value="iniciante">Iniciante / Junior</option>
                        <option value="intermediario">Intermediário / Pleno</option>
                        <option value="experiente">Experiente / Sênior</option>
                      </select>
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Período</label>
                      <input 
                        type="text" value={exp.period}
                        onChange={(e) => updateExperience(exp.id, 'period', e.target.value)}
                        className="w-full p-4 bg-white border border-slate-100 rounded-2xl focus:ring-2 focus:ring-brand-blue outline-none transition-all font-medium"
                        placeholder="Ex: Jan 2020 - Dez 2022"
                      />
                    </div>
                    <div className="space-y-2 col-span-2">
                      <div className="flex justify-between items-center mb-2">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Descrição</label>
                        <button 
                          onClick={() => handleImproveWithAI(exp.id)}
                          disabled={refiningId === exp.id || !exp.description || exp.description.length < 5}
                          className="flex items-center bg-indigo-50 text-indigo-600 px-4 py-2 rounded-xl font-black text-[10px] uppercase tracking-widest hover:bg-indigo-100 transition-all disabled:opacity-50"
                        >
                          {refiningId === exp.id ? <Loader2 className="h-3 w-3 animate-spin mr-2" /> : <Sparkles className="h-3 w-3 mr-2" />}
                          Melhorar com IA
                        </button>
                      </div>
                      <textarea 
                        value={exp.description}
                        onChange={(e) => updateExperience(exp.id, 'description', e.target.value)}
                        className="w-full p-5 bg-white border border-slate-100 rounded-[2rem] focus:ring-2 focus:ring-brand-blue outline-none transition-all font-medium h-40 resize-none"
                        placeholder="Descreva suas responsabilidades e conquistas..."
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );
      case 3:
        return (
          <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-black text-brand-dark tracking-tight">Formação Acadêmica</h2>
              <button onClick={addEducation} className="flex items-center bg-blue-50 text-brand-blue px-4 py-2 rounded-xl font-black text-[10px] uppercase tracking-widest hover:bg-blue-100 transition-all">
                <Plus className="mr-2 h-4 w-4" /> ADICIONAR
              </button>
            </div>
            <div className="space-y-6">
              {formData.education.map((edu) => (
                <div key={edu.id} className="p-8 border border-slate-100 rounded-[2.5rem] relative bg-slate-50/30">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Curso</label>
                      <input 
                        type="text" value={edu.course}
                        onChange={(e) => updateEducation(edu.id, 'course', e.target.value)}
                        className="w-full p-4 bg-white border border-slate-100 rounded-2xl focus:ring-2 focus:ring-brand-blue outline-none transition-all font-medium"
                        placeholder="Ex: Graduação em Administração"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Instituição</label>
                      <input 
                        type="text" value={edu.institution}
                        onChange={(e) => updateEducation(edu.id, 'institution', e.target.value)}
                        className="w-full p-4 bg-white border border-slate-100 rounded-2xl focus:ring-2 focus:ring-brand-blue outline-none transition-all font-medium"
                        placeholder="Nome da faculdade/escola"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Ano de Conclusão</label>
                      <input 
                        type="text" value={edu.year}
                        onChange={(e) => updateEducation(edu.id, 'year', e.target.value)}
                        className="w-full p-4 bg-white border border-slate-100 rounded-2xl focus:ring-2 focus:ring-brand-blue outline-none transition-all font-medium"
                        placeholder="Ex: 2023"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );
      case 4:
        return (
          <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <h2 className="text-2xl font-black text-brand-dark tracking-tight">Especialidades & Skills</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {formData.skills.map((skill, index) => (
                <div key={index} className="relative group">
                  <input 
                    type="text" value={skill}
                    onChange={(e) => updateSkill(index, e.target.value)}
                    className="w-full p-4 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-2 focus:ring-brand-blue outline-none transition-all font-bold text-slate-600 uppercase text-[10px] tracking-widest"
                    placeholder="Ex: JAVASCRIPT"
                  />
                </div>
              ))}
              <button 
                onClick={addSkill} 
                className="p-4 border-2 border-dashed border-slate-200 rounded-2xl text-[10px] font-black text-slate-400 uppercase tracking-widest hover:border-brand-blue hover:text-brand-blue transition-all"
              >
                + Adicionar Skill
              </button>
            </div>
            
            <div className="mt-16 p-10 bg-[#0F172A] rounded-[3rem] text-white shadow-2xl relative overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-brand-blue/20 rounded-full blur-[80px] -mr-32 -mt-32"></div>
                <div className="relative z-10">
                  <div className="flex items-center space-x-4 mb-6">
                      <div className="bg-brand-blue p-3 rounded-2xl">
                        <Zap className="h-6 w-6 text-white fill-white" />
                      </div>
                      <h3 className="text-2xl font-black tracking-tight">Revisão Estratégica IA</h3>
                  </div>
                  <p className="mb-10 text-slate-400 font-medium leading-relaxed max-w-xl">
                    Nossa inteligência agora fará o polimento final de todo o conteúdo, ajustando a semântica para os padrões executivos de 2026.
                  </p>
                  <button 
                      onClick={handleSubmit}
                      disabled={loading}
                      className="w-full py-6 bg-brand-blue text-white font-black rounded-2xl shadow-xl shadow-blue-500/20 hover:bg-blue-600 transition-all flex items-center justify-center disabled:opacity-70 group"
                  >
                      {loading ? (
                          <><Loader2 className="animate-spin mr-3 h-6 w-6" /> PROCESSANDO DADOS...</>
                      ) : (
                          <><Sparkles className="mr-3 h-6 w-6 fill-white group-hover:scale-110 transition-transform" /> FINALIZAR E OTIMIZAR AGORA</>
                      )}
                  </button>
                </div>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-16 selection:bg-brand-blue selection:text-white">
      {/* Progress Stepper */}
      <div className="mb-16">
        <div className="flex justify-between items-center mb-6 px-4">
          {[1, 2, 3, 4].map((s) => (
            <div key={s} className="flex flex-col items-center">
              <div className={`w-12 h-12 rounded-[1.25rem] flex items-center justify-center font-black transition-all duration-500 ${step >= s ? 'bg-brand-blue text-white shadow-xl shadow-blue-500/20 scale-110' : 'bg-slate-200 text-slate-400 opacity-60'}`}>
                {s}
              </div>
              <span className={`text-[10px] uppercase tracking-[0.2em] mt-4 font-black transition-colors ${step >= s ? 'text-brand-blue' : 'text-slate-400'}`}>
                {s === 1 ? 'BIO' : s === 2 ? 'CARREIRA' : s === 3 ? 'ACADÊMICO' : 'IA-FINISH'}
              </span>
            </div>
          ))}
        </div>
        <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
          <div 
            className="bg-brand-blue h-full transition-all duration-700 ease-out shadow-[0_0_15px_rgba(37,99,235,0.4)]" 
            style={{ width: `${(step / 4) * 100}%` }}
          ></div>
        </div>
      </div>

      <div className="bg-white rounded-[3.5rem] p-10 md:p-16 border border-slate-200 shadow-sm min-h-[600px] flex flex-col justify-between">
        <div className="flex-grow">
            {renderStep()}
        </div>

        {step < 4 && (
          <div className="flex justify-between mt-16 pt-10 border-t border-slate-100">
            <button 
              onClick={prevStep}
              disabled={step === 1}
              className="flex items-center px-8 py-3 text-slate-400 font-black uppercase tracking-widest hover:text-brand-dark disabled:opacity-20 transition-all"
            >
              <ChevronLeft className="mr-2 h-5 w-5" /> ANTERIOR
            </button>
            <button 
              onClick={nextStep}
              className="flex items-center px-12 py-5 bg-brand-dark text-white rounded-[1.5rem] font-black uppercase tracking-[0.15em] text-xs shadow-xl hover:bg-slate-800 hover:-translate-y-1 active:translate-y-0 transition-all"
            >
              PRÓXIMA ETAPA <ChevronRight className="ml-2 h-5 w-5" />
            </button>
          </div>
        )}
      </div>

      {showCropper && tempImage && (
        <PhotoCropModal 
          imageSrc={tempImage}
          onCrop={handleCropComplete}
          onClose={() => setShowCropper(false)}
          onRemove={() => {
            updatePersonalInfo('photoDataUrl', '');
            setShowCropper(false);
          }}
          initialShape={formData.personalInfo.photoShape}
        />
      )}
    </div>
  );
};

export default CreateResume;
