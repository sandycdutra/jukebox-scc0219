import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Navigation, Pagination } from 'swiper/modules';
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
            navigation={true}
            className="Swiper"
        >
            {banners.map((banner, index) => (
                <SwiperSlide key={index}><button className="carousel-button"><img src={banner.image} alt = {banner.alt} /></button></SwiperSlide>
            ))}
        </Swiper>
        </section>
    )
}

export default Carousel;