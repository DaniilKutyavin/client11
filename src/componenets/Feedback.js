import React, { useState, useEffect } from "react";
import { createfeedback } from "../http/contactApi"; // Import the createfeedback function
import styles from "../style/Feedback.module.css";
import privacyPolicy from "../file/Политика асатаг.pdf";
import tg from "../img/телеграм.svg";
const Feedback = () => {
  const [isFormVisible, setIsFormVisible] = useState(false);
  const [isButtonVisible, setIsButtonVisible] = useState(false);
  const [formData, setFormData] = useState({ name: "", telephone: "" });
  const [message, setMessage] = useState(""); // Сообщение об успешной отправке
  const [isSubmitted, setIsSubmitted] = useState(false); // Управление отображением контента

  const toggleForm = () => {
    setIsFormVisible((prev) => !prev);
    setMessage(""); // Сброс сообщения
    setIsSubmitted(false); // Возвращаем форму при повторном открытии
  };

  const handleScroll = () => {
    setIsButtonVisible(window.scrollY > 100);
  };

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const handleChange = (e) => {
    const { id, value } = e.target;

    if (id === "telephone") {
      let input = value.replace(/\D/g, "");
      if (input.length > 0 && input[0] !== "7") {
        input = "7" + input;
      }
      let formatted = "+7";
      if (input.length > 1) formatted += ` (${input.substring(1, 4)}`;
      if (input.length >= 5) formatted += `) ${input.substring(4, 7)}`;
      if (input.length >= 8) formatted += `-${input.substring(7, 9)}`;
      if (input.length >= 10) formatted += `-${input.substring(9, 11)}`;
      if (formatted.length > 18) {
        formatted = formatted.substring(0, 18);
      }
      setFormData({ ...formData, telephone: formatted });
    } else {
      setFormData({ ...formData, [id]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await createfeedback(formData); 
      setMessage("Заявка принята! Мы перезвоним вам в ближайшее время");
      setFormData({ name: "", telephone: "" }); 
      setIsSubmitted(true); 

      setTimeout(() => {
        setIsSubmitted(false);е
        setIsFormVisible(false); 
      }, 3000);
    } catch (error) {
      setMessage("Произошла ошибка. Попробуйте еще раз.");
    }
  };

  return (
    <div className={styles.feedback}>
      {isButtonVisible && (
        <button className={styles.phoneButton} onClick={toggleForm}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="white"
            width="24px"
            height="24px"
          >
            <path d="M6.62 10.79a15.464 15.464 0 006.59 6.59l2.2-2.2a1.003 1.003 0 011.06-.21c1.12.44 2.33.68 3.57.68.55 0 1 .45 1 1V20c0 .55-.45 1-1 1C10.39 21 3 13.61 3 4c0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.24 2.45.68 3.57.13.26.07.57-.21 1.06l-2.2 2.2z" />
          </svg>
        </button>
      )}
      {isFormVisible && (
        <div className={styles.modalOverlay} onClick={toggleForm}>
          <div
            className={styles.feedbackForm}
            onClick={(e) => e.stopPropagation()}
          >
            <button className={styles.closeButton} onClick={toggleForm}>
              ✖
            </button>
            {isSubmitted ? (
              // Контент после успешной отправки
              <div className={styles.successMessage}>
                <h3 className={styles.title}>Спасибо за заявку!</h3>
                <p className={styles.description}>
                  Мы перезвоним вам в ближайшее время.
                </p>
              </div>
            ) : (
              // Форма до отправки
              <>
                <h3 className={styles.title}>Ответим на ваши вопросы</h3>
                <p className={styles.description}>
                  Вы можете связаться с нами по телефону и в мессенджере
                </p>
                <div className={styles.contacts}>
                  <a className={styles.phone}>+7 990 197 49 17</a>
                  <a
                    href="https://t.me/+RmKsDFeoLSk3NjU6"
                    target="_blank"
                    rel="noopener noreferrer"
                    className={styles.messenger}
                  >
                    <img
                      src={tg}
                      alt="Telegram"
                      style={{
                        width: "20px",
                        height: "20px",
                        marginTop: "5px",
                      }}
                    />
                  </a>
                </div>
                <hr className={styles.separator} />
                <p className={styles.or}>или</p>
                <p className={styles.subtitle}>
                  Оставьте заявку — мы перезвоним в ближайшее время!
                </p>
                {message && <p className={styles.message}>{message}</p>}
                <form onSubmit={handleSubmit}>
                  <input
                    type="text"
                    placeholder="Ваше имя *"
                    className={styles.input}
                    value={formData.name}
                    onChange={handleChange}
                    id="name"
                    required
                  />
                  <div className={styles.phoneInput}>
                    <input
                      type="tel"
                      id="telephone"
                      value={formData.telephone}
                      placeholder="+7 (999) 999-99-99"
                      className={styles.input}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  <div className={styles.checkboxContainer}>
                    <input type="checkbox" id="policy" required />
                    <label htmlFor="policy">
                      Я подтверждаю ознакомление с{" "}
                      <a href={privacyPolicy} className={styles.policyLink}>
                        Политикой обработки персональных данных
                      </a>{" "}
                      и даю согласие на обработку моих персональных данных
                    </label>
                  </div>
                  <button type="submit" className={styles.submitButton}>
                    Отправить
                  </button>
                </form>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Feedback;
