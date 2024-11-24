import React, { useState, useEffect } from "react";
import { createProductUDO } from "../http/productApi"; // Обновите путь, если необходимо
import { getManufacturersByTypeTwo } from "../http/manufacturerApi";
import Vivid from "../componenets/vivid";

const ProductForm = () => {
  const [formData, setFormData] = useState({
    name: "",
    price: "",
    type: "2",
    desc_header: "", // Устанавливаем тип по умолчанию на 2
    description: "",
    description_low: "",
    weight: "",
    culture: "",
    fertilizers: "",
    manufacturer: "",
    way: "",
    ground: "",
    descTwo: "",
    adva: [],
    specif: [],
    keep: [],
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
        const data = await getManufacturersByTypeTwo();
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

  const addKeep = () => {
    setFormData((prevData) => ({
      ...prevData,
      keep: [...prevData.keep, { text: "" }],
    }));
  };

  const addSpec = () => {
    setFormData((prevData) => ({
      ...prevData,
      specif: [...prevData.specif, { text: "" }],
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

  const handleKeepChange = (index, value) => {
    setFormData((prevData) => {
      const newKeep = prevData.keep.map((item, i) =>
        i === index ? { text: value } : item
      );
      return { ...prevData, keep: newKeep };
    });
  };

  const handleSpecChange = (index, value) => {
    setFormData((prevData) => {
      const newSpec = prevData.specif.map((item, i) =>
        i === index ? { text: value } : item
      );
      return { ...prevData, specif: newSpec };
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
      const product = await createProductUDO(formDataToSubmit);
      console.log("Продукт создан:", product);
      setFormData({
        name: "",
        price: "",
        type: "2",
        desc_header: "", // Сбрасываем тип на 2
        description: "",
        description_low: "",
        weight: "",
        culture: "",
        fertilizers: "",
        manufacturer: "",
        way: "",
        ground: "",
        descTwo: "",
        adva: [],
        specif: [],
        keep: [],
      });
      setFiles({
        img: null,
        certificate: null,
        presentation: null,
      });
    } catch (error) {
      console.error("Ошибка при создании продукта:", error);
    }
  };

  return (
    <div className="delivery-page">
      <h2>Создать удобрение</h2>
      <form  className="delivery-form" onSubmit={handleSubmit}>
      <label htmlFor="name">Название:</label>
          <input
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="Название"
            required
          />
       <label htmlFor="name">Цена:</label>
          <input
            name="price"
            value={formData.price}
            onChange={handleChange}
            placeholder="Цена"
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
        <label htmlFor="name">Описание в шапке:</label>
          <input
            name="desc_header"
            value={formData.desc_header}
            onChange={handleChange}
            placeholder="Описание в шапке"
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
       <label htmlFor="name">Выберите культуру:</label>
          <select
            name="culture"
            value={formData.culture}
            onChange={handleChange}
            required
          >
            <option value="">Выберите культуру</option>
            <option value="Зерновые">Зерновые</option>
            <option value="Масличные">Масличные</option>
            <option value="Зернобобовые">Зернобобовые</option>
            <option value="Овощные">Овощные</option>
            <option value="Плодовые">Плодовые</option>
            {/* Добавьте другие культуры по необходимости */}
          </select>
          <label htmlFor="name">Выберите удобрение:</label>
          <select
            name="fertilizers"
            value={formData.fertilizers}
            onChange={handleChange}
            required
          >
            <option value="">Выберите удобрение</option>
            <option value="Азотные N">Азотные N</option>
            <option value="Фосфорные P">Фосфорные P</option>
            <option value="Калийные K">Калийные K</option>
            <option value="Комплексные N+P+K">Комплексные N+P+K</option>
            <option value="Водорастворимые">Водорастворимые</option>
            <option value="Жидкие">Жидкие</option>
            {/* Добавьте другие удобрения по необходимости */}
          </select>
          <label htmlFor="name">Выберите способ внесения:</label>
          <select
            name="way"
            value={formData.way}
            onChange={handleChange}
            required
          >
            <option value="">Выберите способ внесения</option>
            <option value="Основное внесение">Основное внесение</option>
            <option value="Припосевное внесение">Припосевное внесение</option>
            <option value="Листовые подкормки">Листовые подкормки</option>
            <option value="Фертигация">Фертигация</option>
            <option value="Капельный полив">Капельный полив</option>
            <option value="Корневая подкормка">Корневая подкормка</option>
            <option value="Обработка семян">Обработка семян</option>
            {/* Добавьте другие способы по необходимости */}
          </select>
          <label htmlFor="name">Выберите вид грунта:</label>
          <select
            name="ground"
            value={formData.ground}
            onChange={handleChange}
            required
          >
            <option value="">Выберите вид грунта</option>
            <option value="Открытый">Открытый</option>
            <option value="Закрытый">Закрытый</option>
            {/* Добавьте другие виды грунта по необходимости */}
          </select>
          <label htmlFor="name"> Выберите производителя:</label>
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
            name="descTwo"
            value={formData.descTwo}
            onChange={handleChange}
            placeholder="Описание самое нижнее"
          />
      <label htmlFor="name">Характеристика:</label>
         
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
          <label htmlFor="name">Преимущество:</label>

          {formData.specif.map((speci, index) => (
            <input
              key={index}
              value={speci.text}
              onChange={(e) => handleSpecChange(index, e.target.value)}
              placeholder="Преимущество"
            />
          ))}
          <button
            type="button"
            className="productBuyForm_addInfoButton"
            onClick={addSpec}
          >
            Добавить спецификацию
          </button>
          <label htmlFor="name">Упаковка и хранение:</label>

          {formData.keep.map((kee, index) => (
            <input
              key={index}
              value={kee.text}
              onChange={(e) => handleKeepChange(index, e.target.value)}
              placeholder="Хранение"
            />
          ))}
          <button
            type="button"
            className="productBuyForm_addInfoButton"
            onClick={addKeep}
          >
            Добавить упаковку и хранение
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
            required
          />
          <p></p>
          Файл 2:
          <input
            type="file"
            name="presentation"
            onChange={handleFileChange}
            accept=".pdf"
            required
          />
      

        <button type="submit" className="productBuyForm_submitButton">
          Создать продукт
        </button>
      </form>
      <Vivid productId={2} />
    </div>
  );
};

export default ProductForm;
