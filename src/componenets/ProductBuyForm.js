import React, { useState, useEffect } from "react";
import {
  buyProduct,
  deletebuyProduct,
  getbuyProduct,
} from "../http/productApi";
import "../style/ProductBuyForm.css";

const ProductBuyForm = () => {
  const [name, setName] = useState("");
  const [priceOne, setPriceOne] = useState("");
  const [priceTwo, setPriceTwo] = useState("");
  const [category, setCategory] = useState("");
  const [info, setInfo] = useState([{ name: "" }]);
  const [products, setProducts] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const data = await getbuyProduct();
      setProducts(data);
    } catch (error) {
      console.error("Ошибка при получении продуктов:", error);
    }
  };

  const addInfo = () => setInfo([...info, { name: "" }]);

  const handleInfoChange = (index, event) => {
    const newInfo = [...info];
    newInfo[index].name = event.target.value;
    setInfo(newInfo);
  };

  const handlePriceOneChange = (e) => setPriceOne(e.target.value);
  const handlePriceTwoChange = (e) => setPriceTwo(e.target.value);

  const handleCategoryChange = (e) => {
    setCategory(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      const formData = {
        name,
        price_one: parseFloat(priceOne),
        price_two: parseFloat(priceTwo),
        category,
        info,
      };
      await buyProduct(formData);
      alert("Продукт успешно добавлен");
      resetForm();
      fetchProducts();
    } catch (err) {
      console.error("Ошибка при добавлении продукта:", err);
      setError("Ошибка при добавлении продукта. Попробуйте еще раз.");
    }
  };

  const handleDeleteProduct = async (id) => {
    if (window.confirm("Вы уверены, что хотите удалить этот продукт?")) {
      try {
        await deletebuyProduct(id);
        alert("Продукт успешно удален");
        fetchProducts();
      } catch (error) {
        console.error("Ошибка при удалении продукта:", error);
      }
    }
  };

  const resetForm = () => {
    setName("");
    setPriceOne("");
    setPriceTwo("");
    setCategory("");
    setInfo([{ name: "" }]);
  };

  const categories = [
    { id: 1, name: "Пшеница" },
    { id: 2, name: "Ячмень" },
    { id: 3, name: "Кукуруза" },
    { id: 4, name: "Подсолнечник" },
    { id: 5, name: "Соя" },
    { id: 6, name: "Рапс" },
    { id: 7, name: "Нут" },
    { id: 8, name: "Горох" },
    { id: 9, name: "Рожь" },
  ];

  return (
    <div className="delivery-page">
      <h1>Добавить продукт</h1>
      <form className="delivery-form" onSubmit={handleSubmit}>
        <label htmlFor="name">Название:</label>
        <input
          type="text"
          id="name"
          name="name"
          placeholder="Введите название продукта"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />

        <label htmlFor="priceOne">Цена 1:</label>
        <input
          type="number"
          id="priceOne"
          name="priceOne"
          placeholder="Введите цену 1"
          value={priceOne}
          onChange={handlePriceOneChange}
          required
        />

        <label htmlFor="priceTwo">Цена 2:</label>
        <input
          type="number"
          id="priceTwo"
          name="priceTwo"
          placeholder="Введите цену 2"
          value={priceTwo}
          onChange={handlePriceTwoChange}
          required
        />

        <label htmlFor="category">Категория:</label>
        <select
          id="category"
          value={category}
          onChange={handleCategoryChange}
          required
        >
          <option value="">Выберите категорию</option>
          {categories.map((cat) => (
            <option key={cat.id} value={cat.id}>
              {cat.name}
            </option>
          ))}
        </select>

        <label>Информация о продукте:</label>
        <div className="productBuyForm_infoFields">
          {info.map((item, index) => (
            <input
              key={index}
              type="text"
              value={item.name}
              onChange={(e) => handleInfoChange(index, e)}
              placeholder="Введите информацию"
            />
          ))}
        </div>
        <button
          type="button"
          className="productBuyForm_submitButton"
          onClick={addInfo}
        >
          Добавить еще информацию
        </button>

        {error && <p className="delivery-form_errorMessage">{error}</p>}

        <button type="submit" className="productBuyForm_submitButton">
          Создать
        </button>
      </form>

      <h2>Список продуктов</h2>
      <ul className="productBuyForm_productList">
        {products.map((product) => (
          <li key={product.id} className="productBuyForm_productItem">
            {product.name} - {product.price_one} / {product.price_two}
            <button
              onClick={() => handleDeleteProduct(product.id)}
              className="productBuyForm_deleteButton"
            >
              Удалить
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ProductBuyForm;
