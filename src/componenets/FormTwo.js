import React, { useState, useEffect } from "react";
import { getFormTwo } from "../http/contactApi";

const ContactInfoTwo = () => {
  // Состояния для хранения данных из API и фильтрации
  const [contactInfo, setContactInfo] = useState([]);
  const [filteredInfo, setFilteredInfo] = useState([]);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  useEffect(() => {
    // Получаем данные с API
    getFormTwo()
      .then((data) => {
        if (Array.isArray(data) && data.length > 0) {
          setContactInfo(data);
          setFilteredInfo(data); // Изначально отображаем все данные
        } else {
          console.error("Неверный формат данных или пустой массив");
        }
      })
      .catch((error) => {
        console.error("Ошибка при загрузке данных:", error);
      });
  }, []);

  // Функция для фильтрации по диапазону дат
  const filterByDate = () => {
    if (startDate && endDate) {
      const filtered = contactInfo.filter((item) => {
        const itemDate = new Date(item.createdAt).toISOString().split("T")[0];
        return itemDate >= startDate && itemDate <= endDate;
      });
      setFilteredInfo(filtered);
    } else {
      setFilteredInfo(contactInfo);
    }
  };

  return (
    <div className="contact-info-manager" style={{overflowX: "auto" }}>
      {/* Блок фильтрации по дате */}
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
          style={{
            marginLeft: "10px",
            padding: "5px 10px",
            cursor: "pointer",
          }}
          className="productBuyForm_submitButton"
        >
          Применить
        </button>
      </div>

      {/* Таблица с данными */}
      <table
        className="contact-info-tablee"
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
            filteredInfo.map((item) => (
              <tr key={item.id}>
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

export default ContactInfoTwo;
