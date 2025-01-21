import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { changePassword } from "../http/userApi"; // Импортируйте ваши API-запросы

const ResetPassword = () => {
  const { token } = useParams();
  const navigate = useNavigate(); // Для навигации
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setMessage("");

    if (password.length < 8) {
      setError("Пароль должен содержать не менее 8 символов.");
      return;
    }

    if (password !== confirmPassword) {
      setError("Пароли не совпадают.");
      return;
    }

    try {
      const data = await changePassword(token, password);
      setMessage(data.message || "Пароль успешно изменён.");
      // Переадресация через 3 секунды
      setTimeout(() => {
        navigate("/");
      }, 3000);
    } catch (err) {
      setError(err.response?.data?.message || "Произошла ошибка. Попробуйте ещё раз.");
    }
  };

  return (
    <div
      style={{
        maxWidth: "500px",
        margin: "0 auto",
        padding: "20px",
        marginTop: "200px",
        marginBottom: "200px"
      }}
    >
      <h2>Сброс пароля</h2>
      {token ? (
        <form onSubmit={handleSubmit} noValidate>
          <div style={{ marginBottom: "15px" }}>
            <label htmlFor="password" style={{ display: "block", marginBottom: "5px" }}>
              Новый пароль:
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              style={{
                width: "100%",
                padding: "10px",
                borderRadius: "5px",
                border: "1px solid #ccc",
              }}
            />
          </div>
          <div style={{ marginBottom: "15px" }}>
            <label htmlFor="confirm-password" style={{ display: "block", marginBottom: "5px" }}>
              Подтвердите пароль:
            </label>
            <input
              id="confirm-password"
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              style={{
                width: "100%",
                padding: "10px",
                borderRadius: "5px",
                border: "1px solid #ccc",
              }}
            />
          </div>
          <button
            type="submit"
            style={{
              width: "100%",
              padding: "10px",
              backgroundColor: "#4CAF50",
              color: "#fff",
              border: "none",
              borderRadius: "5px",
              cursor: "pointer",
            }}
          >
            Сменить пароль
          </button>
        </form>
      ) : (
        <p style={{ color: "red" }}>Некорректный или отсутствующий токен.</p>
      )}
      {message && <p style={{ color: "green", marginTop: "15px" }}>{message}</p>}
      {error && <p style={{ color: "red", marginTop: "15px" }}>{error}</p>}
    </div>
  );
};

export default ResetPassword;
