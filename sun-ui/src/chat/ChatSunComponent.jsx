import React, { useEffect, useState } from 'react';
import OrgChatComponent from '../commodule/OrgChatComponent';
import ChatRoomComponent from './ChatRoomPage';  // ChatRoomComponent import

const SOCKET_URL = 'ws://localhost:8787/socket';

const ChatSunComponent = () => {
    const [emp, setEmp] = useState(null);
    const [chat, setChat] = useState([]);
    const [employeeData, setEmployeeData] = useState({});
    const [lastMessage, setLastMessage] = useState({});
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedChatroomCode, setSelectedChatroomCode] = useState(null);  // 선택된 채팅방 코드
    const [socket, setSocket] = useState(null);

    // 사용자 정보 가져오기
    useEffect(() => {
        const value = window.sessionStorage.getItem('user');
        if (value) {
            setEmp(JSON.parse(value));
        }
    }, []);

    // 채팅 목록과 사원 정보 가져오기
    useEffect(() => {
        if (emp && emp.empcode) {
            handleChatRoomCreated();
        }
    }, [emp]);

    // WebSocket 설정
    useEffect(() => {
        if (emp) {
            const ws = new WebSocket(SOCKET_URL);

            ws.onopen = () => {
                console.log('WebSocket connection established');
                ws.send(JSON.stringify({ type: 'JOIN', empCode: emp.empcode }));
            };

            ws.onmessage = (event) => {
                const data = JSON.parse(event.data);

                if (data.type === 'NEW_MESSAGE' && data.chatroomCode) {
                    setLastMessage(prevLastMessage => ({
                        ...prevLastMessage,
                        [data.chatroomCode]: data.message
                    }));
                }

                if (data.type === 'UPDATE_CHAT_LIST') {
                    setChat(data.chatList);
                }
            };

            ws.onerror = (error) => {
                console.error('WebSocket error:', error);
            };

            ws.onclose = () => {
                console.log('WebSocket connection closed');
            };

            setSocket(ws);

            return () => {
                ws.close();
            };
        }
    }, [emp]);

    // 채팅방 생성 후 호출되는 함수
    const handleChatRoomCreated = async () => {
        if (emp && emp.empcode) {
            try {
                const chatResponse = await fetch(`http://localhost:8787/api/chatList?empCode=${emp.empcode}`);
                if (!chatResponse.ok) {
                    throw new Error('Network response was not ok');
                }
                const chatData = await chatResponse.json();
                setChat(chatData);
                console.log(chatData);
                const empCodes = new Set();
                chatData.forEach(item => {
                    item.chatroomParti.split(',').forEach(code => empCodes.add(code));
                });

                const employeeData = {};
                for (const code of empCodes) {
                    try {
                        const empResponse = await fetch(`http://localhost:8787/api/employee/${code}`);
                        if (empResponse.ok) {
                            const empData = await empResponse.json();
                            employeeData[code] = {
                                empName: empData.empName,
                                empDept: empData.deptCode
                            };
                        }
                    } catch (error) {
                        console.error(`Error fetching employee data for code ${code}:`, error);
                    }
                }
                console.log(employeeData);
                setEmployeeData(employeeData);
            } catch (error) {
                console.error('Error fetching chat list:', error);
            }
        }
    };

    // 채팅방 페이지로 이동 대신 모달 열기
    const handleChatRoomClick = (chatroomCode) => {
        setSelectedChatroomCode(chatroomCode);
        setIsModalOpen(true);
    };

    // 모달 닫기
    const closeModal = () => {
        setIsModalOpen(false);
        handleChatRoomCreated();  // 모달 닫힐 때 채팅 목록 갱신
    };

    // 부서명 반환 함수
    const getDeptTitle = (empDept) => {
        switch (empDept) {
            case 1: return '경영총괄';
            case 11: return '경영지원';
            case 21: return '연구개발';
            case 31: return '고객지원';
            case 41: return '운송관리';
            case 51: return '품질관리';
            case 61: return '자재관리';
            case 71: return '생산제조';
            default: return '부서명 없음'; 
        }
    };

    // 마지막 메시지 가져오기
    useEffect(() => {
        const fetchLastMessages = async () => {
            try {
                const lastMessages = {};
                for (const item of chat) {
                    const response = await fetch(`http://localhost:8787/getLastChatMessage?chatroomCode=${item.chatroomCode}`);
                    if (response.ok) {
                        const message = await response.text();
                        lastMessages[item.chatroomCode] = message;
                    }
                }
                setLastMessage(lastMessages);
            } catch (error) {
                console.error('Error fetching last messages:', error);
            }
        };

        if (chat.length > 0) {
            fetchLastMessages();
        }
    }, [chat]);

    return (
        <div>
            <OrgChatComponent 
                buttonName="채팅방생성" 
                mappingUrl="chat" 
                onChatRoomCreated={handleChatRoomCreated} 
                onClose={closeModal}
            />
            <div>
                <table className="table table-bordered" style={{ backgroundColor: 'gray', width: '500px', height: 'flex' }}>
                    <thead>
                        <tr>
                            <th>참여자</th>
                            <th>내용</th>
                        </tr>
                    </thead>
                    <tbody>
                        {chat.map((item, index) => (
                            <tr key={index}>
                                <td style={{ width: '200px', height: '100px' }}>
                                    {item.chatroomParti.split(',').map((code, idx) => (
                                        <div key={idx} style={{ marginBottom: '5px', display: 'flex', alignItems: 'center' }}>
                                            <span
                                                onClick={() => handleChatRoomClick(item.chatroomCode)}  // 클릭 시 모달 열기
                                                style={{ cursor: 'pointer', textDecoration: 'underline' }}
                                            >
                                                {' [' + getDeptTitle(employeeData[code]?.empDept) + ']'}
                                                {employeeData[code]?.empName || code}
                                            </span>
                                        </div>
                                    ))}
                                </td>
                                <td>
                                    {lastMessage[item.chatroomCode] || '최근 메시지가 없습니다.'}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            {isModalOpen && (
                <ChatRoomComponent 
                    show={isModalOpen} 
                    handleClose={closeModal} 
                    chatroomCode={selectedChatroomCode}  // 선택된 채팅방 코드 전달
                />
            )}
        </div>
    );
};

export default ChatSunComponent;
