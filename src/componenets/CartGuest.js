import React, { useEffect, useState } from "react";
import { useNavigate } from 'react-router-dom';
import { createOredersGuest } from "../http/productApi"; // Make sure to use the correct import for the API

const CartGuest = ({ onClose }) => {
  const [cart, setCart] = useState([]);
  const [paymentMethod, setPaymentMethod] = useState(""); // Add state for payment method
  const [userDetails, setUserDetails] = useState({
    name: "",
    phone: "",
    city: "",
    email: "",
    promoCode: "",
    comment: "",
  });
  const navigate = useNavigate();
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    const storedCart = JSON.parse(localStorage.getItem("cart")) || [];
    setCart(storedCart);
  }, []);

  const handleRemoveItem = (index) => {
    const newCart = cart.filter((_, i) => i !== index);
    setCart(newCart);
    localStorage.setItem("cart", JSON.stringify(newCart));
  };

  const handleQuantityChange = (index, action) => {
    const newCart = [...cart];
    if (action === 'increment') {
      newCart[index].quantity += 1;
    } else if (action === 'decrement' && newCart[index].quantity > 1) {
      newCart[index].quantity -= 1;
    }
    setCart(newCart);
    localStorage.setItem("cart", JSON.stringify(newCart));
  };

  const handleCheckout = async () => {
    const totalPrice = cart.reduce((acc, item) => acc + item.price * item.quantity, 0);
    
    // Prepare the order data
    const orderData = {
      items: cart,
      totalPrice,
      paymentMethod,
      name: userDetails.name,
      phone: userDetails.phone,
      city: userDetails.city,
      email: userDetails.email,
      promoCode: userDetails.promoCode,
      comment: userDetails.comment,
    };

    try {
      const response = await createOredersGuest(orderData);
      console.log("Заказ успешно создан:", response);
      alert("Ваш заказ оформлен!");
      localStorage.removeItem("cart");
      setCart([]);
      navigate("/order-confirmation");
      onClose();
    } catch (error) {
      console.error("Ошибка при оформлении заказа:", error);
      alert("Не удалось оформить заказ. Попробуйте снова.");
    }
  };

  // Calculate the total amount
  const totalAmount = cart.reduce((acc, item) => acc + item.price * item.quantity, 0);
  return (
    <div className="cart-overlay" onClick={onClose}>
      <div className="cart-content" onClick={(e) => e.stopPropagation()}>
        <span className="close-icon" onClick={onClose}>✖</span>
        <h2 className="cart-title">Заказ</h2>

        {cart.length !== 0 ? (
          cart.map((item, index) => (
            <div className="cart-item" key={index}>
              <span className="delete-icon" onClick={() => handleRemoveItem(index)}>✖</span>

              <div className="cart-item-info">
                <p className="product-title">{item.name}</p>
                <p className="product-description">{item.description_low}</p>
                <p className="obem">{item.weight}</p>
                <div className="quantity-controls">
                  <button className="quantity-button" onClick={() => handleQuantityChange(index, 'decrement')}>-</button>
                  <span className="quantity">{item.quantity}</span>
                  <button className="quantity-button" onClick={() => handleQuantityChange(index, 'increment')}>+</button>
                  <span className="price-cart">{item.price} ₽</span>
                </div>
              </div>
              <img src={process.env.REACT_APP_API_URL + item.img} alt="Product" className="cart-item-image" />
            </div>
          ))
        ) : (
          <p>Корзина пуста</p>
        )}

        <div className="sum-section">
          <p className="sum-label">Сумма:</p>
          <div className="mobilka">
            {paymentMethod === "Наличными курьеру" ? (
              <>
                <div className="sum-details non-cash">
                  <span className="cash-amount">{totalAmount} ₽&ensp;</span>
                  <span className="cash-method"> Наличный расчет</span>
                </div>
                <div className="sum-details non-cash">
                  <span className="non-cash-amount">
                    {(totalAmount * 1.05).toFixed(2)} ₽&ensp;
                  </span>
                  <span className="non-cash-method"> Безналичный расчет</span>
                </div>
              </>
            ) : (
              <>
                <div className="sum-details non-cash">
                  <span className="cash-amount">
                    {(totalAmount * 1.05).toFixed(2)} ₽&ensp;
                  </span>
                  <span className="cash-method"> Безналичный расчет</span>
                </div>
                <div className="sum-details non-cash">
                  <span className="non-cash-amount">{totalAmount} ₽&ensp;</span>
                  <span className="non-cash-method"> Наличный расчет</span>
                </div>
              </>
            )}
          </div>
        </div>

        <h3 className="section-title">Данные</h3>
        <label>ФИО</label>
        <input
          type="text"
          name="name"
          className="intext"
          value={userDetails.name}
          onChange={(e) => setUserDetails({ ...userDetails, name: e.target.value })}
          required
        />
        <label>Телефон</label>
        <input
          type="tel"
          name="phone"
          className="intext"
          value={userDetails.phone}
          onChange={(e) => setUserDetails({ ...userDetails, phone: e.target.value })}
        />

        <h3 className="section-title">Доставка</h3>
        <label>Город</label>
        <input
          type="text"
          name="city"
          className="intext"
          value={userDetails.city}
          onChange={(e) => setUserDetails({ ...userDetails, city: e.target.value })}
        />
        <label>Почта</label>
        <input
          type="email"
          name="email"
          className="intext"
          value={userDetails.email}
          onChange={(e) => setUserDetails({ ...userDetails, email: e.target.value })}
        />

        <h3 className="section-title">Способ оплаты</h3>
        <div className="payment-options">
          <label>
            <input
              type="radio"
              name="paymentMethod"
              value="Наличными курьеру"
              onChange={() => setPaymentMethod("Наличными курьеру")}
            />
            Наличными курьеру
          </label>
          <label>
            <input
              type="radio"
              name="paymentMethod"
              value="Банковский перевод"
              onChange={() => setPaymentMethod("Банковский перевод")}
            />
            Банковский перевод
          </label>
        </div>

        <h3 className="section-title">Комментарий</h3>
        <label>Промокод</label>
        <input
          type="text"
          name="promoCode"
          className="intext"
          value={userDetails.promoCode}
          onChange={(e) => setUserDetails({ ...userDetails, promoCode: e.target.value })}
        />
        <label>Комментарий к заказу</label>
        <input
          type="text"
          name="comment"
          className="intext"
          value={userDetails.comment}
          onChange={(e) => setUserDetails({ ...userDetails, comment: e.target.value })}
        />
        {errorMessage && <p className="error-message">{errorMessage}</p>}

        <button className="order-button" onClick={handleCheckout}>
          Оформить
        </button>
      </div>
    </div>
  );
};

export default CartGuest;
