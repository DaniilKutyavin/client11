import React, { useEffect, useState } from "react";
import { getAll, updateFooter } from "../http/footerApi"; // Adjust the import path accordingly
import "../style/ProductBuyForm.css"; // Используем общие стили

const FooterForm = ({ onCancel = () => {} }) => {
  const [footerData, setFooterData] = useState({
    telephoneOne: "",
    telephoneTwo: "",
    Email: "",
    time: "",
  });

  useEffect(() => {
    const fetchFooterData = async () => {
      try {
        const data = await getAll();
        if (data && data.length > 0) {
          const footerInfo = data[0];
          setFooterData({
            telephoneOne: footerInfo.telephoneOne || "",
            telephoneTwo: footerInfo.telephoneTwo || "",
            Email: footerInfo.Email || "",
            time: footerInfo.time || "",
          });
        }
      } catch (error) {
        console.error("Error fetching footer data:", error);
      }
    };
    fetchFooterData();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFooterData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await updateFooter(footerData);
      alert("Подвал успешно обновлен");
      onCancel(); // Close the form after submission
    } catch (error) {
      alert("Ошибка");
    }
  };

  return (
    <div className="delivery-page">
      <h1>Обновить подвал</h1>
      <form onSubmit={handleSubmit} className="delivery-form">
        <label htmlFor="telephoneOne">Телефон 1:</label>
        <input
          type="text"
          id="telephoneOne"
          name="telephoneOne"
          value={footerData.telephoneOne}
          onChange={handleChange}
          placeholder="Введите телефон 1"
          required
        />

        <label htmlFor="telephoneTwo">Телефон 2:</label>
        <input
          type="text"
          id="telephoneTwo"
          name="telephoneTwo"
          value={footerData.telephoneTwo}
          onChange={handleChange}
          placeholder="Введите телефон 2"
        />

        <label htmlFor="Email">Email:</label>
        <input
          type="email"
          id="Email"
          name="Email"
          value={footerData.Email}
          onChange={handleChange}
          placeholder="Введите Email"
          required
        />

        <label htmlFor="time">Время работы:</label>
        <input
          type="text"
          id="time"
          name="time"
          value={footerData.time}
          onChange={handleChange}
          placeholder="Введите время работы"
          required
        />

        <button type="submit" className="productBuyForm_submitButton">
          Обновить
        </button>
      </form>
    </div>
  );
};

export default FooterForm;
