import React, { useState } from 'react';
import '../style/CookieBanner.css'; // Стили для компонента
import cookiePolicyPdf from "../img/soglasie_na_obrabotku_personalnyh_dannyh.pdf";

const CookieBanner = () => {
    const [isVisible, setIsVisible] = useState(true);

    const handleAccept = () => {
      // Скрываем баннер, когда пользователь соглашается
      setIsVisible(false);
      // Можно также установить в localStorage флаг о принятии соглашения
      localStorage.setItem('cookiesAccepted', 'true');
    };
  
    // Если пользователь уже согласился (в localStorage), то не показывать баннер
    if (!isVisible || localStorage.getItem('cookiesAccepted')) {
      return null;
    }
  
    return (
        <div className="cookie-banner">
        <div className="cookie-content">
          <p className="cookie-text">
          Этот веб-сайт использует аналитические файлы cookie для оптимизации своей работы и улучшения работы пользователей с ним, а также статистические файлы cookie для отслеживания статистики посещений веб-сайта. Нажимая кнопку «Я согласен», Вы соглашаетесь на использование нами указанных файлов cookie в соответствии с нашей <a href={cookiePolicyPdf} 
   className="cookie-policy-link" 
   target="_blank" 
   rel="noopener noreferrer">Политикой в отношении файлов cookie</a>.
          </p>
          <button onClick={handleAccept} className="accept-button">
            Я СОГЛАСЕН
          </button>
        </div>
      </div>
    );
  };

export default CookieBanner;
