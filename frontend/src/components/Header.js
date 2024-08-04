import React from 'react';
import logo from '../assets/logo.svg'; 
import userAvatar from '../assets/user-avatar.jpg'; 
import './styles/Header.css'; 

function Header() {
    return (
      <header className="header">
        <div className="logo-container">
          <img src={logo} alt="Stock Analysis App Logo" className="logo" />
          <h1 className="borel">Stock Analysis</h1>
        </div>
      </header>
    );
  };

export default Header;
