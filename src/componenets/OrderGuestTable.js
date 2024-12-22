import React, { useEffect, useState } from 'react';
import { getOredersGuest } from '../http/productApi'; // Импорт функции API

const OrderGuestTable = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
  
    useEffect(() => {
      const fetchOrders = async () => {
        try {
          const data = await getOredersGuest();
          setOrders(data);
        } catch (err) {
          setError('Не удалось загрузить заказы.');
        } finally {
          setLoading(false);
        }
      };
  
      fetchOrders();
    }, []);
  
    const calculateTotalPrice = (items, paymentMethod) => {
      if (!items || items.length === 0) return '0.00';
  
      return items.reduce((total, item) => {
        const price = paymentMethod === 'Банковский перевод' ? item.price_two : item.price;
        return total + (price || 0) * (item.quantity || 1);
      }, 0);
    };
  
    if (loading) return <p>Загрузка заказов...</p>;
    if (error) return <p>{error}</p>;
  
    return (
      <div className="orderGuestTableContainer" style={{overflowX: "auto" }}>
        <h2>Список заказов гостей</h2>
        <table className="orderGuestTable">
          <thead>
            <tr>
              <th>ID</th>
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
            {orders.map((order) => (
              <tr key={order.id}>
                <td>{order.id}</td>
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
      </div>
    );
  };

export default OrderGuestTable;
