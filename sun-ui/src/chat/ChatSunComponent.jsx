import React, { useEffect, useState } from 'react';
import OrgChatComponent from '../commodule/OrgChatComponent';
import ChatRoomComponent from './ChatRoomPage'; // ChatRoomComponent import
import 'bootstrap/dist/css/bootstrap.min.css'; // Import Bootstrap CSS
import SockJS from 'sockjs-client';
import { Client } from '@stomp/stompjs';

const SOCKET_URL = 'ws://localhost:8787/socket';

const ChatSunComponent = () => {
    const [emp, setEmp] = useState(null);
    const [chat, setChat] = useState([]);
    const [employeeData, setEmployeeData] = useState({});
    const [lastMessage, setLastMessage] = useState({});
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [newMessageCounts, setNewMessageCounts] = useState({});
    const [selectedChatroomCode, setSelectedChatroomCode] = useState(null);
    const [socket, setSocket] = useState(null);

    // 사용자 정보 가져오기
    useEffect(() => {
        const value = window.sessionStorage.getItem('user');
        if (value) {
            setEmp(JSON.parse(value));
        }
    }, []);

    const updateChatRoomList = () => {
        // 채팅방 목록을 다시 불러오거나 업데이트하는 로직을 구현합니다.
        handleChatRoomCreated();
    };

    // 채팅 목록과 사원 정보 가져오기
    useEffect(() => {
        if (emp && emp.empcode) {
            updateChatRoomList();
        }
    }, [emp ,selectedChatroomCode]);

    // WebSocket 설정 및 메시지 처리
    useEffect(() => {
        if (emp) {
            const socket = new SockJS('http://localhost:8787/ws');
            const client = new Client({
                webSocketFactory: () => socket,
                connectHeaders: {},
                debug: (str) => console.log('STOMP debug:', str),
                reconnectDelay: 5000,
                heartbeatIncoming: 4000,
                heartbeatOutgoing: 4000,
                onConnect: () => {
                    console.log('STOMP connected');
                    chat.forEach((room) => {
                        client.subscribe(`/topic/chatRoom/${room.chatroomCode}`, (message) => {
                            try {
                                
                                const parsedMessage = JSON.parse(message.body);                        
                                if (parsedMessage.chatSender !== emp.empName) { // 필터링 조건
                                    handleNewMessage(room.chatroomCode);
                                }
                                updateChatRoomList();

                            } catch (error) {
                                console.error('Error processing STOMP message:', error);
                            }
                        });
                    });
                    client.subscribe('/topic/newChat', (message) => {
                        console.log('New chat room created:', message.body);
                        updateChatRoomList(); // 새로운 채팅방이 생성되면 채팅방 목록 갱신
                    });

                },
                onStompError: (frame) => {
                    console.error('STOMP error:', frame.headers['message']);
                    console.error('STOMP error details:', frame.body);
                },
                onWebSocketError: (error) => {
                    console.error('WebSocket error:', error);
                }
            });
    
            client.activate();
            setSocket(client);
    
            return () => {
                if (client) {
                    client.deactivate();
                }
            };
        }
    }, [emp, chat]);
    
    const handleNewMessage = (chatroomCode) => { 
        setNewMessageCounts(prevCounts => ({
            ...prevCounts,
            [chatroomCode]: (prevCounts[chatroomCode] || 0) + 1
        }));
    };
    
    // 채팅방 생성 후 호출되는 함수
    const handleChatRoomCreated = async () => {
        if (emp && emp.empcode) {
            try {
                const chatResponse = await fetch(`http://localhost:8787/api/chatList2?empCode=${emp.empcode}`);
                if (!chatResponse.ok) {
                    throw new Error('Network response was not ok');
                }
                const chatData = await chatResponse.json();
                setChat(chatData);

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
                setEmployeeData(employeeData);

            } catch (error) {
                console.error('Error fetching chat list:', error);
            }
        }
    };

    // 채팅방 페이지로 이동 대신 모달 열기
    const handleChatRoomClick = (chatroomCode) => {
        setIsModalOpen(false);
        setNewMessageCounts(prevCounts => ({
            ...prevCounts,
            [chatroomCode]: 0 // 클릭 시 알림 수를 0으로 초기화
        }));
        setSelectedChatroomCode(chatroomCode);
        setIsModalOpen(true);
    };

    // 모달 닫기 및 채팅 목록 갱신
    const closeModal = () => {
        setIsModalOpen(false);
        handleChatRoomCreated(); // 모달 닫힐 때 채팅 목록 갱신
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

    return (
        <div style={{ backgroundColor: '#fafafa', padding: '10px', borderRadius: '8px' }}>
            <OrgChatComponent 
                buttonName="채팅방 생성" 
                mappingUrl="chat" 
                onChatRoomCreated={handleChatRoomCreated} 
                onClose={closeModal}
                maxSelection="1"
            />
            <div 
                className="list-group" 
                style={{
                    width: '140px', 
                    height: '800px', 
                    backgroundColor: '#ffffff', 
                    borderRadius: '10px',
                    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
                    overflowY: 'auto'
                }}
            >
                {chat.map((item, index) => (
                    <button
                        key={index}
                        type="button"
                        className="list-group-item list-group-item-action"
                        style={{
                            backgroundColor: item.chatroomCode === selectedChatroomCode ? '#0095f6' : '#ffffff',
                            color: item.chatroomCode === selectedChatroomCode ? '#ffffff' : '#262626',
                            border: 'none',
                            padding: '10px',
                            marginBottom: '5px',
                            borderRadius: '8px',
                        }}
                        onClick={() => handleChatRoomClick(item.chatroomCode)}
                    >
                        <div className="d-flex w-100 justify-content-between">
                            <h5 className="mb-1" style={{ fontSize: '14px', fontWeight: '500' }}>
                                {item.chatroomParti.split(',').map((code, idx) => (
                                    <span key={idx}>
                                        <span style={{ color: '#8e8e8e' }}>
                                            {' [' + getDeptTitle(employeeData[code]?.empDept) + '] '}
                                        </span>
                                        {employeeData[code]?.empName || code}
                                    </span>
                                ))}
                            </h5>
                            <small style={{ color: item.chatroomCode === selectedChatroomCode ? '#ffffff' : '#8e8e8e' }}>
                                {item.chatTime}
                            </small>
                            {newMessageCounts[item.chatroomCode] > 0 && (
                                <span className="badge bg-danger" style={{ position: 'absolute', top: '0px', right: '0px', fontSize: '0.6rem' }}>
                                    {newMessageCounts[item.chatroomCode]}
                                </span>
                            )}
                        </div>
                    </button>
                ))}
            </div>
            {isModalOpen && (
                <ChatRoomComponent 
                    show={isModalOpen} 
                    handleClose={closeModal} 
                    chatroomCode={selectedChatroomCode} // 선택된 채팅방 코드 전달
                    onUpdateChatRoomList={updateChatRoomList}
                />
            )}
        </div>
    );
    
};

export default ChatSunComponent;
