import React from 'react';
import './AdminHeader.css';

const AdminHeader = () => {
    return (
        <div className='header-wrapper'>
            <header className="header">
                {/* Logo bên trái */}
                <div className="logo">
                    {/* <img src="/src/assets/logo.png" alt="Logo" className="logo-img" /> Thay 'logo.png' bằng đường dẫn logo của bạn */}
                    LOGO
                </div>

                <nav className="sub-nav">
                    <a href="/admin/user" className={`sub-nav-link ${location.pathname.endsWith('/user') ? 'active' : ''}`}>レビュー管理</a>
                    <a href="/admin/review" className={`sub-nav-link ${location.pathname.endsWith('/review') ? 'active' : ''}`}>コンテンツ管理ページ</a>
                    <a href="/admin/menu" className={`sub-nav-link ${location.pathname.endsWith('/menu') ? 'active' : ''}`}>食品およびレストラン</a>
                </nav>

                {/* Các icon bên phải */}
                <div className="icons">
                    {/*<a href="/notifications" className="icon">*/}
                    {/*    <i className="fa-regular fa-bell"></i> /!* Icon thông báo dạng outline *!/*/}
                    {/*</a>*/}
                    <a href="/profile" className="icon">
                        <div className="display-flex-30">
                            <div>
                                <i className="fa-regular fa-user"></i> {/* Icon người dùng dạng outline */}
                            </div>
                            <span>
                                Hello, Admin
                            </span>
                        </div>
                    </a>
                </div>
            </header>
        </div>
    );
};

export default AdminHeader;
