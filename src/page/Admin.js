import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import OrderDetailModal from "../componenets/Order"; // Убедитесь, что путь правильный
import { getOrders, updateOrder } from "../http/productApi";
import {
  CREATE_ROUTER,
  USER_ROUTER,
  ADRESS_ROUTER,
  NEWSADD_ROUTER,
  DELIVERYADD_ROUTER,
  GIFT_ROUTER,
  FOOTER_ROUTER,
  MANUFACTURERS_ROUTER,
  PRODUCTADD_ROUTER,
  IMG_ROUTER,
  CARTINFO_ROUTER,
} from "../utils/consts";
import "../style/newss.css";

import ContactInfoManager from "../componenets/FormOne";
import ContactInfoTwo from "../componenets/FormTwo"; // Убедитесь, что путь правильный
import { observer } from "mobx-react-lite";
import OrderGuestTable from "../componenets/OrderGuestTable";

const Admin = observer(() => {
 const [orders, setOrders] = useState([]);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null);

  // Состояния для диапазона дат
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  useEffect(() => {
    fetchOrders(); // Изначально загружаем заказы
    const intervalId = setInterval(fetchOrders, 15000); // Обновление каждые 15 секунд

    return () => clearInterval(intervalId); // Очистка интервала при размонтировании компонента
  }, []);

  const fetchOrders = async () => {
    try {
      const data = await getOrders();
      const sortedData = data.sort((a, b) => a.id - b.id); // Сортируем заказы по id в порядке возрастания
      setOrders(sortedData);
      setFilteredOrders(sortedData); // Изначально показываем все заказы
    } catch (error) {
      console.error("Ошибка при получении заказов", error);
    }
  };

  // Функция для фильтрации по дате
  const filterByDate = () => {
    if (startDate && endDate) {
      const filtered = orders.filter((order) => {
        const orderDate = new Date(order.createdAt).toISOString().split("T")[0];
        return orderDate >= startDate && orderDate <= endDate;
      });
      setFilteredOrders(filtered);
    } else {
      setFilteredOrders(orders); // Если даты не выбраны, показываем все заказы
    }
  };

  const handleOrderClick = (order) => {
    setSelectedOrder(order);
  };

  const handleCloseModal = () => {
    setSelectedOrder(null);
  };

  const handleOrderUpdate = () => {
    fetchOrders(); // Обновляем заказы после изменения
  };

  const calculateTotal = (order) => {
    let total = order.order_products.reduce((sum, product) => {
      return sum + product.price * product.quantity;
    }, 0);

    // Проверка метода оплаты и корректировка суммы
    if (order.paymentMethod === "Банковский перевод") {
      total *= 1.05; // Умножаем на 5%
    }

    return total.toFixed(0); // Форматируем до целого числа
  };

  return (
    <>
    <div className="header">
        <div className="title-block">
          <h1>Админ панель</h1>         
        </div>
      </div>
      <div className="admin-container">
       
        <div className="admin-buttons">
          <Link to={CREATE_ROUTER}>
            <button className="productBuyForm_addInfoButton">
              Закупка культур
            </button>
          </Link>
          <Link to={USER_ROUTER}>
            <button className="productBuyForm_addInfoButton">
              Создать сотрудника
            </button>
          </Link>
          <Link to={ADRESS_ROUTER}>
            <button className="productBuyForm_addInfoButton">
              Создать адрес
            </button>
          </Link>
          <Link to={NEWSADD_ROUTER}>
            <button className="productBuyForm_addInfoButton">
              Добавить новость
            </button>
          </Link>
          <Link to={DELIVERYADD_ROUTER}>
            <button className="productBuyForm_addInfoButton">
              Обновить доставку
            </button>
          </Link>
          <Link to={GIFT_ROUTER}>
            <button className="productBuyForm_addInfoButton">
              Обновить подарки
            </button>
          </Link>
          <Link to={FOOTER_ROUTER}>
            <button className="productBuyForm_addInfoButton">
              Обновить подвал
            </button>
          </Link>
          <Link to={MANUFACTURERS_ROUTER}>
            <button className="productBuyForm_addInfoButton">
              Управлять производителями
            </button>
          </Link>
          <Link to={PRODUCTADD_ROUTER}>
            <button className="productBuyForm_addInfoButton">
              Добавить продукт
            </button>
          </Link>
          <Link to={IMG_ROUTER}>
            <button className="productBuyForm_addInfoButton">
              Картинки на главной
            </button>
          </Link>
          <Link to={CARTINFO_ROUTER}>
            <button className="productBuyForm_addInfoButton">
              Обновить памятку
            </button>
          </Link>
        </div>
        
        <div className="orders-table-container" style={{ marginTop: "20px" }}>
          <h1>Активные заказы</h1>
          {selectedOrder && (
          <OrderDetailModal
            order={selectedOrder}
            onClose={handleCloseModal}
            onUpdate={handleOrderUpdate}
          />
        )}
        <div className="date-filter" style={{ marginBottom: "20px" }}>
          <label>
            От:
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
            />
          </label>
          <label style={{ marginLeft: "10px" }}>
            До:
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
            />
          </label>
          <button
            onClick={filterByDate}
            style={{ marginLeft: "10px", padding: "5px 10px", cursor: "pointer" }}
            className="productBuyForm_submitButton"
          >
            Применить
          </button>
        </div>
          <table
            className="orders-table"
            style={{ width: "100%", borderCollapse: "collapse" }}
          >
            <thead>
              <tr>
              <th>Дата</th>
                <th>ID Заказа</th>
                <th>Имя пользователя</th>
                <th>Email пользователя</th>
                <th>Телефон</th>
                <th>Метод оплаты</th>
                <th>Продукты</th>
                <th>Статус</th>
                <th>Подарок</th>
                <th>Комментарий</th>
                <th>Город</th>
                <th>Итоговая сумма</th>
              </tr>
            </thead>
            <tbody>
  {filteredOrders.map((order) => (
    <tr key={order.id} onClick={() => handleOrderClick(order)} style={{ cursor: "pointer" }}>
      <td>{new Date(order.createdAt).toLocaleDateString()}</td>
      <td>{order.id}</td>
      <td>{order.user?.name}</td>
      <td>{order.user?.email}</td>
      <td>{order.phone}</td>
      <td>{order.paymentMethod}</td>
      <td>
        <ul>
          {order.order_products.map((product) => (
            <li key={product.productId}>
              {product.product?.name || "Product not found"} - {product.quantity} шт. по {product.price}₽
            </li>
          ))}
        </ul>
      </td>
      <td>{order.status}</td>
      <td>{order.giftId}</td>
      <td>{order.comment}</td>
      <td>{order.city}</td>
      <td>{calculateTotal(order)}₽</td>
    </tr>
  ))}
</tbody>
          </table>
        </div>
        <div className="orders-table-container" style={{ marginTop: "40px", marginBottom:'80px'}}>
          <h1>Заявки от незарегистрированных пользователь</h1>
          <OrderGuestTable />
        </div>
        <div className="orders-table-container" style={{ marginTop: "40px", marginBottom:'80px'}}>
          <h1>Заявки на сотрудничество</h1>
          <ContactInfoManager />
        </div>
        <div className="orders-table-container" style={{ marginTop: "40px", marginBottom:'80px'}}>
          <h1>Заявки на продажу</h1>
          <ContactInfoTwo />
        </div>
      </div>
    </>
  );
});

export default Admin;
