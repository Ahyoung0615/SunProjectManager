import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import sunImage from '../img/image07.png'; // 이미지 경로를 실제 경로로 변경하세요.

const LoginComponent = () => {
    const navigate = useNavigate();

    const storedUserData = window.sessionStorage.getItem("user");
    const initialUser = storedUserData ? JSON.parse(storedUserData) : { empcode: '', emppw: '' };
    const [userData, setUserData] = useState();
    const [user, setUser] = useState(initialUser);
    const [rememberMe, setRememberMe] = useState(false);

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
                console.log('권한: ' + response.data.empAuth);

                // 세션 스토리지에 사용자 데이터 저장 (JSON 형식)
                const userData = {
                    empcode: response.data.empcode,
                    authorities: response.data.authorities,
                };

                window.sessionStorage.setItem("user", JSON.stringify(userData));

                navigate('/access', { state: { userData: response.data } });
            }
        } catch (error) {
            alert('로그인 실패');
        }
    };

    return (
        <div className="login-container">
            <div className="login-box">
                <img src={sunImage} alt="Security" className="login-image" />
                <h2 className="login-title">Login</h2>
                <form onSubmit={handleSubmit}>
                    <input
                        type="text"
                        name="empcode"
                        placeholder="ID"
                        value={user.empcode}
                        onChange={handleChange}
                        required
                        className="login-input"
                    />
                    <input
                        type="password"
                        name="emppw"
                        placeholder="Password"
                        value={user.emppw}
                        onChange={handleChange}
                        required
                        className="login-input"
                    />
                    <div className="checkbox" style={{ marginRight: 220, marginBottom: 10, marginTop: -10 }}>
                        <label>
                            <input
                                type="checkbox"
                                name="rememberMe"
                                checked={rememberMe}
                                onChange={(e) => setRememberMe(e.target.checked)}
                            />
                            자동 로그인
                        </label>
                    </div>
                    <button type="submit" className="login-button">로그인</button>
                </form>
                <Link to={'/register'}><button className="signup-button">회원가입</button></Link>
            </div>
        </div>
    );
};

export default LoginComponent;
