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

  const handleWheel = (event) => {
    const scrollElement = scrollRef.current;

    if (scrollElement && !isMobile) {
      const atLeft = scrollElement.scrollLeft === 0;
      const atRight =
        scrollElement.scrollLeft + scrollElement.clientWidth >= scrollElement.scrollWidth;

      if (event.deltaY > 0 && atRight) {
        return;
      } else if (event.deltaY < 0 && atLeft) {
        return;
      }

      event.preventDefault();
      const scrollSpeedFactor = 2;
      scrollElement.scrollLeft += event.deltaY * scrollSpeedFactor;
    }
  };

  useEffect(() => {
    if (!isMobile) {
      const scrollElement = scrollRef.current;
      scrollElement.addEventListener("wheel", handleWheel);

      return () => {
        scrollElement.removeEventListener("wheel", handleWheel);
      };
    }
  }, [isMobile]);

  const toggleText = (index) => {
    setActiveIndex(activeIndex === index ? null : index);
  };

  const contentItems = [
    {
      img: circle1,
      h3: "Позитивных отзывов",
      description: "Нас любят, к нам возвращаются.",
      h4: "О Нас:",
      text: `Компания "ASATRIAN TRADING GROUP" предлагает фермерским хозяйствам и крупным агропредприятиям Запорожской области широкий ассортимент сертифицированных средств защиты растений (СЗР), удобрений и посевного материала от ведущих производителей. Мы являемся официальным дилером торговой марки "Август", что гарантирует качество и эффективность нашей продукции.`,
    },
    {
      img: circle2,
      h3: "Довольных клиентов",
      description: "Более 1500 довольных клиентов нашим сервисом",
      h4: "Наша миссия:",
      text: `Создать удобную и надежную платформу для сельхозпроизводителей, где каждый сможет найти все необходимое для успешного ведения агробизнеса. Мы понимаем важность своевременной и правильной защиты урожая.`,
    },
    {
      img: circle3,
      h3: "95% Повторных покупок",
      description: "Клиент ценит скорость, комфорт и отсутствие стресса, которые мы ему предоставляем!",
      h4: "Почему выбирают нас:",
      text: `Качество и надежность: сертифицированные товары от проверенных производителей. Профессиональная поддержка: наши специалисты всегда готовы предоставить консультации по выбору и применению препаратов.`,
    },
    {
      img: circle4,
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
                <img src={item.img} alt="Cart" />
                <div className="text-content">
                  <h3>{item.h3}</h3>
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
        <div className="horizontal-scroll-container" ref={scrollRef}>
          <div className="scroll-content">
            {contentItems.map((item, index) => (
              <div className="item" key={index}>
                <img src={item.img} alt="Cart" />
                <div className="text-content">
                  <h3>{item.h3}</h3>
                  <p>{item.description}</p>
                  <h4>{item.h4}</h4>
                  <p>{item.text}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </>
  );
};

export default HorizontalScrollComponent;
