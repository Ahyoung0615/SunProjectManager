import React, { useEffect, useState, useRef } from 'react';
import { useParams } from 'react-router-dom';
import SockJS from 'sockjs-client';
import { Client } from '@stomp/stompjs';
import Modal from 'react-modal';

// Modal 스타일을 위한 기본 설정
Modal.setAppElement('#root'); // 'root'는 앱의 루트 요소 ID입니다.

const ChatRoomModal = ({ isOpen, onRequestClose }) => {
    const { chatroomCode } = useParams();
    const [messages, setMessages] = useState([]);
    const [inputMessage, setInputMessage] = useState('');
    const [stompClient, setStompClient] = useState(null);
    const [emp, setEmp] = useState(null);
    const [isConnected, setIsConnected] = useState(false);

    const messagesEndRef = useRef(null);

    // 사용자 정보 로드
    useEffect(() => {
        const value = window.sessionStorage.getItem('user');
        if (value) {
            setEmp(JSON.parse(value));
            console.log('Loaded user from session storage:', JSON.parse(value));
        } else {
            console.warn('No user data found in session storage');
        }
    }, []);

    // 메시지 로딩
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

    useEffect(() => {
        if (chatroomCode) {
            fetchMessages();
        }
    }, [chatroomCode]);

    // WebSocket 연결 및 메시지 수신
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

    // 메시지 전송
    const handleSendMessage = () => {
        if (stompClient && isConnected && inputMessage.trim() !== '') {
            const now = new Date();
            const koreaOffset = 9 * 60; // 9시간을 분으로 변환
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

            setInputMessage(''); // 메시지 전송 후 입력 필드 초기화
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

    // 메시지 영역 스크롤
    useEffect(() => {
        if (messagesEndRef.current) {
            messagesEndRef.current.scrollIntoView({ behavior: 'smooth', block: 'end' });
        }
    }, [messages]);

    // 시간을 "오전/오후 시:분" 형식으로 변환하는 함수
    const formatTime = (chatTime) => {
        const date = new Date(chatTime);
        const hours = date.getHours();
        const minutes = date.getMinutes();
        const ampm = hours >= 12 ? '오후' : '오전';
        const formattedHours = hours % 12 || 12;
        const formattedMinutes = minutes < 10 ? `0${minutes}` : minutes;

        return `${ampm} ${formattedHours}시 ${formattedMinutes}분`;
    };

    return (
        <Modal
            isOpen={isOpen}
            onRequestClose={onRequestClose}
            contentLabel="Chat Room"
            style={{
                content: {
                    top: '50%',
                    left: '50%',
                    right: 'auto',
                    bottom: 'auto',
                    transform: 'translate(-50%, -50%)',
                    width: '80%',
                    height: '80%',
                    padding: '20px',
                    border: '1px solid #ccc',
                    borderRadius: '10px',
                    overflowY: 'auto'
                }
            }}
        >
            <h2>Chat Room: {chatroomCode}</h2>
            <div
                style={{
                    border: '1px solid #ccc',
                    padding: '10px',
                    marginBottom: '10px',
                    width: '100%',
                    height: '60%',
                    overflowY: 'scroll'
                }}
            >
                {messages.map((message, index) => (
                    <div
                        key={index}
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
                                textAlign: 'left'
                            }}
                        >
                            <div>{message.chatContent}</div>
                            <div style={{ fontSize: '0.8em', color: 'gray', marginTop: '5px' }}>
                                {formatTime(message.chatTime)}
                            </div>
                        </div>
                    </div>
                ))}
                <div ref={messagesEndRef} />
            </div>
            <div>
                <input
                    type="text"
                    value={inputMessage}
                    onChange={(e) => setInputMessage(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder="Enter your message..."
                    style={{ width: '68%', marginRight: '10px' }}
                />
                <button onClick={handleSendMessage}>Send</button>
            </div>
            <button onClick={onRequestClose} style={{ marginTop: '10px' }}>Close</button>
        </Modal>
    );
};

export default ChatRoomModal;
