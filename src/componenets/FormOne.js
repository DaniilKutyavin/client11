import React, { useState, useEffect } from "react";
import { getFormOne } from "../http/contactApi";

const ContactInfoManager = () => {
  const [contactInfo, setContactInfo] = useState([]);
  const [filteredInfo, setFilteredInfo] = useState([]);
  
  // Состояния для диапазона дат
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  useEffect(() => {
    // Получение данных с сервера
    getFormOne()
      .then((data) => {
        setContactInfo(data);
        setFilteredInfo(data); // По умолчанию показываем все данные
      })
      .catch((error) => {
        console.error("Ошибка при загрузке данных:", error);
      });
  }, []);

  // Функция для фильтрации по дате
  const filterByDate = () => {
    if (startDate && endDate) {
      const filtered = contactInfo.filter((item) => {
        const itemDate = new Date(item.createdAt).toISOString().split("T")[0]; // Форматируем дату
        return itemDate >= startDate && itemDate <= endDate;
      });
      setFilteredInfo(filtered);
    } else {
      setFilteredInfo(contactInfo); // Если даты не выбраны, показываем все данные
    }
  };

  return (
    <div className="contact-info-manager">
      {/* Блок выбора диапазона дат */}
      <div className="date-filter" style={{ marginBottom: "20px" }}>
        <label>
          От:{" "}
          <input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
          />
        </label>
        <label style={{ marginLeft: "10px" }}>
          До:{" "}
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
        className="contact-info-table"
        style={{ width: "100%", borderCollapse: "collapse" }}
      >
        <thead>
          <tr>
            <th style={{ border: "1px solid #ddd", padding: "8px" }}>Дата</th>
            <th style={{ border: "1px solid #ddd", padding: "8px" }}>ФИО</th>
            <th style={{ border: "1px solid #ddd", padding: "8px" }}>Телефон</th>
            <th style={{ border: "1px solid #ddd", padding: "8px" }}>Почта</th>
          </tr>
        </thead>
        <tbody>
          {filteredInfo.length > 0 ? (
            filteredInfo.map((item, index) => (
              <tr key={index}>
                <td style={{ border: "1px solid #ddd", padding: "8px" }}>
                  {new Date(item.createdAt).toLocaleDateString()}
                </td>
                <td style={{ border: "1px solid #ddd", padding: "8px" }}>
                  {item.fio}
                </td>
                <td style={{ border: "1px solid #ddd", padding: "8px" }}>
                  <p href={`tel:+${item.telephone}`}>{item.telephone}</p>
                </td>
                <td style={{ border: "1px solid #ddd", padding: "8px" }}>
                  <p href={`mailto:${item.email}`}>{item.email}</p>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="4" style={{ textAlign: "center", padding: "8px" }}>
                Нет данных для отображения
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default ContactInfoManager;
