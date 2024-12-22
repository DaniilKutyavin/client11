import React, { useState, useEffect } from "react";
import { getProductsByTypeAdm, updateProduct } from "../http/productApi";
import "../style/ProductBuyForm.css";

const ProductForm = ({ productId }) => {
  const [products, setProducts] = useState([]); // Сохраняем список продуктов
  const [loading, setLoading] = useState(true); // Статус загрузки
  const [editingProduct, setEditingProduct] = useState(null); // Продукт, который редактируется
  const [formData, setFormData] = useState({
    name: "",
    price: "",
    price_two: "",
    description: "",
    desc_header: "",
    description_low: "",
    weight: "",
    status: false, // Добавлено поле для статуса
  });

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const fetchedProducts = await getProductsByTypeAdm(productId);
        setProducts(fetchedProducts);
      } catch (error) {
        console.error("Ошибка при загрузке продуктов:", error);
      } finally {
        setLoading(false);
      }
    };

    if (productId) fetchProducts();
  }, [productId]);

  const handleEditClick = (product) => {
    setEditingProduct(product);
    setFormData({
      name: product.name,
      price: product.price,
      price_two: product.price_two,
      description: product.description,
      desc_header: product.desc_header,
      description_low: product.description_low,
      weight: product.weight,
      status: product.status, // Заполняем поле статуса
    });
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    const inputValue = type === "checkbox" ? checked : value;
    setFormData((prev) => ({ ...prev, [name]: inputValue }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!editingProduct) return;

    try {
      const updatedProduct = await updateProduct(editingProduct.id, formData);
      setProducts((prev) =>
        prev.map((product) =>
          product.id === editingProduct.id ? updatedProduct : product
        )
      );
      setEditingProduct(null);
      setFormData({
        name: "",
        price: "",
        price_two: "",
        description: "",
        status: false,
      });
    } catch (error) {
      console.error("Ошибка при обновлении продукта:", error);
    }
  };

  if (loading) return <div>Загрузка...</div>;

  if (!products.length) return <div>Продукты не найдены.</div>;

  return (
    <>
      <h2>Список товаров</h2>
      <ul className="productBuyForm_productList">
        {products.map((product) => (
          <li key={product.id} className="productBuyForm_productItem">
            {product.name} - {product.price} ₽ - Статус: {product.status ? "Активен" : "Неактивен"}
            <button
              onClick={() => handleEditClick(product)}
              className="productBuyForm_submitButton"
            >
              Редактировать
            </button>
          </li>
        ))}
      </ul>

      {editingProduct && (
        <form className="productEditForm" onSubmit={handleSubmit}>
          <h3>Редактировать продукт</h3>
          <label>
            Название:
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              className="productBuyForm_productItem"
            />
          </label>
          <label>
            Цена:
            <input
              type="number"
              name="price"
              value={formData.price}
              onChange={handleInputChange}
              className="productBuyForm_productItem"
            />
          </label>
          <label>
            Цена безнал:
            <input
              type="number"
              name="price_two"
              value={formData.price_two}
              onChange={handleInputChange}
              className="productBuyForm_productItem"
            />
          </label>
          <label>
            Описание:
            <textarea
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              className="productBuyForm_productItem"
            />
          </label>

          <label>
            Вес:
            <textarea
              name="weight"
              value={formData.weight}
              onChange={handleInputChange}
              className="productBuyForm_productItem"
            />
          </label>
          <label>
          Описание в шапке:
            <textarea
              name="desc_header"
              value={formData.desc_header}
              onChange={handleInputChange}
              className="productBuyForm_productItem"
            />
          </label>
          <label>
          Нижнее описание:
            <textarea
              name="description_low"
              value={formData.description_low}
              onChange={handleInputChange}
              className="productBuyForm_productItem"
            />
          </label>
          <label>
            Статус:
            <input
              type="checkbox"
              name="status"
              checked={formData.status}
              onChange={handleInputChange}
            />
            {formData.status ? "Активен" : "Неактивен"}
          </label>
          <p/>
          <button type="submit"  className="productBuyForm_submitButton" >Сохранить</button>
          <p/>
          <button type="button" className="productBuyForm_submitButton" onClick={() => setEditingProduct(null)}>
            Отмена
          </button>
        </form>
      )}
    </>
  );
};

export default ProductForm;
