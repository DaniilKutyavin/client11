import { $authHost, $host } from ".";

export const getAll = async () => {
  const { data } = await $host.get(`api/cartinfo/`);
  return data;
};
export const updateCart = async (cartData) => {
  const { data } = await $authHost.put("/api/cartinfo", cartData);
  return data;
};
