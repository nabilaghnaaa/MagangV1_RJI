import api from "./api";

const getAll = async (params = {}) => {
  const response = await api.get("/surat", {
    params,
  });

  return response.data;
};

const getById = async (id) => {
  const response = await api.get(`/surat/${id}`);

  return response.data;
};

const generatePdf = async (id) => {
  const response = await api.post(`/surat/${id}/pdf`);

  return response.data;
};

const downloadPdf = async (id) => {
  const response = await api.get(`/surat/${id}/pdf`, {
    responseType: "blob",
  });

  return response;
};

const sendEmail = async (id) => {
  const response = await api.post(`/surat/${id}/send-email`);

  return response.data;
};

const getVerification = async (id) => {
  const response = await api.get(`/surat/${id}/verification`);

  return response.data;
};

const regenerateVerification = async (id) => {
  const response = await api.post(`/surat/${id}/verification`);

  return response.data;
};

export default {
  getAll,
  getById,
  generatePdf,
  downloadPdf,
  sendEmail,
  getVerification,
  regenerateVerification,
};