import axios from 'axios';
import * as SecureStore from 'expo-secure-store';
import Constants from 'expo-constants';

const hostUri = Constants.expoConfig?.hostUri || '';
const localHost = hostUri.split(':')[0] || 'localhost';
const baseURL = process.env.EXPO_PUBLIC_API_URL || `http://${localHost}:3000`;

const api = axios.create({
  baseURL
});

api.interceptors.request.use(
  async (config) => {

    const token = await SecureStore.getItemAsync('token');

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default api;