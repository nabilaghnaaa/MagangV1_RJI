import api from "./api";

const create = async (
  formData
) => {
  const response = await api.post(
    "/assignments",
    formData,
    {
      headers: {
        "Content-Type":
          "multipart/form-data",
      },
    }
  );

  return response.data;
};

const getAll = async (
  params = {}
) => {
  const response = await api.get(
    "/assignments",
    {
      params,
    }
  );

  return response.data;
};

const getById = async (
  id
) => {
  const response = await api.get(
    `/assignments/${id}`
  );

  return response.data;
};

const update = async (
  id,
  data
) => {
  const response = await api.put(
    `/assignments/${id}`,
    data
  );

  return response.data;
};

const review = async (
  id,
  data
) => {
  const response = await api.patch(
    `/assignments/${id}/review`,
    data
  );

  return response.data;
};

const approve = async (
  id
) => {
  const response = await api.patch(
    `/assignments/${id}/approve`
  );

  return response.data;
};

const reject = async (
  id,
  rejectionReason
) => {
  const response = await api.patch(
    `/assignments/${id}/reject`,
    {
      rejection_reason:
        rejectionReason,
    }
  );

  return response.data;
};

export default {
  create,
  getAll,
  getById,
  update,
  review,
  approve,
  reject,
};