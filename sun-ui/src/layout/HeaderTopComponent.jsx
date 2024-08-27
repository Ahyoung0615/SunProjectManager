import React, { useEffect, useState, useCallback } from 'react';
import 'bootstrap-icons/font/bootstrap-icons.css';
import HeaderSearchComponent from './HeaderSearchComponent';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

const HeaderTopComponent = () => {
  const navigate = useNavigate();
  const [isToggled, setIsToggled] = useState(false);
  const [userName, setUserName] = useState(null);

  // 세션에서 유저 정보를 가져오는 함수
  const fetchUserInfo = useCallback(() => {
    const userInfo = window.sessionStorage.getItem('user');
    if (userInfo) {
      setUserName(JSON.parse(userInfo));
    }
  }, []);

  useEffect(() => {
    fetchUserInfo();
  }, [fetchUserInfo]);

  useEffect(() => {
    const sidebarToggle = document.body.querySelector('#sidebarToggle');
    if (sidebarToggle) {
      // Sidebar 초기 상태 설정
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
  }, []); // 의존성 배열을 빈 배열로 유지하여 첫 렌더링 후 한 번만 실행

  const handleToggleClick = useCallback((event) => {
    event.preventDefault();
    setIsToggled((prevState) => !prevState);
  }, []);

  const handleLogout = async () => {
    try {
      await axios.post('http://localhost:8787/logout', {}, { withCredentials: true });
      window.sessionStorage.removeItem("user");
      setUserName(null); 
      alert('로그아웃 완료');
      navigate('/'); 
    } catch (error) {
      console.error('로그아웃 에러:', error);
    }
  };

  const sessionChk = useCallback(() => {
    const session = window.sessionStorage.getItem('user');
    if(session === null) {
      console.log("세션이 존재하지 않습니다.");
    } else {
      console.log("세션이 존재합니다.");
    }
  }, []);

  return (
    <nav className="sb-topnav navbar navbar-expand navbar-dark bg-dark">
      <a className="navbar-brand ps-3" href="/home" onClick={sessionChk}>SUN Company</a>
      <button 
        className="btn btn-link btn-sm order-1 order-lg-0 me-4 me-lg-0" 
        id="sidebarToggle" 
        href="/#" 
        onClick={handleToggleClick}
      >
        {isToggled ? <i className="bi bi-chevron-double-right"></i> : <i className="bi bi-chevron-double-left"></i>}
      </button>

      <div>
        {userName ? (
          <div style={{ color: 'white', marginLeft: 30 }}>
            {userName.empName}님, 반갑습니다
          </div>
        ) : (
          <div style={{ color: 'white', marginLeft: 30 }}></div>
        )}
      </div>

      <HeaderSearchComponent style={{ marginRight: 80 }} />
      <Link to='/chatSun' style={{ color: 'white', textDecorationLine: 'none', marginRight: 20 }}>
      <i class="bi bi-chat-dots-fill"></i> 채팅
      </Link>
      <Link to='/myPage' style={{ color: 'white', textDecorationLine: 'none', marginRight: 20 }}>
        <i className="bi bi-person-circle"></i> 마이페이지
      </Link>
      
      {userName && (
        <Link 
          to='/' 
          onClick={handleLogout} 
          style={{ color: 'white', textDecorationLine: 'none', marginRight: 20 }}
        >
          <i className="bi bi-person-fill-slash"></i> 로그아웃
        </Link>
      )}
    </nav>
  );
};

export default HeaderTopComponent;
