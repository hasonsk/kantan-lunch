import { configureStore } from '@reduxjs/toolkit';
import { Provider } from 'react-redux';
import userReducer from './redux/userSlice';
import { BrowserRouter as Router } from 'react-router-dom';
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App.jsx';

const store = configureStore({
  reducer: {
    user: userReducer,
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
