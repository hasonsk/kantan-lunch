import React from 'react';
import './AdminSearchbar.css';

/* eslint-disable react/prop-types */

const AdminSearchbar = ({section, callback, searchQuery}) => {
    return (
        <div className="search-bar">
            <div className="greeting-text">{section}</div>
            <div className="input-container">
                <div className="search-icon">
                    <i className="fa fa-search"></i>
                </div>
                <input
                    type="text"
                    placeholder="検索"
                    className="search-input"
                    value={searchQuery}
                    onChange={(e) => callback(e.target.value)}
                />
            </div>
        </div>
    );
};

export default AdminSearchbar;