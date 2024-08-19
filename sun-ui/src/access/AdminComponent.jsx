import React, { useState, useEffect } from 'react';
import admin from '../img/admin.png';
import { useNavigate } from 'react-router-dom';

const AdminComponent = ({ children }) => {
    // 권한 확인 로직
    const [userData, setUserData] = useState(null);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const storedUserData = window.sessionStorage.getItem("user");
        console.log('Stored user data:', storedUserData);
    
        if (storedUserData) {
            const parsedData = JSON.parse(storedUserData);
            console.log('Parsed user data:', parsedData);
    
            setUserData(parsedData);
    
            if (parsedData.authorities !== '[A]') {
                setLoading(false);
                setTimeout(() => {
                    navigate('/home'); // 2초 후 홈으로 리다이렉트
                }, 2000);
            } else {
                setLoading(false);
            }
        } else {
            setLoading(false);
            setTimeout(() => {
                navigate('/'); // 2초 후 로그인 페이지로 리다이렉트
            }, 2000);
        }
    }, [navigate]);

    if (!userData || userData.authorities !== '[ROLE_A]') {
        return (
            <div style={{
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
                height: '100vh',
                textAlign: 'center'
            }}>
                <img src={admin} alt='관리자 권한' />
                <div style={{ fontSize: 20}}>
                    <b>관리자 권한이 필요합니다
                    <br />2초 후 메인 페이지로 이동합니다</b>
                </div>
            </div>
        );
    }
    

    return (
        <div>
            {children}
        </div>
    );
};

export default AdminComponent;
