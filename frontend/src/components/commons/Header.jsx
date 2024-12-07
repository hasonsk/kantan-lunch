import React, { useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
import './Header.css';

const Header = () => {
  // Khai báo state để lưu trữ phần tử đang active
  const [activeLink, setActiveLink] = useState('/restaurant-list');

  // Hàm xử lý khi click vào một liên kết
  const handleLinkClick = (link) => {
    setActiveLink(link); // Cập nhật activeLink khi click vào liên kết
  };

  return (
    <div className="header-wrapper">
      <header className="header">
        {/* Logo bên trái */}
        <div className="logo">
          {/* <img src="/src/assets/logo.png" alt="Logo" className="logo-img" /> Thay 'logo.png' bằng đường dẫn logo của bạn */}
          LOGO
        </div>

        {/* Các icon bên phải */}
        <div className="icons">
          <Link to="/notifications" className="icon">
            <i className="fa-regular fa-bell"></i> {/* Icon thông báo dạng outline */}
          </Link>
          <Link to="/profile" className="icon">
            <i className="fa-regular fa-user"></i> {/* Icon người dùng dạng outline */}
          </Link>
        </div>
      </header>

      {/* Thêm nav bên dưới header */}
      <nav className="sub-nav">
        <NavLink
          to="/restaurant-list"
          className={({ isActive }) => `sub-nav-link ${isActive ? 'active' : ''}`}
          onClick={() => handleLinkClick('/restaurant-list')}
        >
          レストランとメニュー
        </NavLink>
        <NavLink
          to="/community"
          className={({ isActive }) => `sub-nav-link ${isActive ? 'active' : ''}`}
          onClick={() => handleLinkClick('/community')}
        >
          コミュニティー
        </NavLink>
        <NavLink
          to="/interesting"
          className={({ isActive }) => `sub-nav-link ${isActive ? 'active' : ''}`}
          onClick={() => handleLinkClick('/interesting')}
        >
          お気に入りの飲食店
        </NavLink>
        <NavLink
          to="/comment"
          className={({ isActive }) => `sub-nav-link ${isActive ? 'active' : ''}`}
          onClick={() => handleLinkClick('/comment')}
        >
          評価を書く
        </NavLink>
      </nav>
    </div>
  );
};

export default Header;
