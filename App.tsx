
import React, { useState, useMemo, useEffect } from 'react';
import { GoogleGenAI } from "@google/genai";
import { modules } from './data/modules';
import { ModuleDetail, SurveyResponse } from './types';

const GOOGLE_SHEETS_WEBAPP_URL = 'https://script.google.com/macros/s/AKfycbzAYUV1Twj22IIQkL1cYoW7XFdvOGFGUftXBkUd1q62dmX8YMD0mJTGDQXBl6bWdg8j/exec';

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
        <button onClick={() => onNavigate('publico')} className="text-sm font-semibold text-slate-600 hover:text-indigo-600 transition-colors">Quem somos</button>
        <button onClick={() => onNavigate('modulos')} className="text-sm font-semibold text-slate-600 hover:text-indigo-600 transition-colors">Soluções</button>
        <button onClick={() => onNavigate('pesquisa')} className="px-5 py-2.5 bg-indigo-600 text-white rounded-xl text-sm font-bold hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-600/20 active:scale-95">Participar</button>
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
      className="group relative bg-white p-6 rounded-[2rem] border border-slate-100 hover:border-indigo-200 hover:shadow-2xl hover:shadow-indigo-500/10 transition-all duration-500 cursor-pointer flex flex-col h-full overflow-hidden"
    >
      <div className="relative z-10">
        <div className="w-12 h-12 bg-slate-50 rounded-xl flex items-center justify-center text-2xl mb-4 group-hover:bg-indigo-50 transition-colors duration-500">
          {module.icon}
        </div>
        <Badge color={categoryColors[module.category]}>{module.category}</Badge>
        <h3 className="text-lg font-extrabold text-slate-900 mt-3 mb-2 group-hover:text-indigo-600 transition-colors leading-tight">{module.title}</h3>
        <p className="text-slate-500 text-[13px] leading-relaxed line-clamp-2">{module.description}</p>
      </div>
      <div className="mt-auto pt-4 border-t border-slate-50 flex items-center justify-between text-indigo-600">
        <span className="text-[10px] font-bold uppercase tracking-wider inline-flex items-center gap-1">Ver detalhes <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M17 8l4 4m0 0l-4 4m4-4H3"/></svg></span>
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
        contents: { parts: [{ text: "Abstract artistic visualization of 'Cultural Data and Social Impact'. Vibrant, modern, professional, 16:9 ratio." }] },
        config: { imageConfig: { aspectRatio: "16:9" } }
      });

      if (response.candidates?.[0]?.content?.parts) {
        for (const part of response.candidates[0].content.parts) {
          if (part.inlineData) setImageUrl(`data:image/png;base64,${part.inlineData.data}`);
        }
      }
    } catch (e) { console.error(e); } finally { setLoading(false); }
  };

  useEffect(() => { generateVision(); }, []);

  return (
    <div className="relative w-full aspect-video rounded-[3rem] overflow-hidden bg-slate-900 border border-white/10 shadow-2xl group mt-12">
      {loading ? (
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-4">
          <div className="w-12 h-12 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin" />
          <p className="text-indigo-300 font-bold text-xs uppercase tracking-widest animate-pulse">Gerando Visão de Impacto...</p>
        </div>
      ) : imageUrl ? (
        <img src={imageUrl} alt="IA Vision" className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105" />
      ) : null}
      <div className="absolute bottom-6 right-6 z-20">
        <button onClick={generateVision} className="px-4 py-2 bg-white/10 backdrop-blur-md border border-white/20 text-white rounded-xl text-[10px] font-bold uppercase hover:bg-white/20 transition-all">Regerar Visão</button>
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
  const [surveyData, setSurveyData] = useState<SurveyResponse>({ usageLikelihood: 3, valuableModules: [], feedback: "" });
  const [isSubmitted, setIsSubmitted] = useState(false);
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
        await sendToSheet({ type: 'VISITA_INCUBACAO_FINAL', ip, timestamp: new Date().toLocaleString('pt-BR'), userAgent: navigator.userAgent });
      } catch (e) { console.debug('Tracker active...'); }
    };
    trackAccess();
  }, []);

  const filteredModules = useMemo(() => {
    return modules.filter(m => (activeFilter === 'Tudo' || m.category === activeFilter) && 
      (m.title.toLowerCase().includes(searchTerm.toLowerCase()) || m.description.toLowerCase().includes(searchTerm.toLowerCase())));
  }, [activeFilter, searchTerm]);

  const toggleValuableModule = (id: string) => {
    setSurveyData(prev => ({ ...prev, valuableModules: prev.valuableModules.includes(id) ? prev.valuableModules.filter(m => m !== id) : [...prev.valuableModules, id] }));
  };

  const scrollToSection = (id: string) => { document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' }); };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await sendToSheet({
      type: 'VALIDACAO_FINAL',
      ip: userIp,
      timestamp: new Date().toLocaleString('pt-BR'),
      userAgent: navigator.userAgent,
      survey: { likelihood: surveyData.usageLikelihood, modules: surveyData.valuableModules.join(', '), feedback: surveyData.feedback }
    });
    setIsSubmitted(true);
    scrollToSection('pesquisa');
  };

  return (
    <div className="min-h-screen bg-slate-50 overflow-x-hidden text-left">
      <Navbar onNavigate={scrollToSection} />

      {/* Hero: Headline Focada na Dor & Público Amplo */}
      <section className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 overflow-hidden bg-mesh">
        <div className="absolute inset-0 z-0">
          <img src="https://images.unsplash.com/photo-1524758631624-e2822e304c36?auto=format&fit=crop&q=80&w=2070" className="w-full h-full object-cover opacity-10 mix-blend-overlay" alt="Context" />
        </div>
        <div className="max-w-7xl mx-auto px-6 relative z-10 text-center">
          <div className="flex flex-col items-center gap-4 mb-10">
            <div className="inline-flex items-center gap-3 bg-white/10 backdrop-blur-md border border-white/20 px-5 py-2 rounded-full animate-float">
              <span className="flex h-2 w-2 rounded-full bg-sky-400 animate-ping" />
              <span className="text-white text-[11px] font-bold uppercase tracking-[0.2em]">Projeto em Incubação & Co-Criação</span>
            </div>
          </div>
          
          <h1 className="text-5xl lg:text-8xl font-black text-white mb-8 tracking-tight leading-[1.05]">
            Gestão cultural não precisa ser <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-400 via-sky-400 to-indigo-400">um pesadelo burocrático.</span>
          </h1>
          
          <p className="max-w-4xl mx-auto text-xl text-slate-400 mb-12 leading-relaxed font-medium">
            A <strong>Nuvem Cultural</strong> está sendo desenhada para libertar OSCs, Coletivos, Produtoras (ME/MEI) e Agentes Independentes do estresse da prestação de contas e governança.
          </p>

          <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
            <button onClick={() => scrollToSection('pesquisa')} className="px-12 py-6 bg-indigo-600 text-white rounded-2xl font-black text-xl hover:bg-indigo-500 shadow-3xl shadow-indigo-600/30 active:scale-95 transition-all">Participar da Incubação</button>
            <div className="flex flex-col items-center gap-2">
               <button onClick={() => scrollToSection('manifesto')} className="text-indigo-400 font-bold hover:text-white transition-colors underline underline-offset-8">Conheça nosso Modelo Social</button>
               <span className="text-[10px] text-slate-500 font-black uppercase tracking-widest">Meta: Gratuidade Absoluta</span>
            </div>
          </div>
        </div>
      </section>

      {/* Seção de Público: Delimitação */}
      <section id="publico" className="py-24 bg-white border-y border-slate-100 scroll-mt-24">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <Badge color="blue">Para quem estamos construindo?</Badge>
            <h2 className="text-4xl font-black text-slate-900 mt-6 tracking-tight">Do Agente Independente à Instituição.</h2>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="p-10 bg-indigo-50 rounded-[3rem] border border-indigo-100 flex flex-col h-full hover:shadow-2xl transition-all">
              <span className="text-4xl mb-6 block">🏛️</span>
              <h3 className="text-2xl font-black text-indigo-950 mb-4">OSCs e Instituições</h3>
              <p className="text-indigo-900/70 font-medium text-sm leading-relaxed">Foco em governança de diretoria, CNDs automáticas e prestação de contas de grandes editais.</p>
            </div>
            <div className="p-10 bg-slate-50 rounded-[3rem] border border-slate-100 flex flex-col h-full hover:shadow-2xl transition-all">
              <span className="text-4xl mb-6 block">🤝</span>
              <h3 className="text-2xl font-black text-slate-900 mb-4">Coletivos e Grupos</h3>
              <p className="text-slate-500 font-medium text-sm leading-relaxed">Gestão compartilhada de atividades, agenda pública e registro coletivo de impacto social.</p>
            </div>
            <div className="p-10 bg-sky-50 rounded-[3rem] border border-sky-100 flex flex-col h-full hover:shadow-2xl transition-all">
              <span className="text-4xl mb-6 block">🎨</span>
              <h3 className="text-2xl font-black text-sky-950 mb-4">Independentes (MEI/PF)</h3>
              <p className="text-sky-900/70 font-medium text-sm leading-relaxed">Controle de portfólio, depoimentos de impacto e organização financeira simplificada para produtores.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Manifesto de Acesso: O Diferencial Ético */}
      <section id="manifesto" className="py-24 bg-slate-900 text-white scroll-mt-24 relative overflow-hidden">
        <div className="max-w-4xl mx-auto px-6 relative z-10">
          <div className="text-center mb-12">
            <Badge color="orange">Compromisso Social</Badge>
            <h2 className="text-4xl lg:text-5xl font-black mt-6 tracking-tight">Tecnologia sem fins lucrativos.</h2>
          </div>
          <div className="glass-card bg-white/5 border-white/10 rounded-[3rem] p-12 text-center">
            <p className="text-xl text-slate-300 leading-relaxed font-medium mb-10">
              "Nossa meta primária é disponibilizar a Nuvem Cultural de forma <strong>totalmente gratuita</strong>. Caso os custos de infraestrutura exijam, operaremos a <strong>preço de custo social</strong>, garantindo que o acesso à gestão profissional não seja um privilégio de quem tem recursos."
            </p>
            <div className="grid sm:grid-cols-2 gap-6">
               <div className="flex items-center gap-4 p-4 bg-white/5 rounded-2xl border border-white/5">
                  <div className="w-10 h-10 bg-green-500/20 text-green-400 rounded-lg flex items-center justify-center font-bold">✓</div>
                  <span className="text-xs font-bold uppercase tracking-widest text-left">Prioridade 1: Gratuidade</span>
               </div>
               <div className="flex items-center gap-4 p-4 bg-white/5 rounded-2xl border border-white/5">
                  <div className="w-10 h-10 bg-orange-500/20 text-orange-400 rounded-lg flex items-center justify-center font-bold">✓</div>
                  <span className="text-xs font-bold uppercase tracking-widest text-left">Prioridade 2: Custo Social</span>
               </div>
            </div>
          </div>
        </div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-indigo-600/10 blur-[120px] pointer-events-none" />
      </section>

      {/* Módulos: Hipóteses de Solução */}
      <section id="modulos" className="py-24 bg-white scroll-mt-24">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col md:flex-row justify-between items-end gap-8 mb-16">
            <div className="text-left">
              <Badge color="purple">Soluções em Modelagem</Badge>
              <h2 className="text-4xl font-black text-slate-900 mt-6 tracking-tight">O que estamos validando.</h2>
              <p className="text-slate-500 font-medium mt-4">Clique nos módulos para ver os detalhes da nossa aposta estratégica.</p>
            </div>
            <div className="flex flex-wrap gap-2">
              {['Tudo', 'Gestão', 'Social', 'Financeiro', 'Inovação'].map(cat => (
                <button key={cat} onClick={() => setActiveFilter(cat)} className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest border transition-all ${activeFilter === cat ? 'bg-indigo-600 border-indigo-600 text-white' : 'bg-white border-slate-200 text-slate-400 hover:border-indigo-200'}`}>{cat}</button>
              ))}
            </div>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {filteredModules.slice(0, 12).map(m => <ModuleCard key={m.id} module={m} onClick={setSelectedModule} />)}
          </div>
        </div>
      </section>

      {/* Idealizador: Autoridade Vivida */}
      <section id="idealizador" className="py-24 bg-slate-50 scroll-mt-24">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-20 items-center">
             <div className="relative">
                <div className="aspect-[4/5] rounded-[4rem] overflow-hidden shadow-2xl border-8 border-white">
                   <img src="https://images.unsplash.com/photo-1507676184212-d03ab07a01bf?auto=format&fit=crop&q=80&w=1000" className="w-full h-full object-cover" alt="Guilherme" />
                </div>
                <div className="absolute -bottom-6 -right-6 bg-indigo-600 p-8 rounded-[2rem] text-white shadow-3xl max-w-[240px]">
                   <span className="text-[10px] font-black uppercase tracking-widest opacity-60">Idealizador</span>
                   <h4 className="text-xl font-black mt-2">Guilherme Rezende</h4>
                   <p className="text-xs font-bold mt-2 text-indigo-200">Músico, TI e Gestor com 10 anos de experiência em OSCs Culturais.</p>
                </div>
             </div>
             <div className="text-left">
                <Badge color="blue">Autoridade Vivida</Badge>
                <h2 className="text-4xl lg:text-6xl font-black text-slate-900 mt-6 mb-8 tracking-tight">Experiência Real, <br/> não apenas código.</h2>
                <p className="text-slate-600 text-xl font-medium mb-10 leading-relaxed italic">
                  "Eu vivi o gargalo de cada ata, de cada centavo prestado, e vi que a tecnologia é a única forma de libertar o potencial criativo do agente cultural. A Nuvem Cultural é a sistematização desse aprendizado."
                </p>
                <div className="grid grid-cols-2 gap-4">
                   <div className="p-6 bg-white rounded-3xl border border-slate-200 shadow-sm"><span className="text-3xl block mb-2">📚</span><p className="text-xs font-black text-slate-400 uppercase tracking-widest">Trajetória Institucional</p><p className="text-sm font-bold text-slate-800 mt-1">Biblioteca à Tesouraria</p></div>
                   <div className="p-6 bg-white rounded-3xl border border-slate-200 shadow-sm"><span className="text-3xl block mb-2">💻</span><p className="text-xs font-black text-slate-400 uppercase tracking-widest">Trajetória Técnica</p><p className="text-sm font-bold text-slate-800 mt-1">Desenvolvimento focado no Terceiro Setor</p></div>
                </div>
             </div>
          </div>
        </div>
      </section>

      {/* Experimento: Visão de IA */}
      <section id="experimento" className="py-24 bg-white text-left scroll-mt-24">
        <div className="max-w-7xl mx-auto px-6">
          <div className="mb-12">
            <Badge color="purple">Inteligência de Impacto</Badge>
            <h2 className="text-4xl font-black text-slate-900 mt-4 tracking-tight">Visualize o Futuro do seu Portfólio.</h2>
            <p className="text-slate-500 max-w-2xl mt-4">Estamos testando como a IA pode transformar seus dados frios em narrativas de impacto poderosas para doadores e editais.</p>
          </div>
          <VisionGenerator />
        </div>
      </section>

      {/* Pesquisa: O Formulário de Validação Principal */}
      <section id="pesquisa" className="py-32 bg-mesh relative scroll-mt-24">
        <div className="max-w-4xl mx-auto px-6 relative z-10">
          <div className="glass-card rounded-[4rem] p-10 md:p-20 border-white/10 shadow-3xl text-center">
            {!isSubmitted ? (
              <form onSubmit={handleSubmit} className="space-y-16">
                <div className="text-center">
                  <Badge color="orange">Co-Criação Cultural</Badge>
                  <h2 className="text-5xl font-black text-white mb-8 mt-6 tracking-tight">Ajude a moldar a ferramenta.</h2>
                  <p className="text-slate-400 text-lg font-medium">Sua participação na incubação garante que construiremos o que você realmente precisa.</p>
                </div>

                <div className="space-y-12 text-left">
                  <div className="space-y-6">
                    <label className="block text-white text-xl font-bold opacity-80 italic">Qual o nível de estresse da sua gestão/prestação hoje?</label>
                    <div className="flex justify-between items-center max-w-md mx-auto bg-white/5 p-4 rounded-3xl border border-white/5">
                      <span className="text-[10px] font-bold text-slate-500 uppercase px-4">Baixo</span>
                      <div className="flex gap-3">
                        {[1, 2, 3, 4, 5].map(v => <button key={v} type="button" onClick={() => setSurveyData(prev => ({ ...prev, usageLikelihood: v }))} className={`w-12 h-12 rounded-xl font-black text-lg transition-all ${surveyData.usageLikelihood === v ? 'bg-indigo-600 text-white scale-110 shadow-2xl' : 'bg-white/5 text-slate-400 hover:bg-white/10'}`}>{v}</button>)}
                      </div>
                      <span className="text-[10px] font-bold text-red-400 uppercase px-4">Alto</span>
                    </div>
                  </div>

                  <div className="space-y-6">
                    <label className="block text-white text-xl font-bold opacity-80 italic">Quais módulos são prioridade absoluta?</label>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                      {['Datas e Impacto', 'Equidade Interna', 'Gerenciamento Diretoria', 'Monitoramento Editais', 'CRM Beneficiários', 'Gestão de Doadores'].map(m => (
                        <button key={m} type="button" onClick={() => toggleValuableModule(m)} className={`p-4 rounded-xl text-[10px] font-bold uppercase transition-all border ${surveyData.valuableModules.includes(m) ? 'bg-indigo-600 border-indigo-500 text-white shadow-lg' : 'bg-white/5 border-white/5 text-slate-400'}`}>{m}</button>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-6">
                    <label className="block text-white text-xl font-bold opacity-80 italic">Diga-nos o seu maior desafio hoje:</label>
                    <textarea value={surveyData.feedback} onChange={(e) => setSurveyData(prev => ({ ...prev, feedback: e.target.value }))} className="w-full p-8 bg-white/5 border border-white/5 rounded-[2.5rem] text-white placeholder:text-slate-700 min-h-[160px] focus:outline-none focus:ring-4 focus:ring-indigo-600/20 transition-all" placeholder="Ex: 'Preciso de um jeito fácil de provar meu impacto para editais' ou 'Minhas certidões sempre vencem'..." />
                  </div>
                </div>

                <button type="submit" className="w-full py-8 bg-indigo-600 text-white font-black text-2xl rounded-[2.5rem] hover:bg-indigo-500 shadow-3xl active:scale-[0.98] transition-all">Enviar para o Guilherme Rezende</button>
              </form>
            ) : (
              <div className="text-center py-16">
                <div className="w-24 h-24 bg-green-500/20 text-green-400 rounded-full flex items-center justify-center text-5xl mx-auto mb-10">✓</div>
                <h2 className="text-5xl font-black text-white mb-6">Feedback Recebido!</h2>
                <p className="text-slate-400 text-xl font-medium mb-12 max-w-sm mx-auto">Suas dores acabam de se tornar nossa prioridade de incubação.</p>
                <button onClick={() => setIsSubmitted(false)} className="px-12 py-5 bg-white/5 text-white font-bold rounded-2xl hover:bg-white/10 transition-all">Enviar outro comentário</button>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Footer Final */}
      <footer className="py-24 bg-slate-950 text-slate-500 border-t border-white/5 text-left">
        <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-2 lg:grid-cols-4 gap-12 items-start">
          <div className="flex flex-col gap-6">
            <div className="flex items-center gap-3">
               <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center text-white font-bold shadow-indigo-600/20 shadow-xl">N</div>
               <span className="text-2xl font-black text-white tracking-tight">nuvem cultural</span>
            </div>
            <p className="text-xs font-medium leading-relaxed max-w-xs">Tecnologia, vivência e gestão em favor da economia criativa. Projeto idealizado por Guilherme Rezende.</p>
            <div className="flex gap-4">
              <Badge color="orange">Social-First</Badge>
              <Badge color="slate">Incubação 2024</Badge>
            </div>
          </div>
          <div>
            <h4 className="text-white font-bold mb-6 text-sm uppercase tracking-widest">Navegação</h4>
            <ul className="space-y-4 text-xs font-bold uppercase tracking-wider">
               <li><button onClick={() => scrollToSection('publico')} className="hover:text-indigo-400 transition-colors">Público-Alvo</button></li>
               <li><button onClick={() => scrollToSection('modulos')} className="hover:text-indigo-400 transition-colors">Funcionalidades</button></li>
               <li><button onClick={() => scrollToSection('manifesto')} className="hover:text-indigo-400 transition-colors">Modelo Social</button></li>
            </ul>
          </div>
          <div>
            <h4 className="text-white font-bold mb-6 text-sm uppercase tracking-widest">Conectar</h4>
            <ul className="space-y-4 text-xs font-bold uppercase tracking-wider">
               <li><a href="https://linkedin.com/in/guilherme-rezende" target="_blank" className="hover:text-indigo-400 transition-colors">LinkedIn</a></li>
               <li><a href="https://instagram.com/guilherme-rezende" target="_blank" className="hover:text-indigo-400 transition-colors">Instagram</a></li>
            </ul>
          </div>
          <div className="lg:col-span-1">
             <span className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-800">© 2024 Nuvem Cultural — Co-criação Aberta</span>
          </div>
        </div>
      </footer>

      {selectedModule && <ModuleModal module={selectedModule} onClose={() => setSelectedModule(null)} />}
    </div>
  );
};

export default App;
