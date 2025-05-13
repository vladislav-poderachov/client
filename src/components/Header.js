// src/components/Header.jsx

import React from 'react';
import './Header.css';
import { Link } from 'react-router-dom';
const Header = ({ username, onLogout }) => {
    return (
        <header className="header">
            <h1>ProgressPal</h1>
            <div className="header-user">
                <Link to="/profile" className="header-username">{username}</Link>
                <button onClick={onLogout}>Выйти</button>
            </div>
        </header>
    );
};

export default Header;
