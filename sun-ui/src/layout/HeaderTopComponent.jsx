import React, { useEffect, useState } from 'react';
import 'bootstrap-icons/font/bootstrap-icons.css';
import HeaderSearchComponent from './HeaderSearchComponent';
import { Link } from 'react-router-dom';

const HeaderTopComponent = () => {
  const [isToggled, setIsToggled] = useState(false);
  const [userName, setUserName] = useState('');

  useEffect(()=>{
    const user = sessionStorage.getItem('user');
    //setUserName(user.data.name);
    setUserName('김아영');
  });

  useEffect(() => {
    const sidebarToggle = document.body.querySelector('#sidebarToggle');
    if (sidebarToggle) {
      if (localStorage.getItem('sb|sidebar-toggle') === 'true') {
        document.body.classList.add('sb-sidenav-toggled');
      }

      const toggleSidebar = (event) => {
        event.preventDefault();
        document.body.classList.toggle('sb-sidenav-toggled');
        localStorage.setItem('sb|sidebar-toggle', document.body.classList.contains('sb-sidenav-toggled'));
      };

      sidebarToggle.addEventListener('click', toggleSidebar);

      return () => {
        sidebarToggle.removeEventListener('click', toggleSidebar);
      };
    }

    const dropdownElementList = [].slice.call(document.querySelectorAll('.dropdown-toggle'));
    dropdownElementList.map((dropdownToggleEl) => {
      return new window.bootstrap.Dropdown(dropdownToggleEl);
    });
  }, []);

  const handleToggleClick = (event) => {
    event.preventDefault();
    setIsToggled(!isToggled);
  };


    return (
        <nav className="sb-topnav navbar navbar-expand navbar-dark bg-dark">
                    
            <a className="navbar-brand ps-3" href="/">SUN Company</a>
            <button className="btn btn-link btn-sm order-1 order-lg-0 me-4 me-lg-0" id="sidebarToggle" href="#!" onClick={handleToggleClick}>
                {isToggled ? <i className="bi bi-chevron-double-right"></i>:<i className="bi bi-chevron-double-left"></i>}
            </button>
            {userName&&
            <div style={{color:'white', marginLeft:30}}>
            {userName} 님, 반갑습니다
          </div>
              }
              {!userName&&
            <div style={{color:'white', marginLeft:30}}>
            재로그인이 필요합니다
          </div>
              }
              <HeaderSearchComponent style={{marginRight:50}}/>
              <Link to='/myPage' style={{color:'white', textDecorationLine:'none', marginRight:20}}>
                <i className="bi bi-person-circle"></i> 마이페이지
                </Link>
              <Link to='/login' style={{color:'white', textDecorationLine:'none', marginRight:20}}>
                 <i className="bi bi-person-fill-slash"></i> 로그아웃
            </Link>
        </nav>
    );
};

export default HeaderTopComponent;
