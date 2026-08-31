import api from "./api";

const getAll = async (params = {}) => {
  const response = await api.get("/templates", {
    params,
  });

  return response.data;
};

const getById = async (id) => {
  const response = await api.get(`/templates/${id}`);

  return response.data;
};

const create = async (data) => {
  const response = await api.post(
    "/templates",
    data
  );

  return response.data;
};

const update = async (id, data) => {
  const response = await api.put(
    `/templates/${id}`,
    data
  );

  return response.data;
};

const remove = async (id) => {
  const response = await api.delete(
    `/templates/${id}`
  );

  return response.data;
};

const activate = async (id) => {
  const response = await api.patch(
    `/templates/${id}/activate`
  );

  return response.data;
};

const deactivate = async (id) => {
  const response = await api.patch(
    `/templates/${id}/deactivate`
  );

  return response.data;
};

export default {
  getAll,
  getById,
  create,
  update,
  remove,
  activate,
  deactivate,
};