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
    <div className="mx-5">
      <nav className="navbar navbar-expand-lg">
        <div className="container-fluid">
          {/* Logo + Tên website (căn trái) */}
          <Link to="/" className="navbar-brand d-flex align-items-center">
            <img src="/logo.png" alt="Logo" className="me-2" style={{ width: '60px', height: '80px' }} />
            <img src="/header.png" alt="Header" style={{ width: '230px', height: '50px' }} />
          </Link>

          {/* Nút toggle hiển thị menu trên mobile */}
          <button
            className="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbarSupportedContent"
            aria-controls="navbarSupportedContent"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <span className="navbar-toggler-icon"></span>
          </button>

          {/* Nội dung menu */}
          <div className="collapse navbar-collapse" id="navbarSupportedContent">
            {/* Khoảng trống để đẩy icon sang phải */}
            <ul className="navbar-nav me-auto mb-2 mb-lg-0"></ul>

            {/* Thông báo + User icon (căn phải) */}
            <ul className="navbar-nav d-flex align-items-center">
              <li className="nav-item position-relative me-2">
                <div
                  className="nav-link cursor-pointer"
                  onClick={toggleNotification}
                >
                  <i className="fa-regular fa-bell fa-lg"></i>
                </div>
                {/* Modal thông báo */}
                {isNotificationOpen && (
                  <div
                    ref={modalRef}
                    className="notifications-modal bg-white p-3 shadow position-absolute end-0"
                    style={{ top: '3rem', minWidth: '200px' }}
                  >
                    <h6 className="mb-2">お知らせ</h6>
                    <ul className="list-unstyled mb-0">
                      <li className="mb-1">通知1</li>
                      <li className="mb-1">通知2</li>
                      <li className="mb-1">通知3</li>
                    </ul>
                  </div>
                )}
              </li>
              <li className="nav-item">
                <Link to="/profile" className="nav-link">
                  <i className="fa-regular fa-user fa-lg"></i>
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </nav>

      {/* Thêm nav bên dưới header */}
      <nav className="sub-nav navbar navbar-expand-lg">
        <div className="collapse navbar-collapse">
          <ul className="navbar-nav">
            <NavLink
              to="/restaurant-list"
              className={({ isActive }) =>
                `nav-item nav-link ${isActive ? 'active' : ''} mr-3`
              }
              onClick={() => handleLinkClick('/restaurant-list')}
            >
              レストランとメニュー
            </NavLink>
            <NavLink
              to="/community"
              className={({ isActive }) =>
                `nav-item nav-link ${isActive ? 'active' : ''} mx-3`
              }
              onClick={() => handleLinkClick('/community')}
            >
              コミュニティー
            </NavLink>
            <NavLink
              to="/interesting"
              className={({ isActive }) =>
                `nav-item nav-link ${isActive ? 'active' : ''} mx-3`
              }
              onClick={() => handleLinkClick('/interesting')}
            >
              お気に入りの飲食店
            </NavLink>
            <NavLink
              to="/write-post"
              className={({ isActive }) =>
                `nav-item nav-link ${isActive ? 'active' : ''} mx-3`
              }
              onClick={() => handleLinkClick('/write-post')}
            >
              評価を書く
            </NavLink>
          </ul>
        </div>
      </nav>
    </div>
  );
};

export default Header;
