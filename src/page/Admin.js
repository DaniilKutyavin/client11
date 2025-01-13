import React, { useState, useEffect, useContext  } from "react";
import { Link,Navigate} from "react-router-dom";
import OrderDetailModal from "../componenets/Order"; // Убедитесь, что путь правильный
import { getOrders, updateOrder,generateYmlFeed } from "../http/productApi";
import { exportUsersToCSV } from "../http/userApi";
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
  SHOP_ROUTER,
} from "../utils/consts";
import arrowDown from "../img/стрелка вниз.svg";
import "../style/newss.css";
import { Context } from '..';
import ContactInfoManager from "../componenets/FormOne";
import ContactInfoTwo from "../componenets/FormTwo"; // Убедитесь, что путь правильный
import { observer } from "mobx-react-lite";
import OrderGuestTable from "../componenets/OrderGuestTable";

const Admin = observer(() => {
  const { user } = useContext(Context);
 const [orders, setOrders] = useState([]);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null);

  // Состояния для диапазона дат
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const ordersPerPage = 10; // Количество заказов на странице

  useEffect(() => {
    fetchOrders(); 
    const intervalId = setInterval(() => {
      fetchOrders();
    }, 10 * 60 * 1000); 

    return () => clearInterval(intervalId);
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
  const handleExportCSV = async () => {
    try {
      await exportUsersToCSV(); // Вызываем функцию для скачивания CSV
    } catch (error) {
      console.error("Ошибка при экспорте пользователей в CSV", error);
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

    setCurrentPage(1);
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
      // Если метод оплаты — "Банковский перевод", используем price_two
      const price = order.paymentMethod === "Банковский перевод" ? product.product.price_two : product.price;
      return sum + (price * product.quantity)-order.discount;
    }, 0);
  
    return total.toFixed(0); // Форматируем до целого числа
  };
  const handleNextPage = () => {
    setCurrentPage(prevPage => Math.min(prevPage + 1, totalPages));
  };

  const handlePreviousPage = () => {
    setCurrentPage(prevPage => Math.max(prevPage - 1, 1));
  };

  const totalPages = Math.ceil(filteredOrders.length / ordersPerPage);

  const currentOrders = filteredOrders.slice(
    (currentPage - 1) * ordersPerPage,
    currentPage * ordersPerPage
  );

  const filterByToday = () => {
    const today = new Date().toISOString().split("T")[0];
    setStartDate(today);
    setEndDate(today);
    filterByDate(); // Применить фильтрацию
  };

  const filterByYesterday = () => {
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const yesterdayDate = yesterday.toISOString().split("T")[0];
    setStartDate(yesterdayDate);
    setEndDate(yesterdayDate);
    filterByDate(); // Применить фильтрацию
  };
  if (!user.isAuth || (user.user.role !== 'Admin' && user.user.role !== 'Employee')) {
    return <Navigate to={SHOP_ROUTER} />;
}
const handleGenerateYmlFeed = async () => {
  try {
    const data = await generateYmlFeed(); // Make sure the API call resolves with the correct data
    console.log("YML feed generated successfully:", data);
  } catch (error) {
    console.error("Error generating YML feed:", error);
  }
};
  return (
    <>
    <div className="header">
        <div className="title-block">
          <h1>Админ панель</h1>         
        </div>
      </div>
      <div className="admin-container">
      {user.user.role === "Admin" && ( 
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
          <button onClick={handleExportCSV} className="productBuyForm_addInfoButton">
            Экспортировать пользователей в CSV
          </button>
          <button onClick={handleGenerateYmlFeed} className="productBuyForm_addInfoButton">
            Генерация YML фида
          </button>
        </div>
        )}
        {user.user.role === "Employee" && ( 
         <button onClick={handleGenerateYmlFeed} className="productBuyForm_addInfoButton">
            Генерация YML фида
          </button>
           )}
        <div className="orders-table-container" style={{ marginTop: "20px", overflowX: "auto" }}>
          <h1>Активные заказы</h1>
          {selectedOrder && (
            <OrderDetailModal order={selectedOrder} onClose={handleCloseModal} onUpdate={handleOrderUpdate} />
          )}

          <div className="date-filter" style={{ marginBottom: "20px" }}>
            <label>
              От:
              <input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} />
            </label>
            <label style={{ marginLeft: "10px" }}>
              До:
              <input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} />
            </label>
            <button
              onClick={filterByDate}
              style={{ marginLeft: "10px" }}
              className="productBuyForm_submitButton"
            >
              Применить
            </button>
            <button onClick={filterByToday}   className="productBuyForm_submitButton"  style={{margin: '10px' }}>Сегодня</button>
            <button onClick={filterByYesterday}   className="productBuyForm_submitButton">Вчера</button>
          </div>

          <table className="orders-table" style={{ width: "100%", borderCollapse: "collapse" }}>
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
                <th>Скидка</th>
                <th>Итоговая сумма</th>
              </tr>
            </thead>
            <tbody>
              {currentOrders.map((order) => (
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
        {product.product?.name || "Product not found"} 
        {product.product?.manufacturer && ` (Произ-тель: ${product.product.manufacturer})`} 
        - {product.quantity} шт. по &nbsp;  
        {order.paymentMethod === "Банковский перевод" ? product.product.price_two : product.price}₽
      </li>
    ))}
  </ul>
                  </td>
                  <td>{order.status}</td>
                  <td>{order.giftId}</td>
                  <td>{order.comment}</td>
                  <td>{order.city}</td>
                  <td>{order.discount}</td>
                  <td>{calculateTotal(order)}₽</td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Пагинация */}
          <div className="pagination" style={{ marginTop: "20px" }}>
              <button
                            className="pagination-arrow"
                            onClick={handlePreviousPage} disabled={currentPage === 1}
                            
                          >
                            <img
                              src={arrowDown}
                              alt="Next"
                              style={{ transform: "rotate(90deg)" }}
                            />
                          </button>
            <span>Страница {currentPage} из {totalPages}</span>
           
            <button
                            className="pagination-arrow"
                            onClick={handleNextPage} disabled={currentPage === totalPages}
                            
                          >
                            <img
                              src={arrowDown}
                              alt="Next"
                              style={{ transform: "rotate(-90deg)" }}
                            />
                          </button>
          </div>
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
