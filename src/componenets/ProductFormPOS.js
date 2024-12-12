import React, { useState, useEffect } from "react";
import { createProductPOS } from "../http/productApi"; // Update the path as necessary
import { getManufacturersByTypeThree } from "../http/manufacturerApi";
import Vivid from "../componenets/vivid";

const ProductForm = () => {
  const [formData, setFormData] = useState({
    name: "",
    price: "",
    price_two: "",
    type: "3",
    desc_header: "",
    description: "",
    description_low: "",
    weight: "",
    culture: "",
    fertilizers: "",
    manufacturer: "",
    way: "",
    ground: "",
    descThree: "",
    category: "",
    adva: [],
    stabil: [],
    productiv: [],
  });

  const [files, setFiles] = useState({
    img: null,
    certificate: null,
    presentation: null,
  });

  const [manufacturers, setManufacturers] = useState([]);
  const [loadingManufacturers, setLoadingManufacturers] = useState(true);

  useEffect(() => {
    const fetchManufacturers = async () => {
      try {
        const data = await getManufacturersByTypeThree();
        setManufacturers(data);
      } catch (error) {
        console.error("Error fetching manufacturers:", error);
      } finally {
        setLoadingManufacturers(false);
      }
    };

    fetchManufacturers();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleFileChange = (e) => {
    const { name, files: selectedFiles } = e.target;
    setFiles((prevFiles) => ({
      ...prevFiles,
      [name]: selectedFiles[0],
    }));
  };

  const addAdvantage = () => {
    setFormData((prevData) => ({
      ...prevData,
      adva: [...prevData.adva, { text: "" }],
    }));
  };

  const addStabil = () => {
    setFormData((prevData) => ({
      ...prevData,
      stabil: [...prevData.stabil, { text: "" }],
    }));
  };

  const addProductiv = () => {
    setFormData((prevData) => ({
      ...prevData,
      productiv: [...prevData.productiv, { text: "" }],
    }));
  };

  const handleAdvantageChange = (index, value) => {
    setFormData((prevData) => {
      const newAdva = prevData.adva.map((item, i) =>
        i === index ? { text: value } : item
      );
      return { ...prevData, adva: newAdva };
    });
  };

  const handleStabilChange = (index, value) => {
    setFormData((prevData) => {
      const newStabil = prevData.stabil.map((item, i) =>
        i === index ? { text: value } : item
      );
      return { ...prevData, stabil: newStabil };
    });
  };

  const handleProdChange = (index, value) => {
    setFormData((prevData) => {
      const newProd = prevData.productiv.map((item, i) =>
        i === index ? { text: value } : item
      );
      return { ...prevData, productiv: newProd };
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formDataToSubmit = new FormData();

    Object.keys(formData).forEach((key) => {
      if (Array.isArray(formData[key])) {
        formDataToSubmit.append(key, JSON.stringify(formData[key]));
      } else {
        formDataToSubmit.append(key, formData[key]);
      }
    });

    formDataToSubmit.append("img", files.img);
    formDataToSubmit.append("certificate", files.certificate);
    formDataToSubmit.append("presentation", files.presentation);

    try {
      await createProductPOS(formDataToSubmit);
      alert("Продукт успешно создан!");
      setFormData({
        name: "",
        price: "",
        price_two:"",
        type: "3",
        desc_header: "",
        description: "",
        description_low: "",
        weight: "",
        manufacturer: "",
        category:"",
        descThree: "",
        adva: [],
        stabil: [],
        productiv: [],
      });
      setFiles({
        img: null,
        certificate: null,
        presentation: null,
      });
    } catch (error) {
      alert("Ошибка при создании продукта.");
      console.error("Error creating product:", error);
    }
  };

  const handleCategorySelect = (category) => {
    setFormData((prevData) => {
      const currentCategories = prevData.category ? prevData.category.split(";") : [];
  
      // Проверяем, есть ли категория в списке
      if (currentCategories.includes(category)) {
        // Удаляем категорию из списка
        const newCategories = currentCategories.filter(item => item !== category);
        return { ...prevData, category: newCategories.join(";") };
      } else {
        // Добавляем категорию в список
        return { ...prevData, category: [...currentCategories, category].join(";") };
      }
    });
  };

  return (
    <div className="delivery-page">
      <h2>Создать посевной материал</h2>
      <form className="delivery-form" onSubmit={handleSubmit}>
      <label htmlFor="name">Название:</label>
          <input
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="Название"
            required
          />
        <label htmlFor="name">Цена наличные:</label>
          <input
            name="price"
            value={formData.price}
            onChange={handleChange}
            placeholder="Цена"
            required
          />
          <label htmlFor="name">Цена безнал:</label>
          <input
            name="price_two"
            value={formData.price_two}
            onChange={handleChange}
            placeholder="Цена безнал"
            required
          />
         <label htmlFor="name">Тип:</label>
          <input
            name="type"
            value={formData.type}
            onChange={handleChange}
            placeholder="Тип"
            readOnly // Делаем поле только для чтения
          />
        <label htmlFor="name">Текст в шапке:</label>
          <textarea
            name="desc_header"
            value={formData.desc_header}
            onChange={handleChange}
            placeholder="Текст в шапке"
          />
         <label htmlFor="name">Описание:</label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            placeholder="Описание"
          />
         <label htmlFor="name">Нижнее описание:</label>
          <textarea
            name="description_low"
            value={formData.description_low}
            onChange={handleChange}
            placeholder="Нижнее описание"
          />
        <label htmlFor="name">Вес:</label>
          <input
            name="weight"
            value={formData.weight}
            onChange={handleChange}
            placeholder="Вес"
          />
       <label>Выберите категорию:</label>
<div>
  <button type="button" onClick={() => handleCategorySelect("Подсолнечник")}>Подсолнечник</button>
  <button type="button" onClick={() => handleCategorySelect("Рапс")}>Рапс</button>
  <button type="button" onClick={() => handleCategorySelect("Кукуруза")}>Кукуруза</button>
  <button type="button" onClick={() => handleCategorySelect("Пшеница")}>Пшеница</button>
  <button type="button" onClick={() => handleCategorySelect("Ячмень")}>Ячмень</button>
  <button type="button" onClick={() => handleCategorySelect("Нут")}>Нут</button>
  <button type="button" onClick={() => handleCategorySelect("Горох")}>Горох</button>
  <button type="button" onClick={() => handleCategorySelect("Горчица")}>Горчица</button>
  <button type="button" onClick={() => handleCategorySelect("Соя")}>Соя</button> 
</div>

{/* Вывод выбранных категорий */}
{formData.category && (
  <div>
    <strong>Выбранные категории:</strong>
    <p>{formData.category.split(";").join(", ")}</p>
  </div>
)}
          
          <label htmlFor="name">Выберите производителя:</label>
          <select
            name="manufacturer"
            value={formData.manufacturer}
            onChange={handleChange}
            required
          >
            <option value="" disabled>
              Выберите производителя
            </option>
            {loadingManufacturers ? (
              <option>Загрузка...</option>
            ) : (
              manufacturers.map((manufacturer) => (
                <option key={manufacturer.id} value={manufacturer.name}>
                  {manufacturer.name}
                </option>
              ))
            )}
          </select>
          <label htmlFor="name">Описание самое нижнее:</label>
          <input
            name="descThree"
            value={formData.descThree}
            onChange={handleChange}
            placeholder="Описание самое нижнее"
          />
        <label htmlFor="name">Характеристики:</label>
          {formData.adva.map((adv, index) => (
            <input
              key={index}
              value={adv.text}
              onChange={(e) => handleAdvantageChange(index, e.target.value)}
              placeholder="Характеристика"
            />
          ))}
          <button
            type="button"
            className="productBuyForm_addInfoButton"
            onClick={addAdvantage}
          >
            Добавить характеристику
          </button>
          <label htmlFor="name">Устойчивость:</label>
          {formData.stabil.map((stab, index) => (
            <input
              key={index}
              value={stab.text}
              onChange={(e) => handleStabilChange(index, e.target.value)}
              placeholder="Устойчивость"
            />
          ))}
          <button
            type="button"
            className="productBuyForm_addInfoButton"
            onClick={addStabil}
          >
            Добавить устойчивость
          </button>
          <label htmlFor="name">Урожайность:</label>
          {formData.productiv.map((prod, index) => (
            <input
              key={index}
              value={prod.text}
              onChange={(e) => handleProdChange(index, e.target.value)}
              placeholder="Урожайность"
            />
          ))}
          <button
            type="button"
            className="productBuyForm_addInfoButton"
            onClick={addProductiv}
          >
            Добавить урожайность
          </button>
          
          Фото:
          <input
            type="file"
            name="img"
            onChange={handleFileChange}
            accept="image/*"
            required
          />
          <p></p>
          Файл 1:
          <input
            type="file"
            name="certificate"
            onChange={handleFileChange}
            accept=".pdf"
          />
          <p></p>
          Файл 2:
          <input
            type="file"
            name="presentation"
            onChange={handleFileChange}
            accept=".pdf"
          />
        

        <button type="submit" className="productBuyForm_submitButton">
          Создать продукт
        </button>
      </form>
      <Vivid productId={3} />
    </div>
  );
};

export default ProductForm;
