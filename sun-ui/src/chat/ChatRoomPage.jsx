import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import SockJS from 'sockjs-client';
import { Client } from '@stomp/stompjs';

const ChatRoomComponent = () => {
    const { chatroomCode } = useParams();
    const [messages, setMessages] = useState([]);
    const [inputMessage, setInputMessage] = useState('');
    const [stompClient, setStompClient] = useState(null);
    const [emp, setEmp] = useState(null);
    const [isConnected, setIsConnected] = useState(false);

    useEffect(() => {
        const value = window.sessionStorage.getItem('user');
        if (value) {
            setEmp(JSON.parse(value));
        }
    }, []);

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
                console.log('Connected to WebSocket');
                setIsConnected(true);
                client.subscribe(`/topic/chatRoom/${chatroomCode}`, (message) => {
                    console.log('Received message:', message.body);
                    try {
                        const parsedMessage = JSON.parse(message.body);
                        setMessages((prevMessages) => [...prevMessages, parsedMessage]);
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
            const chatMessage = {
                chatCode: 0,
                chatroomCode: parseInt(chatroomCode, 10),
                chatContent: inputMessage,
                chatSender: emp?.empName || 'Anonymous',
                chatTime: new Date().toISOString()
            };

            console.log('Sending message:', chatMessage);
            stompClient.publish({
                destination: `/app/chat.sendMessage/${chatroomCode}`,
                body: JSON.stringify(chatMessage),
                headers: {
                    'content-type': 'application/json'
                }
            });
            setInputMessage('');
        } else {
            console.warn('Cannot send message. STOMP client is not connected.');
        }
    };

    return (
        <div>
            <h2>Chat Room: {chatroomCode}</h2>
            <div style={{ border: '1px solid #ccc', padding: '10px', marginBottom: '10px',width: '56.5%' ,height: '400px', overflowY: 'scroll' }}>
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
                            <strong>{message.chatSender}:</strong> {message.chatContent}
                        </div>
                    </div>
                ))}
            </div>
            <div>
                <input
                    type="text"
                    value={inputMessage}
                    onChange={(e) => setInputMessage(e.target.value)}
                    placeholder="Enter your message..."
                    style={{ width: '50%', marginRight: '10px' }}
                />
                <button onClick={handleSendMessage}>Send</button>
            </div>
        </div>
    );
};

export default ChatRoomComponent;
