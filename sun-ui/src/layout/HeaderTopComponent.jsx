import React, { useEffect, useState } from 'react';
import 'bootstrap-icons/font/bootstrap-icons.css';
import HeaderSearchComponent from './HeaderSearchComponent';
import { Link, useNavigate } from 'react-router-dom';
import LogoutComponent from '../login/LogoutComponent';

const HeaderTopComponent = () => {
  const navigate = useNavigate();
  const [isToggled, setIsToggled] = useState(false);
  
  const [userName, setUserName] = useState("");

  useEffect(()=>{
    const userInfo = window.sessionStorage.getItem('user');
    
    if(userInfo){
      setUserName(JSON.parse(userInfo));
    }


  }, []);

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
                    
            <a className="navbar-brand ps-3" href="/home">SUN Company</a>
            <button className="btn btn-link btn-sm order-1 order-lg-0 me-4 me-lg-0" id="sidebarToggle" href="/#" onClick={handleToggleClick}>
                {isToggled ? <i className="bi bi-chevron-double-right"></i>:<i className="bi bi-chevron-double-left"></i>}
            </button>
           
            {userName&&
            <div style={{color:'white', marginLeft:30}}>
            {userName.empcode}님, 반갑습니다
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
              <Link to='/' style={{color:'white', textDecorationLine:'none', marginRight:20}}>
                 <i className="bi bi-person-fill-slash"></i> 로그아웃
            </Link>
        </nav>
    );
};

export default HeaderTopComponent;
