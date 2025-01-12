import React, { useRef, useEffect, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";
import 'swiper/swiper-bundle.css';
import "../style/HorizontalScrollComponent.css";

const HorizontalScrollComponent = () => {
  const scrollRef = useRef(null);
  const isMobile = window.innerWidth <= 768; // Проверка на мобильное устройство

  return (
    <>
      {isMobile ? (
        <Swiper
          spaceBetween={10}
          slidesPerView={1}
          className="swiper-container"
          speed={800} // Плавный переход между слайдами
          freeMode={true} // Режим свободного скролла
          modules={[Pagination]}
          pagination={{ clickable: true }} 
        >
          <SwiperSlide>
            <div className="item">
              <div className="text-content">
                <h3>Позитивных отзывов</h3>
                <div className="huge-gradient-text">100%</div>
                <p className="podsize">Нас любят, к нам возвращаются.</p>
                <h4 className="toggle-header">О Нас:</h4>
              </div>
            </div>
            <p
              className={`toggle-text show`}
              dangerouslySetInnerHTML={{
                __html: `ASATRIAN TRADING GROUP — надежный партнер для агропредприятий и фермерских хозяйств, который за короткий период на рынке добился значительных успехов благодаря современному подходу и профессионализму.
                <p/>Наши клиенты получают продукцию, соответствующую международным стандартам качества и эффективности, благодаря прямым поставкам от проверенных брендов. Мы обеспечиваем максимальный комфорт и удобство на всех этапах сотрудничества, предоставляя полный пакет документации на каждую единицу продукции.`,
              }}
            ></p>
          </SwiperSlide>

          <SwiperSlide>
            <div className="item">
              <div className="text-content">
                <h3>Довольных клиентов</h3>
                <div className="huge-gradient-text">1500</div>
                <p className="podsize">Более 1500 довольных клиентов нашим сервисом</p>
                <h4 className="toggle-header">Наша миссия:</h4>
              </div>
            </div>
            <p
              className={`toggle-text show`}
              dangerouslySetInnerHTML={{
                __html: `Создать удобную платформу для сельхозпроизводителей, предлагая эффективные решения для успешного ведения агробизнеса. Задача нашей компании — помочь вам защищать урожай с помощью проверенных и сертифицированных товаров, которые гарантируют высокую результативность и минимизируют риски потерь. Мы понимаем важность своевременной защиты растений и предлагаем решения, которые повышают продуктивность и снижают затраты.

<p/>Наша цель — поддержать долгосрочный рост и устойчивость вашего бизнеса, предоставив доступ к качественной продукции и оптимизированным процессам, которые помогут вам достигать наилучших результатов в аграрном секторе.`,
              }}
            ></p>
          </SwiperSlide>

          <SwiperSlide>
            <div className="item">
              <div className="text-content">
                <h3>Повторных покупок</h3>
                <div className="huge-gradient-text">95%</div>
                <p className="podsize">Клиент ценит скорость, комфорт и отсутствие стресса, которые мы ему предоставляем!</p>
                <h4 className="toggle-header">Почему выбирают нас:</h4>
              </div>
            </div>
            <p
              className={`toggle-text show`}
              dangerouslySetInnerHTML={{
                __html: `<ul>
                <li>Качество и надежность: Мы предлагаем сертифицированные товары от проверенных мировых производителей, что гарантирует высокое качество и эффективность продукции. Все наши товары соответствуют международным стандартам, что дает вам уверенность в правильности выбора и долговечности результата.</li>
                <p/>
                <li>Профессиональная поддержка: Наши специалисты всегда готовы предоставить консультации по выбору и применению препаратов, помогая вам максимально эффективно решать задачи агропроизводства.</li>
                <p/>
                <li>Удобный сервис: Мы предлагаем легкий процесс оформления заказов и прозрачную систему работы с клиентами, что позволяет вам быстро и удобно получать нужные товары. Наши клиенты ценят простоту и удобство взаимодействия на всех этапах сотрудничества.</li>
                </ul>`,
              }}
            ></p>
          </SwiperSlide>

          <SwiperSlide>
            <div className="item">
              <div className="text-content">
                <h3>Выполненных заказов</h3>
                <div className="huge-gradient-text">10000</div>
                <p className="podsize">Более 10000 заказов доставлено к нашим клиентам.</p>
                <h4 className="toggle-header">Что мы предлагаем:</h4>
              </div>
            </div>
            <p
              className={`toggle-text show`}
              dangerouslySetInnerHTML={{
                __html: `Широкий ассортимент продукции от ведущих СНГ производителей: 
                <p/>
                <ul><li><strong>ХСЗР:</strong> (Гербициды, инсектициды, фунгициды, протравители, адъюванты и другое.)</li></ul><p/>
                От Производителей:<strong> «Август», «Biochefarm», «Агрохим ХХI» </strong>и тд. 
                <p/>
                <ul><li><strong>Удобрения:</strong> (азотные, фосфорные, калийные, комбинированные, жидкие, водорастворимые.)</li></ul><p/>
                От Производителей: <strong>«Уралхим», «Фосагро», «Еврохим», «Акрон», «Россошь» </strong>и тд. 
                <p/>
                <ul><li><strong> Посевной материал:</strong> (Под Классическую, Экспресс, Clearfield технологии возделывания.)</li></ul><p/>
                От Производителя: <strong>«ВНИИМК»</strong>. <p/>
                Наша компания так-же занимается закупкой сельскохозяйственных культур, предоставляя отличные условия для сотрудничества.`,
              }}
            ></p>
          </SwiperSlide>
        </Swiper>
      ) : (
        <Swiper
          spaceBetween={10}
          slidesPerView={1.6}
          className="swiper-container"
          speed={800} // Плавный переход между слайдами
          freeMode={true} // Режим свободного скролла
        >
          <SwiperSlide>
            <div className="item">
              <div className="text-content">
                <h2 className="zag">Позитивных отзывов</h2>
                <div className="huge-gradient-text">100%</div>
                <p className="podsize">Нас любят, к нам возвращаются.</p>
                <h3 className="zag">О Нас:</h3>
                <p dangerouslySetInnerHTML={{
                  __html: `ASATRIAN TRADING GROUP — надежный партнер для агропредприятий и фермерских хозяйств, который за короткий период на рынке добился значительных успехов благодаря современному подходу и профессионализму.
                  <p/>Наши клиенты получают продукцию, соответствующую международным стандартам качества и эффективности, благодаря прямым поставкам от проверенных брендов. Мы обеспечиваем максимальный комфорт и удобство на всех этапах сотрудничества, предоставляя полный пакет документации на каждую единицу продукции.`,
                }}></p>
              </div>
            </div>
          </SwiperSlide>

          <SwiperSlide>
            <div className="item">
              <div className="text-content">
                <h2 className="zag">Довольных клиентов</h2>
                <div className="huge-gradient-text">1500</div>
                <p className="podsize">Более 1500 довольных клиентов нашим сервисом</p>
                <h3 className="zag">Наша миссия:</h3>
                <p dangerouslySetInnerHTML={{
                  __html: `Создать удобную платформу для сельхозпроизводителей, предлагая эффективные решения для успешного ведения агробизнеса. Задача нашей компании — помочь вам защищать урожай с помощью проверенных и сертифицированных товаров, которые гарантируют высокую результативность и минимизируют риски потерь. Мы понимаем важность своевременной защиты растений и предлагаем решения, которые повышают продуктивность и снижают затраты.

<p/>Наша цель — поддержать долгосрочный рост и устойчивость вашего бизнеса, предоставив доступ к качественной продукции и оптимизированным процессам, которые помогут вам достигать наилучших результатов в аграрном секторе.`,
                }}></p>
              </div>
            </div>
          </SwiperSlide>

          <SwiperSlide>
            <div className="item">
              <div className="text-content">
                <h2 className="zag">Повторных покупок</h2>
                <div className="huge-gradient-text">95%</div>
                <p className="podsize">Клиент ценит скорость, комфорт и отсутствие стресса, которые мы ему предоставляем!</p>
                <h3 className="zag">Почему выбирают нас:</h3>
                <p dangerouslySetInnerHTML={{
                  __html: `<ul>
                  <li>Качество и надежность: Мы предлагаем сертифицированные товары от проверенных мировых производителей, что гарантирует высокое качество и эффективность продукции. Все наши товары соответствуют международным стандартам, что дает вам уверенность в правильности выбора и долговечности результата.</li>
                  <p/>
                  <li>Профессиональная поддержка: Наши специалисты всегда готовы предоставить консультации по выбору и применению препаратов, помогая вам максимально эффективно решать задачи агропроизводства.</li>
                  <p/>
                  <li>Удобный сервис: Мы предлагаем легкий процесс оформления заказов и прозрачную систему работы с клиентами, что позволяет вам быстро и удобно получать нужные товары. Наши клиенты ценят простоту и удобство взаимодействия на всех этапах сотрудничества.</li>
                  </ul>`,
                }}></p>
              </div>
            </div>
          </SwiperSlide>

          <SwiperSlide>
            <div className="item">
              <div className="text-content">
                <h2 className="zag">Выполненных заказов</h2>
                <div className="huge-gradient-text">10000</div>
                <p className="podsize">Более 10000 заказов доставлено к нашим клиентам.</p>
                <h3 className="zag">Что мы предлагаем:</h3>
                <p dangerouslySetInnerHTML={{
                  __html: `Широкий ассортимент продукции от ведущих СНГ производителей: 
                  <p/>
                  <ul><li><strong>ХСЗР:</strong> (Гербициды, инсектициды, фунгициды, протравители, адъюванты и другое.)</li></ul><p/>
                  От Производителей:<strong> «Август», «Biochefarm», «Агрохим ХХI» </strong>и тд. 
                  <p/>
                  <ul><li><strong>Удобрения:</strong> (азотные, фосфорные, калийные, комбинированные, жидкие, водорастворимые.)</li></ul><p/>
                  От Производителей:<strong> «Уралхим», «Фосагро», «Еврохим», «Акрон», «Россошь»</strong> и тд. 
                  <p/>
                  <ul><li><strong> Посевной материал:</strong> (Под Классическую, Экспресс, Clearfield технологии возделывания.)</li></ul><p/>
                  От Производителя: <strong>«ВНИИМК»</strong>. <p/>
                  Наша компания так-же занимается закупкой сельскохозяйственных культур, предоставляя отличные условия для сотрудничества.`,
                }}></p>
              </div>
            </div>
          </SwiperSlide>
        </Swiper>
      )}
    </>
  );
};

export default HorizontalScrollComponent;
