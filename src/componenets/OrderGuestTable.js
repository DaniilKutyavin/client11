import React, { useEffect, useState } from 'react';
import { getOredersGuest } from '../http/productApi'; // Импорт функции API
import arrowDown from "../img/стрелка вниз.svg";

const OrderGuestTable = () => {
  const [orders, setOrders] = useState([]);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const ordersPerPage = 10; // Количество заказов на странице
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const data = await getOredersGuest();
        setOrders(data);
        setFilteredOrders(data); // Изначально показываем все заказы
      } catch (err) {
        setError('Не удалось загрузить заказы.');
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  // Фильтрация по дате
  const filterByDate = () => {
    if (startDate && endDate) {
      const filtered = orders.filter((order) => {
        const orderDate = new Date(order.createdAt).toISOString().split('T')[0];
        return orderDate >= startDate && orderDate <= endDate;
      });
      setFilteredOrders(filtered);
    } else {
      setFilteredOrders(orders);
    }

    setCurrentPage(1); // Сброс текущей страницы при применении фильтра
  };

  // Функция для расчета итоговой цены
  const calculateTotalPrice = (items, paymentMethod) => {
    if (!items || items.length === 0) return '0.00';
    return items.reduce((total, item) => {
      const price = paymentMethod === 'Банковский перевод' ? item.price_two : item.price;
      return total + (price || 0) * (item.quantity || 1);
    }, 0);
  };

  // Пагинация
  const totalPages = Math.ceil(filteredOrders.length / ordersPerPage);
  const currentOrders = filteredOrders.slice(
    (currentPage - 1) * ordersPerPage,
    currentPage * ordersPerPage
  );

  const handleNextPage = () => {
    setCurrentPage((prevPage) => Math.min(prevPage + 1, totalPages));
  };

  const handlePreviousPage = () => {
    setCurrentPage((prevPage) => Math.max(prevPage - 1, 1));
  };

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

  if (loading) return <p>Загрузка заказов...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div className="orderGuestTableContainer" style={{ overflowX: 'auto' }}>
      <h2>Список заказов гостей</h2>

      {/* Фильтрация по датам */}
      <div className="date-filter">
        <label>
          От:
          <input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
          />
        </label>
        <label>
          До:
          <input
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
          />
        </label>
        <button onClick={filterByDate}   className="productBuyForm_submitButton"style={{marginLeft: '10px' }} >Применить</button>
        <button onClick={filterByToday}   className="productBuyForm_submitButton"  style={{margin: '10px' }}>Сегодня</button>
        <button onClick={filterByYesterday}   className="productBuyForm_submitButton">Вчера</button>
      </div>

      <table className="orderGuestTable">
        <thead>
          <tr>
            <th>ID</th>
            <th>Дата</th>
            <th>Товары</th>
            <th>Итоговая цена</th>
            <th>ФИО</th>
            <th>Телефон</th>
            <th>Город</th>
            <th>Email</th>
            <th>Способ оплаты</th>
            <th>Промокод</th>
            <th>Комментарий</th>
            <th>ID подарка</th>
          </tr>
        </thead>
        <tbody>
          {currentOrders.map((order) => (
            <tr key={order.id}>
              <td>{order.id}</td>
              <td>{new Date(order.createdAt).toLocaleDateString()}</td>
              <td>
                {order.items && order.items.length > 0 ? (
                  <ul>
                    {order.items.map((item, index) => (
                      <li key={index}>
                        {item.name} - {item.quantity} шт.
                      </li>
                    ))}
                  </ul>
                ) : (
                  'Нет товаров'
                )}
              </td>
              <td>{calculateTotalPrice(order.items, order.paymentMethod)} ₽</td>
              <td>{order.name}</td>
              <td>{order.phone}</td>
              <td>{order.city}</td>
              <td>{order.email}</td>
              <td>{order.paymentMethod}</td>
              <td>{order.promoCode || 'Нет'}</td>
              <td>{order.comment || 'Нет'}</td>
              <td>{order.giftId || 'Нет'}</td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Пагинация */}
      <div className="pagination" style={{ marginTop: '20px' }}>
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
        
        <span>
          Страница {currentPage} из {totalPages}
        </span>
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
  );
};

export default OrderGuestTable;
