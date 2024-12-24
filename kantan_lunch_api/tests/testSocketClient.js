// testSocketClient.js
import io from 'socket.io-client';

// Replace with your server URL and port
const SOCKET_URL = 'http://localhost:3000';

// Replace with the user ID you want to register
const USER_ID = '6757fb6720cfeabef0328663';

const socket = io(SOCKET_URL);

// Connect to the server
socket.on('connect', () => {
  console.log('Connected to server');

  // Register the user
  socket.emit('register', USER_ID);
});

// Listen for notifications
socket.on('notification', (data) => {
  console.log('Received notification:', data);
});

// Handle disconnection
socket.on('disconnect', () => {
  console.log('Disconnected from server');
});