import React, { useEffect, useState, useCallback } from 'react';
import 'bootstrap-icons/font/bootstrap-icons.css';
import HeaderSearchComponent from './HeaderSearchComponent';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import ChatSunComponent from '../chat/ChatSunComponent';
import SockJS from 'sockjs-client';
import { Client } from '@stomp/stompjs';

const HeaderTopComponent = () => {
  const navigate = useNavigate();
  const [isToggled, setIsToggled] = useState(false);
  const [userName, setUserName] = useState(null);
  const [isChatModalOpen, setIsChatModalOpen] = useState(false);
  const [newMessageCount, setNewMessageCount] = useState(0); // 새로운 메시지 수 상태
  const [chat, setChat] = useState([]);
  const [socket, setSocket] = useState(null);

  const fetchUserInfo = useCallback(() => {
    const userInfo = window.sessionStorage.getItem('user');
    if (userInfo) {
      setUserName(JSON.parse(userInfo));
    }
  }, []);

  useEffect(() => {
    fetchUserInfo();
    handleChatRoomCreated();
  }, [fetchUserInfo]);

  useEffect(() => {
    const sidebarToggle = document.body.querySelector('#sidebarToggle');
    if (sidebarToggle) {
      if (localStorage.getItem('sb|sidebar-toggle') === 'true') {
        document.body.classList.add('sb-sidenav-toggled');
      }

      const toggleSidebar = (event) => {
        event.preventDefault();
        document.body.classList.toggle('sb-sidenav-toggled');
        localStorage.setItem('sb|sidebar-toggle', document.body.classList.contains('sb-sidenav-toggled'));
      };

      sidebarToggle.addEventListener('click', toggleSidebar);

      return () => {
        sidebarToggle.removeEventListener('click', toggleSidebar);
      };
    }

    const dropdownElementList = [].slice.call(document.querySelectorAll('.dropdown-toggle'));
    dropdownElementList.map((dropdownToggleEl) => {
      return new window.bootstrap.Dropdown(dropdownToggleEl);
    });
  }, []);
  // WebSocket 설정 및 메시지 처리
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
            console.log('STOMP connected');
            chat.forEach((room) => {
                client.subscribe(`/topic/chatRoom/${room.chatroomCode}`, (message) => {
                    try {
                        const parsedMessage = JSON.parse(message.body);                        
                        if (parsedMessage.chatSender !== userName.empName && isChatModalOpen == false) { // 필터링 조건
                          handleNewMessage();
                        }
                    } catch (error) {
                        console.error('Error processing STOMP message:', error);
                    }
                });
            });
            client.subscribe('/topic/newChat', (message) => {
                console.log('New chat room created:', message.body);

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

}, [chat, isChatModalOpen, userName]);
useEffect(() => {
  if (userName) {
    handleChatRoomCreated();
  }
}, [userName]); 

  const handleChatRoomCreated = async () => {
    try {
        const chatResponse = await fetch(`http://localhost:8787/api/chatList2?empCode=${userName.empcode}`);
        if (!chatResponse.ok) {
            throw new Error('Network response was not ok');
        }
        const chatData = await chatResponse.json();
        setChat(chatData);
    } catch (error) {
        console.error('Error fetching chat list:', error);
    }
  };
  const handleToggleClick = useCallback((event) => {
    event.preventDefault();
    setIsToggled((prevState) => !prevState);
  }, []);

  const handleLogout = async () => {
    try {
      await axios.post('http://localhost:8787/logout', {}, { withCredentials: true });
      setIsChatModalOpen(false);
      window.sessionStorage.removeItem("user");
      setUserName(null); 
      alert('로그아웃 완료');
      navigate('/'); 
    } catch (error) {
      console.error('로그아웃 에러:', error);
    }
  };

  const sessionChk = useCallback(() => {
    const session = window.sessionStorage.getItem('user');
    if(session === null) {
      console.log("세션이 존재하지 않습니다.");
    } else {
      console.log("세션이 존재합니다.");
    }
  }, []);

  const openChatModal = () => {
    if(isChatModalOpen==true){
      setIsChatModalOpen(false);
    }else{
      setIsChatModalOpen(true);
    }
    setNewMessageCount(0); // 채팅 모달을 열 때 알림 숫자를 초기화
  };

  

  const handleNewMessage = () => {
    setNewMessageCount(prevCount => prevCount + 1);
  };

  return (
    <nav className="sb-topnav navbar navbar-expand navbar-dark bg-dark">
      <a className="navbar-brand ps-3" href="/home" onClick={sessionChk}>SUN Company</a>
      <button 
        className="btn btn-link btn-sm order-1 order-lg-0 me-4 me-lg-0" 
        id="sidebarToggle" 
        href="/#" 
        onClick={handleToggleClick}
      >
        {isToggled ? <i className="bi bi-chevron-double-right"></i> : <i className="bi bi-chevron-double-left"></i>}
      </button>

      <div>
        {userName ? (
          <div style={{ color: 'white', marginLeft: 30 }}>
            {userName.empName}님, 반갑습니다
          </div>
        ) : (
          <div style={{ color: 'white', marginLeft: 30 }}></div>
        )}
      </div>

      <HeaderSearchComponent style={{ marginRight: 80 }} />
      <button 
        onClick={openChatModal} 
        style={{ color: 'white', background: 'none', border: 'none', marginRight: 0, cursor: 'pointer', position: 'relative' }}
      >
        <i className="bi bi-chat-dots-fill"></i> 채팅
        {newMessageCount > 0 && (
          <span className="badge bg-danger" style={{ position: 'absolute', top: '-10px', right: '-10px', fontSize: '0.6rem' }}>
            {newMessageCount}
          </span>
        )}
      </button>
      <Link to='/myPage' style={{ color: 'white', textDecorationLine: 'none', marginRight: 20 }}>
        <i className="bi bi-person-circle"></i> 마이페이지
      </Link>
      
      {userName && (
        <Link 
          to='/' 
          onClick={handleLogout} 
          style={{ color: 'white', textDecorationLine: 'none', marginRight: 20 }}
        >
          <i className="bi bi-person-fill-slash"></i> 로그아웃
        </Link>
      )}

      {isChatModalOpen && (
        <div style={{
                position: 'fixed',
                top: '10%',
                right: '0px',
                width: '550px',
                height: '84%',
                border: '1px solid #ccc',
                boxShadow: '0px 0px 10px rgba(0,0,0,0.2)',
                backgroundColor: '#fafafa',
                zIndex: 1050,
                display: 'block' 
          }}  
          role="dialog" 
          tabIndex="-1" 
          data-bs-backdrop="static"
        >
          <div className="modal-dialog modal-dialog-scrollable modal-lg">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">채팅</h5>
              </div>
              <div className="modal-body">
                <ChatSunComponent/>
              </div>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default HeaderTopComponent;