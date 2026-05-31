import axios from 'axios';

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
    // Authorization: `Bearer ${token}`,
  },
});

api.interceptors.response.use(
  function (response) {
    return response;
  },
  async function (error) {
    // Signout the user if Unauthenticated
    if (error.status === 401) {
      //   await clearLocalStorage().then(() => {
      //     window.location.href = `${process.env.NEXT_PUBLIC_BASE_URL}/auth/login`;
      //   });
    }
    return Promise.reject(error);
  },
);

export default api;
