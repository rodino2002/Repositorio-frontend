import React from 'react';
import { 
  Globe, 
  ShieldCheck, 
  ArrowRight, 
  Cpu, 
  Award,
  Instagram,
  Facebook,
  Linkedin
} from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const ISPBLandingPage = () => {
  return (
    // Fundo off-white/creme idêntico ao site do ISPB e fonte limpa
    <div className="min-h-screen bg-[#FDFBF9] font-sans antialiased text-[#1A1A1A]">
      
      {/* --- NAV BAR --- */}
      <nav className="flex items-center justify-between px-6 md:px-16 py-5 bg-white border-b border-zinc-100 sticky top-0 z-50">
        <div className="flex items-center gap-3">
          {/* Logo simulado com o vermelho oficial */}
          <div className="bg-[#E53935] p-2 rounded">
            <Award className="text-white w-5 h-5" />
          </div>
          <div className="flex flex-col">
            <span className="text-lg font-black tracking-tighter text-zinc-900 leading-none">ISPB</span>
            <span className="text-xs font-bold text-[#E53935] uppercase tracking-widest mt-0.5">Repositório</span>
          </div>
        </div>
        
        {/* Links no estilo corporativo do ISPB */}
        <div className="hidden md:flex items-center gap-8 font-semibold text-xs uppercase tracking-wider text-zinc-700">
          <a href="#impacto" className="hover:text-[#E53935] transition-colors">Impacto</a>
          <a href="#tecnologia" className="hover:text-[#E53935] transition-colors">Tecnologia</a>
          <a href="#estatisticas" className="hover:text-[#E53935] transition-colors">Estatísticas</a>
          <Button className="bg-[#E53935] hover:bg-[#C62828] text-white font-bold uppercase tracking-wider text-xs rounded px-6 h-10 transition-colors">
            Entrar →
          </Button>
        </div>
      </nav>

      {/* --- HERO SECTION --- */}
      {/* relative e overflow-hidden para podermos brincar com formas geométricas no fundo, simulando a estrela */}
      <section className="relative px-6 md:px-16 py-20 lg:py-32 overflow-hidden bg-[#FDFBF9]">
        {/* Elemento decorativo que imita a ponta da Estrela Laranja/Vermelha do site */}
        <div className="absolute right-0 top-1/2 -translate-y-1/2 w-[45%] h-[90%] bg-gradient-to-br from-[#FF7A59]/10 to-[#E53935]/5 rounded-l-[200px] pointer-events-none hidden lg:block" />

        <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-12 items-center relative z-10">
          <div className="space-y-6">
            <Badge className="bg-red-50 text-[#E53935] border border-red-100 px-3 py-1 text-xs font-bold uppercase tracking-wider rounded">
              Inteligência Artificial Acadêmica
            </Badge>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-zinc-900 tracking-tight uppercase leading-[1.05]">
              Cursos Acreditados <br />
              <span className="text-[#E53935]">pelo MESCTI</span> e Investigação Científica
            </h1>
            <p className="text-base md:text-lg text-zinc-600 leading-relaxed max-w-xl font-normal">
              Não procure apenas por palavras. Descubra significados. O nosso repositório utiliza busca semântica para conectar estudantes e investigadores ao conhecimento angolano de forma inteligente.
            </p>
            <div className="flex flex-wrap gap-4 pt-4">
              <Button className="h-12 px-6 bg-[#E53935] hover:bg-[#C62828] text-white font-bold uppercase tracking-wider text-xs rounded transition-all group">
                Explorar Trabalhos 
                <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Button>
              <Button variant="outline" className="h-12 px-6 border-2 border-zinc-900 text-zinc-900 font-bold uppercase tracking-wider text-xs rounded hover:bg-zinc-950 hover:text-white transition-all">
                Ver Demonstração
              </Button>
            </div>
          </div>

          {/* Imagem com visual limpo e bordas mais discretas para bater com o padrão */}
          <div className="relative">
             <Card className="border-none shadow-xl rounded-lg overflow-hidden bg-white">
                <img 
                  src="https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?auto=format&fit=crop&q=80&w=1000" 
                  alt="Scientific Research ISPB" 
                  className="w-full h-[400px] md:h-[480px] object-cover grayscale-[20%] contrast-[110%]"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent flex items-end p-6 md:p-8">
                    <div className="text-white max-w-md">
                       <p className="text-[#FF7A59] text-xs font-bold uppercase tracking-widest mb-1">Impacto Real</p>
                       <h3 className="text-lg md:text-xl font-medium tracking-tight">"Transformando dados em descobertas para o desenvolvimento de Angola e de Benguela."</h3>
                    </div>
                </div>
             </Card>
          </div>
        </div>
      </section>

      {/* --- IMPACT & FEATURES (Fundo Vermelho do Card institucional) --- */}
      <section id="tecnologia" className="bg-[#E53935] py-20 px-6 md:px-16 text-white relative">
        <div className="max-w-7xl mx-auto">
          <div className="mb-14 space-y-2">
            <span className="text-xs font-bold uppercase tracking-widest text-red-200">Inovação</span>
            <h2 className="text-3xl md:text-4xl font-black uppercase tracking-tight">Por que o Repositório Semântico?</h2>
            <div className="w-16 h-1 bg-white mt-4" />
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              { 
                icon: <Cpu className="w-6 h-6" />, 
                title: "Busca Inteligente", 
                desc: "Algoritmos que entendem o contexto real do seu tema em Benguela, não apenas palavras isoladas." 
              },
              { 
                icon: <Globe className="w-6 h-6" />, 
                title: "Acesso Global", 
                desc: "Os trabalhos do ISPB visíveis para o mundo, aumentando expressivamente o prestígio acadêmico da instituição." 
              },
              { 
                icon: <ShieldCheck className="w-6 h-6" />, 
                title: "Integridade Científica", 
                desc: "Verificação rigorosa de similaridade e validação de ética científica em todos os envios de artigos e TCCs." 
              }
            ].map((feature, i) => (
              <Card key={i} className="bg-white/10 border-white/10 hover:bg-white/15 text-white transition-all p-8 rounded-md group">
                <div className="bg-white text-[#E53935] p-3 rounded w-fit mb-6 transition-transform">
                  {feature.icon}
                </div>
                <h3 className="text-lg font-bold uppercase tracking-wide mb-3">{feature.title}</h3>
                <p className="text-red-100 text-sm leading-relaxed font-normal">{feature.desc}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* --- STATISTICS SECTION --- */}
      <section id="estatisticas" className="py-20 px-6 md:px-16 bg-white">
        <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          <div>
            <h4 className="text-4xl md:text-5xl font-black text-zinc-900 mb-1">1.2k+</h4>
            <p className="text-xs font-bold uppercase tracking-wider text-zinc-400">Trabalhos Publicados</p>
          </div>
          <div>
            <h4 className="text-4xl md:text-5xl font-black text-[#E53935] mb-1">85%</h4>
            <p className="text-xs font-bold uppercase tracking-wider text-zinc-400">Precisão Semântica</p>
          </div>
          <div>
            <h4 className="text-4xl md:text-5xl font-black text-zinc-900 mb-1">450</h4>
            <p className="text-xs font-bold uppercase tracking-wider text-zinc-400">Investigadores Ativos</p>
          </div>
          <div>
            <h4 className="text-4xl md:text-5xl font-black text-[#E53935] mb-1">15k</h4>
            <p className="text-xs font-bold uppercase tracking-wider text-zinc-400">Downloads Mensais</p>
          </div>
        </div>
      </section>

      {/* --- CALL TO ACTION --- */}
      <section className="px-6 pb-20 bg-white">
        <div className="max-w-7xl mx-auto bg-zinc-900 rounded-lg p-8 md:p-16 text-center text-white relative overflow-hidden shadow-xl">
           <h2 className="text-3xl md:text-4xl font-black uppercase tracking-tight mb-4 relative z-10">Pronto para elevar a sua investigação?</h2>
           <p className="text-sm md:text-base mb-8 text-zinc-400 max-w-2xl mx-auto relative z-10">
             Junte-se à comunidade científica do ISPB e tenha acesso exclusivo aos trabalhos e dados que estão a moldar o futuro acadêmico e tecnológico de Angola.
           </p>
           <Button className="bg-[#E53935] hover:bg-[#C62828] text-white font-bold uppercase tracking-wider text-xs h-12 px-8 rounded relative z-10 transition-colors">
             Começar agora gratuitamente
           </Button>
        </div>
      </section>

      {/* --- FOOTER INSTITUCIONAL COMPLETO (Baseado no Site Oficial) --- */}
      <footer className="bg-[#121212] text-zinc-400 py-16 px-6 md:px-16 border-t border-zinc-800">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-12 text-left">
          
          {/* Coluna 1: Contactos */}
          <div className="space-y-4">
            <h5 className="text-white text-xs font-bold uppercase tracking-widest border-b border-red-500 pb-2 w-fit">Contactos</h5>
            <div className="space-y-2 text-sm">
              <p className="hover:text-white transition-colors">+(244) 923 919 100</p>
              <p className="hover:text-white transition-colors">geral@ispbenguela.com</p>
              <p className="text-zinc-500">Av. Governador Moutinho, T 125</p>
            </div>
            {/* Ícones sociais adicionados ao rodapé esquerdo */}
            <div className="flex items-center gap-4 pt-2">
              <a href="#" className="hover:text-white transition-colors"><Instagram className="w-5 h-5" /></a>
              <a href="#" className="hover:text-white transition-colors"><Facebook className="w-5 h-5" /></a>
              <a href="#" className="hover:text-white transition-colors"><Linkedin className="w-5 h-5" /></a>
            </div>
          </div>

          {/* Coluna 2: Recursos */}
          <div className="space-y-4">
            <h5 className="text-white text-xs font-bold uppercase tracking-widest border-b border-red-500 pb-2 w-fit">Recursos</h5>
            <div className="flex flex-col space-y-2 text-sm">
              <a href="#" className="hover:text-white transition-colors">OnBoarding</a>
              <a href="#" className="hover:text-white transition-colors">Moodle</a>
            </div>
          </div>

          {/* Coluna 3: O Instituto */}
          <div className="space-y-4">
            <h5 className="text-white text-xs font-bold uppercase tracking-widest border-b border-red-500 pb-2 w-fit">O Instituto</h5>
            <div className="flex flex-col space-y-2 text-sm">
              <a href="#" className="hover:text-white transition-colors">História</a>
              <a href="#" className="hover:text-white transition-colors">Sobre nós</a>
            </div>
          </div>
        </div>

        {/* Linha de Copyright inferior limpa */}
        <div className="max-w-7xl mx-auto mt-12 pt-8 border-t border-zinc-800 text-center text-xs text-zinc-600 flex flex-col md:flex-row justify-between items-center gap-4">
          <p>2026 © Instituto Superior Politécnico de Benguela.</p>
          <div className="flex items-center gap-4">
            <a href="#" className="hover:text-zinc-400"><Instagram className="w-4 h-4" /></a>
            <a href="#" className="hover:text-zinc-400"><Facebook className="w-4 h-4" /></a>
            <a href="#" className="hover:text-zinc-400"><Linkedin className="w-4 h-4" /></a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default ISPBLandingPage;