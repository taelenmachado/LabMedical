import React from 'react';
import './Toolbar.scss';

const Toolbar = () => {
  return (
    <nav className="navbar top-menu">
      <div className="container-fluid">
        <span className='fs-2'>
          <i className="bi bi-heart-pulse-fill"></i> LabMedical
        </span>
        <div id="navbarSupportedContent">
          <span className="navbar-text top-menu__user">
            {localStorage.getItem('userEmail')} {localStorage.getItem('userEmail') && <i className="bi bi-person-circle fs-4 "></i> }
          </span>
        </div>
      </div>
    </nav>
  );
};

export default Toolbar;