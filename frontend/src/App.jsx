import React from 'react';
import { Navigate, Route, Routes, useLocation } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
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
import AdminHeader from './components/commons/admin/AdminHeader';
import ReviewManagement from './pages/admin/ReviewManagement';
import ThrottleExample from './components/ratings/RatingForm';
import ErrorModal from './components/commons/Modal/Modal';
import UserProfile from './pages/user/UserProfile';
import RestaurantManagement from './pages/admin/Restaurantmanagement';
import UncontrolledExample from './components/carousel';

function App() {
  const isLoggedIn = useSelector((state) => state.user.value);
  const showModal = useSelector((state) => state.error.value);
  let location = useLocation();
  return (
    <div>
      {/* Header luôn xuất hiện trừ khi login/signup*/}
      {location.pathname !== '/login' &&
        location.pathname !== '/signup' &&
        !location.pathname.startsWith('/admin') && <Header />}
      {location.pathname.startsWith('/admin') && <AdminHeader />}
      <main>
        {/* Các route chính */}
        <Routes>
          <Route path="/" element={<Navigate to="/home" replace />} />
          <Route path="/carousel" element={<UncontrolledExample />} />
          <Route path="/home" element={<HomePage />} />
          <Route path="/restaurant-list" element={<RestaurantList />} />
          <Route path="/restaurants/:id" element={<RestaurantDetail />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} /> RestaurantManagement
          <Route
            path="/admin/restaurant-management"
            element={<RestaurantManagement />}
          />
          <Route path="/test" element={<ThrottleExample />} />
          <Route
            path="/restaurants/write-post"
            element={
              isLoggedIn ? (
                <UpLoadPostPage />
              ) : (
                //<Navigate to="/signin" replace />
                <UpLoadPostPage />
              )
            }
          />
          <Route path="/profile/:id" element={<UserProfile />} />
          <Route path="/admin" element={<h1>Admin Page</h1>} />
          <Route path="/admin/user" element={<h1>User Management</h1>} />
          <Route path="/admin/review" element={<ReviewManagement />} />
          <Route path="/admin/menu" element={<RestaurantManagement />} />
        </Routes>
      </main>
      {/* Footer luôn xuất hiện trừ khi login/signup */}
      {location.pathname !== '/login' && location.pathname !== '/signup' && (
        <Footer />
      )}
      {showModal ? <ErrorModal /> : null}
    </div>
  );
}

export default App;
