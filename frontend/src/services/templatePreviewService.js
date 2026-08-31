import api from "./api";

const previewInvitation = async (id) => {
  const response = await api.get(
    `/template-preview/invitation/${id}`
  );

  return response.data;
};

const previewAssignment = async (id) => {
  const response = await api.get(
    `/template-preview/assignment/${id}`
  );

  return response.data;
};

export default {
  previewInvitation,
  previewAssignment,
};