import React, { useEffect, useState } from "react";
import { getGift, updateGift } from "../http/giftApi";
import "../style/ProductBuyForm.css";

const GiftForm = ({ onCancel }) => {
  const [formData, setFormData] = useState({
    description: "",
    nameOne: "",
    priceOne: "",
    nameTwo: "",
    priceTwo: "",
    nameThree: "",
    priceThree: "",
    imgOne: null,
    imgTwo: null,
    imgThree: null,
  });

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchGiftData = async () => {
      try {
        const giftData = await getGift();
        if (giftData && Array.isArray(giftData) && giftData.length > 0) {
          const gift = giftData[0];
          setFormData({
            description: gift.description || "",
            nameOne: gift.nameOne || "",
            priceOne: gift.priceOne || "",
            nameTwo: gift.nameTwo || "",
            priceTwo: gift.priceTwo || "",
            nameThree: gift.nameThree || "",
            priceThree: gift.priceThree || "",
            imgOne: gift.imgOne || null,
            imgTwo: gift.imgTwo || null,
            imgThree: gift.imgThree || null,
          });
        } else {
          console.error("Gift data not found or empty");
        }
        setLoading(false);
      } catch (error) {
        console.error("Error loading gift data:", error);
        setLoading(false);
      }
    };

    fetchGiftData();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    const { name, files } = e.target;
    if (files && files[0]) {
      setFormData((prev) => ({ ...prev, [name]: files[0] }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formDataToSend = new FormData();
    formDataToSend.append("description", formData.description);
    formDataToSend.append("nameOne", formData.nameOne);
    formDataToSend.append("priceOne", formData.priceOne);
    formDataToSend.append("nameTwo", formData.nameTwo);
    formDataToSend.append("priceTwo", formData.priceTwo);
    formDataToSend.append("nameThree", formData.nameThree);
    formDataToSend.append("priceThree", formData.priceThree);

    if (formData.imgOne) formDataToSend.append("imgOne", formData.imgOne);
    if (formData.imgTwo) formDataToSend.append("imgTwo", formData.imgTwo);
    if (formData.imgThree) formDataToSend.append("imgThree", formData.imgThree);

    try {
      await updateGift(formDataToSend);
      alert("Успешно");
    } catch (error) {
      console.error("Error updating gift:", error);
      alert("Ошибка");
    }
  };

  if (loading) {
    return <div>Loading data...</div>;
  }

  return (
    <div className="delivery-page">
      <h1>Обновить подарки</h1>
      <form className="delivery-form" onSubmit={handleSubmit}>
        <label htmlFor="description">Описание:</label>
        <input
          type="text"
          id="description"
          name="description"
          placeholder="Введите описание"
          value={formData.description}
          onChange={handleChange}
          required
        />

        <label htmlFor="nameOne">Название 1:</label>
        <input
          type="text"
          id="nameOne"
          name="nameOne"
          placeholder="Введите название 1"
          value={formData.nameOne}
          onChange={handleChange}
          required
        />

        <label htmlFor="priceOne">Цена 1:</label>
        <input
          type="text"
          id="priceOne"
          name="priceOne"
          placeholder="Введите цену 1"
          value={formData.priceOne}
          onChange={handleChange}
          required
        />

        <label htmlFor="nameTwo">Название 2:</label>
        <input
          type="text"
          id="nameTwo"
          name="nameTwo"
          placeholder="Введите название 2"
          value={formData.nameTwo}
          onChange={handleChange}
          required
        />

        <label htmlFor="priceTwo">Цена 2:</label>
        <input
          type="text"
          id="priceTwo"
          name="priceTwo"
          placeholder="Введите цену 2"
          value={formData.priceTwo}
          onChange={handleChange}
          required
        />

        <label htmlFor="nameThree">Название 3:</label>
        <input
          type="text"
          id="nameThree"
          name="nameThree"
          placeholder="Введите название 3"
          value={formData.nameThree}
          onChange={handleChange}
          required
        />

        <label htmlFor="priceThree">Цена 3:</label>
        <input
          type="text"
          id="priceThree"
          name="priceThree"
          placeholder="Введите цену 3"
          value={formData.priceThree}
          onChange={handleChange}
          required
        />

        <label>Изображение 1:</label>
        <input
          type="file"
          name="imgOne"
          accept="image/*"
          onChange={handleFileChange}
        />

        <label>Изображение 2:</label>
        <input
          type="file"
          name="imgTwo"
          accept="image/*"
          onChange={handleFileChange}
        />

        <label>Изображение 3:</label>
        <input
          type="file"
          name="imgThree"
          accept="image/*"
          onChange={handleFileChange}
        />

        <button type="submit" className="productBuyForm_submitButton">
          Сохранить
        </button>
      </form>
    </div>
  );
};

export default GiftForm;
