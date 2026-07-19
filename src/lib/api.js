import axios from 'axios';

const baseURL = import.meta.env.VITE_API_BASE_URL;

if (!baseURL) {
  // Without this guard, a missing env var silently resolves fetches
  // as relative paths on the frontend's own domain, returning HTML
  // 404 pages instead of JSON — a real bug hit on Me & Coach's launch.
  throw new Error(
    'VITE_API_BASE_URL is not set. Check your Vercel build environment variables.'
  );
}

const api = axios.create({ baseURL });

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('me_and_doctor_token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

api.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401) {
      localStorage.removeItem('me_and_doctor_token');
      window.location.href = '/login';
    }
    return Promise.reject(err);
  }
);

export default api;
