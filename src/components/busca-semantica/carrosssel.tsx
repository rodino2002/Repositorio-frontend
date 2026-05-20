import { useState, useRef, useEffect } from "react";
import img1 from "@/assets/carrossel/img1.jpeg"
import img2 from "@/assets/carrossel/img2.jpeg"
import img3 from "@/assets/carrossel/img3.jpeg"
import img4 from "@/assets/carrossel/img4.jpeg"
import img5 from "@/assets/carrossel/img5.jpeg"
import img6 from "@/assets/carrossel/img6.jpeg"
import img7 from "@/assets/carrossel/img7.jpeg"
import img8 from "@/assets/carrossel/img8.jpeg"
import img9 from "@/assets/carrossel/img9.jpeg"

const carouselImages = [
        {
            id: 1,
            image:
                img1,
            title: "Campus Universitário Moderno",
            subtitle: "Inspirado no ambiente académico do ISPB",
        },
        {
            id: 2,
            image:
                img2,
            title: "Investigação Científica e Tecnologia",
            subtitle: "Pesquisa semântica com inteligência artificial",
        },
        {
            id: 3,
            image:
                img3,
            title: "Biblioteca e Produção Científica",
            subtitle: "Explore trabalhos académicos publicados",
        },
        {
            id: 4,
            image:
                img4,
            title: "Laboratórios e Inovação",
            subtitle: "Ambientes de pesquisa equipada com tecnologia de ponta",
        },
        {
            id: 5,
            image:
                img5,
            title: "Estudos e Colaboração",
            subtitle: "Áreas de estudo inspiradoras para trabalhos em equipa",
        },
        {
            id: 6,
            image:
                img6,
            title: "Soluções Tecnológicas Avançadas",
            subtitle: "Plataformas integradas para análise semântica",
        },
        {
            id: 7,
            image:
                img7,
            title: "Espaços Académicos Inspiradores",
            subtitle: "Design pensado para promover criatividade e foco",
        },
        {
            id: 8,
            image:
                img8,
            title: "Eventos Científicos e Workshops",
            subtitle: "Aprendizagem contínua com especialistas e investigadores",
        },
        {
            id: 9,
            image:
                img9,
            title: "Futuro da Pesquisa Académica",
            subtitle: "Descubra insights através da pesquisa semântica",
        },
    ]
    
export default function Carrossel() {
  const [currentIndex, setCurrentIndex] = useState(0);
const carouselRef = useRef<HTMLDivElement>(null);

const scrollToSlide = (index: number) => {
    if (carouselRef.current) {
        const slideWidth = carouselRef.current.offsetWidth;
        carouselRef.current.scrollTo({
            left: slideWidth * index,
            behavior: "smooth",
        });
        setCurrentIndex(index);
    }
};

// Atualiza a bolinha ativa caso o utilizador arraste com o dedo/rato
const handleScroll = () => {
    if (carouselRef.current) {
        const { scrollLeft, offsetWidth } = carouselRef.current;
        const index = Math.round(scrollLeft / offsetWidth);
        setCurrentIndex(index);
    }
};

useEffect(() => {
    const timer = setInterval(() => {
        // 1. Calcula qual será o próximo índice
        const nextIndex = currentIndex === carouselImages.length - 1 ? 0 : currentIndex + 1;
        
        // 2. Dispara a função que faz o scroll físico e atualiza o estado
        scrollToSlide(nextIndex);
    }, 3000); // 2 segundos

    return () => clearInterval(timer);
}, [currentIndex]); // Reinicia o timer sempre que o índice muda (evita conflito com o clique manual)
    return (
        <section className="relative h-[90vh] min-h-175 w-full overflow-hidden bg-zinc-900">
            {/* Wrapper das Imagens */}
            <div 
                ref={carouselRef}
                onScroll={handleScroll}
                className="flex h-full w-full overflow-x-auto snap-x snap-mandatory scrollbar-none scroll-smooth"
            >
                {carouselImages?.map((slide) => (
                    <div
                        key={slide.id}
                        className="relative min-w-full h-full snap-start shrink-0"
                    >
                        {/* Imagem de Fundo */}
                        <img
                            src={slide.image}
                            alt={slide.title}
                            className="absolute inset-0 w-full h-full object-cover"
                        />

                        {/* Overlay Escuro */}
                        <div className="absolute inset-0 bg-black/60" />

                        {/* Conteúdo Textual */}
                        <div className="absolute inset-0 flex items-center z-10">
                            <div className="max-w-7xl mx-auto px-6 lg:px-10 w-full">
                                <div className="max-w-3xl text-white">
                                    <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md border border-white/20 px-4 py-2 rounded-full text-sm font-semibold mb-6">
                                        Plataforma Inteligente de Pesquisa Académica
                                    </div>

                                    <h1 className="text-5xl md:text-6xl lg:text-7xl font-black leading-tight tracking-tight">
                                        {slide.title}
                                    </h1>

                                    <p className="mt-6 text-zinc-200 text-lg md:text-xl leading-relaxed max-w-2xl">
                                        {slide.subtitle}
                                    </p>

                                    <div className="mt-10 flex flex-col sm:flex-row gap-4">
                                        <button className="bg-[#FC9500] hover:opacity-90 transition rounded-2xl px-8 py-4 text-white font-semibold shadow-2xl shadow-[#FC9500]/30">
                                            Explorar Trabalhos
                                        </button>

                                        <button className="bg-white/10 backdrop-blur-md border border-white/20 hover:bg-white/20 transition rounded-2xl px-8 py-4 font-semibold text-white">
                                            Pesquisa Semântica
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Indicadores/Botões de Paginação (Garante que ficam no topo com z-30) */}
            <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-50 flex gap-3 ">
                {carouselImages.map((_, index) => (
                    <button
                        key={index}
                        onClick={() => scrollToSlide(index)}
                        className={`h-3 rounded-full transition-all duration-300 ${
                            currentIndex === index 
                                ? "w-8 bg-[#FC9500] cursor-pointer" 
                                : "w-3 bg-zinc-200 hover:bg-white/80 ring-1 ring-zinc-300 cursor-pointer"
                        } backdrop-blur-md`}
                        aria-label={`Ir para o slide ${index + 1}`}
                    />
                ))}
            </div>
        </section>
    );
}