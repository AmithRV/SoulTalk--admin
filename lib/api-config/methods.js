import api from './axiosInstance';

const handleGetMethod = async (url, params) => {
  const response = await api.get(url, params);
  return response?.data;
};

const handlePostMethod = async (url, data) => {
  const response = await api.post(url, data);
  return response?.data;
};

const handlePatchMethod = async (url, data) => {
  const response = await api.patch(url, data);

  return response?.data;
};

const handleDeleteMethod = async (url, data) => {
  const response = await api.delete(url, data);

  return response?.data;
};

const handlePutMethod = async (url, data) => {
  const response = await api.put(url, data);

  return response?.data;
};

const handleFileUpload = async (url, data) => {
  const response = await api.post(url, data, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return response?.data;
};

export {
  handlePutMethod,
  handleGetMethod,
  handlePostMethod,
  handlePatchMethod,
  handleDeleteMethod,
  handleFileUpload,
};
