import axios from 'axios';

// In dev: Vite proxy forwards /api → localhost:4000
// In production: VITE_API_URL must be set to the full backend URL (e.g. https://your-api.onrender.com/api)
const BASE_URL = import.meta.env.VITE_API_URL || '/api';

const api = axios.create({
  baseURL: BASE_URL,
  withCredentials: true,
});

export const REFRESH_URL = `${BASE_URL}/auth/refresh`;

let accessToken = null;

export function setAccessToken(token) {
  accessToken = token;
}

export function clearAccessToken() {
  accessToken = null;
}

api.interceptors.request.use((config) => {
  if (accessToken) {
    config.headers.Authorization = `Bearer ${accessToken}`;
  }
  return config;
});

let isRefreshing = false;
let queue = [];

function processQueue(error, token) {
  queue.forEach(({ resolve, reject }) => (error ? reject(error) : resolve(token)));
  queue = [];
}

const AUTH_PATHS = ['/auth/refresh', '/auth/login', '/auth/register'];

api.interceptors.response.use(
  (res) => res,
  async (error) => {
    const original = error.config;

    const isAuthEndpoint = AUTH_PATHS.some((p) => original.url?.includes(p));
    if (error.response?.status !== 401 || original._retry || isAuthEndpoint) {
      return Promise.reject(error);
    }

    if (isRefreshing) {
      return new Promise((resolve, reject) => {
        queue.push({ resolve, reject });
      }).then((token) => {
        original.headers.Authorization = `Bearer ${token}`;
        return api(original);
      });
    }

    original._retry = true;
    isRefreshing = true;

    try {
      const { data } = await axios.post(REFRESH_URL, {}, { withCredentials: true });
      setAccessToken(data.accessToken);
      processQueue(null, data.accessToken);
      original.headers.Authorization = `Bearer ${data.accessToken}`;
      return api(original);
    } catch (err) {
      processQueue(err, null);
      clearAccessToken();
      const onAuthPage = ['/login', '/register', '/onboarding'].some(
        (p) => window.location.pathname.startsWith(p)
      );
      if (!onAuthPage) {
        window.location.href = '/login';
      }
      return Promise.reject(err);
    } finally {
      isRefreshing = false;
    }
  }
);

export default api;
