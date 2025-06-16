import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Navigation, Pagination } from 'swiper/modules'; // Adicione Autoplay aqui
import { Link } from 'react-router-dom';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import "../css/main.css";
import "../css/carousel.css"
import banners from "../mockdata/banners.jsx"

function Carousel() {

    return (
        <section className="carousel-section">
            <Swiper
                modules={[Autoplay, Navigation, Pagination]}
                loop={true}
                pagination={{ clickable: true }}
                // navigation={true} //setas com erro
                autoplay={{ // Adicionado para que o carrossel avance automaticamente
                    delay: 5000, // 5 segundos
                    disableOnInteraction: false, // Continua o autoplay mesmo após interação do usuário
                }}
                className="Swiper" // Classe aplicada ao container Swiper
                // --- PROPRIEDADES DE RESPONSIVIDADE PARA O SWIPER ---
                slidesPerView={1} // Por padrão, sempre 1 slide visível (ótimo para mobile)
                spaceBetween={0} // Sem espaço entre os slides
            >
                {banners.map((banner, index) => (
                    <SwiperSlide key={index}>
                        <Link to={`/product/${banner.id}`} className="carousel-link">
                            <img 
                                src={banner.image} 
                                alt={banner.alt} 
                                style={{ width: '100%', height: 'auto', display: 'block' }} 
                            />
                        </Link>
                    </SwiperSlide>
                ))}
            </Swiper>
        </section>
    )
}

export default Carousel;