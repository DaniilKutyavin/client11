import { $authHost, $host } from ".";
import { jwtDecode } from "jwt-decode";

export const registration = async (name, email, password) => {
  try {
    const { data } = await $host.post("api/user/registration", {
      name,
      email,
      password,
    });
    localStorage.setItem("accessToken", data.accessToken);
    localStorage.setItem("userIsAuth", true);
    return jwtDecode(data.accessToken);
  } catch (error) {
    console.error("Registration error:", error);
    throw error;
  }
};

export const login = async (email, password) => {
  try {
    const { data } = await $host.post("api/user/login", { email, password });
    localStorage.setItem("accessToken", data.accessToken);
    localStorage.setItem("userIsAuth", true);
    return jwtDecode(data.accessToken);
  } catch (error) {
    console.error("Login error:", error);
    throw error;
  }
};

export const check = async () => {
  try {
    const { data } = await $authHost.post("api/user/refresh");
    localStorage.setItem("accessToken", data.accessToken);
    return jwtDecode(data.accessToken);
  } catch (error) {
    console.error("Error during token refresh:", error);
    throw error;
  }
};

export const logout = async () => {
  try {
    await $authHost.post("api/user/logout");
    localStorage.removeItem("accessToken");
    localStorage.removeItem("userIsAuth");
  } catch (error) {
    console.error("Logout error:", error);
    throw error;
  }
};

export const updateUser = async (email, password, confirmPassword) => {
  try {
    const { data } = await $authHost.put("api/user/update", {
      email,
      password,
      confirmPassword,
    });
    return data;
  } catch (error) {
    console.error("Update error:", error);
    throw error;
  }
};

export const exportUsersToCSV = async () => {
  try {
    const { data } = await $authHost.get("api/user/export", { responseType: "blob" });

    // Создаём ссылку для скачивания
    const blob = new Blob([data], { type: "text/csv" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "users.csv"; // Название файла для скачивания
    link.click(); // Имитируем клик по ссылке для начала скачивания
  } catch (error) {
    console.error("Export error:", error);
    throw error;
  }
};

export const resetPassword = async (email) => {
  try {
    const { data } = await $host.post("api/user/reset-password", { email });
    return data;
  } catch (error) {
    throw error.response?.data?.message || error.message;
  }
};

export const changePassword = async (resetToken, newPassword) => {
  try {
    const { data } = await $host.post("api/user/change-password", { resetToken, newPassword });
    return data;
  } catch (error) {
    throw error.response?.data?.message || error.message;
  }
};

