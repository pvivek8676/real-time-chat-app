import api from "./api";

export const getMessages =
  async (userId) => {
    const response = await api.get(
      `/messages/${userId}`
    );

    return response.data;
  };

export const sendMessageApi =
  async (data) => {
    const response = await api.post(
      "/messages",
      data
    );

    return response.data;
  };