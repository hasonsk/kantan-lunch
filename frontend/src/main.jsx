import { configureStore } from '@reduxjs/toolkit';
import { Provider } from 'react-redux';
import userReducer from './redux/userSlice';
import errorReducer from './redux/errorSlice.js';
import { BrowserRouter as Router } from 'react-router-dom';
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import App from './App.jsx';

const store = configureStore({
  reducer: {
    user: userReducer,
    error: errorReducer,
  },
});

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Router>
      <Provider store={store}>
        <App />
      </Provider>
    </Router>
  </StrictMode>
);
