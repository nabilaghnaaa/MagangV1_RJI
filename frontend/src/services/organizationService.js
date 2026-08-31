import api from "./api";

const get = async () => {
  const response =
    await api.get(
      "/organization"
    );

  return response.data;
};

const update = async (
  data
) => {
  const response =
    await api.put(
      "/organization",
      data
    );

  return response.data;
};

export default {
  get,
  update,
};