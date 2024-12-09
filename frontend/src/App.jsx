import React from 'react';
import { Navigate } from 'react-router-dom';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css'; // Đảm bảo import file CSS tổng quát
import HomePage from './pages/home/HomePage';
import RestaurantList from './pages/restaurant/RestaurantList';
import RestaurantDetail from './pages/restaurant/RestaurantDetail';
import Header from './components/commons/Header';
import Footer from './components/commons/Footer';
import UpLoadPostPage from './pages/post/UploadPost';
import { useSelector } from 'react-redux';

function App() {
  const isLoggedIn = useSelector((state) => state.user.value);
  return (
    <Router>
      <div>
        {/* Header luôn xuất hiện */}
        <Header />
        <main>
          {/* Các route chính */}
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/restaurant-list" element={<RestaurantList />} />
            <Route path="/restaurants/:id" element={<RestaurantDetail />} />
            <Route
              path="/comment"
              element={
                isLoggedIn ? <UpLoadPostPage /> : <Navigate to="/signin" replace />
              }
            />
          </Routes>
        </main>
        {/* Footer luôn xuất hiện */}
        <Footer />
      </div>
    </Router>
  );
}

export default App;
