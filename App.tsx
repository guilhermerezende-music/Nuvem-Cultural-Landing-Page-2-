
import React, { useState, useMemo, useEffect } from 'react';
import { GoogleGenAI, Type } from "@google/genai";
import { modules } from './data/modules';
import { ModuleDetail, SurveyResponse } from './types';

const GOOGLE_SHEETS_WEBAPP_URL = 'https://script.google.com/macros/s/AKfycbzAYUV1Twj22IIQkL1cYoW7XFdvOGFGUftXBkUd1q62dmX8YMD0mJTGDQXBl6bWdg8j/exec';

// Interface para os dados de impacto simulados
interface ImpactData {
  theme: string;
  stat1: { value: string; label: string };
  stat2: { value: string; label: string };
  details: string[];
  quote: string;
  author: string;
  authorTitle: string;
}

const DEFAULT_IMPACT: ImpactData = {
  theme: "Música & Profissionalização",
  stat1: { value: "150", label: "Alunos Profissionalizados (Últimos 5 anos)" },
  stat2: { value: "02", label: "Destaques Internacionais" },
  details: [
    "1 aluno aprovado e matriculado na Berklee College of Music.",
    "1 egresso integrando a banda de apoio de Bruno Mars em turnê global."
  ],
  quote: "Sem a base técnica e o apoio estruturado da instituição, o sonho de chegar a Berklee seria apenas um registro num papel. A organização deles permitiu que o meu talento fosse visto pelo mundo. Hoje, essa é minha realidade.",
  author: "Ex-aluno e Bolsista",
  authorTitle: "Formação Musical 2019-2023"
};

// Componentes Auxiliares
const Badge = ({ children, color = 'blue' }: { children?: React.ReactNode, color?: string }) => {
  const colors: Record<string, string> = {
    blue: 'bg-blue-50 text-blue-600 border-blue-100',
    purple: 'bg-purple-50 text-purple-600 border-purple-100',
    green: 'bg-green-50 text-green-600 border-green-100',
    orange: 'bg-orange-50 text-orange-600 border-orange-100',
    slate: 'bg-slate-100 text-slate-600 border-slate-200',
    red: 'bg-red-50 text-red-600 border-red-100'
  };
  return (
    <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest border ${colors[color] || colors.blue}`}>
      {children}
    </span>
  );
};

const Navbar = ({ onNavigate }: { onNavigate: (id: string) => void }) => (
  <nav className="fixed top-0 w-full z-[60] px-6 py-4">
    <div className="max-w-7xl mx-auto flex justify-between items-center glass-card rounded-2xl px-6 py-3 shadow-lg shadow-indigo-950/5 border border-white/20">
      <div className="flex items-center gap-3 cursor-pointer" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
        <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center text-white shadow-indigo-500/20 shadow-xl">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z"/></svg>
        </div>
        <span className="text-xl font-extrabold text-slate-900 tracking-tight">nuvem cultural</span>
      </div>
      <div className="hidden md:flex gap-8 items-center">
        <button onClick={() => onNavigate('experimento')} className="text-sm font-semibold text-slate-600 hover:text-indigo-600 transition-colors">O Experimento</button>
        <button onClick={() => onNavigate('publico')} className="text-sm font-semibold text-slate-600 hover:text-indigo-600 transition-colors">Público</button>
        <button onClick={() => onNavigate('modulos')} className="text-sm font-semibold text-slate-600 hover:text-indigo-600 transition-colors">Soluções</button>
        <button onClick={() => onNavigate('pesquisa')} className="px-5 py-2.5 bg-indigo-600 text-white rounded-xl text-sm font-bold hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-600/20 active:scale-95">Acessar formulário</button>
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
      className="group relative bg-white p-6 rounded-[2rem] border border-slate-100 hover:border-indigo-300 hover:shadow-[0_20px_50px_rgba(79,70,229,0.15)] hover:-translate-y-2 transition-all duration-500 cursor-pointer flex flex-col h-full overflow-hidden"
    >
      <div className="relative z-10">
        <div className="w-12 h-12 bg-slate-50 rounded-xl flex items-center justify-center text-2xl mb-4 group-hover:bg-indigo-50 transition-colors duration-500">
          {module.icon}
        </div>
        <Badge color={categoryColors[module.category]}>{module.category}</Badge>
        <h3 className="text-lg font-extrabold text-slate-900 mt-3 mb-2 group-hover:text-indigo-600 transition-colors leading-tight">{module.title}</h3>
        <p className="text-slate-500 text-[13px] leading-relaxed line-clamp-3 min-h-[4.5rem]">{module.description}</p>
      </div>
      <div className="mt-auto pt-4 border-t border-slate-50 flex items-center justify-between text-indigo-600">
        <span className="text-[10px] font-bold uppercase tracking-wider inline-flex items-center gap-1 group-hover:gap-2 transition-all">Ver detalhes <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M17 8l4 4m0 0l-4 4m4-4H3"/></svg></span>
      </div>
    </div>
  );
};

const ImpactIntelligence = () => {
  const [impactData, setImpactData] = useState<ImpactData>(DEFAULT_IMPACT);
  const [loading, setLoading] = useState(false);

  const simulateNewTheme = async () => {
    setLoading(true);
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: "Gere um exemplo fictício mas realista de dashboard de impacto cultural para uma ONG. Escolha um eixo temático diferente de Música (ex: Dança, Teatro, Literatura, Cinema, Circo, Artes Visuais). Forneça dados de impacto, 2 detalhes inspiradores e um depoimento de um beneficiário.",
        config: {
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              theme: { type: Type.STRING, description: "Nome do eixo temático (ex: Dança & Expressão)" },
              stat1: {
                type: Type.OBJECT,
                properties: {
                  value: { type: Type.STRING },
                  label: { type: Type.STRING }
                }
              },
              stat2: {
                type: Type.OBJECT,
                properties: {
                  value: { type: Type.STRING },
                  label: { type: Type.STRING }
                }
              },
              details: {
                type: Type.ARRAY,
                items: { type: Type.STRING },
                description: "2 fatos inspiradores sobre egressos"
              },
              quote: { type: Type.STRING, description: "Depoimento do beneficiário" },
              author: { type: Type.STRING, description: "Quem falou" },
              authorTitle: { type: Type.STRING, description: "Cargo ou ano de formação" }
            },
            required: ["theme", "stat1", "stat2", "details", "quote", "author", "authorTitle"]
          }
        }
      });

      const json = JSON.parse(response.text);
      setImpactData(json);
    } catch (e) {
      console.error("Erro ao simular impacto:", e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative w-full rounded-[3rem] overflow-hidden bg-slate-900 border border-white/10 shadow-2xl mt-12 p-6 md:p-12 transition-all duration-700">
      <div className={`flex flex-col md:flex-row gap-12 items-center transition-opacity duration-500 ${loading ? 'opacity-30' : 'opacity-100'}`}>
        <div className="flex-1 text-left space-y-8 w-full">
          <div className="space-y-2">
            <h3 className="text-indigo-400 font-black text-[10px] md:text-xs uppercase tracking-widest">Amostra de Inteligência de Impacto</h3>
            <h4 className="text-2xl md:text-3xl font-black text-white leading-tight tracking-tight break-words">Eixo Temático: {impactData.theme}</h4>
          </div>
          
          <div className="grid grid-cols-2 gap-4 md:gap-6">
            <div className="bg-white/5 border border-white/10 p-4 md:p-6 rounded-3xl overflow-hidden">
              <span className="text-3xl md:text-4xl font-black text-white block mb-1">{impactData.stat1.value}</span>
              <p className="text-[9px] md:text-xs font-bold text-slate-400 uppercase tracking-wider md:tracking-widest break-words leading-tight">{impactData.stat1.label}</p>
            </div>
            <div className="bg-white/5 border border-white/10 p-4 md:p-6 rounded-3xl overflow-hidden">
              <span className="text-3xl md:text-4xl font-black text-sky-400 block mb-1">{impactData.stat2.value}</span>
              <p className="text-[9px] md:text-xs font-bold text-slate-400 uppercase tracking-wider md:tracking-widest break-words leading-tight">{impactData.stat2.label}</p>
            </div>
          </div>

          <div className="space-y-4">
            {impactData.details.map((detail, idx) => (
              <div key={idx} className="flex items-start gap-4">
                <div className="w-10 h-10 md:w-12 md:h-12 bg-indigo-500/20 text-indigo-400 rounded-2xl flex items-center justify-center font-black text-xs shrink-0 mt-1">
                  {idx === 0 ? '🏆' : '✨'}
                </div>
                <p className="text-slate-300 text-xs md:text-sm font-medium leading-relaxed break-words" dangerouslySetInnerHTML={{ __html: detail.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>') }} />
              </div>
            ))}
          </div>
        </div>

        <div className="flex-1 w-full">
          <div className="bg-white/5 border border-white/10 rounded-[2rem] md:rounded-[2.5rem] p-6 md:p-8 relative overflow-hidden group min-h-[250px] md:min-h-[300px] flex flex-col justify-center">
            <div className="absolute top-0 right-0 w-24 h-24 bg-indigo-600/10 blur-3xl rounded-full" />
            <span className="text-3xl md:text-4xl text-indigo-400 block mb-4 md:mb-6">"</span>
            <p className="text-white text-base md:text-lg font-medium leading-relaxed italic mb-8 relative z-10 break-words">
              {impactData.quote}
            </p>
            <div className="flex items-center gap-4 mt-auto">
              <div className="w-10 h-10 bg-slate-800 rounded-full border border-white/10 flex items-center justify-center text-white text-xs font-black shrink-0">
                {impactData.author.charAt(0)}
              </div>
              <div className="min-w-0">
                <p className="text-white font-bold text-sm truncate">{impactData.author}</p>
                <p className="text-slate-500 text-[9px] md:text-[10px] font-black uppercase tracking-widest truncate">{impactData.authorTitle}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {loading && (
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 z-20 bg-slate-900/60 backdrop-blur-[2px]">
          <div className="w-12 h-12 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin" />
          <p className="text-indigo-300 font-bold text-xs uppercase tracking-widest animate-pulse">Cruzando Dados de Impacto...</p>
        </div>
      )}
      
      <div className="mt-12 flex flex-col sm:flex-row items-center justify-between border-t border-white/5 pt-8 gap-6">
        <p className="text-slate-500 text-[8px] md:text-[10px] font-black uppercase tracking-[0.2em] md:tracking-[0.3em] text-center sm:text-left">IA Predictive Impact Analysis Dashboard — Nuvem Cultural Beta</p>
        <button 
          onClick={simulateNewTheme} 
          disabled={loading}
          className="w-full sm:w-auto px-6 py-3 bg-white/5 border border-white/10 text-white rounded-xl text-[10px] font-bold uppercase tracking-widest hover:bg-white/10 transition-all flex items-center justify-center gap-3 disabled:opacity-50"
        >
          <svg className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"/></svg>
          Simular outro Eixo Temático
        </button>
      </div>
    </div>
  );
};

const ModuleModal = ({ module, onClose }: { module: ModuleDetail; onClose: () => void }) => (
  <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-6 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-300" onClick={onClose}>
    <div className="relative bg-white w-full max-w-2xl rounded-[3rem] overflow-hidden shadow-2xl animate-in zoom-in-95 duration-300 flex flex-col max-h-[90vh]" onClick={(e) => e.stopPropagation()}>
      <button onClick={onClose} className="absolute top-8 right-8 w-10 h-10 bg-slate-50 rounded-full flex items-center justify-center text-slate-400 hover:text-slate-900 z-10">
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M6 18L18 6M6 6l12 12"/></svg>
      </button>
      <div className="p-8 md:p-12 overflow-y-auto text-left">
        <div className="flex items-center gap-6 mb-8">
          <div className="w-20 h-20 bg-slate-50 rounded-3xl flex items-center justify-center text-4xl shadow-inner shrink-0">{module.icon}</div>
          <div>
            <Badge color="blue">{module.category}</Badge>
            <h2 className="text-3xl font-black text-slate-900 mt-2 tracking-tight">{module.title}</h2>
          </div>
        </div>
        <p className="text-slate-500 text-lg leading-relaxed mb-10 font-medium italic">"{module.description}"</p>
        <div className="grid md:grid-cols-2 gap-10">
          <div>
            <h4 className="text-[10px] font-black uppercase tracking-widest text-indigo-600 mb-4">Funcionalidades Sugeridas</h4>
            <ul className="space-y-2">
              {module.features.map((f, i) => <li key={i} className="flex items-center gap-3 text-sm font-bold text-slate-700"><span className="w-1.5 h-1.5 rounded-full bg-indigo-200" />{f}</li>)}
            </ul>
          </div>
          <div>
            <h4 className="text-[10px] font-black uppercase tracking-widest text-green-600 mb-4">Meta de Impacto</h4>
            <ul className="space-y-2">
              {module.benefits.map((b, i) => <li key={i} className="flex items-center gap-3 text-sm font-bold text-slate-700"><span className="w-1.5 h-1.5 rounded-full bg-green-200" />{b}</li>)}
            </ul>
          </div>
        </div>
      </div>
      <div className="p-8 bg-slate-50 flex justify-end">
        <button onClick={onClose} className="px-8 py-4 bg-slate-900 text-white rounded-2xl font-bold text-sm shadow-xl shadow-slate-900/10">Fechar</button>
      </div>
    </div>
  </div>
);

const App: React.FC = () => {
  const [selectedModule, setSelectedModule] = useState<ModuleDetail | null>(null);
  const [activeFilter, setActiveFilter] = useState<string>('Tudo');
  const [searchTerm, setSearchTerm] = useState('');
  const [userIp, setUserIp] = useState<string>('0.0.0.0');

  const sendToSheet = async (payload: any) => {
    try {
      await fetch(GOOGLE_SHEETS_WEBAPP_URL, {
        method: 'POST',
        mode: 'no-cors',
        headers: { 'Content-Type': 'text/plain' },
        body: JSON.stringify(payload)
      });
    } catch (e) { console.error(e); }
  };

  useEffect(() => {
    const trackAccess = async () => {
      try {
        const ipRes = await fetch('https://api.ipify.org?format=json');
        const { ip } = await ipRes.json();
        setUserIp(ip);
        await sendToSheet({ type: 'VISITA_LANDING_ESTRATEGICA', ip, timestamp: new Date().toLocaleString('pt-BR'), userAgent: navigator.userAgent });
      } catch (e) { console.debug('Tracker active...'); }
    };
    trackAccess();
  }, []);

  const filteredModules = useMemo(() => {
    return modules.filter(m => (activeFilter === 'Tudo' || m.category === activeFilter) && 
      (m.title.toLowerCase().includes(searchTerm.toLowerCase()) || m.description.toLowerCase().includes(searchTerm.toLowerCase())));
  }, [activeFilter, searchTerm]);

  const scrollToSection = (id: string) => { document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' }); };

  return (
    <div className="min-h-screen bg-slate-50 overflow-x-hidden text-left">
      <Navbar onNavigate={scrollToSection} />

      {/* Hero - Refinado para sobriedade e estratégia */}
      <section className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 overflow-hidden bg-mesh">
        <div className="absolute inset-0 z-0">
          <img src="https://images.unsplash.com/photo-1524758631624-e2822e304c36?auto=format&fit=crop&q=80&w=2070" className="w-full h-full object-cover opacity-10 mix-blend-overlay" alt="Context" />
        </div>
        <div className="max-w-7xl mx-auto px-6 relative z-10 text-center">
          <div className="flex flex-col items-center gap-4 mb-10">
            <div className="inline-flex items-center gap-3 bg-white/10 backdrop-blur-md border border-white/20 px-5 py-2 rounded-full animate-float">
              <span className="flex h-2 w-2 rounded-full bg-sky-400 animate-ping" />
              <span className="text-white text-[11px] font-bold uppercase tracking-[0.2em]">Projeto em fase de incubação</span>
            </div>
          </div>
          
          <h1 className="text-5xl lg:text-8xl font-black text-white mb-8 tracking-tight leading-[1.05]">
            Gestão cultural não precisa ser <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-400 via-sky-400 to-indigo-400">um pesadelo burocrático.</span>
          </h1>
          
          <p className="max-w-4xl mx-auto text-xl text-slate-400 mb-12 leading-relaxed font-medium">
            A <strong>Nuvem Cultural</strong> ajuda OSCs, coletivos e produtores (ME/MEI/PF) a organizar prestação de contas, informações institucionais e infraestrutura tecnológica — para que o foco volte à criação.
            <br/><br/>
            <span className="text-indigo-400 font-bold">Em vez de improviso e retrabalho, estrutura.</span>
          </p>

          <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
            <button onClick={() => scrollToSection('pesquisa')} className="px-12 py-6 bg-indigo-600 text-white rounded-2xl font-black text-xl hover:bg-indigo-500 shadow-3xl shadow-indigo-600/30 active:scale-95 transition-all">Responder formulário de contato</button>
            <div className="flex flex-col items-center gap-2">
               <button onClick={() => scrollToSection('manifesto')} className="text-indigo-400 font-bold hover:text-white transition-colors underline underline-offset-8">Entenda nosso modelo</button>
               <span className="text-[10px] text-slate-500 font-black uppercase tracking-widest">Estrutura que gera autonomia</span>
            </div>
          </div>
        </div>
      </section>

      {/* Público */}
      <section id="publico" className="py-24 bg-white border-y border-slate-100 scroll-mt-24">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <Badge color="blue">Infraestrutura completa para todos</Badge>
            <h2 className="text-4xl font-black text-slate-900 mt-6 tracking-tight">Do Produtor Independente à Instituição.</h2>
            <p className="text-slate-500 font-medium mt-4">Todo o ecossistema de ferramentas está disponível para todos os perfis, adaptando-se à sua realidade.</p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="p-10 bg-indigo-50 rounded-[3rem] border border-indigo-100 flex flex-col h-full hover:shadow-2xl transition-all">
              <span className="text-4xl mb-6 block">🏛️</span>
              <h3 className="text-2xl font-black text-indigo-950 mb-4">OSCs e Instituições</h3>
              <p className="text-indigo-900/70 font-medium text-sm leading-relaxed">Segurança jurídica e governança de alto nível para gerenciar projetos complexos e prestar contas com transparência absoluta.</p>
            </div>
            <div className="p-10 bg-slate-50 rounded-[3rem] border border-slate-100 flex flex-col h-full hover:shadow-2xl transition-all">
              <span className="text-4xl mb-6 block">🤝</span>
              <h3 className="text-2xl font-black text-slate-900 mb-4">Coletivos e Grupos</h3>
              <p className="text-slate-500 font-medium text-sm leading-relaxed">Organização coletiva e visibilidade social para grupos que buscam ampliar sua voz e medir o impacto de suas ações territoriais.</p>
            </div>
            <div className="p-10 bg-sky-50 rounded-[3rem] border border-sky-100 flex flex-col h-full hover:shadow-2xl transition-all">
              <span className="text-4xl mb-6 block">🎨</span>
              <h3 className="text-2xl font-black text-sky-950 mb-4">Produtores (ME/MEI/PF)</h3>
              <p className="text-sky-900/70 font-medium text-sm leading-relaxed">Agilidade e profissionalismo para o agente independente gerir seu portfólio, captar recursos e comprovar sua relevância social.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Modelo de Sustentabilidade */}
      <section id="manifesto" className="py-24 bg-slate-900 text-white scroll-mt-24 relative overflow-hidden">
        <div className="max-w-5xl mx-auto px-6 relative z-10">
          <div className="text-center mb-16">
            <Badge color="green">Sustentabilidade & Transparência</Badge>
            <h2 className="text-4xl lg:text-5xl font-black mt-6 tracking-tight">Como sustentamos a tecnologia.</h2>
            <p className="text-slate-400 font-medium mt-6 max-w-2xl mx-auto text-lg leading-relaxed">
              A Nuvem Cultural é uma infraestrutura de alto nível que exige servidores seguros, backups constantes e suporte especializado. Nosso modelo é desenhado para garantir que essa ferramenta nunca pare, operando sempre com foco no impacto, não no lucro.
            </p>
          </div>
          <div className="grid md:grid-cols-2 gap-8">
            <div className="glass-card bg-white/5 border-white/10 rounded-[3rem] p-10 flex flex-col h-full">
              <div className="w-16 h-16 bg-green-500/20 text-green-400 rounded-2xl flex items-center justify-center font-black text-2xl mb-6 shrink-0">1</div>
              <h4 className="text-2xl font-black text-white mb-4">Prioridade: Gratuidade absoluta</h4>
              <p className="text-slate-400 text-sm font-medium leading-relaxed mb-8">
                Nossa missão é garantir que o acesso à gestão profissional seja um direito de todo agente cultural. Buscamos fomento através de editais e parcerias institucionais para que a plataforma chegue até você sem barreiras financeiras.
              </p>
              <div className="mt-auto inline-flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-green-400 bg-green-400/10 px-4 py-2 rounded-full w-fit">Modelo Preferencial</div>
            </div>
            
            <div className="glass-card bg-white/5 border-white/10 rounded-[3rem] p-10 flex flex-col h-full">
              <div className="w-16 h-16 bg-sky-500/20 text-sky-400 rounded-2xl flex items-center justify-center font-black text-2xl mb-6 shrink-0">2</div>
              <h4 className="text-2xl font-black text-white mb-4">Alternativa: Custo social</h4>
              <p className="text-slate-400 text-sm font-medium leading-relaxed mb-8">
                Caso os custos de manutenção exijam autonomia, operaremos exclusivamente a preço de custo social. Sem distribuição de dividendos: cada centavo é reinvestido integralmente na segurança e evolução técnica da ferramenta.
              </p>
              <div className="mt-auto inline-flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-sky-400 bg-sky-400/10 px-4 py-2 rounded-full w-fit">Modelo de Continuidade</div>
            </div>
          </div>
          <div className="mt-16 text-center">
            <p className="text-xl text-white font-bold italic opacity-90">"Sustentabilidade é a nossa base para profissionalizar o seu impacto."</p>
          </div>
        </div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-indigo-600/10 blur-[120px] pointer-events-none" />
      </section>

      {/* Inteligência de Impacto */}
      <section id="experimento" className="py-24 bg-white text-left scroll-mt-24 overflow-hidden">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col lg:flex-row gap-16 items-start">
            <div className="lg:w-1/3">
              <Badge color="purple">Inteligência de Impacto</Badge>
              <h2 className="text-4xl font-black text-slate-900 mt-6 tracking-tight leading-tight">Como a IA narra o seu legado.</h2>
              <p className="text-slate-500 font-medium mt-6 leading-relaxed">
                A Nuvem Cultural não apenas guarda dados; ela identifica padrões de sucesso. Transformamos registros brutos em indicadores que emocionam doadores e convencem avaliadores de editais.
              </p>
              <div className="mt-10 p-6 bg-slate-50 rounded-3xl border border-slate-100">
                <p className="text-[10px] font-black uppercase text-indigo-600 tracking-widest mb-2">Status da Validação</p>
                <p className="text-sm font-bold text-slate-700 italic leading-relaxed">"Estamos testando modelos de processamento de linguagem natural que cruzam depoimentos de beneficiários com metas de editais passados para simular narrativas poderosas."</p>
              </div>
            </div>
            <div className="lg:w-2/3 w-full">
              <ImpactIntelligence />
            </div>
          </div>
        </div>
      </section>

      {/* Módulos */}
      <section id="modulos" className="py-24 bg-slate-50 scroll-mt-24">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col md:flex-row justify-between items-end gap-8 mb-16">
            <div className="text-left">
              <Badge color="blue">Estrutura Modular</Badge>
              <h2 className="text-4xl font-black text-slate-900 mt-6 tracking-tight">O que estamos validando.</h2>
              <p className="text-slate-500 font-medium mt-4">Soluções pensadas para libertar o seu tempo criativo.</p>
            </div>
            <div className="flex flex-wrap gap-2">
              {['Tudo', 'Gestão', 'Social', 'Financeiro', 'Inovação'].map(cat => (
                <button key={cat} onClick={() => setActiveFilter(cat)} className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest border transition-all ${activeFilter === cat ? 'bg-indigo-600 border-indigo-600 text-white' : 'bg-white border-slate-200 text-slate-400 hover:border-indigo-200'}`}>{cat}</button>
              ))}
            </div>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {filteredModules.map(m => <ModuleCard key={m.id} module={m} onClick={setSelectedModule} />)}
          </div>
        </div>
      </section>

      {/* Idealizador - CONTEÚDO AMPLO & ESTRUTURADO */}
      <section id="idealizador" className="py-24 bg-white scroll-mt-24">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid lg:grid-cols-12 gap-12 lg:gap-20 items-start">
             <div className="lg:col-span-5 sticky top-24">
                <div className="relative group">
                   <div className="absolute -inset-4 bg-indigo-100 rounded-[4.5rem] scale-95 opacity-0 group-hover:opacity-100 group-hover:scale-100 transition-all duration-700" />
                   <div className="relative aspect-[4/5] rounded-[4rem] overflow-hidden shadow-2xl border-8 border-white">
                      <img src="https://scontent.fudi1-1.fna.fbcdn.net/v/t1.6435-9/109747542_3260347380689997_6643390485613737139_n.jpg?_nc_cat=105&ccb=1-7&_nc_sid=833d8c&_nc_eui2=AeGwS8H7lII_NsCyUqfPd0QVaX9OboU-BzJpf05uhT4HMoglkRh_p1kDrOhQ9pBtDnt6DJXdeUFe-iuPaxy1rov9&_nc_ohc=aq9MYa81O3IQ7kNvwHMElyZ&_nc_oc=AdnFloBDKY65fYjASYOwMgTlmK1vPmllKZb31K9upM447u47M4A0Hoo9DE9ipmWHdIMCUAbDR2o5RFVsWI2RjN93&_nc_zt=23&_nc_ht=scontent.fudi1-1.fna&_nc_gid=mTboIJxO9FxNdZr-If0CcQ&oh=00_Aft4RQpyQTCvAI9R_DF--Txh1FYOnhreGiAO-2FgtvSFJA&oe=69BB6DC7" className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-700" alt="Guilherme Rezende" />
                   </div>
                   <div className="absolute -bottom-6 -right-6 bg-slate-900 p-8 rounded-[2.5rem] text-white shadow-3xl max-w-[320px] border border-white/10">
                      <span className="text-[10px] font-black uppercase tracking-widest text-indigo-400">Idealizador</span>
                      <h4 className="text-xl font-black mt-2">Guilherme Rezende</h4>
                      <p className="text-[10px] font-bold mt-2 text-slate-400 leading-relaxed uppercase tracking-widest">Músico, produtor e estruturador de soluções para cultura e terceiro setor</p>
                   </div>
                </div>
             </div>
             
             <div className="lg:col-span-7 text-left space-y-10">
                <div>
                   <Badge color="blue">Vivência & Prática</Badge>
                   <h2 className="text-4xl lg:text-5xl font-black text-slate-900 mt-6 tracking-tight leading-[1.1]">
                      Operação cultural com <br/>
                      <span className="text-indigo-600">visão estrutural.</span>
                   </h2>
                   <div className="space-y-6 mt-8">
                      <p className="text-slate-600 text-lg font-medium leading-relaxed">
                        Atuei na montagem e operação de cinema ao ar livre, palestras e shows, e também na organização técnica de projetos financiados por edital.
                      </p>
                      <p className="text-slate-600 text-lg font-medium leading-relaxed">
                        Ao longo dessa experiência, organizei e padronizei informações institucionais para reduzir retrabalho — facilitando tanto a prestação de contas quanto a submissão de novos projetos em editais de incentivo à cultura.
                      </p>
                      <p className="text-slate-600 text-lg font-medium leading-relaxed">
                        Também viabilizei mais de R$ 40 mil por ano em infraestrutura de TI por meio de programas de doação e prospecção direta, fortalecendo a base tecnológica da instituição sem aumento de custos.
                      </p>
                      <p className="text-indigo-600 text-lg font-bold italic border-l-4 border-indigo-100 pl-6">
                        "A Nuvem Cultural nasce dessa vivência prática: transformar desafios recorrentes da gestão cultural em estrutura consistente e sustentável."
                      </p>
                   </div>
                </div>

                <div className="grid sm:grid-cols-2 gap-6 pt-6">
                   {/* 🎨 Criativo & Independente */}
                   <div className="p-8 bg-sky-50 rounded-[2.5rem] border border-sky-100 hover:shadow-xl hover:shadow-sky-500/5 transition-all">
                      <span className="text-3xl block mb-4">🎨</span>
                      <h4 className="text-[11px] font-black uppercase tracking-[0.2em] text-sky-600 mb-4">Criativo & Independente</h4>
                      <ul className="space-y-2">
                         <li className="text-sm font-bold text-slate-700 flex items-start gap-2"><div className="w-1.5 h-1.5 rounded-full bg-sky-400 mt-1.5" />Músico profissional e graduando em Design Musical</li>
                         <li className="text-sm font-bold text-slate-700 flex items-start gap-2"><div className="w-1.5 h-1.5 rounded-full bg-sky-400 mt-1.5" />Produção artística independente</li>
                         <li className="text-sm font-bold text-slate-700 flex items-start gap-2"><div className="w-1.5 h-1.5 rounded-full bg-sky-400 mt-1.5" />Design gráfico e web</li>
                      </ul>
                   </div>

                   {/* 📊 Gestão & Estratégia */}
                   <div className="p-8 bg-slate-50 rounded-[2.5rem] border border-slate-100 hover:shadow-xl transition-all">
                      <span className="text-3xl block mb-4">📊</span>
                      <h4 className="text-[11px] font-black uppercase tracking-[0.2em] text-indigo-600 mb-4">Gestão & Estratégia</h4>
                      <ul className="space-y-2">
                         <li className="text-sm font-bold text-slate-700 flex items-start gap-2"><div className="w-1.5 h-1.5 rounded-full bg-indigo-300 mt-1.5" />Elaboração e estruturação de projetos culturais</li>
                         <li className="text-sm font-bold text-slate-700 flex items-start gap-2"><div className="w-1.5 h-1.5 rounded-full bg-indigo-300 mt-1.5" />Organização e padronização para reduzir retrabalho</li>
                         <li className="text-sm font-bold text-slate-700 flex items-start gap-2"><div className="w-1.5 h-1.5 rounded-full bg-indigo-300 mt-1.5" />Organização e análise de dados institucionais</li>
                         <li className="text-sm font-bold text-slate-700 flex items-start gap-2"><div className="w-1.5 h-1.5 rounded-full bg-indigo-300 mt-1.5" />Planejamento aplicado à rotina de OSCs</li>
                      </ul>
                   </div>

                   {/* ⚙️ Infraestrutura & TI */}
                   <div className="p-8 bg-slate-900 rounded-[2.5rem] border border-white/10 text-white hover:shadow-2xl transition-all relative overflow-hidden sm:mt-[-1rem]">
                      <div className="absolute top-0 right-0 w-24 h-24 bg-sky-500/10 blur-3xl rounded-full" />
                      <span className="text-3xl block mb-4">⚙️</span>
                      <h4 className="text-[11px] font-black uppercase tracking-[0.2em] text-sky-400 mb-4">Infraestrutura & TI</h4>
                      <ul className="space-y-2">
                         <li className="text-sm font-bold text-slate-300 flex items-start gap-2"><div className="w-1.5 h-1.5 rounded-full bg-sky-500 mt-1.5" />Estruturação de TI institucional</li>
                         <li className="text-sm font-bold text-green-400 flex items-start gap-2"><div className="w-1.5 h-1.5 rounded-full bg-green-500 mt-1.5" />Captação de +R$ 40k/ano em infraestrutura</li>
                         <li className="text-sm font-bold text-slate-300 flex items-start gap-2"><div className="w-1.5 h-1.5 rounded-full bg-sky-500 mt-1.5" />Segurança e organização de dados</li>
                         <li className="text-sm font-bold text-slate-300 flex items-start gap-2"><div className="w-1.5 h-1.5 rounded-full bg-sky-500 mt-1.5" />Desenvolvimento web</li>
                      </ul>
                   </div>

                   {/* 🎬 Operação (Campo & Oficinas) */}
                   <div className="p-8 bg-slate-50 rounded-[2.5rem] border border-slate-100 hover:shadow-xl transition-all sm:mt-1">
                      <span className="text-3xl block mb-4">🎬</span>
                      <h4 className="text-[11px] font-black uppercase tracking-[0.2em] text-slate-400 mb-4">Operação de Campo</h4>
                      <ul className="space-y-2">
                         <li className="text-sm font-bold text-slate-700 flex items-start gap-2"><div className="w-1.5 h-1.5 rounded-full bg-slate-400 mt-1.5" />Operação técnica de cinema</li>
                         <li className="text-sm font-bold text-slate-700 flex items-start gap-2"><div className="w-1.5 h-1.5 rounded-full bg-slate-400 mt-1.5" />Montagem de shows e eventos</li>
                         <li className="text-sm font-bold text-slate-700 flex items-start gap-2"><div className="w-1.5 h-1.5 rounded-full bg-slate-400 mt-1.5" />Atendimento ao público</li>
                         <li className="text-sm font-bold text-indigo-600 flex items-start gap-2"><div className="w-1.5 h-1.5 rounded-full bg-indigo-400 mt-1.5" />Apoio estratégico a oficinas culturais</li>
                      </ul>
                   </div>
                </div>
             </div>
          </div>
        </div>
      </section>

      {/* CTA Final */}
      <section id="pesquisa" className="py-32 bg-mesh relative scroll-mt-24 overflow-hidden">
        <div className="max-w-5xl mx-auto px-6 relative z-10">
          <div className="bg-slate-900/95 backdrop-blur-2xl rounded-[4rem] p-12 md:p-24 border border-white/10 shadow-[0_50px_100px_rgba(0,0,0,0.5)] text-center relative overflow-hidden">
            <div className="absolute top-0 left-0 w-64 h-64 bg-indigo-600/20 blur-[100px] -translate-x-1/2 -translate-y-1/2" />
            <div className="absolute bottom-0 right-0 w-96 h-96 bg-sky-500/10 blur-[120px] translate-x-1/4 translate-y-1/4" />
            
            <div className="relative z-10 flex flex-col items-center">
              <Badge color="orange">Co-Criação Cultural</Badge>
              <h2 className="text-4xl md:text-6xl font-black text-white mb-8 mt-8 tracking-tight leading-tight">
                Ajude a moldar <br/> a ferramenta.
              </h2>
              <p className="text-slate-300 text-lg md:text-xl font-medium mb-12 max-w-2xl mx-auto leading-relaxed">
                Suas respostas são o combustível para priorizarmos as funcionalidades que realmente resolvem as dores da gestão cultural no Brasil.
              </p>
              
              <div className="group relative">
                <div className="absolute -inset-1 bg-gradient-to-r from-indigo-500 to-sky-500 rounded-[2.5rem] blur opacity-25 group-hover:opacity-100 transition duration-1000 group-hover:duration-200" />
                <a 
                  href="https://forms.gle/wXVEk7nP7LzUWwDd6" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="relative inline-block px-12 md:px-20 py-6 md:py-8 bg-indigo-600 text-white font-black text-xl md:text-2xl rounded-[2.5rem] hover:bg-indigo-500 transition-all active:scale-[0.98] shadow-2xl shadow-indigo-600/40"
                >
                  Responder formulário
                </a>
              </div>
              
              <div className="mt-12 flex items-center gap-3">
                <svg className="w-5 h-5 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"/></svg>
                <p className="text-slate-500 text-xs font-black uppercase tracking-[0.2em]">Redirecionamento para Google Forms</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <footer className="py-24 bg-slate-950 text-slate-500 border-t border-white/5 text-left">
        <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-2 lg:grid-cols-4 gap-12 items-start">
          <div className="flex flex-col gap-6">
            <div className="flex items-center gap-3">
               <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center text-white font-bold shadow-indigo-600/20 shadow-xl">N</div>
               <span className="text-2xl font-black text-white tracking-tight">nuvem cultural</span>
            </div>
            <p className="text-xs font-medium leading-relaxed max-w-xs">Tecnologia, vivência e gestão em favor da economia criativa. Projeto idealizado por Guilherme Rezende.</p>
            <div className="flex gap-4">
              <Badge color="orange">Prioridade Social</Badge>
              <Badge color="slate">Incubação 2026</Badge>
            </div>
          </div>
          <div>
            <h4 className="text-white font-bold mb-6 text-sm uppercase tracking-widest">Navegação</h4>
            <ul className="space-y-4 text-xs font-bold uppercase tracking-wider">
               <li><button onClick={() => scrollToSection('publico')} className="hover:text-indigo-400 transition-colors">Público-Alvo</button></li>
               <li><button onClick={() => scrollToSection('modulos')} className="hover:text-indigo-400 transition-colors">Funcionalidades</button></li>
               <li><button onClick={() => scrollToSection('manifesto')} className="hover:text-indigo-400 transition-colors">Sustentabilidade</button></li>
            </ul>
          </div>
          <div>
            <h4 className="text-white font-bold mb-6 text-sm uppercase tracking-widest">Conectar</h4>
            <ul className="space-y-4 text-xs font-bold uppercase tracking-wider">
               <li><a href="https://linkedin.com/in/guilherme-rezende1994/" target="_blank" className="hover:text-indigo-400 transition-colors">LinkedIn (Idealizador)</a></li>
               <li><a href="https://instagram.com/GuilhermeRezende.music" target="_blank" className="hover:text-indigo-400 transition-colors">Instagram (Idealizador)</a></li>
            </ul>
          </div>
          <div className="lg:col-span-1">
             <span className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-800">© 2026 Nuvem Cultural — Projeto em fase de incubação</span>
          </div>
        </div>
      </footer>

      {selectedModule && <ModuleModal module={selectedModule} onClose={() => setSelectedModule(null)} />}
    </div>
  );
};

export default App;
