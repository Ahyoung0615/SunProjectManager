import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import sunImage from '../img/image07.png'; // 이미지 경로를 실제 경로로 변경하세요.
import SockJS from 'sockjs-client';
import { Stomp } from '@stomp/stompjs';

const LoginComponent = () => {
    const navigate = useNavigate();
    const storedUserData = window.sessionStorage.getItem("user");
    const initialUser = storedUserData ? JSON.parse(storedUserData) : { empcode: '', emppw: '' };
    const [user, setUser] = useState(initialUser);
    const [rememberMe, setRememberMe] = useState(false);
    let stompClient;

    useEffect(() => {
        const checkRememberMe = async () => {
            try {
                const response = await axios.get('http://localhost:8787/checkRememberMe', { withCredentials: true });
                if (response.status === 200 && response.data.empcode) {
                    window.sessionStorage.setItem("user", JSON.stringify(response.data));
                    navigate('/access', { state: { userData: response.data } });
                    connectWebSocket(response.data.empcode);
                }
            } catch (error) {
                console.error('자동 로그인 체크 실패:', error);
            }
        };
        checkRememberMe();
    }, [navigate]);

    const connectWebSocket = (empcode) => {
        const socket = new SockJS('http://localhost:8787/ws');
        stompClient = Stomp.over(socket);

        stompClient.connect({}, () => {
            console.log('WebSocket 연결 성공');
            stompClient.subscribe('/topic/chatRoom', (message) => {
                console.log('WebSocket 메시지 수신:', JSON.parse(message.body));
            });
            stompClient.send('/app/chatRoom', {}, JSON.stringify({ empcode }));
        });
    };
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
            formData.append('rememberMe', rememberMe);
            const response = await axios({
                url: 'http://localhost:8787/loginProc',
                method: 'POST',
                data: formData,
                withCredentials: true,
            });

            if (response.status === 200) {
                alert('로그인 성공!');
                const userData = {
                    empcode: response.data.empcode,
                    authorities: response.data.authorities,
                    empName: response.data.empName,
                };
                window.sessionStorage.setItem("user", JSON.stringify(userData));
                connectWebSocket(response.data.empcode);
                navigate('/home', { state: { userData: response.data } });
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
