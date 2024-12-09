import React from 'react';
import {BrowserRouter as Router, Routes, Route} from 'react-router-dom';
import './App.css'; // Đảm bảo import file CSS tổng quát
import HomePage from './pages/home/HomePage'
import RestaurantList from './pages/restaurant/RestaurantList';
import RestaurantDetail from './pages/restaurant/RestaurantDetail';
import Header from './components/commons/Header';
import Footer from './components/commons/Footer';
import AdminHeader from './components/commons/admin/AdminHeader';
import ReviewManagement from './pages/admin/ReviewManagement';

function App() {
    const isAdminRoute = window.location.pathname.startsWith('/admin');
    return (
        <Router>
            <div>
                {/* Header luôn xuất hiện */}
                {isAdminRoute ? <AdminHeader /> : <Header />}
                <main>
                    {/* Các route chính */}
                    <Routes>
                        <Route path="/" element={<HomePage/>}/>
                        <Route path="/restaurant-list" element={<RestaurantList/>}/>
                        <Route path="/restaurants/:id" element={<RestaurantDetail/>}/>

                        <Route path="/admin" element={<h1>Admin Page</h1>}/>
                        <Route path="/admin/user" element={<h1>User Management</h1>}/>
                        <Route path="/admin/review" element={<ReviewManagement>}/>
                        <Route path="/admin/menu" element={<h1>Menu Management</h1>}/>
                    </Routes>
                </main>
                {/* Footer luôn xuất hiện */}
                {isAdminRoute ? "" : <Footer />}
            </div>
        </Router>
    );
}

export default App;
