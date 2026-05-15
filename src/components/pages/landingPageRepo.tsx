import React from 'react';
import { 
  Search, 
  BookOpen, 
  BarChart3, 
  Globe, 
  ShieldCheck, 
  ArrowRight, 
  Cpu, 
  Users,
  Award
} from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Card, } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const ISPBLandingPage = () => {
  return (
    <div className="min-h-screen bg-[#F8FAFC] font-sans">
      {/* --- NAV BAR --- */}
      <nav className="flex items-center justify-between px-12 py-6 bg-white border-b border-gray-100 sticky top-0 z-50">
        <div className="flex items-center gap-3">
          <div className="bg-[#141B59] p-2 rounded-lg">
            <Award className="text-white w-6 h-6" />
          </div>
          <span className="text-2xl font-bold text-[#141B59]">ISPB <span className="text-orange-500">Repositório</span></span>
        </div>
        <div className="hidden md:flex items-center gap-8 font-medium text-[#141B59]">
          <a href="#impacto" className="hover:text-orange-500 transition-colors">Impacto</a>
          <a href="#tecnologia" className="hover:text-orange-500 transition-colors">Tecnologia</a>
          <a href="#estatisticas" className="hover:text-orange-500 transition-colors">Estatísticas</a>
          <Button className="bg-[#141B59] hover:bg-[#1C2675] rounded-full px-6">
            Aceder ao Repositório
          </Button>
        </div>
      </nav>

      {/* --- HERO SECTION --- */}
      <section className="relative px-12 py-24 overflow-hidden">
        <div className="max-w-6xl mx-auto grid lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-8">
            <Badge className="bg-orange-100 text-orange-600 hover:bg-orange-100 border-none px-4 py-1 text-sm rounded-full">
              Inteligência Artificial Acadêmica
            </Badge>
            <h1 className="text-6xl font-extrabold text-[#141B59] leading-[1.1]">
              A Próxima Fronteira da <span className="text-orange-500">Investigação</span> Científica no ISPB.
            </h1>
            <p className="text-xl text-gray-600 leading-relaxed max-w-xl">
              Não procure apenas por palavras. Descubra significados. O nosso repositório utiliza busca semântica para conectar estudantes e investigadores ao conhecimento angolano de forma inteligente.
            </p>
            <div className="flex gap-4">
              <Button className="h-14 px-8 bg-orange-500 hover:bg-orange-600 text-lg rounded-2xl shadow-lg shadow-orange-500/20 group">
                Explorar Trabalhos 
                <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Button>
              <Button variant="outline" className="h-14 px-8 border-2 border-[#141B59] text-[#141B59] text-lg rounded-2xl hover:bg-[#141B59]/5">
                Ver Demonstração
              </Button>
            </div>
          </div>

          {/* Visual Element (Representing the Search UI) */}
          <div className="relative">
             <div className="absolute -top-12 -left-12 w-64 h-64 bg-orange-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-pulse"></div>
             <Card className="border-none shadow-2xl rounded-[32px] overflow-hidden rotate-2">
                <img 
                  src="https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?auto=format&fit=crop&q=80&w=1000" 
                  alt="Scientific Research" 
                  className="w-full h-[500px] object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#141B59] to-transparent flex items-end p-8">
                   <div className="text-white">
                      <p className="text-orange-400 font-bold mb-2">Impacto Real</p>
                      <h3 className="text-2xl font-bold italic">"Transformando dados em descobertas para o desenvolvimento de Angola."</h3>
                   </div>
                </div>
             </Card>
          </div>
        </div>
      </section>

      {/* --- IMPACT & FEATURES --- */}
      <section id="tecnologia" className="bg-[#141B59] py-24 px-12 text-white">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16 space-y-4">
            <h2 className="text-4xl font-bold">Por que o Repositório <span className="text-orange-400">Semântico?</span></h2>
            <p className="text-gray-300 max-w-2xl mx-auto">Tecnologia de ponta ao serviço da educação no Instituto Superior Politécnico de Benguela.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              { 
                icon: <Cpu className="w-8 h-8" />, 
                title: "Busca Inteligente", 
                desc: "Algoritmos que entendem o contexto do seu tema, não apenas as letras." 
              },
              { 
                icon: <Globe className="w-8 h-8" />, 
                title: "Acesso Global", 
                desc: "Os trabalhos do ISPB visíveis para o mundo, aumentando o prestígio acadêmico." 
              },
              { 
                icon: <ShieldCheck className="w-8 h-8" />, 
                title: "Integridade", 
                desc: "Verificação rigorosa de plágio e validação de ética científica em todos os envios." 
              }
            ].map((feature, i) => (
              <Card key={i} className="bg-white/5 border-white/10 hover:bg-white/10 transition-all p-8 rounded-3xl group">
                <div className="bg-orange-500 p-4 rounded-2xl w-fit mb-6 group-hover:scale-110 transition-transform text-white">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-bold mb-3">{feature.title}</h3>
                <p className="text-gray-400 leading-relaxed">{feature.desc}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* --- STATISTICS SECTION --- */}
      <section id="estatisticas" className="py-24 px-12">
        <div className="max-w-6xl mx-auto grid md:grid-cols-4 gap-8 text-center">
          <div>
            <h4 className="text-5xl font-extrabold text-[#141B59] mb-2">1.2k+</h4>
            <p className="text-gray-500 font-medium">Trabalhos Publicados</p>
          </div>
          <div>
            <h4 className="text-5xl font-extrabold text-orange-500 mb-2">85%</h4>
            <p className="text-gray-500 font-medium">Precisão Semântica</p>
          </div>
          <div>
            <h4 className="text-5xl font-extrabold text-[#141B59] mb-2">450</h4>
            <p className="text-gray-500 font-medium">Investigadores Ativos</p>
          </div>
          <div>
            <h4 className="text-5xl font-extrabold text-orange-500 mb-2">15k</h4>
            <p className="text-gray-500 font-medium">Downloads Mensais</p>
          </div>
        </div>
      </section>

      {/* --- CALL TO ACTION --- */}
      <section className="px-12 pb-24">
        <div className="max-w-6xl mx-auto bg-orange-500 rounded-[40px] p-16 text-center text-white relative overflow-hidden shadow-2xl shadow-orange-500/40">
           {/* Decorative circles */}
           <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -mr-32 -mt-32"></div>
           <div className="absolute bottom-0 left-0 w-32 h-32 bg-black/5 rounded-full -ml-16 -mb-16"></div>
           
           <h2 className="text-4xl font-bold mb-6 relative z-10">Pronto para elevar a sua investigação?</h2>
           <p className="text-xl mb-10 text-orange-100 max-w-2xl mx-auto relative z-10">
             Junte-se à comunidade científica do ISPB e tenha acesso exclusivo aos trabalhos que estão a moldar o futuro de Benguela.
           </p>
           <Button className="bg-[#141B59] hover:bg-[#1C2675] text-white h-16 px-12 text-xl rounded-2xl relative z-10">
             Começar agora gratuitamente
           </Button>
        </div>
      </section>

      {/* --- FOOTER --- */}
      <footer className="py-12 border-t border-gray-100 text-center text-gray-500">
        <p>© 2024 ISPB - Instituto Superior Politécnico de Benguela. Todos os direitos reservados.</p>
      </footer>
    </div>
  );
};

export default ISPBLandingPage;