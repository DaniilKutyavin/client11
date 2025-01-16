import React, { useState, useEffect } from "react";
import { getAllfeedback, deletefeedback } from "../http/contactApi";

const FeedbackAdmin = () => {
  const [feedbacks, setFeedbacks] = useState([]);

  // Загрузка всех отзывов при монтировании компонента
  useEffect(() => {
    fetchFeedbacks();
  }, []);

  const fetchFeedbacks = async () => {
    try {
      const data = await getAllfeedback();
      setFeedbacks(data);
    } catch (error) {
      console.error("Ошибка при получении отзывов:", error);
    }
  };

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm("Вы уверены, что хотите удалить этот отзыв?");
    if (confirmDelete) {
      try {
        await deletefeedback(id);
        setFeedbacks(feedbacks.filter((feedback) => feedback.id !== id)); // Обновляем список
      } catch (error) {
        console.error("Ошибка при удалении отзыва:", error);
      }
    }
  };

  return (
    <div className="feedback-admin">
      {feedbacks.length > 0 ? (
        <table className="feedback-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Имя</th>
              <th>Телефон</th>
              <th>Дата</th>
              <th>Действия</th>
            </tr>
          </thead>
          <tbody>
            {feedbacks.map((feedback) => (
              <tr key={feedback.id}>
                <td>{feedback.id}</td>
                <td>{feedback.name}</td>
                <td>{feedback.telephone}</td>
                <td>{new Date(feedback.createdAt).toLocaleString()}</td>
                <td>
                  <button
                    className="delete-button"
                    onClick={() => handleDelete(feedback.id)}
                  >
                    Удалить
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p>Нет отзывов для отображения.</p>
      )}
    </div>
  );
};

export default FeedbackAdmin;
