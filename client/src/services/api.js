import axios from 'axios';
const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL || 'http://localhost:5000/api',
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});
export const getServices = () => api.get('/services');
export const getAvailableSlots = (date, serviceId) => api.get(`/appointments/available-slots/${date}?serviceId=${serviceId}`);
export const createAppointment = (data) => api.post('/appointments', data);
export const getAllAppointments = () => api.get('/appointments');
export const cancelAppointment = (id) => api.put(`/appointments/${id}/cancel`);
export const updateStatus = (id, status) => api.put(`/appointments/${id}/status`, { status });
export const createPaymentOrder = (appointmentId) => api.post('/payments/create-order', { appointmentId });
export const verifyPayment = (data) => api.post('/payments/verify', data);
export const login = (email, password) => api.post('/auth/login', { email, password });
export const getMe = () => api.get('/auth/me');

export default api;