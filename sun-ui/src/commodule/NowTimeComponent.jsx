import React from 'react';
import { useState } from 'react';
import { useEffect } from 'react';

const NowTimeComponent = () => {
    const [currentTime, setCurrentTime] = useState('');

    useEffect(() => {
        // 컴포넌트가 마운트될 때 현재 시각을 설정
        const now = new Date();
        const formattedTime = now.toLocaleTimeString(); // 시각을 문자열로 변환
        setCurrentTime(formattedTime);
    }, []); // 빈 배열을 사용하여 컴포넌트가 처음 마운트될 때만 실행

    return (
        <div>
            <h3>{currentTime}</h3>
        </div>
    );
};


export default NowTimeComponent;