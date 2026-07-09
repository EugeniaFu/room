import { io } from 'socket.io-client';
import Constants from 'expo-constants';

const hostUri = Constants.expoConfig?.hostUri || '';
const localHost = hostUri.split(':')[0] || 'localhost';
const socketURL = process.env.EXPO_PUBLIC_API_URL || `http://${localHost}:3000`;

const socket = io(
  socketURL,
  {
    transports: ['websocket'],
  }
);

export default socket;