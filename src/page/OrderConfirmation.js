import React, { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import LogoScrolled from '../img/лого чистое.svg';
import '../style/OrderConfirmation.css';

const OrderConfirmation = () => {
  const navigate = useNavigate();
  const location = useLocation(); 

  // Переадресация через 5 секунд в зависимости от маршрута
  useEffect(() => {
    const timer = setTimeout(() => {
      if (location.pathname === '/order-confirmation') {
        navigate('/ls'); // Redirect to /ls if on /order-confirmation
      } else {
        navigate('/'); // Redirect to the home page for other routes
      }
    }, 5000);

    return () => clearTimeout(timer); // Очистка таймера при размонтировании компонента
  }, [navigate, location.pathname]);

  const isOrderConfirmation = location.pathname === '/order-confirmation';
  const isConfirmation2 = location.pathname === '/confirmation2';
  const isConfirmation3 = location.pathname === '/confirmation3';

  return (
    <div className="order-confirmation-wrapper">
      <div className="order-confirmation-container">
        {isOrderConfirmation && (
          <>
            <h1 className="order-confirmation-title">Ваша заказ принят</h1>
            <h2 className="order-confirmation-subtitle">Спасибо, что выбираете нас!</h2>
            <p className="order-confirmation-description">Наш менеджер свяжется с Вами в ближайшее время.</p>
          </>
        )}
        {isConfirmation2 && (
          <>
            <h1 className="order-confirmation-title">Заявка принята</h1>
            <h2 className="order-confirmation-subtitle">Благодарим за Ваш интерес к нам!</h2>
            <p className="order-confirmation-description">Наш менеджер свяжется с Вами в ближайшее время.</p>
          </>
        )}
        {isConfirmation3 && (
          <>
            <h1 className="order-confirmation-title">Ваша заявка принята</h1>
            <h2 className="order-confirmation-subtitle">Благодарим за сотрудничество</h2>
            <p className="order-confirmation-description">Наш менеджер свяжется с Вами в ближайшее время.</p>
          </>
        )}
        <img src={LogoScrolled} alt="Логотип" className="order-confirmation-logo" />
      </div>
    </div>
  );
};

export default OrderConfirmation;
