import React, { useRef, useEffect, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";
import "../style/HorizontalScrollComponent.css";
import circle1 from "../img/кольцо1.svg";
import circle2 from "../img/кольцо2.svg";
import circle3 from "../img/кольцо3.svg";
import circle4 from "../img/Кольцо4.svg";

const HorizontalScrollComponent = () => {
  const scrollRef = useRef(null);
  const isMobile = window.innerWidth <= 768; // Проверка на мобильное устройство
  const [activeIndex, setActiveIndex] = useState(null);

 

  const toggleText = (index) => {
    setActiveIndex(activeIndex === index ? null : index);
  };

  const contentItems = [
    {
      img: '100%',
      h3: "Позитивных отзывов",
      description: "Нас любят, к нам возвращаются.",
      h4: "О Нас:",
      text: `Компания "ASATRIAN TRADING GROUP" предлагает фермерским хозяйствам и крупным агропредприятиям Запорожской области широкий ассортимент сертифицированных средств защиты растений (СЗР), удобрений и посевного материала от ведущих производителей. Мы являемся официальным дилером торговой марки "Август", что гарантирует качество и эффективность нашей продукции.`,
    },
    {
      img: '1500',
      h3: "Довольных клиентов",
      description: "Более 1500 довольных клиентов нашим сервисом",
      h4: "Наша миссия:",
      text: `Создать удобную и надежную платформу для сельхозпроизводителей, где каждый сможет найти все необходимое для успешного ведения агробизнеса. Мы понимаем важность своевременной и правильной защиты урожая.`,
    },
    {
      img: '95%',
      h3: "95% Повторных покупок",
      description: "Клиент ценит скорость, комфорт и отсутствие стресса, которые мы ему предоставляем!",
      h4: "Почему выбирают нас:",
      text: `Качество и надежность: сертифицированные товары от проверенных производителей. Профессиональная поддержка: наши специалисты всегда готовы предоставить консультации по выбору и применению препаратов.`,
    },
    {
      img: '10000',
      h3: "10000 выполненных заказов",
      description: "Более 10000 заказов доставлено к нашим клиентам.",
      h4: "Что мы предлагаем:",
      text: `СЗР (средства защиты растений): широкий выбор гербицидов, фунгицидов и инсектицидов для защиты ваших культур.`,
    },
  ];

  return (
    <>
      {isMobile ? (
        <Swiper
        spaceBetween={10}
        slidesPerView={1}
        className="swiper-container"
        speed={800} // Плавный переход между слайдами
        freeMode={true} // Режим свободного скролла
        freeModeMomentum={true} // Инерция при остановке скролла
      >
          {contentItems.map((item, index) => (
            <SwiperSlide key={index}>
              <div className="item">
                <div className="text-content">
                  <h3>{item.h3}</h3>
                  <div className="huge-gradient-text">{item.img}</div>
                  <p>{item.description}</p>
                  <h4 onClick={() => toggleText(index)} className="toggle-header">
                    {item.h4}
                  </h4>
                  
                </div>
              </div>
              <p className={`toggle-text ${activeIndex === index ? "show" : ""}`}>{item.text}</p>
            </SwiperSlide>
          ))}
        </Swiper>
      ) : (
         <Swiper
        spaceBetween={10}
        slidesPerView={1.3}
        className="swiper-container"
        speed={800} // Плавный переход между слайдами
        freeMode={true} // Режим свободного скролла
        freeModeMomentum={true} // Инерция при остановке скролла
      >
          {contentItems.map((item, index) => (
            <SwiperSlide key={index}>
              <div className="item">
                <div className="text-content">
                  <h2 className="zag">{item.h3}</h2>
                  <div className="huge-gradient-text">{item.img}</div>
                  <p>{item.description}</p>
                  <h3 className="zag">
                    {item.h4}
                  </h3>
                  <p >{item.text}</p>
                </div>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      )}
    </> 
  );
};

export default HorizontalScrollComponent;
