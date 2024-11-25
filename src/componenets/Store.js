import React from 'react';
import '../style/store.css';
import acidImage from '../img/комбаин.svg';
import appStoreLogo from '../img/ап сторр.svg'; // Лого App Store
import googlePlayLogo from '../img/ру сторр.svg'; // Лого Google Play
import sloganSvg from '../img/слоган2.svg';

const Store = () => {
  return (
    <div className="page-content">
      <div className="acid-gradient-container">
        <img src={acidImage} alt="Acid Gradient Background" className="acid-image" />

        {/* Текст в левом верхнем углу */}
        <div className="acid-text ttop-left">
          <h1>В скором времени</h1>
          <p>Загружайте приложение на площадках</p>
          <div className="store-logos">
            <img src={appStoreLogo} alt="App Store" className="store-logo" />
            <img src={googlePlayLogo} alt="Google Play" className="store-logo" />
          </div>
        </div>

        {/* Слоган в правом верхнем углу */}
        <div className="acid-slogan ttop-right">
        <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 500 500"
            className="slogan-svg"
          >
            <style type="text/css">
              {`.st0 { opacity: 0.46; }
                .st1 { fill: #F2F2F2; }
                .st2 { font-family: 'Impact'; }
                .st3 { font-size: 86.6175px; }`}
            </style>
            <g className="st0">
              <text transform="matrix(1 0 0 1.0368 41.0332 179.4746)">
                <tspan x="0" y="0" className="st1 st2 st3">
                  ТЕРРИТОРИЯ{' '}
                </tspan>
                <tspan x="-43" y="100.3" className="st1 st2 st3">
                  СЧАСТЛИВОГО{' '}
                </tspan>
                <tspan x="49.9" y="200.5" className="st1 st2 st3">
                  ФЕРМЕРА
                </tspan>
              </text>
            </g>
          </svg>
        </div>
      </div>
    </div>
  );
};

export default Store;
