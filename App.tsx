
import React, { useState, useMemo, useEffect } from 'react';
import { GoogleGenAI } from "@google/genai";
import { modules } from './data/modules';
import { ModuleDetail, SurveyResponse } from './types';

// URL da nova implantação do Google Apps Script
const GOOGLE_SHEETS_WEBAPP_URL = 'https://script.google.com/macros/s/AKfycbzAYUV1Twj22IIQkL1cYoW7XFdvOGFGUftXBkUd1q62dmX8YMD0mJTGDQXBl6bWdg8j/exec';

// Componentes Auxiliares de Estilo
const Badge = ({ children, color = 'blue' }: { children?: React.ReactNode, color?: string }) => {
  const colors: Record<string, string> = {
    blue: 'bg-blue-50 text-blue-600 border-blue-100',
    purple: 'bg-purple-50 text-purple-600 border-purple-100',
    green: 'bg-green-50 text-green-600 border-green-100',
    orange: 'bg-orange-50 text-orange-600 border-orange-100',
    slate: 'bg-slate-100 text-slate-600 border-slate-200'
  };
  return (
    <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest border ${colors[color] || colors.blue}`}>
      {children}
    </span>
  );
};

const Navbar = ({ onNavigate }: { onNavigate: (id: string) => void }) => (
  <nav className="fixed top-0 w-full z-[60] px-6 py-4">
    <div className="max-w-7xl mx-auto flex justify-between items-center glass-card rounded-2xl px-6 py-3 shadow-lg shadow-indigo-950/5">
      <div className="flex items-center gap-3 cursor-pointer" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
        <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center text-white shadow-indigo-500/20 shadow-xl">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z"/></svg>
        </div>
        <span className="text-xl font-extrabold text-slate-900 tracking-tight">nuvem cultural</span>
      </div>
      <div className="hidden md:flex gap-8 items-center">
        <button onClick={() => onNavigate('foco')} className="text-sm font-semibold text-slate-600 hover:text-indigo-600 transition-colors">Público-Alvo</button>
        <button onClick={() => onNavigate('modulos')} className="text-sm font-semibold text-slate-600 hover:text-indigo-600 transition-colors">Módulos</button>
        <button onClick={() => onNavigate('didatico')} className="text-sm font-semibold text-slate-600 hover:text-indigo-600 transition-colors">Educação</button>
        <button onClick={() => onNavigate('idealizador')} className="text-sm font-semibold text-slate-600 hover:text-indigo-600 transition-colors">O Idealizador</button>
        <button onClick={() => onNavigate('pesquisa')} className="px-5 py-2.5 bg-indigo-600 text-white rounded-xl text-sm font-bold hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-600/20 active:scale-95">Pesquisa</button>
      </div>
    </div>
  </nav>
);

const ModuleCard: React.FC<{ module: ModuleDetail; onClick: (m: ModuleDetail) => void }> = ({ module, onClick }) => {
  const categoryColors: Record<string, string> = {
    'Gestão': 'blue',
    'Social': 'purple',
    'Financeiro': 'green',
    'Inovação': 'orange'
  };

  return (
    <div 
      onClick={() => onClick(module)}
      className="group relative bg-white p-6 rounded-[2rem] border border-slate-100 hover:border-indigo-200 hover:shadow-2xl hover:shadow-indigo-500/10 transition-all duration-500 cursor-pointer flex flex-col h-full overflow-hidden animate-in fade-in slide-in-from-bottom-4"
    >
      <div className="absolute top-0 right-0 w-24 h-24 bg-slate-50 rounded-bl-[3rem] transition-transform group-hover:scale-110 duration-500 -z-0 opacity-50" />
      
      <div className="relative z-10">
        <div className="w-12 h-12 bg-slate-50 rounded-xl flex items-center justify-center text-2xl mb-4 group-hover:bg-indigo-50 transition-colors duration-500">
          {module.icon}
        </div>
        <Badge color={categoryColors[module.category]}>{module.category}</Badge>
        <h3 className="text-lg font-extrabold text-slate-900 mt-3 mb-2 group-hover:text-indigo-600 transition-colors leading-tight">{module.title}</h3>
        <p className="text-slate-500 text-[13px] leading-relaxed line-clamp-2">{module.description}</p>
      </div>

      <div className="mt-auto pt-4 border-t border-slate-50 flex items-center justify-between text-indigo-600">
        <span className="text-[10px] font-bold uppercase tracking-wider group-hover:translate-x-1 transition-transform inline-flex items-center gap-1">
          Ver detalhes
          <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M17 8l4 4m0 0l-4 4m4-4H3"/></svg>
        </span>
      </div>
    </div>
  );
};

const VisionGenerator = () => {
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const generateVision = async () => {
    setLoading(true);
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash-image',
        contents: {
          parts: [{
            text: "A highly artistic and modern digital painting of a 'Cultural Cloud'. Abstract cloud composed of musical instruments, theatre masks, and floating books connected by glowing digital lines. Vibrant colors, blue and purple palette, professional lighting, cinematic 16:9 aspect ratio."
          }]
        },
        config: {
          imageConfig: { aspectRatio: "16:9" }
        }
      });

      if (response.candidates?.[0]?.content?.parts) {
        for (const part of response.candidates[0].content.parts) {
          if (part.inlineData) {
            setImageUrl(`data:image/png;base64,${part.inlineData.data}`);
          }
        }
      }
    } catch (error) {
      console.error("Erro ao gerar imagem:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    generateVision();
  }, []);

  return (
    <div className="relative w-full aspect-video rounded-[3rem] overflow-hidden bg-slate-900 border border-white/10 shadow-2xl group">
      {loading ? (
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-4">
          <div className="w-12 h-12 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin" />
          <p className="text-indigo-300 font-bold text-xs uppercase tracking-widest animate-pulse">Gerando Visão Artística...</p>
        </div>
      ) : imageUrl ? (
        <>
          <img src={imageUrl} alt="Visão Nuvem Cultural" className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105" />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent opacity-60" />
          <div className="absolute bottom-10 left-10 right-10 flex justify-between items-end">
            <div>
              <Badge color="purple">IA Generativa</Badge>
              <h3 className="text-2xl font-black text-white mt-2">Visão da Nuvem</h3>
              <p className="text-slate-300 text-sm max-w-sm">Esta imagem foi criada por nossa IA para representar o encontro entre tecnologia e cultura.</p>
            </div>
            <button 
              onClick={generateVision}
              className="px-6 py-3 bg-white/10 backdrop-blur-md border border-white/20 text-white rounded-xl font-bold text-xs hover:bg-white/20 transition-all active:scale-95"
            >
              Regerar Obra
            </button>
          </div>
        </>
      ) : (
        <div className="absolute inset-0 flex items-center justify-center">
           <button onClick={generateVision} className="text-indigo-400 font-bold">Tentar gerar visão novamente</button>
        </div>
      )}
    </div>
  );
};

const ModuleModal = ({ module, onClose }: { module: ModuleDetail; onClose: () => void }) => {
  const categoryColors: Record<string, string> = {
    'Gestão': 'blue',
    'Social': 'purple',
    'Financeiro': 'green',
    'Inovação': 'orange'
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-6 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-300">
      <div 
        className="relative bg-white w-full max-w-2xl rounded-[3rem] overflow-hidden shadow-2xl animate-in zoom-in-95 duration-300 flex flex-col max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        <button 
          onClick={onClose}
          className="absolute top-8 right-8 w-10 h-10 bg-slate-50 rounded-full flex items-center justify-center text-slate-400 hover:text-slate-900 hover:bg-slate-100 transition-all z-10"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M6 18L18 6M6 6l12 12"/></svg>
        </button>

        <div className="p-8 md:p-12 overflow-y-auto">
          <div className="flex items-center gap-6 mb-8 text-left">
            <div className="w-20 h-20 bg-slate-50 rounded-3xl flex items-center justify-center text-4xl shadow-inner shrink-0">
              {module.icon}
            </div>
            <div>
              <Badge color={categoryColors[module.category]}>{module.category}</Badge>
              <h2 className="text-3xl font-black text-slate-900 mt-2 tracking-tight">{module.title}</h2>
            </div>
          </div>

          <div className="mb-10 text-left">
             <div className="inline-flex items-center gap-2 px-3 py-1 bg-indigo-50 rounded-lg mb-4">
                <span className="text-indigo-600">💡</span>
                <span className="text-[11px] font-bold text-indigo-700 uppercase tracking-wider">Dica Didática: Entenda o Porquê</span>
             </div>
             <p className="text-slate-500 text-lg leading-relaxed font-medium italic">
                Cada funcionalidade abaixo foi desenhada não apenas para "fazer", mas para ensinar a lógica da governança cultural.
             </p>
          </div>

          <p className="text-slate-500 text-lg leading-relaxed mb-10 font-medium text-left">
            {module.description}
          </p>

          <div className="grid md:grid-cols-2 gap-10 text-left">
            <div>
              <h4 className="text-[10px] font-black uppercase tracking-widest text-indigo-600 mb-4 flex items-center gap-2">
                <span className="w-4 h-0.5 bg-indigo-600 rounded-full" />
                Funcionalidades
              </h4>
              <ul className="space-y-3">
                {module.features.map((feature, i) => (
                  <li key={i} className="flex items-center gap-3 text-sm font-bold text-slate-700">
                    <span className="w-1.5 h-1.5 rounded-full bg-indigo-200" />
                    {feature}
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h4 className="text-[10px] font-black uppercase tracking-widest text-green-600 mb-4 flex items-center gap-2">
                <span className="w-4 h-0.5 bg-green-600 rounded-full" />
                Benefícios Esperados
              </h4>
              <ul className="space-y-3">
                {module.benefits.map((benefit, i) => (
                  <li key={i} className="flex items-center gap-3 text-sm font-bold text-slate-700">
                    <span className="w-1.5 h-1.5 rounded-full bg-green-200" />
                    {benefit}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        <div className="p-8 bg-slate-50 flex justify-end">
          <button 
            onClick={onClose}
            className="px-8 py-4 bg-slate-900 text-white rounded-2xl font-bold text-sm hover:bg-slate-800 transition-all active:scale-95 shadow-xl shadow-slate-900/10"
          >
            Fechar Detalhes
          </button>
        </div>
      </div>
      <div className="absolute inset-0 -z-10" onClick={onClose} />
    </div>
  );
};

const App: React.FC = () => {
  const [selectedModule, setSelectedModule] = useState<ModuleDetail | null>(null);
  const [activeFilter, setActiveFilter] = useState<string>('Tudo');
  const [searchTerm, setSearchTerm] = useState('');
  const [surveyData, setSurveyData] = useState<SurveyResponse>({
    usageLikelihood: 3,
    valuableModules: [],
    feedback: ""
  });
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [userIp, setUserIp] = useState<string>('0.0.0.0');

  // Função centralizada para enviar dados para o Sheet
  const sendToSheet = async (payload: any) => {
    try {
      await fetch(GOOGLE_SHEETS_WEBAPP_URL, {
        method: 'POST',
        mode: 'no-cors',
        headers: { 'Content-Type': 'text/plain' },
        body: JSON.stringify(payload)
      });
    } catch (e) {
      console.error("Erro ao enviar dados para a planilha:", e);
    }
  };

  // Registro de Acesso Silencioso
  useEffect(() => {
    const trackAccess = async () => {
      try {
        const ipResponse = await fetch('https://api.ipify.org?format=json');
        const { ip } = await ipResponse.json();
        setUserIp(ip);

        await sendToSheet({
          type: 'VISITA',
          ip: ip,
          timestamp: new Date().toLocaleString('pt-BR'),
          userAgent: navigator.userAgent
        });
      } catch (error) {
        console.debug('Rastreador de acesso em execução...');
      }
    };

    trackAccess();
  }, []);

  const categories = ['Tudo', 'Gestão', 'Social', 'Financeiro', 'Inovação'];

  const filteredModules = useMemo(() => {
    return modules.filter(m => {
      const matchesFilter = activeFilter === 'Tudo' || m.category === activeFilter;
      const matchesSearch = m.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          m.description.toLowerCase().includes(searchTerm.toLowerCase());
      return matchesFilter && matchesSearch;
    });
  }, [activeFilter, searchTerm]);

  const toggleValuableModule = (id: string) => {
    setSurveyData(prev => ({
      ...prev,
      valuableModules: prev.valuableModules.includes(id) 
        ? prev.valuableModules.filter(m => m !== id)
        : [...prev.valuableModules, id]
    }));
  };

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Envia os dados da pesquisa para a planilha
    await sendToSheet({
      type: 'PESQUISA',
      ip: userIp,
      timestamp: new Date().toLocaleString('pt-BR'),
      userAgent: navigator.userAgent,
      survey: {
        likelihood: surveyData.usageLikelihood,
        modules: surveyData.valuableModules.join(', '),
        feedback: surveyData.feedback
      }
    });

    setIsSubmitted(true);
    scrollToSection('pesquisa');
  };

  return (
    <div className="min-h-screen bg-slate-50 overflow-x-hidden text-left">
      <Navbar onNavigate={scrollToSection} />

      {/* Hero Section */}
      <section className="relative pt-32 pb-24 lg:pt-48 lg:pb-56 overflow-hidden bg-mesh">
        <div className="absolute inset-0 z-0">
          <img 
            src="https://images.unsplash.com/photo-1524758631624-e2822e304c36?auto=format&fit=crop&q=80&w=2070" 
            className="w-full h-full object-cover opacity-20 mix-blend-overlay"
            alt="Background"
          />
        </div>
        <div className="max-w-7xl mx-auto px-6 relative z-10 text-center">
          <div className="flex flex-col items-center gap-4 mb-10">
            <div className="inline-flex items-center gap-3 bg-white/10 backdrop-blur-md border border-white/20 px-5 py-2 rounded-full animate-float">
              <span className="flex h-2 w-2 rounded-full bg-sky-400 animate-ping" />
              <span className="text-white text-[11px] font-bold uppercase tracking-[0.2em]">Projeto Didático em Incubação</span>
            </div>
            <div className="flex gap-3">
              <Badge color="orange">Modelo Social Sustentável</Badge>
              <Badge color="blue">Foco: Educação & Cultura</Badge>
            </div>
          </div>
          
          <h1 className="text-5xl lg:text-8xl font-black text-white mb-10 tracking-tight leading-[1.05]">
            Nuvem Cultural: <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-sky-400 via-indigo-400 to-purple-400">Ferramentas + Saber.</span>
          </h1>
          
          <p className="max-w-3xl mx-auto text-xl text-slate-400 mb-14 leading-relaxed font-medium">
            Um ecossistema tecnológico e didático que ensina o <strong>porquê</strong> de cada processo na gestão cultural.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
            <button 
              onClick={() => scrollToSection('modulos')}
              className="group px-10 py-5 bg-indigo-600 text-white rounded-2xl font-bold text-lg hover:bg-indigo-500 transition-all shadow-2xl shadow-indigo-600/30 active:scale-95 flex items-center gap-3"
            >
              Conhecer Ecossistema
              <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M14 5l7 7m0 0l-7 7m7-7H3"/></svg>
            </button>
            <button 
              onClick={() => scrollToSection('didatico')}
              className="px-10 py-5 bg-white/5 border border-white/10 backdrop-blur-sm text-white rounded-2xl font-bold text-lg hover:bg-white/10 transition-all active:scale-95"
            >
              Biblioteca Didática
            </button>
          </div>
        </div>

        <div className="absolute top-1/4 -left-20 w-80 h-80 bg-indigo-600/20 rounded-full blur-[120px] pointer-events-none" />
        <div className="absolute bottom-1/4 -right-20 w-80 h-80 bg-sky-600/20 rounded-full blur-[120px] pointer-events-none" />
      </section>

      {/* Dados do Setor Section */}
      <section className="py-20 bg-white border-y border-slate-100 relative z-20">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="text-left">
              <Badge color="blue">Panorama da Economia Criativa</Badge>
              <h2 className="text-4xl lg:text-5xl font-black text-slate-900 mt-6 mb-6 tracking-tight leading-tight">Um ecossistema em busca de profissionalização.</h2>
              <p className="text-slate-500 text-lg font-medium leading-relaxed italic">
                Apesar da complexidade em obter dados absolutos, as estatísticas oficiais revelam a magnitude e a necessidade de infraestrutura para o setor.
              </p>
            </div>
            <div className="grid sm:grid-cols-2 gap-6">
              <div className="p-8 bg-indigo-50 rounded-[2.5rem] border border-indigo-100 shadow-xl shadow-indigo-900/5 hover:-translate-y-1 transition-all duration-300">
                <div className="text-4xl lg:text-5xl font-black text-indigo-600 mb-2">+35k</div>
                <h4 className="text-sm font-black text-indigo-950 uppercase tracking-widest mb-4">OSCs de Arte e Cultura</h4>
                <p className="text-indigo-900/60 text-xs leading-relaxed font-medium">Dentro de um universo de mais de 600 mil OSCs no Brasil.</p>
                <div className="mt-4 pt-4 border-t border-indigo-200/50">
                  <span className="text-[10px] font-bold text-indigo-400">Fonte: Mapa das OSCs (Gov Federal)</span>
                </div>
              </div>
              <div className="p-8 bg-sky-50 rounded-[2.5rem] border border-sky-100 shadow-xl shadow-sky-900/5 hover:-translate-y-1 transition-all duration-300">
                <div className="text-4xl lg:text-5xl font-black text-sky-600 mb-2">+190k</div>
                <h4 className="text-sm font-black text-sky-950 uppercase tracking-widest mb-4">Agentes Culturais</h4>
                <p className="text-sky-900/60 text-xs leading-relaxed font-medium">Sendo 150k+ agentes individuais e 36k+ agentes coletivos cadastrados.</p>
                <div className="mt-4 pt-4 border-t border-sky-200/50">
                  <span className="text-[10px] font-bold text-sky-400">Fonte: Mapa da Cultura (Gov Federal)</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Dimensão Didática Section */}
      <section id="didatico" className="py-32 bg-slate-50 relative z-20 scroll-mt-28">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-20 items-center">
            <div className="text-left">
              <Badge color="purple">Didática & Mentoria</Badge>
              <h2 className="text-4xl lg:text-6xl font-black text-slate-900 mt-6 mb-8 tracking-tight">Mais que fazer, <br/> entender.</h2>
              <p className="text-slate-500 text-xl font-medium mb-10 leading-relaxed">
                A Nuvem Cultural acredita que a tecnologia só é poderosa quando aliada ao <strong>conhecimento estratégico</strong>. Por isso, nosso sistema não é apenas operacional; ele é educacional.
              </p>
              
              <div className="space-y-6">
                <div className="flex gap-5 p-6 bg-white rounded-3xl border border-slate-100 hover:border-indigo-200 transition-all group">
                   <div className="w-14 h-14 bg-red-50 text-red-500 rounded-2xl flex items-center justify-center text-3xl shrink-0 group-hover:scale-110 transition-transform">📺</div>
                   <div>
                      <h4 className="text-xl font-black text-slate-900 mb-2">Biblioteca de Vídeos (YouTube)</h4>
                      <p className="text-slate-500 text-sm font-medium leading-relaxed">Acesso gratuito a orientações de especialistas em contabilidade, direito e produção para funcionários de OSCs.</p>
                   </div>
                </div>
                <div className="flex gap-5 p-6 bg-white rounded-3xl border border-slate-100 hover:border-indigo-200 transition-all group">
                   <div className="w-14 h-14 bg-indigo-50 text-indigo-500 rounded-2xl flex items-center justify-center text-3xl shrink-0 group-hover:scale-110 transition-transform">💡</div>
                   <div>
                      <h4 className="text-xl font-black text-slate-900 mb-2">Dicas Contextuais</h4>
                      <p className="text-slate-500 text-sm font-medium leading-relaxed">Cada campo e módulo do sistema conta com notas explicativas sobre o "porquê" jurídico e social daquela tarefa.</p>
                   </div>
                </div>
                <div className="flex gap-5 p-6 bg-white rounded-3xl border border-slate-100 hover:border-indigo-200 transition-all group">
                   <div className="w-14 h-14 bg-green-50 text-green-500 rounded-2xl flex items-center justify-center text-3xl shrink-0 group-hover:scale-110 transition-transform">🌱</div>
                   <div>
                      <h4 className="text-xl font-black text-slate-900 mb-2">Cuidado Integral</h4>
                      <p className="text-slate-500 text-sm font-medium leading-relaxed">Conteúdos sobre acessibilidade, equidade, combate à sobrecarga e burnout no setor cultural.</p>
                   </div>
                </div>
              </div>
            </div>

            <div className="relative">
               <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-4 text-left">
                     <div className="bg-indigo-600 p-8 rounded-[2.5rem] text-white shadow-xl shadow-indigo-600/20">
                        <span className="text-[10px] font-black uppercase tracking-widest opacity-60">Trilhas de Aprendizado</span>
                        <h5 className="text-xl font-black mt-2 leading-tight">Como captar recursos?</h5>
                     </div>
                     <div className="bg-slate-900 p-8 rounded-[2.5rem] text-white shadow-xl">
                        <span className="text-[10px] font-black uppercase tracking-widest opacity-60">Especialistas</span>
                        <h5 className="text-xl font-black mt-2 leading-tight">Neurodivergência & Acessibilidade</h5>
                     </div>
                  </div>
                  <div className="space-y-4 pt-12 text-left">
                     <div className="bg-sky-500 p-8 rounded-[2.5rem] text-white shadow-xl shadow-sky-600/20">
                        <span className="text-[10px] font-black uppercase tracking-widest opacity-60">Documentação</span>
                        <h5 className="text-xl font-black mt-2 leading-tight">Estatutos & Atas: O Guia</h5>
                     </div>
                     <div className="bg-purple-600 p-8 rounded-[2.5rem] text-white shadow-xl shadow-purple-600/20">
                        <span className="text-[10px] font-black uppercase tracking-widest opacity-60">Comunicação</span>
                        <h5 className="text-xl font-black mt-2 leading-tight">Portfólio Institucional</h5>
                     </div>
                  </div>
               </div>
               <div className="absolute -z-10 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-indigo-200/40 rounded-full blur-[100px]" />
            </div>
          </div>
        </div>
      </section>

      {/* Público-Alvo Section */}
      <section id="foco" className="py-32 bg-white relative z-20 scroll-mt-28 text-left">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <Badge color="blue">Público-Alvo e Missão</Badge>
            <h2 className="text-4xl lg:text-6xl font-black text-slate-900 mt-6 tracking-tight">Onde a tecnologia serve à arte.</h2>
          </div>
          <div className="grid lg:grid-cols-3 gap-10">
            <div className="group overflow-hidden bg-indigo-50 rounded-[3rem] border border-indigo-100 flex flex-col h-full shadow-lg shadow-indigo-900/5 transition-all hover:shadow-2xl">
              <div className="h-48 overflow-hidden relative">
                <img src="https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&q=80&w=1000" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" alt="OSCs" />
                <div className="absolute inset-0 bg-indigo-600/20 mix-blend-multiply" />
              </div>
              <div className="p-10">
                <span className="text-4xl mb-4 block">🏛️</span>
                <h3 className="text-2xl font-black text-indigo-950 mb-4">Foco: OSCs Culturais</h3>
                <p className="text-indigo-900/70 font-medium leading-relaxed">
                  Modelado especificamente para as complexidades das mais de 35 mil Organizações da Sociedade Civil de Arte e Cultura brasileiras.
                </p>
              </div>
            </div>
            
            <div className="group overflow-hidden bg-slate-50 rounded-[3rem] border border-slate-100 flex flex-col h-full hover:border-indigo-200 transition-all shadow-lg hover:shadow-2xl">
              <div className="h-48 overflow-hidden relative">
                <img src="https://images.unsplash.com/photo-1460661419201-fd4cecdf8a8b?auto=format&fit=crop&q=80&w=1000" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" alt="Agents" />
                <div className="absolute inset-0 bg-slate-600/20 mix-blend-multiply" />
              </div>
              <div className="p-10">
                <span className="text-4xl mb-4 block">🎭</span>
                <h3 className="text-2xl font-black text-slate-900 mb-4">Agentes Individuais</h3>
                <p className="text-slate-500 font-medium leading-relaxed">
                  Para os 150k+ trabalhadores da cultura que buscam ferramentas para gerir seu portfólio de atividades e prestação de contas.
                </p>
              </div>
            </div>

            <div className="group overflow-hidden bg-slate-50 rounded-[3rem] border border-slate-100 flex flex-col h-full hover:border-indigo-200 transition-all shadow-lg hover:shadow-2xl">
              <div className="h-48 overflow-hidden relative">
                <img src="https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&q=80&w=1000" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" alt="Others" />
                <div className="absolute inset-0 bg-slate-600/20 mix-blend-multiply" />
              </div>
              <div className="p-10">
                <span className="text-4xl mb-4 block">🌐</span>
                <h3 className="text-2xl font-black text-slate-900 mb-4">Agentes Coletivos</h3>
                <p className="text-slate-500 font-medium leading-relaxed">
                  Apoio aos 36k+ grupos e coletivos que movimentam a economia criativa local em cada canto do país.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Galeria de Visão Artificial */}
      <section className="py-20 bg-white text-left">
        <div className="max-w-7xl mx-auto px-6">
          <div className="mb-12 text-center md:text-left">
            <Badge color="purple">Tecnologia em Ação</Badge>
            <h2 className="text-4xl font-black text-slate-900 mt-4 tracking-tight">Visualize o Futuro da Gestão.</h2>
          </div>
          <VisionGenerator />
        </div>
      </section>

      {/* Sustentabilidade Section */}
      <section id="sustentabilidade" className="py-32 bg-slate-900 text-white relative overflow-hidden scroll-mt-28">
        <div className="max-w-7xl mx-auto px-6 relative z-10 text-center md:text-left">
          <div className="text-center mb-16">
            <Badge color="orange">Modelo de Sustentabilidade</Badge>
            <h2 className="text-4xl lg:text-6xl font-black mt-8 tracking-tight">Um compromisso com o impacto.</h2>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
            {[
              { title: 'Fase de Incubação', desc: 'Projeto em modelagem estratégica. Testes com OSCs parceiras para validação real.', icon: '🧪' },
              { title: 'Acessibilidade de Custos', desc: 'Valores sociais para manutenção técnica, mantendo o foco zero lucro e 100% reinvestimento.', icon: '💰' },
              { title: 'Editais de Fomento', desc: 'Busca por financiamento para democratizar o acesso e oferecer camadas gratuitas.', icon: '📑' },
              { title: 'Educação Aberta', desc: 'Nossa biblioteca de vídeos e dicas didáticas serão sempre de livre acesso.', icon: '🎓' }
            ].map((item, idx) => (
              <div key={idx} className="p-8 bg-white/5 border border-white/10 rounded-3xl hover:bg-white/10 transition-all flex flex-col h-full text-left">
                <span className="text-3xl mb-4 block">{item.icon}</span>
                <h4 className="font-bold text-lg mb-2 text-white">{item.title}</h4>
                <p className="text-slate-400 text-xs leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
          
          <div className="mt-16 p-8 bg-indigo-500/10 border border-indigo-500/20 rounded-[2rem] max-w-4xl mx-auto text-left">
            <p className="text-sm text-indigo-200 font-medium leading-relaxed italic">
              "A Nuvem Cultural nasceu para ser sustentável. Embora possa ter custos de acesso para garantir sua evolução técnica, nosso compromisso é mantê-lo acessível e reinvestir cada centavo no próprio ecossistema cultural."
            </p>
          </div>
        </div>
      </section>

      {/* Idealizador Section */}
      <section id="idealizador" className="py-32 bg-white relative z-20 overflow-hidden scroll-mt-28 text-left">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-20 items-start">
            <div className="relative">
              <div className="absolute -top-10 -left-10 w-48 h-48 bg-indigo-100 rounded-full blur-3xl opacity-60" />
              <div className="relative z-10">
                <div className="aspect-[4/5] rounded-[4rem] overflow-hidden shadow-2xl border-8 border-white group relative">
                   <img 
                    src="https://images.unsplash.com/photo-1507676184212-d03ab07a01bf?auto=format&fit=crop&q=80&w=1000" 
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000" 
                    alt="Guilherme Rezende Concept" 
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-indigo-900/80 to-transparent flex items-end p-12 text-left">
                    <div>
                      <h3 className="text-3xl font-black text-white">Guilherme Rezende</h3>
                      <p className="text-indigo-200 font-bold text-sm mt-2">Músico, Gestor & Desenvolvedor</p>
                    </div>
                  </div>
                </div>
                
                <div className="flex gap-4 mt-8">
                  <a href="https://linkedin.com/in/guilherme-rezende" target="_blank" rel="noopener noreferrer" className="flex-1 py-5 bg-[#0077b5] text-white rounded-[1.5rem] font-bold text-xs flex items-center justify-center gap-2 hover:opacity-90 transition-all active:scale-95 shadow-lg shadow-[#0077b5]/20">
                    LinkedIn
                  </a>
                  <a href="https://instagram.com/guilherme-rezende" target="_blank" rel="noopener noreferrer" className="flex-1 py-5 bg-gradient-to-tr from-[#f09433] via-[#dc2743] to-[#bc1888] text-white rounded-[1.5rem] font-bold text-xs flex items-center justify-center gap-2 hover:opacity-90 transition-all active:scale-95 shadow-lg shadow-pink-500/20">
                    Instagram
                  </a>
                </div>
              </div>
            </div>

            <div className="text-left">
              <Badge color="purple">Trajetória Multidisciplinar</Badge>
              <h2 className="text-4xl lg:text-6xl font-black text-slate-900 mt-6 mb-8 tracking-tight leading-tight">Experiência Real <br/> em Cada Módulo.</h2>
              <p className="text-slate-500 text-xl font-medium mb-10 leading-relaxed italic">
                A Nuvem Cultural não é teórica. É o resultado de <strong>uma década vivida intensamente</strong> dentro de uma OSC Cultural, ocupando do operacional ao estratégico.
              </p>
              
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-12">
                {[
                  { icon: '📚', text: 'Auxiliar de Biblioteca' },
                  { icon: '🔊', text: 'Técnico de Som / Shows' },
                  { icon: '🎬', text: 'Produtor Cinema Ar Livre' },
                  { icon: '✍️', text: 'Escrita de Projetos' },
                  { icon: '🎨', text: 'Designer Gráfico' },
                  { icon: '📈', text: 'Análise de Dados' },
                  { icon: '⚙️', text: 'Melhoria de Processos' },
                  { icon: '🏦', text: 'Tesouraria' },
                  { icon: '💾', text: 'Gestor de TI' }
                ].map((item, idx) => (
                  <div key={idx} className="flex flex-col items-center p-4 bg-white rounded-2xl border border-slate-100 text-center hover:shadow-lg hover:border-indigo-100 transition-all group">
                    <span className="text-2xl mb-2 group-hover:scale-110 transition-transform">{item.icon}</span>
                    <span className="text-[9px] font-black uppercase tracking-widest text-slate-500 leading-tight">{item.text}</span>
                  </div>
                ))}
              </div>

              <div className="p-8 bg-indigo-950 text-white rounded-[3rem] shadow-xl relative overflow-hidden text-left">
                <div className="absolute -top-10 -right-10 w-32 h-32 bg-indigo-500/20 blur-3xl rounded-full" />
                <p className="text-lg italic font-medium relative z-10 leading-relaxed">
                  "Eu vivi o gargalo de cada módulo deste sistema. Da montagem do som à prestação de contas do tesoureiro, vi que a tecnologia é a única ferramenta capaz de libertar o potencial criativo do agente cultural."
                </p>
                <div className="mt-6 flex items-center gap-4 relative z-10">
                  <div className="w-12 h-1 bg-sky-400 rounded-full" />
                  <span className="font-bold text-sky-400 uppercase tracking-widest text-[10px]">A Visão do Idealizador</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Modules Explorer */}
      <section id="modulos" className="py-32 bg-slate-50 relative overflow-hidden scroll-mt-28 text-left">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-20">
            <Badge color="blue">Arquitetura de Gestão</Badge>
            <h2 className="text-4xl lg:text-6xl font-black text-slate-900 mt-6 tracking-tight mb-8">Soluções Granulares.</h2>
            
            <div className="max-w-4xl mx-auto flex flex-col md:flex-row gap-4 items-center justify-center mt-12">
              <div className="relative w-full md:w-96 text-left">
                <input 
                  type="text" 
                  placeholder="Pesquisar módulo..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full px-6 py-4 rounded-2xl border border-slate-200 focus:ring-4 focus:ring-indigo-600/10 focus:outline-none text-slate-600 font-medium shadow-sm transition-all"
                />
              </div>
              <div className="flex flex-wrap justify-center gap-2">
                {categories.map(cat => (
                  <button
                    key={cat}
                    onClick={() => setActiveFilter(cat)}
                    className={`px-5 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all border ${
                      activeFilter === cat 
                        ? 'bg-indigo-600 border-indigo-600 text-white shadow-xl shadow-indigo-600/20' 
                        : 'bg-white border-slate-200 text-slate-400 hover:border-indigo-200'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredModules.length > 0 ? (
              filteredModules.map(module => (
                <ModuleCard key={module.id} module={module} onClick={(m) => setSelectedModule(m)} />
              ))
            ) : (
              <div className="col-span-full py-24 text-center">
                <p className="text-slate-400 font-bold text-xl">Nenhum módulo encontrado.</p>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Survey Section */}
      <section id="pesquisa" className="py-32 bg-mesh relative overflow-hidden scroll-mt-28 text-left">
        <div className="max-w-4xl mx-auto px-6 relative z-10">
          <div className="glass-card rounded-[3rem] p-8 md:p-16 border-white/10 shadow-3xl text-center">
            {!isSubmitted ? (
              <>
                <div className="text-center mb-16">
                  <Badge color="orange">Co-Criação Cultural</Badge>
                  <h2 className="text-4xl font-black text-white mb-6 mt-6 tracking-tight">Ajude a moldar o futuro.</h2>
                  <p className="text-slate-400 text-lg font-medium">Sua experiência prática ajudará a priorizar o desenvolvimento do sistema.</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-16 text-left">
                  <div className="space-y-8 text-center">
                    <label className="block text-xl font-bold text-white italic opacity-80">Impacto estratégico esperado para sua OSC:</label>
                    <div className="flex justify-between items-center max-w-lg mx-auto bg-white/5 p-4 rounded-3xl border border-white/5">
                      <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest px-4">Baixo</span>
                      <div className="flex gap-2 md:gap-4">
                        {[1, 2, 3, 4, 5].map(v => (
                          <button
                            key={v}
                            type="button"
                            onClick={() => setSurveyData(prev => ({ ...prev, usageLikelihood: v }))}
                            className={`w-10 h-10 md:w-14 md:h-14 rounded-xl font-black text-lg transition-all duration-300 ${
                              surveyData.usageLikelihood === v 
                                ? 'bg-indigo-600 text-white scale-110 shadow-xl' 
                                : 'bg-white/5 text-slate-400 hover:bg-white/10'
                            }`}
                          >
                            {v}
                          </button>
                        ))}
                      </div>
                      <span className="text-[10px] font-bold text-sky-400 uppercase tracking-widest px-4">Crítico</span>
                    </div>
                  </div>

                  <div className="space-y-8 text-center">
                    <label className="block text-xl font-bold text-white italic opacity-80">Quais módulos são prioridade hoje?</label>
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 text-left">
                      {modules.slice(0, 16).map(m => (
                        <button
                          key={m.id}
                          type="button"
                          onClick={() => toggleValuableModule(m.id)}
                          className={`p-3 rounded-xl text-[9px] font-bold transition-all border duration-300 ${
                            surveyData.valuableModules.includes(m.id)
                              ? 'bg-indigo-600 border-indigo-500 text-white shadow-lg shadow-indigo-600/20'
                              : 'bg-white/5 border-white/5 text-slate-400 hover:bg-white/10'
                          }`}
                        >
                          {m.title}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-6 text-center">
                    <label className="block text-xl font-bold text-white italic opacity-80">Sugestões ou necessidades específicas?</label>
                    <textarea 
                      value={surveyData.feedback}
                      onChange={(e) => setSurveyData(prev => ({ ...prev, feedback: e.target.value }))}
                      placeholder="Diga-nos o que falta para ser a ferramenta ideal para você..."
                      className="w-full p-8 bg-white/5 border border-white/5 rounded-[2.5rem] text-white focus:ring-4 focus:ring-indigo-600/20 focus:outline-none transition-all placeholder:text-slate-600 min-h-[140px] text-left"
                    />
                  </div>

                  <button 
                    type="submit"
                    className="w-full py-6 bg-indigo-600 text-white font-black text-xl rounded-[2.5rem] hover:bg-indigo-500 transition-all shadow-2xl shadow-indigo-600/30 active:scale-[0.98]"
                  >
                    Enviar Minha Contribuição
                  </button>
                </form>
              </>
            ) : (
              <div className="text-center py-16">
                <div className="w-24 h-24 bg-green-500/20 text-green-400 rounded-[2.5rem] flex items-center justify-center text-5xl mx-auto mb-10 shadow-inner">✓</div>
                <h2 className="text-5xl font-black text-white mb-6 tracking-tight">Feedback Recebido!</h2>
                <p className="text-slate-400 text-xl font-medium mb-12 max-w-sm mx-auto">Suas respostas serão analisadas pessoalmente pelo Guilherme Rezende.</p>
                <button 
                  onClick={() => setIsSubmitted(false)}
                  className="px-12 py-5 bg-white/5 border border-white/10 text-white font-bold rounded-2xl hover:bg-white/10 transition-all"
                >
                  Voltar
                </button>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-24 bg-slate-950 text-slate-500 relative overflow-hidden text-left">
        <div className="max-w-7xl mx-auto px-6 relative z-10 text-left">
          <div className="flex flex-col md:flex-row justify-between items-start gap-12 border-b border-white/5 pb-20">
            <div className="flex flex-col gap-6 max-w-sm">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center text-white font-bold">N</div>
                <span className="text-2xl font-black text-white tracking-tight">nuvem cultural</span>
              </div>
              <p className="text-slate-500 text-sm font-medium leading-relaxed">
                Tecnologia, vivência e gestão em favor da economia criativa. Projeto idealizado por Guilherme Rezende.
              </p>
              <div className="flex gap-4">
                <Badge color="orange">Modelo Social Sustentável</Badge>
                <Badge color="slate">Gestão Cultural</Badge>
              </div>
            </div>
            
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-12 text-left">
              <div>
                <h4 className="text-white font-bold mb-6 text-sm uppercase tracking-widest text-left">Navegação</h4>
                <ul className="space-y-4 text-xs font-bold uppercase tracking-wider text-left">
                  <li><button onClick={() => scrollToSection('foco')} className="hover:text-indigo-400 transition-colors text-left">Público-Alvo</button></li>
                  <li><button onClick={() => scrollToSection('modulos')} className="hover:text-indigo-400 transition-colors text-left">Funcionalidades</button></li>
                  <li><button onClick={() => scrollToSection('didatico')} className="hover:text-indigo-400 transition-colors text-left">Educação</button></li>
                  <li><button onClick={() => scrollToSection('sustentabilidade')} className="hover:text-indigo-400 transition-colors text-left">Sustentabilidade</button></li>
                </ul>
              </div>
              <div>
                <h4 className="text-white font-bold mb-6 text-sm uppercase tracking-widest text-left">Social</h4>
                <ul className="space-y-4 text-xs font-bold uppercase tracking-wider text-left">
                  <li><a href="https://linkedin.com/in/guilherme-rezende" target="_blank" className="hover:text-indigo-400 transition-colors text-left">LinkedIn</a></li>
                  <li><a href="https://instagram.com/guilherme-rezende" target="_blank" className="hover:text-indigo-400 transition-colors text-left">Instagram</a></li>
                </ul>
              </div>
            </div>
          </div>
          
          <div className="pt-12 flex flex-col md:flex-row justify-between items-center gap-8 text-[10px] font-bold uppercase tracking-[0.4em] text-slate-800">
            <span className="text-center md:text-left">© 2024 Nuvem Cultural — Projeto em Incubação</span>
            <span className="text-center md:text-right">Guilherme Rezende — Músico, TI & Gestor</span>
          </div>
        </div>
      </footer>

      {/* Modal Overlay */}
      {selectedModule && (
        <ModuleModal 
          module={selectedModule} 
          onClose={() => setSelectedModule(null)} 
        />
      )}
    </div>
  );
};

export default App;
