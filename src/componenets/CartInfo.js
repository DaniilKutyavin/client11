import React, { useState, useEffect } from "react";
import { getAll, updateCart } from "../http/infocartApi";

const EditCartInfo = () => {
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getAll();
        const sortedData = data.sort((a, b) => a.id - b.id);
        setCartItems(sortedData);
      } catch (err) {
        setError("Ошибка при загрузке данных");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleUpdate = async (id, desc) => {
    try {
      const updatedItem = { id, desc };
      await updateCart(updatedItem);
      alert("Запись успешно обновлена");
    } catch (err) {
      console.error(err);
      alert("Ошибка при обновлении записи");
    }
  };

  const handleChange = (id, newText) => {
    setCartItems((prevItems) =>
      prevItems.map((item) =>
        item.id === id ? { ...item, desc: newText } : item
      )
    );
  };

  if (loading) return <div>Загрузка...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div className="delivery-page" style={{ marginTop: "300px" }}>
      <h2>Редактирование памятки.</h2>
      {cartItems.map((item) => (
        <div
          key={item.id}
          style={{ marginBottom: "15px" }}
          className="delivery-form"
        >
          <textarea
            value={item.desc}
            onChange={(e) => handleChange(item.id, e.target.value)}
            rows="5"
            style={{
              width: "100%",
              padding: "10px",
              marginBottom: "10px",
              border: "1px solid #ccc",
              borderRadius: "4px",
              resize: "vertical",
            }}
          />
          <button
            className="productBuyForm_submitButton"
            onClick={() => handleUpdate(item.id, item.desc)}
          >
            Сохранить
          </button>
        </div>
      ))}
    </div>
  );
};

export default EditCartInfo;
