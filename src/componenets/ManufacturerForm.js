import React, { useState, useEffect } from "react";
import {
  createManufacturerOne,
  createManufacturerTwo,
  createManufacturerThree,
  getManufacturersByTypeOne,
  getManufacturersByTypeTwo,
  getManufacturersByTypeThree,
  deleteManufacturerOne,
  deleteManufacturerTwo,
  deleteManufacturerThree,
} from "../http/manufacturerApi";
import "../style/ProductBuyForm.css"; // Подключаем существующий CSS файл

const ManufacturerForm = () => {
  const [manufacturers, setManufacturers] = useState({});
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [name, setName] = useState("");
  const [logo, setLogo] = useState(null);
  const [typeId, setTypeId] = useState("1");

  useEffect(() => {
    fetchManufacturers();
  }, []);

  // Получение списка производителей по категориям
  const fetchManufacturers = async () => {
    const data1 = await getManufacturersByTypeOne();
    const data2 = await getManufacturersByTypeTwo();
    const data3 = await getManufacturersByTypeThree();
    setManufacturers({
      1: data1,
      2: data2,
      3: data3,
    });
  };

  // Обработчик отправки формы
  const handleManufacturerSubmit = async (e) => {
    e.preventDefault();
    const manufacturerData = new FormData();
    manufacturerData.append("name", name);
    manufacturerData.append("logo", logo);

    // Создание производителя по выбранной категории
    if (typeId === "1") {
      await createManufacturerOne(manufacturerData);
    } else if (typeId === "2") {
      await createManufacturerTwo(manufacturerData);
    } else {
      await createManufacturerThree(manufacturerData);
    }

    resetForm();
    fetchManufacturers();
  };

  // Удаление производителя
  const handleDeleteManufacturer = async (typeId, id) => {
    if (typeId === "1") {
      await deleteManufacturerOne(id);
    } else if (typeId === "2") {
      await deleteManufacturerTwo(id);
    } else {
      await deleteManufacturerThree(id);
    }
    fetchManufacturers();
  };

  // Сброс формы
  const resetForm = () => {
    setIsFormOpen(false);
    setName("");
    setLogo(null);
    setTypeId("1");
  };

  const handleLogoChange = (e) => {
    setLogo(e.target.files[0]);
  };

  return (
    <div className="delivery-page">
      <h1>Управление производителями</h1>

      {/* Кнопка для открытия формы */}
      {!isFormOpen && (
        <button
          onClick={() => setIsFormOpen(true)}
          className="productBuyForm_submitButton"
        >
          Добавить производителя
        </button>
      )}

      {/* Форма добавления производителя */}
      {isFormOpen && (
        <form onSubmit={handleManufacturerSubmit} className="delivery-form">
          <label htmlFor="name">Название:</label>
          <input
            type="text"
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />

          <label htmlFor="logo">Логотип:</label>
          <input type="file" id="logo" onChange={handleLogoChange} required />

          <label htmlFor="type">Категория:</label>
          <select
            id="type"
            value={typeId}
            onChange={(e) => setTypeId(e.target.value)}
          >
            <option value="1">ХСЗР</option>
            <option value="2">Удобрения</option>
            <option value="3">Посевной материал</option>
          </select>

          <button type="submit" className="productBuyForm_submitButton">
            Добавить
          </button>

          <button
            type="button"
            onClick={resetForm}
            className="productBuyForm_deleteButton"
          >
            Отмена
          </button>
        </form>
      )}

      {/* Список производителей по категориям */}
      <h2 style={{ marginTop: "20px", marginBottom: "20px" }}>
        Список производителей:
      </h2>
      {["1", "2", "3"].map((id) => (
        <div key={id}>
          <h3>Категория {id}</h3>
          <ul className="productBuyForm_productList">
            {manufacturers[id] &&
              manufacturers[id].map((manufacturer) => (
                <li
                  key={manufacturer.id}
                  className="productBuyForm_productItem"
                >
                  {manufacturer.name}
                  <button
                    onClick={() =>
                      handleDeleteManufacturer(id, manufacturer.id)
                    }
                    className="productBuyForm_deleteButton"
                  >
                    Удалить
                  </button>
                </li>
              ))}
          </ul>
        </div>
      ))}
    </div>
  );
};

export default ManufacturerForm;
