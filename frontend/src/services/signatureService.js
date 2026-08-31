import api from "./api";

const get = async () => {
  const response = await api.get("/signature");

  return response.data;
};

const update = async (formData) => {
  const response = await api.put(
    "/signature",
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }
  );

  return response.data;
};

export default {
  get,
  update,
};