import React from 'react';

import { Navigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useLocation,
} from 'react-router-dom';
import './App.css'; // Đảm bảo import file CSS tổng quát
import HomePage from './pages/home/HomePage';
import Login from './pages/session/Login';
import Signup from './pages/session/Signup';
import RestaurantList from './pages/restaurant/RestaurantList';
import RestaurantDetail from './pages/restaurant/RestaurantDetail';
import Header from './components/commons/Header';
import Footer from './components/commons/Footer';
import UpLoadPostPage from './pages/post/UploadPost';
import { useSelector } from 'react-redux';



function App() {
  const isLoggedIn = useSelector((state) => state.user.value);
  let location = useLocation();
  return (
    <Router>
      <div>
        {/* Header luôn xuất hiện trừ khi login/signup*/}
        {location.pathname !== '/login' && location.pathname !== '/signup' && (
          <Header />
        )}
        <main>
          {/* Các route chính */}
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/restaurant-list" element={<RestaurantList />} />
            <Route path="/restaurants/:id" element={<RestaurantDetail />} />
              <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
            <Route
              path="/comment"
              element={
                isLoggedIn ? (
                  <UpLoadPostPage />
                ) : (
                  <Navigate to="/signin" replace />
                )
              }
            />
          </Routes>
        </main>
        {/* Footer luôn xuất hiện trừ khi login/signup */}
        {location.pathname !== '/login' && location.pathname !== '/signup' && (
          <Footer />
        )}
      </div>
    </Router>
  );
}

export default App;
