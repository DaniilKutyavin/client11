import React, { useContext, useState, useEffect } from "react";
import { Link, redirect, useLocation, useNavigate } from "react-router-dom";
import "../style/auth.css";
import { login, registration, resetPassword } from "../http/userApi";
import { observer } from "mobx-react-lite";
import { Context } from "..";
import {
  DELIVERY_ROUTER,
  LOGIN_ROUTER,
  REGISTRATION_ROUTER,
  SHOP_ROUTER,
} from "../utils/consts";

const generateCaptcha = () => {
  const characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let captcha = "";
  for (let i = 0; i < 6; i++) {
    captcha += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  return captcha;
};

const LoginForm = ({ onClose }) => {
  const [isRegistering, setIsRegistering] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isResettingPassword, setIsResettingPassword] = useState(false);
  const [confirmPassword, setConfirmPassword] = useState("");
  const [name, setName] = useState("");
  const [captcha, setCaptcha] = useState("");
  const [generatedCaptcha, setGeneratedCaptcha] = useState(generateCaptcha());
  const [errors, setErrors] = useState({}); // Store validation errors
  const [resetEmailSent, setResetEmailSent] = useState(false);

  const { user } = useContext(Context);
  const location = useLocation();
  const handleRegisterClick = () => {
    setIsRegistering(true);
    setGeneratedCaptcha(generateCaptcha()); // Regenerate CAPTCHA on register
  };
  const handleResetPasswordClick = () => {
    setIsResettingPassword(true);
    setErrors({});
  };
  const handlePasswordResetSubmit = async (event) => {
    event.preventDefault();
    setErrors({});

    if (!email) {
      setErrors({ email: "Введите ваш email" });
      return;
    }

    try {
      await resetPassword(email); // API вызов для сброса пароля
      setResetEmailSent(true); // Успешный сброс
    } catch (e) {
      setErrors({ general: e.response?.data?.message || "Ошибка при сбросе пароля" });
    }
  };
  const handleSubmit = async (event) => {
    event.preventDefault();
    setErrors({}); // Reset errors on new submit

    if (isRegistering) {
      // Validation for registration
      const newErrors = {};
      if (captcha !== generatedCaptcha) {
        newErrors.captcha = "Неверный код с картинки";
      }
      if (password.length < 8 || password.length > 20) {
        newErrors.password = "Пароль должен быть от 8 до 20 символов";
      }
      if (password !== confirmPassword) {
        newErrors.confirmPassword = "Пароли не совпадают";
      }
      if (!name) {
        newErrors.name = "ФИО обязательно";
      }
      if (!email) {
        newErrors.email = "Email обязателен";
      }
      if (!password) {
        newErrors.password = "Пароль обязателен";
      }

      if (Object.keys(newErrors).length > 0) {
        setErrors(newErrors);
        setGeneratedCaptcha(generateCaptcha()); // Regenerate CAPTCHA on error
        return; // Stop execution if there are errors
      }

      try {
        const data = await registration(name, email, password);
        user.setUser(data);
        user.setIsAuth(true);
        window.location.href = SHOP_ROUTER;
        onClose(); // Close form after successful registration
      } catch (e) {
        setErrors({ general: e.response?.data?.message || "Произошла ошибка" });
      }
    } else {
      // Validation for login
      try {
        const data = await login(email, password);
        user.setUser(data);
        user.setIsAuth(true);
        window.location.href = SHOP_ROUTER;
        onClose(); // Close form after successful login
      } catch (e) {
        setErrors({ general: e.response?.data?.message || "Произошла ошибка" });
      }
    }
  };

  useEffect(() => {
    if (isRegistering) {
      setGeneratedCaptcha(generateCaptcha()); // Regenerate CAPTCHA on form load if registering
    }
  }, [isRegistering]);
  if (isResettingPassword) {
    return (
      <div className="login-form-overlay">
        <div className="login-form">
          <div className="close-btnn" onClick={onClose}>✖</div>
          <h1 className="loginotst">Сброс пароля</h1>
          {resetEmailSent ? (
            <p className="instruction-text">
              Инструкции по сбросу пароля отправлены на указанный email.
            </p>
          ) : (
            <form onSubmit={handlePasswordResetSubmit}>
              <div className="form-field">
                <label htmlFor="email">Введите ваш email:</label>
                <input
                  className="log"
                  type="email"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
                {errors.email && (
                  <div className="error-message" style={{ color: "red" }}>
                    {errors.email}
                  </div>
                )}
              </div>
              {errors.general && (
                <div className="error-message" style={{ color: "red" }}>
                  {errors.general}
                </div>
              )}
              <button type="submit" className="submit-buttonn">Отправить</button>
            </form>
          )}
        </div>
      </div>
    );
  }
  return (
    <div className="login-form-overlay">
      <div className="login-form">
        <div className="close-btnn" onClick={onClose}>
          ✖
        </div>
        <h1 className="loginotst">
          {isRegistering ? "Создать учётную запись" : "Вход"}
        </h1>
        <p
          className="instruction-text"
          dangerouslySetInnerHTML={{
            __html: isRegistering
              ? "<h3>Скидка каждому новому покупателю 500 руб.!</h3> <p><h3>Что необходимо для того, чтобы получить скидку?</h3></p> Зарегистрироваться на сайте. Добавить в корзину товары на сумму от 35000 руб <p></p>Ввести подарочный промо-код из письма, полученного при регистрации"
              : "Если у вас есть учётная запись на нашем сайте, пожалуйста, авторизируйтесь.",
          }}
        />

        <form className="login-form-content" onSubmit={handleSubmit}>
          {isRegistering ? (
            <>
              <h1>Личная информация</h1>
              <div className="email-password-row">
                <div className="form-field">
                  <label htmlFor="fullName">ФИО:</label>
                  <input
                    className="log"
                    type="text"
                    id="fullName"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                  />
                  {errors.name && (
                    <div className="error-message" style={{ color: "red" }}>
                      {errors.name}
                    </div>
                  )}
                </div>
                <div className="form-field">
                  <label htmlFor="email">Email:</label>
                  <input
                    className="log"
                    type="email"
                    id="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                  {errors.email && (
                    <div className="error-message" style={{ color: "red" }}>
                      {errors.email}
                    </div>
                  )}
                 
                </div>
              </div>
              <h1>Информация для авторизации</h1>
              <div className="email-password-row">
                <div className="form-field">
                  <label htmlFor="password">Пароль:</label>
                  <input
                    className="log"
                    type="password"
                    id="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                  {errors.password && (
                    <div className="error-message" style={{ color: "red" }}>
                      {errors.password}
                    </div>
                  )}
                </div>
                <div className="form-field">
                  <label htmlFor="confirmPassword">Подтвердите пароль:</label>
                  <input
                    className="log"
                    type="password"
                    id="confirmPassword"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                  />
                  {errors.confirmPassword && (
                    <div className="error-message" style={{ color: "red" }}>
                      {errors.confirmPassword}
                    </div>
                  )}
                </div>
              </div>
              <div className="email-password-row">
                <div className="form-field captcha-field">
                  <label htmlFor="captcha">Введите код:</label>
                  <input
                    className="log"
                    type="text"
                    id="captcha"
                    value={captcha}
                    onChange={(e) => setCaptcha(e.target.value)}
                    required
                  />
                  {errors.captcha && (
                    <div className="error-message" style={{ color: "red" }}>
                      {errors.captcha}
                    </div>
                  )}
                </div>
                <div className="form-field captcha-field">
                  <label htmlFor="generatedCaptcha">Код</label>
                  <input
                    className="log"
                    type="text"
                    id="generatedCaptcha"
                    value={generatedCaptcha}
                    readOnly // Make it read-only
                    style={{ textAlign: "center" }} // Center text within the input
                    onCopy={(e) => e.preventDefault()}
                  />
                </div>
              </div>
            </>
          ) : (
            <div className="email-password-row">
              <div className="form-field">
                <label htmlFor="email">Email:</label>
                <input
                  className="log"
                  type="email"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
                {errors.email && (
                  <div className="error-message" style={{ color: "red" }}>
                    {errors.email}
                  </div>
                )}
                 {errors.general && (
                    <div className="error-message" style={{ color: "red" }}>
                      {errors.general}
                    </div>
                  )}
              </div>
              <div className="form-field">
                <label htmlFor="password">Пароль:</label>
                <input
                  className="log"
                  type="password"
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                {errors.password && (
                  <div className="error-message" style={{ color: "red" }}>
                    {errors.password}
                  </div>
                )}
              </div>
            </div>
          )}

          <button type="submit" className="submit-buttonn">
            {isRegistering ? "Создать" : "Войти"}
          </button>
          {!isRegistering && (
         <a 
         href="#" 
         className="no-style-link" 
         onClick={handleResetPasswordClick}
       >
         Забыли пароль?
       </a>
        )}
        </form>

        {!isRegistering && (
          <>
            <h1>Создать учетную запись</h1>
            <p className="form-description">
              Создав учётную запись на нашем сайте, вы будете тратить меньше
              времени на оформление заказа, сможете хранить несколько адресов
              доставки, отслеживать состояние заказов, а также многое другое.
            </p>
            <button className="submit-buttonn" onClick={handleRegisterClick}>
              Регистрация
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default observer(LoginForm);
