import {
  createContext,
  useContext,
  useEffect,
  useState
} from 'react';

import * as SecureStore from 'expo-secure-store';

import api from '../services/api';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {

  const [user, setUser] = useState(null);

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadSession();
  }, []);

  const loadSession = async () => {
    try {

      const token = await SecureStore.getItemAsync('token');

      if (!token) {
        setLoading(false);
        return;
      }

      const response = await api.get('/private');

      setUser(response.data.user);

    } catch (err) {

      await SecureStore.deleteItemAsync('token');

      setUser(null);

    } finally {

      setLoading(false);

    }
  };

  const login = async (email, password) => {

    const response = await api.post('/auth/login', {
      email,
      password
    });

    const { token, user } = response.data;

    await SecureStore.setItemAsync('token', token);

    setUser(user);

    return user;
  };

  const verifyEmail = async (email, code) => {

    const response = await api.post('/auth/verify-email', {
      email,
      code
    });

    const { token, user } = response.data;

    await SecureStore.setItemAsync('token', token);

    setUser(user);

    return user;
  };

  const register = async (email, password) => {

    const response = await api.post('/auth/register', {
      email,
      password
    });

    return response.data;
  };

  const logout = async () => {

    await SecureStore.deleteItemAsync('token');

    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        register,
        verifyEmail,
        logout
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
};