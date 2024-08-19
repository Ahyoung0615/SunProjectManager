import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const AccessUserComponent = ({ children }) => {
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
            setLoading(false);
        } else {
            setLoading(false);
            navigate('/'); // 로그인 정보가 없으면 로그인 페이지로 리다이렉트
        }
    }, [navigate]);

    useEffect(() => {
        if (!loading && userData === null) {
            navigate('/'); // 로그인 정보가 없으면 로그인 페이지로 리다이렉트
        }
    }, [loading, userData, navigate]);

    return (
        <div>
           { children }
        </div>
    );
};

export default AccessUserComponent;
