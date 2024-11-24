import React, { useState, useEffect } from 'react';
import { createNews, getNews, updatenews, deletenews } from '../http/newsApi'; // Импортируем API функции
import '../style/ProductBuyForm.css'; // Импортируем стили

const NewsPage = () => {
  const [newsList, setNewsList] = useState([]);
  const [formData, setFormData] = useState({ title: '', description: '', img: null });
  const [loading, setLoading] = useState(true);
  const [editMode, setEditMode] = useState(false);
  const [editId, setEditId] = useState(null);

  useEffect(() => {
    const fetchNews = async () => {
      try {
        const data = await getNews();
        setNewsList(data);
      } catch (error) {
        console.error('Ошибка при получении новостей:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchNews();
  }, []);

  const handleChange = (e) => {
    if (e.target.name === 'img') {
      setFormData({ ...formData, img: e.target.files[0] });
    } else {
      setFormData({ ...formData, [e.target.name]: e.target.value });
    }
  };

  const handleCreateOrUpdateNews = async (e) => {
    e.preventDefault();

    const formDataToSend = new FormData();
    formDataToSend.append('title', formData.title);
    formDataToSend.append('description', formData.description);

    if (formData.img) {
      formDataToSend.append('img', formData.img);
    }

    try {
      if (editMode) {
        // Обновление новости
        await updatenews(editId, formDataToSend);
        const updatedList = newsList.map((item) => (item.id === editId ? { ...item, ...formData } : item));
        setNewsList(updatedList);
        setEditMode(false);
        setEditId(null);
      } else {
        // Создание новой новости
        const newNews = await createNews(formDataToSend);
        setNewsList([...newsList, newNews]);
      }
      setFormData({ title: '', description: '', img: '' });
    } catch (error) {
      console.error(editMode ? 'Ошибка при обновлении новости:' : 'Ошибка при добавлении новости:', error);
    }
  };

  const handleEdit = (newsItem) => {
    setEditMode(true);
    setEditId(newsItem.id);
    setFormData({ title: newsItem.title, description: newsItem.description, img: null });
  };

  const handleDelete = async (id) => {
    try {
      await deletenews(id);
      setNewsList(newsList.filter((item) => item.id !== id));
    } catch (error) {
      console.error('Ошибка при удалении новости:', error);
    }
  };

  if (loading) {
    return <p>Загрузка новостей...</p>;
  }

  return (
    <div className="delivery-page">
      <h1>{editMode ? 'Редактировать новость' : 'Добавить новость'}</h1>

      <form className="delivery-form" onSubmit={handleCreateOrUpdateNews}>
        <label htmlFor="title">Название:</label>
        <input
          type="text"
          id="title"
          name="title"
          value={formData.title}
          onChange={handleChange}
          placeholder="Введите название новости"
          required
        />

        <label htmlFor="description">Описание:</label>
        <textarea
          id="description"
          name="description"
          value={formData.description}
          onChange={handleChange}
          placeholder="Введите описание новости"
          required
        />

        <label htmlFor="img">Изображение:</label>
        <input type="file" id="img" name="img" accept="image/*" onChange={handleChange} />

        <button type="submit" className="productBuyForm_submitButton">
          {editMode ? 'Обновить новость' : 'Добавить новость'}
        </button>
      </form>

      <div className="productBuyForm_productList">
        <h2>Список новостей:</h2>
        {newsList.length > 0 ? (
          newsList.map((newsItem) => (
            <div key={newsItem.id} className="productBuyForm_productItem">
              <h2>{newsItem.title.length > 15 ? `${newsItem.title.slice(0, 15)}...` : newsItem.title}</h2>
            
              <div className="news-buttons">
                <button className="productBuyForm_submitButton" onClick={() => handleEdit(newsItem)}>Редактировать</button>
                <button  className="productBuyForm_deleteButton" onClick={() => handleDelete(newsItem.id)}>Удалить</button>
              </div>
            </div>
          ))
        ) : (
          <p>Новостей пока нет.</p>
        )}
      </div>
    </div>
  );
};

export default NewsPage;
