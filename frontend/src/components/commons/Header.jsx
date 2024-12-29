import React, { useState, useRef } from 'react';
import { Link, NavLink } from 'react-router-dom';
import './Header.css';

const Header = () => {
  const [activeLink, setActiveLink] = useState('/restaurant-list');
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  
  // Sử dụng useRef để giữ tham chiếu đến phần tử modal
  const modalRef = useRef(null);

  // Hàm xử lý khi click vào một liên kết
  const handleLinkClick = (link) => {
    setActiveLink(link); // Cập nhật activeLink khi click vào liên kết
  };

  // Hàm mở/đóng modal thông báo
  const toggleNotification = () => {
    setIsNotificationOpen((prev) => !prev); // Đảo ngược trạng thái modal
  };

  // Hàm xử lý click ra ngoài modal
  const handleOutsideClick = (event) => {
    if (modalRef.current && !modalRef.current.contains(event.target)) {
      setIsNotificationOpen(false); // Đóng modal khi click ngoài
    }
  };

  // Hook useEffect để lắng nghe sự kiện click ngoài modal
  React.useEffect(() => {
    document.addEventListener('mousedown', handleOutsideClick);
    return () => {
      document.removeEventListener('mousedown', handleOutsideClick);
    };
  }, []);

  return (
    <div className="header-wrapper">
      <header className="header">
        {/* Logo bên trái */}
        <div className="logo">LOGO</div>

        {/* Các icon bên phải */}
        <div className="icons">
          <div className="notification-wrapper">
            <i
              className="fa-regular fa-bell icon"
              onClick={toggleNotification}
            ></i>
            {/* Hiển thị modal thông báo */}
            {isNotificationOpen && (
              <div ref={modalRef} className="notifications-modal">
                <h4>Thông báo</h4>
                <ul>
                  <li>Thông báo 1</li>
                  <li>Thông báo 2</li>
                  <li>Thông báo 3</li>
                </ul>
              </div>
            )}
          </div>
          <Link to="/profile" className="icon">
            <i className="fa-regular fa-user"></i>
          </Link>
        </div>
      </header>

      {/* Thêm nav bên dưới header */}
      <nav className="sub-nav">
        <NavLink
          to="/restaurant-list"
          className={({ isActive }) =>
            `sub-nav-link ${isActive ? 'active' : ''}`
          }
          onClick={() => handleLinkClick('/restaurant-list')}
        >
          レストランとメニュー
        </NavLink>
        <NavLink
          to="/community"
          className={({ isActive }) =>
            `sub-nav-link ${isActive ? 'active' : ''}`
          }
          onClick={() => handleLinkClick('/community')}
        >
          コミュニティー
        </NavLink>
        <NavLink
          to="/interesting"
          className={({ isActive }) =>
            `sub-nav-link ${isActive ? 'active' : ''}`
          }
          onClick={() => handleLinkClick('/interesting')}
        >
          お気に入りの飲食店
        </NavLink>
        <NavLink
          to="/write-post"
          className={({ isActive }) =>
            `sub-nav-link ${isActive ? 'active' : ''}`
          }
          onClick={() => handleLinkClick('/write-post')}
        >
          評価を書く
        </NavLink>
      </nav>
    </div>
  );
};

export default Header;
