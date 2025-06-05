import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Navigation, Pagination } from 'swiper/modules';
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
            modules={[Navigation, Pagination]}
            loop={true}
            pagination={{ clickable: true }}
            // navigation={true} // setas com erro
            className="Swiper"
        >
            {banners.map((banner, index) => (
                <SwiperSlide key={index}>
                    <Link to={`/product/${banner.id}`} className="carousel-link">
                        <img src={banner.image} alt={banner.alt} />
                    </Link>
                </SwiperSlide>
            ))}
        </Swiper>
        </section>
    )
}

export default Carousel;