import { $authHost, $host } from ".";

export const createNews = async (product) => {
    const { data } = await $authHost.post('api/news/', product);
    return data;
};

export const getNews = async (id) => {
    const { data } = await $host.get(`api/news/`);
    return data;
};

export const getNewsOne = async (id) => {
    const { data } = await $host.get(`api/news/${id}`);
    return data;
};

export const updatenews = async (id, news) => {
    const { data } = await $authHost.put(`api/news/${id}`, news);
    return data;
  };
  
  export const deletenews = async (id) => {
    const { data } = await $authHost.delete(`api/news/${id}`);
    return data;
  };


