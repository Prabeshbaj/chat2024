import React from 'react';
import './Header.css';

const Header: React.FC = () => {
  return (
    <div className="app-header">
      <div className="logo">
        <img src="path-to-logo" alt="V" className="logo-image" />
        <span className="beta-label">BETA</span>
      </div>
      <div className="header-icons">
        <img src="path-to-icon1" alt="icon1" className="header-icon" />
        <img src="path-to-icon2" alt="icon2" className="header-icon" />
        <img src="path-to-user" alt="user" className="user-icon" />
      </div>
    </div>
  );
};

export default Header;
