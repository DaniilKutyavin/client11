import React, { useContext, useEffect, useState } from "react";
import Store from "../componenets/Store";
import "../style/Contacts.css";
import Shkal from "../componenets/Shkal";
import { observer } from "mobx-react-lite";
import { Context } from "..";
import {
  getAllinfo,
  getAlluser,
  submitPartnershipForm,
} from "../http/contactApi";
import { useNavigate } from "react-router-dom";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";

const Contacts = observer(() => {
  const { contact } = useContext(Context);
  const navigate = useNavigate();
  // Form state
  const [formData, setFormData] = useState({
    fio: "",
    telephone: "",
    email: "",
  });
  const [successMessage, setSuccessMessage] = useState("");
 
  useEffect(() => {
    getAllinfo().then((data) => contact.setInfocon(data));
    getAlluser().then((data) => contact.setUsercon(data));
  }, [contact]);

  const handleChange = (e) => {
    const { id, value } = e.target;
  
    if (id === "telephone") {
      // Apply the phone formatting logic
      let input = value.replace(/\D/g, ""); // Remove all non-numeric characters
  
      // Ensure the first digit is "7"
      if (input.length > 0 && input[0] !== "7") {
        input = "7" + input;
      }
  
      // Apply the phone number format
      let formatted = "+7";
      if (input.length > 1) formatted += ` (${input.substring(1, 4)}`;
      if (input.length >= 5) formatted += `) ${input.substring(4, 7)}`;
      if (input.length >= 8) formatted += `-${input.substring(7, 9)}`;
      if (input.length >= 10) formatted += `-${input.substring(9, 11)}`;
  
      // Limit the length of the formatted string
      if (formatted.length > 18) {
        formatted = formatted.substring(0, 18);
      }
  
      setFormData({ ...formData, [id]: formatted });
    } else {
      setFormData({ ...formData, [id]: value });
    }
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await submitPartnershipForm(formData);
      setFormData({ fio: "", telephone: "", email: "" }); // Clear form
      navigate('/confirmation2');
    } catch (error) {
      console.error("Error submitting form:", error);
    }
  };

  return (
    <>
      <div className="header">
        <div className="title-block">
          <h1>Контакты</h1>
          <p className="pod">На связи 24/7</p>
        </div>
      </div>
      <div className="contacts-container">
        {contact.infocon.map((item) => (
          <div className="contact-block" key={item.id}>
            <h2>{item.name}</h2>
            <div className="contact-details">
              <div>
                <p>
                  <strong>Адрес:</strong>
                </p>
                <p>{item.adress}</p>
              </div>
              <div>
                <p>
                  <strong>Телефон:</strong>
                </p>
                <p>
                  <a href={`tel:+${item.telephone}`} className="color pod">
                    {item.telephone}
                  </a>
                </p>
              </div>
              <div>
                <p>
                  <strong>Почта:</strong>
                </p>
                <p>
                  <a href={`mailto:${item.email}`}>{item.email}</a>
                </p>
              </div>
            </div>
          </div>
        ))}

        <div className="partnership-form">
          <h2>Желаете стать нашим партнером?</h2>
          <form onSubmit={handleSubmit}>
            <div className="form-container">
              <div className="form-fields">
                <div className="form-group">
                  <label htmlFor="fio">Имя Отчество</label>
                  <input
                    type="text"
                    id="fio"
                    value={formData.fio}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="telephone">Телефон</label>
                  <input
                    type="tel"
                    id="telephone"
                    value={formData.telephone}
                    onChange={handleChange}
                      placeholder="+7 (___) ___-__-__"
                    required
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="email">Email</label>
                  <input
                    type="email"
                    id="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>
              <button type="submit" className="submit-button">
                Отправить
              </button>
            </div>
            {successMessage && (
              <p className="success-message">{successMessage}</p>
            )}
            <p>Наш менеджер свяжется с Вами в ближайшее время.</p>
          </form>
        </div>
      </div>
      <div className="employee-cards contactfoto">
        <div className="card-container">
          {contact.usercon.map((user) => (
            <div className="employee-card" key={user.id}>
              <img
                src={process.env.REACT_APP_API_URL_IMG + user.img}
                alt="Employee Name"
                className="employee-img"
              />
              <div className="employee-info">
                <h3>{user.name}</h3>
                <p className="pod">{user.post}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="employee-cards contactfototwo"> 
      <Swiper
        spaceBetween={10}
        slidesPerView={1}
        className="card-container"
        speed={800} // Плавный переход между слайдами
        freeMode={true} // Режим свободного скролла
      >
          {contact.usercon.map((user, index) => (
            <SwiperSlide key={index}>
               <div className="employee-card" key={user.id}>
              <img
                src={process.env.REACT_APP_API_URL_IMG + user.img}
                alt="Employee Name"
                className="employee-img"
              />
              <div className="employee-info"> 
                <h3>{user.name}</h3>
                <p className="pod">{user.post}</p>
              </div>
            </div>
            </SwiperSlide>
          ))}
        </Swiper>
       
      </div>
      <Store />
      <Shkal />
    </>
  );
});

export default Contacts;
