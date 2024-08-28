import React, { useEffect, useState } from 'react';
import DateTimeComponent from '../commodule/DateTimeComponent';
import axios from 'axios';
import { Card, Form, Button, Row, Col } from 'react-bootstrap';
import Swal from 'sweetalert2';
import { useNavigate } from 'react-router-dom';
import OrgChartComponent from '../commodule/OrgChartComponent';

const MinutesFormComponent = () => {
    const [minutesAttendees, setMinutesAttendees] = useState("");
    const [meetroomCode, setMeetroomCode] = useState("");
    const [minutesDate, setMinutesDate] = useState(new Date());
    const [userCode, setUserCode] = useState('');
    const [username, setUsername] = useState('');
    const [text, setText] = useState('');
    const [summary, setSummary] = useState('');
    const [title, setTitle] = useState('');
    const [isTextValid, setIsTextValid] = useState(true);
    const [isSummaryVisible, setIsSummaryVisible] = useState(false);
    const maxCharCount = 2000;
    const [attendeesList, setAttendeesList] = useState();
    const [selectedEmployees, setSelectedEmployees] = useState([]);

    const navigate = useNavigate();

    useEffect(() => {
        const value = window.sessionStorage.getItem('user');
        if (value) {
            const parsedEmployee = JSON.parse(value);
            setUsername(parsedEmployee.empName);
            setUserCode(parsedEmployee.empcode);
        }
    }, []);

    const handleSelectedEmployees = (employees) => {
        setSelectedEmployees(employees);
    };

    const MapselectedEmployees = selectedEmployees.reduce((acc, employee) => {
        acc[employee.empCode] = employee.empName;
        return acc;
    }, {});

    const handleSummarize = async () => {
        if (text.length > maxCharCount) {
            return;
        }

        Swal.fire({
            title: "AI 요약을 실행하시겠습니까?",
            text: "모든 회의 내용을 작성 후에 실행해주세요",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "실행",
            cancelButtonText: "취소"
        }).then(async (result) => {
            if (result.isConfirmed) {
                try {
                    const requestBody = {
                        document: {
                            title: title,
                            content: text,
                        },
                        option: {
                            language: "ko",
                            model: "general",
                            tone: 0,
                            summaryCount: 3
                        }
                    };

                    const response = await axios.post(
                        'http://localhost:8787/api/summary',
                        requestBody
                    );

                    setSummary(response.data.summary);
                    setIsSummaryVisible(true); // 요약 결과를 보여줌

                    Swal.fire({
                        title: "성공!",
                        text: "요약 완료",
                        icon: "success"
                    });
                } catch (error) {
                    console.error('Error fetching summary:', error);
                    setSummary('요약 생성 중 오류가 발생했습니다.');
                    setIsSummaryVisible(true); // 오류 메시지를 보여줌

                    Swal.fire({
                        title: "실패!",
                        text: "요약 생성 중 오류가 발생했습니다.",
                        icon: "error"
                    });
                }
            }
        });
    };

    const handleTextChange = (e) => {
        const newText = e.target.value;
        setText(newText);
        setIsTextValid(newText.length <= maxCharCount);
    };

    const validateForm = () => {
        if (!meetroomCode || !minutesDate || !title || !text) {
            alert("모든 항목을 입력해주세요.");
            return false;
        }
        return true;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validateForm()) {
            return;
        }
    
        // 서버에서 기대하는 형식에 맞게 데이터를 변환합니다.
        const minutesAttendeesString = JSON.stringify(MapselectedEmployees);
    
        const minutesData = {
            empCode: userCode,
            meetroomCode: meetroomCode,
            minutesDate: minutesDate.toISOString().split('T')[0],
            minutesAttendees: minutesAttendeesString,  
            minutesSubject: title,
            minutesContent: text,
            minutesSummary: summary
        };
    
        try {
            const response = await axios.post('http://localhost:8787/api/insertMinutes', minutesData);
            console.log(minutesData);
            if (response.status === 200) {
                alert("회의록 등록 완료");
                navigate("/meetingSummary");
            }
        } catch (error) {
            console.error('등록실패:', error);
        }
    };
    
    const handleCancel = () => {
        alert("등록이 취소되었습니다.");
        navigate("/meetingSummary");
    };

    return (
        <div className="container" style={{ marginTop: 50 }}>
            <Card style={{ padding: '20px', marginBottom: '20px' }}>
                <Card.Title style={{ textAlign: 'center', marginBottom: '30px' }}>
                    <h4>신규 회의록 작성</h4>
                </Card.Title>
                <h5>회의록 정보</h5>
                <Form>
                    <Row className="mb-3">
                        <Form.Group as={Col} controlId="formUsername">
                            <Form.Label>작성자</Form.Label>
                            <Form.Control type="text" value={username} readOnly style={{ marginTop: 10 }} />
                        </Form.Group>

                        <Form.Group as={Col} controlId="formAttendees">
                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                <Form.Label style={{ marginRight: '10px' }}>회의 참여자</Form.Label>
                                <OrgChartComponent
                                    buttonName="참여자 선택"
                                    mappingUrl="mintesAttendense"
                                    maxSelection="3"
                                    onSelectionChange={handleSelectedEmployees}
                                />
                            </div>
                            <Form.Control
                                type="text"
                                value={selectedEmployees.map(emp => `${emp.empName}(${emp.empCode})`).join(', ')}
                                required
                                style={{ marginTop: '10px' }}
                            />
                        </Form.Group>

                    </Row>
                    <Row className="mb-3">
                        <Form.Group as={Col} controlId="formMeetroomCode">
                            <Form.Label>회의장소</Form.Label>
                            <Form.Control
                                as="select"
                                value={meetroomCode}
                                onChange={(e) => setMeetroomCode(e.target.value)}
                                required
                            >
                                <option value="101">101 호실</option>
                                <option value="102">102 호실</option>
                                <option value="103">103 호실</option>
                                <option value="204">204 호실</option>
                                <option value="205">205 호실</option>
                                <option value="206">206 호실</option>
                                <option value="207">207 호실</option>
                                <option value="308">308 호실</option>
                            </Form.Control>
                        </Form.Group>

                        <Form.Group as={Col} controlId="formMinutesDate">
                            <Form.Label>회의 일자</Form.Label>
                            <DateTimeComponent
                                selectedDate={minutesDate}
                                setSelectedDate={setMinutesDate}
                                style={{ width: "100%" }}
                            />
                        </Form.Group>
                    </Row>
                </Form>
            </Card>

            <Card style={{ padding: '20px', marginBottom: '20px' }}>
                <h5>회의록 내용</h5>
                <Form>
                    <Form.Group controlId="formTitle" className="mb-3">
                        <Form.Label>제목</Form.Label>
                        <Form.Control
                            type="text"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            placeholder="제목을 입력하세요"
                            style={{ width: '100%' }}
                        />
                    </Form.Group>

                    <Form.Group controlId="formContent" className="mb-3">
                        <Form.Label>내용</Form.Label>
                        <Form.Control
                            as="textarea"
                            value={text}
                            onChange={handleTextChange}
                            placeholder="텍스트를 입력하세요"
                            rows={10}
                            style={{ width: '100%' }}
                        />
                        <div style={{ color: isTextValid ? 'black' : 'red', marginTop: 10 }}>
                            {isTextValid ? `글자 수: ${text.length} / ${maxCharCount}` : `${text.length} / ${maxCharCount} | 2000자 이내로 입력해 주세요.`}
                        </div>
                    </Form.Group>

                    <Button
                        variant="primary"
                        onClick={handleSummarize}
                        disabled={!isTextValid}
                    >
                        AI 요약하기 ▼
                    </Button> 신규 회의록 작성 시에만 요약 기능을 진행할 수 있습니다
                </Form>
            </Card>

            {isSummaryVisible && (
                <Card style={{ padding: '20px' }}>
                    <h5>요약 결과</h5>
                    <Form.Group controlId="formSummary">
                        <Form.Control
                            as="textarea"
                            value={summary}
                            rows={10}
                            style={{ width: '100%' }}
                        />
                    </Form.Group>
                </Card>
            )}
            <div style={{ display: "flex", justifyContent: "center", gap: "20px", marginBottom: 30, marginTop: 30 }}>
                <button className="btn btn-secondary" onClick={handleCancel}>
                    취소
                </button>
                <button className="btn btn-primary" onClick={handleSubmit}>
                    등록
                </button>
            </div>
        </div>
    );
};

export default MinutesFormComponent;
