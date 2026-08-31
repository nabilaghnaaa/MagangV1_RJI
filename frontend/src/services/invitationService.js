import api from "./api";

const create = async (data) => {
  const response = await api.post(
    "/invitations",
    data
  );

  return response.data;
};

const getAll = async (params = {}) => {
  const response = await api.get(
    "/invitations",
    {
      params,
    }
  );

  return response.data;
};

const getById = async (id) => {
  const response = await api.get(
    `/invitations/${id}`
  );

  return response.data;
};

const update = async (
  id,
  data
) => {
  const response = await api.put(
    `/invitations/${id}`,
    data
  );

  return response.data;
};

const review = async (
  id,
  data = {}
) => {
  const response = await api.patch(
    `/invitations/${id}/review`,
    data
  );

  return response.data;
};

const approve = async (
  id
) => {
  const response = await api.patch(
    `/invitations/${id}/approve`
  );

  return response.data;
};

const reject = async (
  id,
  rejectionReason
) => {
  const response = await api.patch(
    `/invitations/${id}/reject`,
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