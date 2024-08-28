import React, { useEffect, useState, useRef } from 'react';
import { Modal, Button } from 'react-bootstrap';
import SockJS from 'sockjs-client';
import { Client } from '@stomp/stompjs';

const ChatRoomPage = ({ show, handleClose, chatroomCode ,onUpdateChatRoomList}) => {
    const [messages, setMessages] = useState([]);
    const [inputMessage, setInputMessage] = useState('');
    const [stompClient, setStompClient] = useState(null);
    const [emp, setEmp] = useState(null);
    const [isConnected, setIsConnected] = useState(false);
    const [participants, setParticipants] = useState([]);
    const [employeeData, setEmployeeData] = useState({});
    const [opponentName, setOpponentName] = useState('');
    const [opponentDeptTitle, setOpponentDeptTitle] = useState('');
    const messagesEndRef = useRef(null);

    useEffect(() => {
        const value = window.sessionStorage.getItem('user');
        if (value) {
            setEmp(JSON.parse(value));
        } else {
            console.warn('No user data found in session storage');
        }
        console.log(chatroomCode);
        fetchParticipants();
    }, []);

    const fetchMessages = async () => {
        try {
            const response = await fetch(`http://localhost:8787/chatList?chatroomCode=${chatroomCode}`);
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            const data = await response.json();
            setMessages(data);
        } catch (error) {
            console.error('Error fetching chat messages:', error);
        }
    };

    const fetchParticipants = async () => {
        try {
            const chatResponse = await fetch(`http://localhost:8787/api/partiList?chatroomCode=${chatroomCode}`);
            if (!chatResponse.ok) {
                throw new Error('Network response was not ok');
            }
            const chatData = await chatResponse.json();
            setParticipants(chatData);
            const empCodes = new Set();
            chatData.forEach(item => {
                item.chatroomParti.split(',').forEach(code => empCodes.add(code));
            });

            console.log(empCodes);
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
            console.log(employeeData);
            if (Object.keys(employeeData).length > 0) {
                // 현재 사용자의 empCode를 가져옵니다.
                const currentEmpCode = emp?.empcode;

                // 현재 사용자의 empCode를 제외한 나머지 직원 데이터를 필터링합니다.
                const filteredEmployeeData = Object.keys(employeeData)
                    .filter(empCode => empCode !== currentEmpCode) // 현재 사용자의 empCode를 제외
                    .reduce((acc, empCode) => {
                        acc[empCode] = employeeData[empCode];
                        return acc;
                    }, {});

                // 필터링된 직원 목록이 비어 있지 않은 경우
                if (Object.keys(filteredEmployeeData).length > 0) {
                    const firstOpponentCode = Object.keys(filteredEmployeeData)[0];
                    const opponent = filteredEmployeeData[firstOpponentCode];
                    setOpponentName(opponent.empName);
                    setOpponentDeptTitle(getDeptTitle(opponent.empDept));
                }
            }
        } catch (error) {
            console.error('Error fetching chat participants:', error);
        }
    };

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

    useEffect(() => {
        if (emp) {
            fetchMessages();
            fetchParticipants();
        }
    }, [emp , chatroomCode]);

    useEffect(() => {
        const socket = new SockJS('http://localhost:8787/ws');
        const client = new Client({
            webSocketFactory: () => socket,
            connectHeaders: {},
            debug: (str) => console.log('STOMP debug:', str),
            reconnectDelay: 5000,
            heartbeatIncoming: 4000,
            heartbeatOutgoing: 4000,
            onConnect: () => {
                setIsConnected(true);
                client.subscribe(`/topic/chatRoom/${chatroomCode}`, (message) => {
                    try {
                        const parsedMessage = JSON.parse(message.body);
                        setMessages((prevMessages) => {
                            if (!prevMessages.some(msg => msg.chatCode === parsedMessage.chatCode)) {
                                return [...prevMessages, parsedMessage];
                            }
                            fetchMessages();
                            return prevMessages;
                        });
                    } catch (error) {
                        console.error('Error parsing message:', error);
                    }
                });
            },
            onStompError: (frame) => {
                console.error('STOMP error:', frame.headers['message']);
                console.error('STOMP error details:', frame.body);
                setIsConnected(false);
            },
            onWebSocketError: (error) => {
                console.error('WebSocket error:', error);
                setIsConnected(false);
            }
        });

        client.activate();
        setStompClient(client);

        return () => {
            if (client) {
                client.deactivate();
            }
        };
    }, [chatroomCode]);

    const handleSendMessage = () => {
        if (stompClient && isConnected && inputMessage.trim() !== '') {
            const now = new Date();
            const koreaOffset = 9 * 60;
            const koreaTime = new Date(now.getTime() + koreaOffset * 60 * 1000);
            const chatTime = koreaTime.toISOString();

            const chatMessage = {
                chatroomCode: parseInt(chatroomCode, 10),
                chatContent: inputMessage,
                chatSender: emp?.empName || 'Anonymous',
                chatTime: chatTime
            };

            stompClient.publish({
                destination: `/app/chat.sendMessage/${chatroomCode}`,
                body: JSON.stringify(chatMessage),
                headers: {
                    'content-type': 'application/json'
                }
            });

            setInputMessage('');
            // 부모 컴포넌트의 콜백 함수 호출
            if (onUpdateChatRoomList) {
                onUpdateChatRoomList();
            }
        } else {
            console.warn('Cannot send message. STOMP client is not connected.');
        }
    };

    const handleKeyDown = (event) => {
        if (event.key === 'Enter') {
            event.preventDefault();
            handleSendMessage();
        }
    };

    useEffect(() => {
        if (messagesEndRef.current) {
            messagesEndRef.current.scrollIntoView({ block: 'end' });
        }
    }, [messages]);

    const formatTime = (chatTime) => {
        const date = new Date(chatTime);
        const hours = date.getHours();
        const minutes = date.getMinutes();
        const ampm = hours >= 12 ? '오후' : '오전';
        const formattedHours = hours % 12 || 12;
        const formattedMinutes = minutes < 10 ? `0${minutes}` : minutes;
        
        return `${ampm} ${formattedHours}시 ${formattedMinutes}분`;
    };

    const formatDate = (chatTime) => {
        const date = new Date(chatTime);
        return `${date.getFullYear()}년 ${date.getMonth() + 1}월 ${date.getDate()}일`;
    };

    return (
        <div
            style={{
                position: 'fixed',
                top: '10%',
                right: '0',
                width: '400px',
                height: '79%',
                border: '1px solid #ccc',
                boxShadow: '0px 0px 10px rgba(0,0,0,0.2)',
                backgroundColor: 'white',
                zIndex: 1050, // Bootstrap modal default z-index is 1050
                display: show ? 'block' : 'none'
            }}
        >
            <div
                style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    padding: '10px',
                    borderBottom: '1px solid #ddd',
                    backgroundColor: '#f8f9fa'
                }}
            >
                <span>{`[${opponentDeptTitle || '부서명 없음'}] ${opponentName || '불명'}`}</span>
                <button
                    onClick={handleClose}
                    style={{
                        border: 'none',
                        background: 'transparent',
                        fontSize: '20px',
                        cursor: 'pointer'
                    }}
                >
                    &times;
                </button>
            </div>
            <div
                style={{
                    padding: '10px',
                    height: 'calc(100% - 80px)',
                    overflowY: 'scroll',
                    borderBottom: '1px solid #ddd'
                }}
            >
                {messages.map((message, index) => {
                    const showDateLabel =
                        index === 0 || 
                        new Date(messages[index - 1].chatTime).toDateString() !== new Date(message.chatTime).toDateString();

                    return (
                        <div key={index}>
                            {showDateLabel && (
                                <div
                                    style={{
                                        textAlign: 'center',
                                        margin: '10px 0',
                                        color: 'gray',
                                        fontWeight: 'bold'
                                    }}
                                >
                                    {formatDate(message.chatTime)}
                                </div>
                            )}
                            <div
                                style={{
                                    display: 'flex',
                                    justifyContent: message.chatSender === emp?.empName ? 'flex-end' : 'flex-start',
                                    marginBottom: '10px'
                                }}
                            >
                                <div
                                    style={{
                                        padding: '10px',
                                        borderRadius: '10px',
                                        backgroundColor: message.chatSender === emp?.empName ? '#dcf8c6' : '#fff',
                                        boxShadow: '0px 1px 3px rgba(0,0,0,0.2)',
                                        maxWidth: '70%',
                                        textAlign: 'left',
                                        wordBreak: 'break-word', // 긴 단어 자동 줄 바꿈
                                        overflowWrap: 'break-word', // 긴 단어 자동 줄 바꿈
                                        whiteSpace: 'pre-wrap' // 줄 바꿈과 공백을 유지
                                    }}
                                >
                                    <div>{message.chatContent}</div>
                                    <div style={{ fontSize: '0.8em', color: 'gray', marginTop: '5px' }}>
                                        {formatTime(message.chatTime)}
                                    </div>
                                </div>
                            </div>
                        </div>
                    );
                })}
                <div ref={messagesEndRef} />
            </div>
            <div
                style={{
                    display: 'flex',
                    alignItems: 'center',
                    padding: '10px',
                    borderTop: '1px solid #ddd',
                    backgroundColor: '#f8f9fa'
                }}
            >
                <textarea
                    value={inputMessage}
                    onChange={(e) => setInputMessage(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder="메시지를 입력하세요"
                    style={{
                        width: '80%',
                        marginRight: '10px',
                        resize: 'none', // 사용자가 크기를 조절할 수 없게 설정
                        overflowY: 'auto', // 수직 스크롤을 가능하게 하되 스크롤바는 숨김
                        overflowX: 'hidden', // 수평 스크롤 숨기기
                        height: '30px',
                        minHeight: '50px', // 최소 높이 설정
                        maxHeight: '200px', // 최대 높이 설정
                        padding: '10px', // 패딩 추가
                        boxSizing: 'border-box', // 패딩과 테두리가 높이와 너비에 포함되도록 설정
                        scrollbarWidth: 'none', // Firefox에서 스크롤바 숨기기
                        msOverflowStyle: 'none' // IE 및 Edge에서 스크롤바 숨기기
                    }}
                />
                <Button onClick={handleSendMessage}>전송</Button>
            </div>
        </div>
    );
};

export default ChatRoomPage;
