import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css'; // Đảm bảo import file CSS tổng quát
import HomePage from './pages/home/HomePage'
import RestaurantList from './pages/restaurant/RestaurantList';
import RestaurantDetail from './pages/restaurant/RestaurantDetail';
import Header from './components/commons/Header';
import Footer from './components/commons/Footer';
function App() {
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
          </Routes>
        </main>
        {/* Footer luôn xuất hiện */}
        <Footer />
      </div>
    </Router>
  );
}

export default App;
