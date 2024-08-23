import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom'; 
import OrgChatComponent from '../commodule/OrgChatComponent';

// WebSocket URL (서버의 WebSocket 엔드포인트)
const SOCKET_URL = 'ws://localhost:8787/socket';

const ChatSunComponent = () => {
    const [emp, setEmp] = useState(null); // 현재 로그인된 사용자의 정보
    const [chat, setChat] = useState([]); // 채팅방 목록
    const [employeeData, setEmployeeData] = useState({}); // 사원번호와 사원 정보를 매핑
    const [lastMessage, setLastMessage] = useState({}); // 마지막 메시지를 저장할 상태 변수
    const navigate = useNavigate(); 
    const [socket, setSocket] = useState(null);

    // 사용자 정보를 가져와 상태에 설정
    useEffect(() => {
        const value = window.sessionStorage.getItem('user');
        if (value) {
            setEmp(JSON.parse(value)); // JSON 문자열을 객체로 변환하여 상태에 저장
        }
    }, []); 

    // 채팅 목록과 사원 정보를 가져오는 비동기 작업 수행
    useEffect(() => {
        if (emp && emp.empcode) {
            const fetchData = async () => {
                try {
                    // 채팅방 목록을 가져오기 위한 API 호출
                    const chatResponse = await fetch(`http://localhost:8787/api/chatList?empCode=${emp.empcode}`);
                    if (!chatResponse.ok) {
                        throw new Error('Network response was not ok');
                    }
                    const chatData = await chatResponse.json();
                    setChat(chatData); // 채팅 목록 상태에 저장

                    // 참여자 사원번호 수집
                    const empCodes = new Set();
                    chatData.forEach(item => {
                        item.chatroomParti.split(',').forEach(code => empCodes.add(code));
                    });

                    // 사원번호로 사원 정보 가져오기
                    const fetchEmployeeData = async () => {
                        const data = {};
                        for (const code of empCodes) {
                            const empResponse = await fetch(`http://localhost:8787/api/employee/${code}`);
                            if (empResponse.ok) {
                                const empData = await empResponse.json();
                                data[code] = {
                                    empName: empData.empName,
                                    empDept: empData.deptCode
                                };
                            }
                        }
                        setEmployeeData(data); // 사원 정보 상태에 저장
                    };

                    fetchEmployeeData();

                } catch (error) {
                    console.error('Error fetching chat list:', error); // 오류가 발생하면 콘솔에 출력
                }
            };

            fetchData();
        }
    }, [emp]); // `emp`가 변경될 때마다 데이터 재요청

    // WebSocket 연결 설정
    useEffect(() => {
        if (emp) {
            const ws = new WebSocket(SOCKET_URL);

            ws.onopen = () => {
                console.log('WebSocket connection established');
                // 로그인된 사용자의 정보를 서버에 전송 (필요시)
                ws.send(JSON.stringify({ type: 'JOIN', empCode: emp.empcode }));
            };

            ws.onmessage = (event) => {
                const data = JSON.parse(event.data);

                // 서버에서 받은 메시지에 따라 상태 업데이트
                if (data.type === 'NEW_MESSAGE' && data.chatroomCode) {
                    setLastMessage(prevLastMessage => ({
                        ...prevLastMessage,
                        [data.chatroomCode]: data.message
                    }));
                }

                // 서버에서 채팅방 목록 업데이트가 필요하다면 처리
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

            // 컴포넌트 언마운트 시 WebSocket 연결 종료
            return () => {
                ws.close();
            };
        }
    }, [emp]); // `emp`가 변경될 때마다 WebSocket 연결 재설정

    // 채팅방 페이지로 이동하는 함수
    const handleChatRoomClick = (chatroomCode) => {
        window.open(
            `/chatRoom/${chatroomCode}`,
            '채팅방',
            'width=500,height=600'
        );
    };

    // 부서 코드에 따라 부서명을 반환하는 함수
    const getDeptTitle = (empDept) => {
        switch (empDept) {
            case 1:
                return '경영총괄';
            case 11:
                return '경영지원';
            case 21:
                return '연구개발';
            case 31:
                return '고객지원';
            case 41:
                return '운송관리';
            case 51:
                return '품질관리';
            case 61:
                return '자재관리';
            case 71:
                return '생산제조';
            default:
                return '부서명 없음'; 
        }
    };

    // 각 채팅방의 마지막 메시지를 가져오는 비동기 작업 수행
    useEffect(() => {
        const fetchLastMessages = async () => {
            try {
                const lastMessages = {};
                for (const item of chat) {
                    const response = await fetch(`http://localhost:8787/getLastChatMessage?chatroomCode=${item.chatroomCode}`);
                    if (response.ok) {
                        const message = await response.text(); // 마지막 메시지 문자열을 가져오기
                        lastMessages[item.chatroomCode] = message;
                    }
                }
                if (JSON.stringify(lastMessages) !== JSON.stringify(lastMessage)) {
                    setLastMessage(lastMessages); // 마지막 메시지 상태에 저장
                }
            } catch (error) {
                console.error('Error fetching last messages:', error); // 오류가 발생하면 콘솔에 출력
            }
        };

        if (chat.length > 0) {
            fetchLastMessages();
        }
    }, [chat, lastMessage] ); // `chat`이 변경될 때마다 마지막 메시지 가져오기

    return (
        <div>
            <OrgChatComponent buttonName="채팅방생성" mappingUrl="chat" /> {/* 채팅방 생성 버튼 */}
            <div>
                <table className="table table-bordered" style={{ backgroundColor: 'gray', width: '500px', height: 'flex' }}>
                    <thead>
                        <tr>
                            <th>참여자</th>
                            <th>내용</th>
                        </tr>
                    </thead>
                    <tbody>
                        {/* 채팅 목록을 테이블로 렌더링 */}
                        {chat.map((item, index) => (
                            <tr key={index}>
                                <td style={{ width: '200px', height: '100px' }}>
                                    {/* 참여자의 사원번호를 기반으로 사원 정보 렌더링 */}
                                    {item.chatroomParti.split(',').map((code, idx) => (
                                        <div key={idx} style={{ marginBottom: '5px', display: 'flex', alignItems: 'center', border: '1px' }}>
                                            <span
                                                onClick={() => handleChatRoomClick(item.chatroomCode)} // 클릭 시 채팅방으로 이동
                                                style={{ cursor: 'pointer', textDecoration: 'underline', marginTop: 'center' }}
                                            >
                                                {' [' + getDeptTitle(employeeData[code]?.empDept) + ']'} {/* 부서명을 표시 */}
                                                {employeeData[code]?.empName || code} {/* 사원번호에 대한 이름을 표시 */}
                                            </span>
                                        </div>
                                    ))}
                                </td>
                                <td>
                                    {/* 마지막 메시지 표시 */}
                                    {lastMessage[item.chatroomCode] || '최근 메시지가 없습니다.'}
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
