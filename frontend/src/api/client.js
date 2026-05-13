import axios from 'axios';

const client = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000',
});

// Attach JWT to every request
client.interceptors.request.use((config) => {
  const token = localStorage.getItem('jwt_token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// Handle expired/invalid tokens globally
client.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401) {
      localStorage.removeItem('jwt_token');
      localStorage.removeItem('user_data');
      window.location.href = '/login';
    }
    return Promise.reject(err);
  }
);

export const auth = {
  register: (email, password) => client.post('/api/auth/register', { email, password }),
  login:    (email, password) => client.post('/api/auth/login',    { email, password }),
};

export const subs = {
  list:   ()         => client.get('/api/subs'),
  create: (data)     => client.post('/api/subs', data),
  update: (id, data) => client.put(`/api/subs/${id}`, data),
  remove: (id)       => client.delete(`/api/subs/${id}`),
  stats:  ()         => client.get('/api/subs/stats'),
};

export const rates = {
  get: () => client.get('/api/rates'),
};

// Helpers
export const CURRENCIES = ['PLN', 'USD', 'EUR'];
export const CURRENCY_SYMBOLS = { PLN: 'zł', USD: '$', EUR: '€' };

export const formatCost = (cost, currency) => {
  const amount = parseFloat(cost).toFixed(2);
  return currency === 'PLN' ? `${amount} zł` : `${CURRENCY_SYMBOLS[currency] || currency}${amount}`;
};

export default client;
