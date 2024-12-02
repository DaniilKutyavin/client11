import React, { useState, useEffect } from "react";
import { createProductSZR } from "../http/productApi"; // Update the path as necessary
import "../style/ProductBuyForm.css"; // Import your CSS file
import { getManufacturersByTypeOne } from "../http/manufacturerApi";
import Vivid from "../componenets/vivid";
const ProductForm = () => {
  const [formData, setFormData] = useState({
    name: "",
    price: "",
    price_two: "",
    type: "1", // Always set type to 1
    description: "",
    description_low: "",
    desc_header: "",
    weight: "",
    culture: "",
    category: "",
    waiting: "",
    manufacturer: "",
    expenditure: "",
    shelf: "",
    conditions: "",
    packaging: "",
    htmlTable: "",
    adva: [],
    desc: [],
  });
  const [manufacturers, setManufacturers] = useState([]);
  const [loadingManufacturers, setLoadingManufacturers] = useState(true);

  useEffect(() => {
    const fetchManufacturers = async () => {
      try {
        const data = await getManufacturersByTypeOne();
        setManufacturers(data);
      } catch (error) {
        console.error("Error fetching manufacturers:", error);
      } finally {
        setLoadingManufacturers(false);
      }
    };

    fetchManufacturers();
  }, []);

  const [files, setFiles] = useState({
    img: null,
    certificate: null,
    presentation: null,
  });

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

  const addDescription = () => {
    setFormData((prevData) => ({
      ...prevData,
      desc: [...prevData.desc, { title: "", text: "" }],
    }));
  };

  const handleAdvantageChange = (index, value) => {
    setFormData((prevData) => {
      const newAdva = prevData.adva.map((item, i) =>
        i === index ? { text: value } : item
      );
      return {
        ...prevData,
        adva: newAdva,
      };
    });
  };

  const handleDescriptionChange = (index, field, value) => {
    setFormData((prevData) => {
      const newDesc = prevData.desc.map((item, i) =>
        i === index ? { ...item, [field]: value } : item
      );
      return {
        ...prevData,
        desc: newDesc,
      };
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
      await createProductSZR(formDataToSubmit);

    alert("Продукт успешно создан!");
      // Reset form and state if necessary
      setFormData({
        name: "",
        price: "",
        price_two: "",
        type: "1", // Reset type to 1
        description: "",
        description_low: "",
        desc_header: "",
        weight: "",
        culture: "",
        category: "",
        waiting: "",
        manufacturer: "",
        expenditure: "",
        shelf: "",
        conditions: "",
        packaging: "",
        htmlTable: "",
        adva: [],
        desc: [],
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

  return (
    <div className="delivery-page">
      <h2>Создать ХСЗР</h2>
      <form className="delivery-form" onSubmit={handleSubmit}>
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
            value={formData.type} // Keep type as a constant
            readOnly // Make it read-only since it's always 1
          />
        <label htmlFor="name">Описание:</label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            placeholder="Описание"
          />
        <label htmlFor="name">Описание в шапке:</label>
          <input
            name="desc_header"
            value={formData.desc_header}
            onChange={handleChange}
            placeholder="Описание в шапке"
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
  <button type="button" onClick={() => handleСultureSelect("Кукуруза")}>Кукуруза</button>
  <button type="button" onClick={() => handleСultureSelect("Подсолнечник")}>Подсолнечник</button>
  <button type="button" onClick={() => handleСultureSelect("Сахарная свекла")}>Сахарная свекла</button>
  <button type="button" onClick={() => handleСultureSelect("Соя")}>Соя</button>
  <button type="button" onClick={() => handleСultureSelect("Рапс")}>Рапс</button>
  <button type="button" onClick={() => handleСultureSelect("Картофель")}>Картофель</button>
  <button type="button" onClick={() => handleСultureSelect("Нут")}>Нут</button>
  <button type="button" onClick={() => handleСultureSelect("Горох")}>Горох</button>
  <button type="button" onClick={() => handleСultureSelect("Томаты")}>Томаты</button>
  <button type="button" onClick={() => handleСultureSelect("Огурцы")}>Огурцы</button>
  <button type="button" onClick={() => handleСultureSelect("Лук")}>Лук</button>
  <button type="button" onClick={() => handleСultureSelect("Виноградники")}>Виноградники</button>
  <button type="button" onClick={() => handleСultureSelect("Плодовые")}>Плодовые</button>
  <button type="button" onClick={() => handleСultureSelect("Лен")}>Лен</button>
  <button type="button" onClick={() => handleСultureSelect("Капуста")}>Капуста</button>
  <button type="button" onClick={() => handleСultureSelect("Свекла столовая")}>Свекла столовая</button>
  <button type="button" onClick={() => handleСultureSelect("Морковь")}>Морковь</button>
  <button type="button" onClick={() => handleСultureSelect("Рис")}>Рис</button>
  <button type="button" onClick={() => handleСultureSelect("Пары")}>Пары</button>
  <button type="button" onClick={() => handleСultureSelect("Пастбища и кормовые травы")}>Пастбища и кормовые травы</button>
  <button type="button" onClick={() => handleСultureSelect("Декоративные")}>Декоративные</button>
  <button type="button" onClick={() => handleСultureSelect("Лекарственные")}>Лекарственные</button>
  <button type="button" onClick={() => handleСultureSelect("Саранчовые")}>Саранчовые</button>
  <button type="button" onClick={() => handleСultureSelect("Индустриальные объекты")}>Индустриальные объекты</button>
  <button type="button" onClick={() => handleСultureSelect("Гречиха")}>Гречиха</button>
  <button type="button" onClick={() => handleСultureSelect("Чечевица")}>Чечевица</button>
  <button type="button" onClick={() => handleСultureSelect("Пшеница")}>Пшеница</button>
  <button type="button" onClick={() => handleСultureSelect("Ячмень")}>Ячмень</button>
  <button type="button" onClick={() => handleСultureSelect("Овес")}>Овес</button>
  <button type="button" onClick={() => handleСultureSelect("Рожь")}>Рожь</button>
  <button type="button" onClick={() => handleСultureSelect("Люпин")}>Люпин</button>
  <button type="button" onClick={() => handleСultureSelect("Люцерна")}>Люцерна</button>
  <button type="button" onClick={() => handleСultureSelect("Чеснок")}>Чеснок</button>
</div>
{formData.culture && (
  <div>
    <strong>Выбранные культура:</strong>
    <p>{formData.culture.split(";").join(", ")}</p>
  </div>
)}
         
          <label>Выберите категорию:</label>
<div>
  <button type="button" onClick={() => handleCategorySelect("Гербициды")}>Гербициды</button>
  <button type="button" onClick={() => handleCategorySelect("Инсектициды")}>Инсектициды</button>
  <button type="button" onClick={() => handleCategorySelect("Фунгициды")}>Фунгициды</button>
  <button type="button" onClick={() => handleCategorySelect("Протравители")}>Протравители</button>
  <button type="button" onClick={() => handleCategorySelect("Адьюванты")}>Адьюванты</button>
  <button type="button" onClick={() => handleCategorySelect("Регуляторы роста")}>Регуляторы роста</button>
  <button type="button" onClick={() => handleCategorySelect("Десиканты")}>Десиканты</button>
  <button type="button" onClick={() => handleCategorySelect("Фумиганты и родентициды")}>Фумиганты и родентициды</button>
</div>
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
          <label htmlFor="name">Срок ожидания и кратность ...:</label>
          <input
            name="waiting"
            value={formData.waiting}
            onChange={handleChange}
            placeholder="Срок ожидания и кратность ..."
          />
        <label htmlFor="name">Расход рабочей жидкости:</label>
          <input
            name="expenditure"
            value={formData.expenditure}
            onChange={handleChange}
            placeholder="Расход рабочей жидкости"
          />
       <label htmlFor="name">Срок хранения:</label>
          <input
            name="shelf"
            value={formData.shelf}
            onChange={handleChange}
            placeholder="Срок хранения"
          />
        <label htmlFor="name">Условия хранения:</label>
          <input
            name="conditions"
            value={formData.conditions}
            onChange={handleChange}
            placeholder="Условия хранения"
          />
       <label htmlFor="name">Упаковка:</label>
          <input
            name="packaging"
            value={formData.packaging}
            onChange={handleChange}
            placeholder="Упаковка"
          />
        <label htmlFor="name">HTML Таблица:</label>
          <input
            name="htmlTable"
            value={formData.htmlTable}
            onChange={handleChange}
            placeholder="HTML Таблица"
          />
        

        
        <label htmlFor="name">Преимущество:</label>
          <div className="productBuyForm_infoFields">
          {formData.adva.map((adv, index) => (
            <input
              key={index}
              value={adv.text}
              onChange={(e) => handleAdvantageChange(index, e.target.value)}
              placeholder="Преимущество"
            />
          ))}
        </div>
          <button
            type="button"
            className="productBuyForm_addInfoButton"
            onClick={addAdvantage}
          >
            Добавить преимущество
          </button>
        

          <label htmlFor="name">Описание:</label>
          <div className="productBuyForm_infoFields">
          {formData.desc.map((desc, index) => (
            <div key={index}>
              <input
                value={desc.title}
                onChange={(e) =>
                  handleDescriptionChange(index, "title", e.target.value)
                }
                placeholder="Заголовок"
              />
              <textarea
                value={desc.text}
                onChange={(e) =>
                  handleDescriptionChange(index, "text", e.target.value)
                }
                placeholder="Описание"
              />
            </div>
          ))}
          </div>
          <button
            type="button"
           className="productBuyForm_addInfoButton"
            onClick={addDescription}
          >
            Добавить описание
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
      <Vivid productId={1} />
    </div>
  );
};

export default ProductForm;
