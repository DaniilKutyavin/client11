import React, { useContext, useState, useEffect,useRef } from "react";
import { Context } from "..";
import "../style/navbar.css";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  CONTACTS_ROUTER,
  DELIVERY_ROUTER,
  NEWS_ROUTER,
  SHOP_ROUTER,
  LOGIN_ROUTER,
  LS_ROUTER,
  PRODUCT_ROUTER,
} from "../utils/consts";
import LogoWhite from "../img/Лого белый.svg";
import menu from "../img/меню.svg";
import krest from "../img/крестик.svg";
import LogoScrolled from "../img/Лого цветной.svg";
import Ls from "../img/человек 500.svg";
import LsAlt from "../img/человек цвет.svg";
import LoginForm from "../page/Form";
import arrowRight from "../img/стрелка вниз.svg";

const NavBar = () => {
  const { user } = useContext(Context);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isLoginFormOpen, setIsLoginFormOpen] = useState(false);
  const [currentIcon, setCurrentIcon] = useState(Ls);
  const location = useLocation();
  const navigate = useNavigate();

  const prevPathnameRef = useRef(null); 
    const isInitialRender = useRef(true); 
  

    const pathsToClearFilters = [
      "/product/type/1",
      "/product/type/2",
      "/product/type/3",
      "/buy",
    ];
  

    useEffect(() => {
      if (pathsToClearFilters.includes(location.pathname)) {
        if (!isInitialRender.current && prevPathnameRef.current !== location.pathname) {
          localStorage.removeItem("selectedFilters");
        }
        prevPathnameRef.current = location.pathname; 
      }
      isInitialRender.current = false;
    }, [location.pathname]);
  
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 0);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    if (location.pathname === LS_ROUTER) {
      setCurrentIcon(LsAlt);
    } else {
      setCurrentIcon(Ls);
    }
  }, [location.pathname, user.isAuth]);

  useEffect(() => {
    setIsMobileMenuOpen(false); // Закрываем меню, когда изменяется маршрут
  }, [location]);

  const handleUserIconClick = () => {
    if (user.isAuth) {
      navigate(LS_ROUTER);
    } else {
      setIsLoginFormOpen(true);
    }
  };

  useEffect(() => {
    if (isMobileMenuOpen) {
      // Отключаем прокрутку на странице, устанавливаем overflow на hidden для html и body
      document.body.style.overflow = "hidden";
      document.documentElement.style.overflow = "hidden"; // Дополнительно для html
      document.documentElement.style.height = "100%"; // Убедимся, что высота html на 100%
    } else {
      // Восстанавливаем прокрутку
      document.body.style.overflow = "auto";
      document.documentElement.style.overflow = "auto";
      document.documentElement.style.height = "auto"; // Восстанавливаем высоту
    }
  }, [isMobileMenuOpen]);
  const closeLoginForm = () => {
    setIsLoginFormOpen(false);
  };

  const handleDropdownToggle = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  const handleMobileMenuToggle = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
    setIsDropdownOpen(false);
  };

  return (
    <>
      <header className={`navbar ${isScrolled ? "navbar-scrolled" : ""}`}>
        <div className="navbar-content">
          <div className="navbar-logo">
            <Link to={SHOP_ROUTER}>
              <img
                src={
                  location.pathname === "/"
                    ? isScrolled
                      ? LogoScrolled
                      : LogoWhite
                    : LogoScrolled
                }
                alt="Logo"
                style={{
                  height: window.innerWidth < 768 ? "50px" : "70px",
                  width: window.innerWidth < 768 ? "200px" : "300px",
                }}
              />
            </Link>
          </div>

          <nav className="navbar-links">
            <div className="catalog-wrapper" onClick={handleDropdownToggle}>
              <a
                href="#catalog"
                className={
                  location.pathname === PRODUCT_ROUTER ? "active-link big" : ""
                }
              >
                Каталог товаров
                <img
                  src={arrowRight}
                  alt="Arrow"
                  className={`accordion-arrow ${isDropdownOpen ? "open" : ""}`}
                />
              </a>
              {isDropdownOpen && (
                <div className="dropdown-menu">
                  <Link to="/product/type/1" onClick={closeMobileMenu}>
                    ХСЗР
                  </Link>
                  <Link to="/product/type/2" onClick={closeMobileMenu}>
                    Удобрения
                  </Link>
                  <Link to="/product/type/3" onClick={closeMobileMenu}>
                    Посевной материал
                  </Link>
                  <Link to="/buy" onClick={closeMobileMenu}>
                    Закупка культур
                  </Link>
                </div>
              )}
            </div>
            <Link to={DELIVERY_ROUTER} className="big">
              Доставка
            </Link>
            <Link to={NEWS_ROUTER} className="big">
              Новости
            </Link>
            <Link to={CONTACTS_ROUTER} className="big">
              Контакты
            </Link>
          </nav>

          <div className="navbar-user">
            <img
              src={currentIcon}
              alt="User Icon"
              onClick={handleUserIconClick}
              style={{ height: "40px", cursor: "pointer", margin: "10px" }}
            />
          </div>

          <div className="mobsps">
            <img
              src={isMobileMenuOpen ? krest : menu}
              alt="Menu Icon"
              onClick={handleMobileMenuToggle}
              style={{ cursor: "pointer" }}
            />
          </div>
        </div>
      </header>

      {isMobileMenuOpen && (
        <div className="mobile-menu">
          <Link to="/product/type/1" onClick={closeMobileMenu}>
            ХСЗР
          </Link>
          <Link to="/product/type/2" onClick={closeMobileMenu}>
            Удобрения
          </Link>
          <Link to="/product/type/3" onClick={closeMobileMenu}>
            Посевной материал
          </Link>
          <Link to="/buy" onClick={closeMobileMenu}>
            Закупка культур
          </Link>
          <Link to={DELIVERY_ROUTER} onClick={closeMobileMenu}>
            Доставка
          </Link>
          <Link to={NEWS_ROUTER} onClick={closeMobileMenu}>
            Новости
          </Link>
          <Link to={CONTACTS_ROUTER} onClick={closeMobileMenu}>
            Контакты
          </Link>
        </div>
      )}

      {isLoginFormOpen && <LoginForm onClose={closeLoginForm} />}
    </>
  );
};

export default NavBar;
