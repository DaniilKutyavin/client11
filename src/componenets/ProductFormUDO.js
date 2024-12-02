import React, { useState, useEffect } from "react";
import { createProductUDO } from "../http/productApi"; // Обновите путь, если необходимо
import { getManufacturersByTypeTwo } from "../http/manufacturerApi";
import Vivid from "../componenets/vivid";

const ProductForm = () => {
  const [formData, setFormData] = useState({
    name: "",
    price: "",
    price_two: "",
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
        price_two: "",
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

  const handleСultureSelect = (culture) => {
    setFormData((prevData) => {
      const currentСultures = prevData.culture ? prevData.culture.split(";") : [];
  
      // Проверяем, есть ли категория в списке
      if (currentСultures.includes(culture)) {
        // Удаляем категорию из списка
        const newCategories = currentСultures.filter(item => item !== culture);
        return { ...prevData, culture: newCategories.join(";") };
      } else {
        // Добавляем категорию в список
        return { ...prevData, culture: [...currentСultures, culture].join(";") };
      }
    });
  };

  const handleFertilizersSelect = (fertilizers) => {
    setFormData((prevData) => {
      const currentFertilizers = prevData.fertilizers ? prevData.fertilizers.split(";") : [];
  
      // Проверяем, есть ли категория в списке
      if (currentFertilizers.includes(fertilizers)) {
        // Удаляем категорию из списка
        const newCategories = currentFertilizers.filter(item => item !== fertilizers);
        return { ...prevData, fertilizers: newCategories.join(";") };
      } else {
        // Добавляем категорию в список
        return { ...prevData, fertilizers: [...currentFertilizers, fertilizers].join(";") };
      }
    });
  };

  const handleWaySelect = (way) => {
    setFormData((prevData) => {
      const currentWay = prevData.way ? prevData.way.split(";") : [];
  
      // Проверяем, есть ли категория в списке
      if (currentWay.includes(way)) {
        // Удаляем категорию из списка
        const newCategories = currentWay.filter(item => item !== way);
        return { ...prevData, way: newCategories.join(";") };
      } else {
        // Добавляем категорию в список
        return { ...prevData, way: [...currentWay, way].join(";") };
      }
    });
  };

  const handleGroundSelect = (ground) => {
    setFormData((prevData) => {
      const currentGround = prevData.ground ? prevData.ground.split(";") : [];
  
      // Проверяем, есть ли категория в списке
      if (currentGround.includes(ground)) {
        // Удаляем категорию из списка
        const newCategories = currentGround.filter(item => item !== ground);
        return { ...prevData, ground: newCategories.join(";") };
      } else {
        // Добавляем категорию в список
        return { ...prevData, ground: [...currentGround, ground].join(";") };
      }
    });
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

          <label>Выберите культуру:</label>
<div>
  <button type="button" onClick={() => handleСultureSelect("Зерновые")}>Зерновые</button>
  <button type="button" onClick={() => handleСultureSelect("Масличные")}>Масличные</button>
  <button type="button" onClick={() => handleСultureSelect("Зернобобовые")}>Зернобобовые</button>
  <button type="button" onClick={() => handleСultureSelect("Овощные")}>Овощные</button>
  <button type="button" onClick={() => handleСultureSelect("Плодовые")}>Плодовые</button>
  <button type="button" onClick={() => handleСultureSelect("Корнеплоды/клубнеплоды")}>Корнеплоды/клубнеплоды</button>
  <button type="button" onClick={() => handleСultureSelect("Ягодные")}>Ягодные</button>
  <button type="button" onClick={() => handleСultureSelect("Зеленные")}>Зеленные</button>
  <button type="button" onClick={() => handleСultureSelect("Прядильные")}>Прядильные</button>
</div>
{formData.culture && (
  <div>
    <strong>Выбранные культура:</strong>
    <p>{formData.culture.split(";").join(", ")}</p>
  </div>
)}
          
          <label>Выберите удобрение:</label>
<div>
  <button type="button" onClick={() => handleFertilizersSelect("Азотные N")}>Азотные N</button>
  <button type="button" onClick={() => handleFertilizersSelect("Фосфорные P")}>Фосфорные P</button>
  <button type="button" onClick={() => handleFertilizersSelect("Калийные K")}>Калийные K</button>
  <button type="button" onClick={() => handleFertilizersSelect("Комплексные N+P+K")}>Комплексные N+P+K</button>
  <button type="button" onClick={() => handleFertilizersSelect("Водорастворимые")}>Водорастворимые</button>
  <button type="button" onClick={() => handleFertilizersSelect("Жидкие")}>Жидкие</button>
</div>
{formData.fertilizers && (
  <div>
    <strong>Выбранные удобрения:</strong>
    <p>{formData.fertilizers.split(";").join(", ")}</p>
  </div>
)}
         

          <label>Выберите  способ внесения:</label>
<div>
  <button type="button" onClick={() => handleWaySelect("Основное внесение")}>Основное внесение</button>
  <button type="button" onClick={() => handleWaySelect("Припосевное внесение")}>Припосевное внесение</button>
  <button type="button" onClick={() => handleWaySelect("Листовые подкормки")}>Листовые подкормки</button>
  <button type="button" onClick={() => handleWaySelect("Фертигация")}>Фертигация</button>
  <button type="button" onClick={() => handleWaySelect("Капельный полив")}>Капельный полив</button>
  <button type="button" onClick={() => handleWaySelect("Корневая подкормка")}>Корневая подкормка</button>
  <button type="button" onClick={() => handleWaySelect("Обработка семян")}>Обработка семян</button>
</div>
{formData.way && (
  <div>
    <strong>Выбранные  способы внесения:</strong>
    <p>{formData.way.split(";").join(", ")}</p>
  </div>
)}
        
          <label>Выберите вид грунта:</label>
<div>
  <button type="button" onClick={() => handleGroundSelect("Открытый")}>Открытый</button>
  <button type="button" onClick={() => handleGroundSelect("Закрытый")}>Закрытый</button>
</div>
{formData.ground && (
  <div>
    <strong>Выбранные виды грунта:</strong>
    <p>{formData.ground.split(";").join(", ")}</p>
  </div>
)}
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
