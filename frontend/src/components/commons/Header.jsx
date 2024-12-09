import React from 'react';
import './Header.css';

const Header = () => {
  return (
    <div className="header-wrapper">
      <header className="header">
        {/* Logo bên trái */}
        <div className="logo ">
          <a href="/home" className='sub-nav-link'>
            {/* <img src="/src/assets/logo.png" alt="Logo" className="logo-img" /> Thay 'logo.png' bằng đường dẫn logo của bạn */}
            LOGO
          </a>
        </div>

        {/* Các icon bên phải */}
        <div className="icons">
          <a href="/notifications" className="icon">
            <i className="fa-regular fa-bell"></i>{' '}
            {/* Icon thông báo dạng outline */}
          </a>
          <a href="/profile" className="icon">
            <i className="fa-regular fa-user"></i>{' '}
            {/* Icon người dùng dạng outline */}
          </a>
        </div>
      </header>

      {/* Thêm nav bên dưới header */}
      <nav className="sub-nav">
        <a href="/restaurant-list" className="sub-nav-link active">
          レストランとメニュー
        </a>
        <a href="/community" className="sub-nav-link">
          コミュニティー
        </a>
        <a href="/interesting" className="sub-nav-link">
          お気に入りの飲食店
        </a>
        <a href="/comment" className="sub-nav-link">
          評価を書く
        </a>
      </nav>
    </div>
  );
};

export default Header;
