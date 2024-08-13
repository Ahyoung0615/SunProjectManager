import React from 'react';
import { useLocation } from 'react-router-dom';
import axios from 'axios';

const LogoutComponent = () => {
    const location = useLocation();
    const { empcode, authorities } = location.state.userData;
    const handleLogout = async () => {
        try {
          await axios.post('http://localhost:8787/logout', {}, { withCredentials: false });
          // 세션 스토리지 초기화
          window.sessionStorage.removeItem("user");
          alert('로그아웃 완료');
          window.location.href = '/';
        } catch (error) {
          console.error('로그아웃 에러:', error);
        }
      };
    return (
        <div>
            로그인완료
            <h1>사용자 정보</h1>
            <p>이메일: {empcode}</p>
            <p>권한: {authorities}</p>
            <button onClick={handleLogout}>로그아웃</button>
        </div>
    );
};

export default LogoutComponent;