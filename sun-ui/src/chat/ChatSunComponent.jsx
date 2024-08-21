import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom'; // React Router DOM의 useNavigate를 사용하여 페이지 이동
import OrgChartComponent from '../commodule/OrgChartComponent';

const ChatSunComponent = () => {
    const [emp, setEmp] = useState(null); // 초기 상태를 null로 설정
    const [chat, setChat] = useState([]);
    const [employeeData, setEmployeeData] = useState({}); // 사원번호와 사원 정보 매핑
    const navigate = useNavigate(); // 페이지 이동을 위한 useNavigate 훅

    useEffect(() => {
        const value = window.sessionStorage.getItem('user');
        if (value) {
            setEmp(JSON.parse(value)); // JSON 파싱하여 상태에 설정
        }
    }, []); // 빈 배열을 의존성으로 설정하여 컴포넌트가 마운트될 때만 실행

    useEffect(() => {
        if (emp && emp.empcode) {
            const fetchData = async () => {
                try {
                    const chatResponse = await fetch(`http://localhost:8787/api/chatList?empCode=${emp.empcode}`);
                    if (!chatResponse.ok) {
                        throw new Error('Network response was not ok');
                    }
                    const chatData = await chatResponse.json();
                    setChat(chatData);

                    // 참여자 사원번호 수집
                    const empCodes = new Set();
                    chatData.forEach(item => {
                        item.chatroomParti.split(',').forEach(code => empCodes.add(code));
                    });

                    // 사원번호로 이름과 이미지를 매핑하기 위해 API 호출
                    const fetchEmployeeData = async () => {
                        const data = {};
                        for (const code of empCodes) {
                            const empResponse = await fetch(`http://localhost:8787/api/employee/${code}`);
                            if (empResponse.ok) {
                                const empData = await empResponse.json();
                                data[code] = {
                                    empName: empData.empName,
                                    empImg: empData.empImg
                                };
                            }
                        }
                        setEmployeeData(data);
                    };

                    fetchEmployeeData();

                } catch (error) {
                    console.error('Error fetching chat list:', error);
                }
            };

            fetchData();
        }
    }, [emp]); // emp가 변경될 때마다 실행

    // 채팅방 페이지로 이동하는 함수
    const handleChatRoomClick = (chatroomCode) => {
        window.open(
            `/chatRoom/${chatroomCode}`,
            '채팅방',
            'width=500,height=600'
        )
        
    };

    return (
        <div>
            <OrgChartComponent buttonName="채팅방생성" mappingUrl="chat" />
            <div>
                <table className="table table-bordered" style={{backgroundColor: 'gray', width: '500px', height: '500px'}}>
                    <thead>
                        <tr>
                            <th>참여자</th>
                        </tr>
                    </thead>
                    <tbody>
                        {chat.map((item, index) => (
                            <tr key={index}>
                                <td>
                                    {item.chatroomParti.split(',').map((code, idx) => (
                                        <div key={idx} style={{ marginBottom: '5px', display: 'flex', alignItems: 'center' }}>
                                            <img
                                                src={`http://localhost:8787/memberImage/${employeeData[code]?.empImg}`} // 이미지 URL
                                                alt={employeeData[code]?.empName || code}
                                                style={{ width: '100px', height: '100px', borderRadius: '50%', marginRight: '8px' }}
                                            />
                                            <span
                                                onClick={() => handleChatRoomClick(item.chatroomCode)} // 클릭 시 채팅방으로 이동
                                                style={{ cursor: 'pointer', textDecoration: 'underline' }}
                                            >
                                                {employeeData[code]?.empName || code} {/* 사원번호에 대한 이름을 표시 */}
                                            </span>
                                        </div>
                                    ))}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default ChatSunComponent;
