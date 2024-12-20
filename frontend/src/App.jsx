import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css'; // Đảm bảo import file CSS tổng quát
import Home from './pages/home/HomePage';
import RestaurantList from './pages/restaurant/RestaurantList';
import RestaurantDetail from './pages/restaurant/RestaurantDetail';
import RestaurantLikeList from './pages/restaurant/RestaurantLikeList';
import Header from './components/commons/Header';
import Footer from './components/commons/Footer';
import CommunityPage from './pages/community/CommunityPage';
function App() {
  return (
    <Router>
      <div>
        {/* Header luôn xuất hiện */}
        <Header />
        <main>
          {/* Các route chính */}
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/restaurant-list" element={<RestaurantList />} />
            <Route path="/community" element={<CommunityPage />} />
            <Route path="/interesting" element={<RestaurantLikeList />} />
            <Route path="/restaurants/:id" element={<RestaurantDetail />} />
          </Routes>
        </main>
        {/* Footer luôn xuất hiện */}
        <Footer />
      </div>
    </Router>
  );
}

export default App;
