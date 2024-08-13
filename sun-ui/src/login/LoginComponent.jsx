import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

const LoginComponent = () => {
    const navigate = useNavigate();

    const storedUserData = window.sessionStorage.getItem("user");
    const initialUser = storedUserData ? JSON.parse(storedUserData) : { empcode: '', emppw: '' };
    const [userData, setUserData] = useState();
    const [user, setUser] = useState(initialUser);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setUser({ ...user, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
          const formData = new FormData();
          formData.append('empcode', user.empcode);
          formData.append('emppw', user.emppw);
    
          console.log('전송된 empcode:', user.empcode); // 확인
            console.log('전송된 emppw:', user.emppw); // 확인
          const response = await axios({
            url: 'http://localhost:8787/loginProc',
            method: 'POST',
            data: formData,
            withCredentials: true,
          });
          console.log('서버 응답:', response.data); // 응답 확인
          if (response.status === 200) {
            alert('로그인 성공!');
            console.log('유저 이메일: ' + response.data.empcode);
            console.log('권한: ' + response.data.emppw);
            
             // 세션 스토리지에 사용자 데이터 저장 (JSON 형식)
            const userData = {
                empcode: response.data.empcode,
                authorities: response.data.authorities,
                
            };
            
            window.sessionStorage.setItem("user", JSON.stringify(userData));
            
            navigate('/logout', { state: { userData: response.data } });
          }
        } catch (error) {
          alert('로그인 실패');
        }
      };

    return (
        <div>
            <h3>로그인</h3>
            <form onSubmit={handleSubmit}>
                <input type="text" name="empcode" placeholder="ID" value={user.empcode} onChange={handleChange} />
                <input type="password" name="emppw" placeholder="PW" value={user.emppw} onChange={handleChange} />
                <button type="submit">로그인</button>
            </form>
        </div>
    );
};

export default LoginComponent;