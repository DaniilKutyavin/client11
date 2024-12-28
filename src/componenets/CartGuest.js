import React, { useEffect, useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { createOredersGuest } from "../http/productApi"; // Make sure to use the correct import for the API
import { Context } from "..";
import { getGift } from "../http/giftApi";

const CartGuest = ({ onClose }) => {
  const [cart, setCart] = useState([]);
  const [paymentMethod, setPaymentMethod] = useState("Наличными курьеру");
  const [selectedGift, setSelectedGift] = useState(null);
  const { gift } = useContext(Context);

  const [userDetails, setUserDetails] = useState({
    name: "",
    phone: "",
    city: "",
    email: "",
    promoCode: "",
    comment: "",
    giftId: selectedGift,
  });

  useEffect(() => {
    getGift().then((data) => gift.setGift(data));
  }, []);
  const item = gift.gift[0];

  const handleGiftSelection = (gift) => {
    setSelectedGift((prevGift) => (prevGift === gift ? null : gift));
    setUserDetails((prevDetails) => ({
      ...prevDetails,
      giftId: selectedGift === gift ? null : gift,
    }));
  };

  // Или через useEffect:
  useEffect(() => {
    setUserDetails((prevDetails) => ({
      ...prevDetails,
      giftId: selectedGift,
    }));
  }, [selectedGift]);
  const navigate = useNavigate();
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    const storedCart = JSON.parse(localStorage.getItem("cart")) || [];
    setCart(storedCart);
  }, []);

  const handleRemoveItem = (index) => {
    // Создаём новую корзину, исключая удалённый элемент
    const newCart = cart.filter((_, i) => i !== index);

    // Обновляем состояние корзины
    setCart(newCart);

    // Сохраняем обновлённую корзину в localStorage
    localStorage.setItem("cart", JSON.stringify(newCart));

    // Создаём кастомное событие для уведомления других компонентов
    const event = new Event("cartUpdated");
    window.dispatchEvent(event); // Триггерим событие
  };

  const handleQuantityChange = (index, action) => {
    const newCart = [...cart];
    if (action === "increment") {
      newCart[index].quantity += 1;
    } else if (action === "decrement" && newCart[index].quantity > 1) {
      newCart[index].quantity -= 1;
    }
    setCart(newCart);
    localStorage.setItem("cart", JSON.stringify(newCart));
    const event = new Event("cartUpdated");
    window.dispatchEvent(event); // Триггерим событие
  };

  const handleCheckout = async () => {
    const totalPrice = cart.reduce((acc, item) => {
      return (
        acc +
        (paymentMethod === "Банковский перевод" ? item.price_two : item.price) *
          item.quantity
      );
    }, 0);

    let type2Count = 0;
    let type3Count = 0;

    cart.forEach((item) => {
      if (item.type === 2) {
        type2Count += item.quantity;
      }
      if (item.type === 3) {
        type3Count += item.quantity;
      }
    });

    if (cart.length === 0) {
      setErrorMessage(
        "Корзина пуста. Пожалуйста, добавьте товары в корзину перед оформлением заказа."
      );
      return;
    }

    if (type2Count < 20 && type2Count != 0) {
      setErrorMessage("Удобрений должно быть не менее 20т.");
      return;
    }
    if (type3Count < 10 && type3Count != 0) {
      setErrorMessage("Посевного материала должно быть не менее 10.");
      return;
    }
    if (totalPrice < 35000) {
      setErrorMessage(
        "Минимальная сумма заказа составляет 35,000 ₽. Пожалуйста, добавьте товары на эту сумму."
      );
      return; // Prevent checkout
    }

    const { name, phone, city, email } = userDetails;
    if (!name || !phone || !city || !email) {
      setErrorMessage("Пожалуйста, заполните все обязательные поля.");
      return; // Прерываем оформление заказа, если не все обязательные поля заполнены
    }
    // Prepare the order data
    const orderData = {
      items: cart,
      totalPrice,
      paymentMethod,
      ...userDetails,
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

  const totalAmount = cart.reduce((acc, item) => {
    return acc + item.price * item.quantity;
  }, 0);

  const totalAmount2 = cart.reduce((acc, item) => {
    return acc + item.price_two * item.quantity;
  }, 0);
  const handlePhoneChange = (e) => {
    let input = e.target.value.replace(/\D/g, ""); // Удаляем всё, кроме цифр

    // Если первый символ не "7", заменяем его на "7"
    if (input.length > 0 && input[0] !== "7") {
      input = "7" + input;
    }

    // Формируем маску
    let formatted = "+7";
    if (input.length > 1) formatted += ` (${input.substring(1, 4)}`;
    if (input.length >= 5) formatted += `) ${input.substring(4, 7)}`;
    if (input.length >= 8) formatted += `-${input.substring(7, 9)}`;
    if (input.length >= 10) formatted += `-${input.substring(9, 11)}`;

    // Ограничиваем длину
    if (formatted.length > 18) {
      formatted = formatted.substring(0, 18);
    }

    setUserDetails((prevDetails) => ({
      ...prevDetails,
      phone: formatted,
    }));
  };
  return (
    <div className="cart-overlay" onClick={onClose}>
      <div className="cart-content" onClick={(e) => e.stopPropagation()}>
        <span className="close-icon close-button" onClick={onClose}>
          ×
        </span>
        <h2 className="cart-title">Заказ</h2>

        {cart.length !== 0 ? (
          cart.map((item, index) => (
            <div className="cart-item" key={index}>
              <span
                className="delete-icon"
                onClick={() => handleRemoveItem(index)}
              >
                ✖
              </span>

              <div className="cart-item-info">
                <p className="product-title">{item.name}</p>
                <p className="product-description">{item.description_low}</p>
                <p className="obem">{item.weight}</p>
                <div className="quantity-controls">
                  <button
                    className="quantity-button"
                    onClick={() => handleQuantityChange(index, "decrement")}
                  >
                    -
                  </button>
                  <span className="quantity">{item.quantity}</span>
                  <button
                    className="quantity-button"
                    onClick={() => handleQuantityChange(index, "increment")}
                  >
                    +
                  </button>
                  <span className="price-cart">{item.price} ₽</span>
                </div>
              </div>
              <img
                src={process.env.REACT_APP_API_URL_IMG + item.img}
                alt="Product"
                className="cart-item-image"
              />
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
                    {totalAmount2} ₽&ensp;
                  </span>
                  <span className="non-cash-method"> Безналичный расчет</span>
                </div>
              </>
            ) : (
              <>
                <div className="sum-details non-cash">
                  <span className="cash-amount">{totalAmount2} ₽&ensp;</span>
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
        {totalAmount >= 50000 && (
          <div className="gift-section">
            <h3 className="section-title">Выберите подарок:</h3>
            <div className="gift-options">
              {totalAmount >= 50000 && (
                <div
                  className={`gift-card ${
                    selectedGift === "1" ? "selected" : ""
                  }`}
                  onClick={() => handleGiftSelection("1")}
                >
                  <img
                    src={process.env.REACT_APP_API_URL_IMG + item?.imgOne}
                    className="product-imageee"
                  />
                  <p />
                  Получить
                </div>
              )}
              {totalAmount >= 100000 && (
                <div
                  className={`gift-card ${
                    selectedGift === "2" ? "selected" : ""
                  }`}
                  onClick={() => handleGiftSelection("2")}
                >
                  <img
                    src={process.env.REACT_APP_API_URL_IMG + item?.imgTwo}
                    className="product-imageee"
                  />
                  <p />
                  Получить
                </div>
              )}
              {totalAmount >= 150000 && (
                <div
                  className={`gift-card ${
                    selectedGift === "3" ? "selected" : ""
                  }`}
                  onClick={() => handleGiftSelection("3")}
                >
                  <img
                    src={process.env.REACT_APP_API_URL_IMG + item?.imgThree}
                    className="product-imageee"
                  />
                  <p />
                  Получить
                </div>
              )}
            </div>
          </div>
        )}
        <h3 className="section-title">Данные</h3>
        {/* User Details */}
        <label>ФИО</label>
        <input
          type="text"
          name="name"
          className="intext"
          value={userDetails.name}
          onChange={(e) =>
            setUserDetails({ ...userDetails, name: e.target.value })
          }
        />
        <label>Телефон</label>
        <input
          type="tel"
          id="phone"
          name="phone"
          className="intext"
          placeholder="+7 (___) ___-__-__"
          value={userDetails.phone}
          onChange={handlePhoneChange}
          maxLength={18} // Ограничиваем ввод длиной маски
        />

        <h3 className="section-title">Доставка</h3>
        <label>Город</label>
        <input
          type="text"
          name="city"
          className="intext"
          value={userDetails.city}
          onChange={(e) =>
            setUserDetails({ ...userDetails, city: e.target.value })
          }
        />
        <label>Почта</label>
        <input
          type="email"
          name="email"
          className="intext"
          value={userDetails.email}
          onChange={(e) =>
            setUserDetails({ ...userDetails, email: e.target.value })
          }
        />

        <h3 className="section-title">Способ оплаты</h3>
        <div className="payment-options">
          <label>
            <input
              type="radio"
              name="paymentMethod"
              value="Наличными курьеру"
              checked={paymentMethod === "Наличными курьеру"}
              onChange={() => setPaymentMethod("Наличными курьеру")}
            />
            Наличными курьеру
          </label>
          <label>
            <input
              type="radio"
              name="paymentMethod"
              value="Банковский перевод"
              checked={paymentMethod === "Банковский перевод"}
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
          onChange={(e) =>
            setUserDetails({ ...userDetails, promoCode: e.target.value })
          }
        />
        <label>Комментарий к заказу</label>
        <input
          type="text"
          name="comment"
          className="intext"
          value={userDetails.comment}
          onChange={(e) =>
            setUserDetails({ ...userDetails, comment: e.target.value })
          }
        />
        {errorMessage && <p className="error-messagee">{errorMessage}</p>}

        <button className="order-button" onClick={handleCheckout}>
          Оформить
        </button>
      </div>
    </div>
  );
};

export default CartGuest;
