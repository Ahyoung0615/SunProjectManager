import React, { useState } from 'react';
import axios from 'axios';

function MeetingSummaryComponent() {
    const [text, setText] = useState('');
    const [summary, setSummary] = useState('');
    const [title, setTitle] = useState('');

    const handleSummarize = async () => {
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

        try {
            const response = await axios.post(
                'http://localhost:8787/api/summary',
                requestBody
            );
            setSummary(response.data.summary); // response.data의 summary를 상태로 설정
        } catch (error) {
            console.error('Error fetching summary:', error);
            setSummary('요약 생성 중 오류가 발생했습니다.');
        }
    };

    return (
        <div style={{ marginTop: 50, marginLeft: 300 }}>
            <h4>요약 텍스트 입력</h4>
            <input 
                type='text' 
                value={title} 
                onChange={(e) => setTitle(e.target.value)} 
                placeholder='제목을 입력하세요'
                style={{ width: 500, marginBottom: 20 }}
            />
            <br></br>
            <textarea
                value={text}
                onChange={(e) => setText(e.target.value)}
                placeholder="텍스트를 입력하세요"
                rows={10}
                style={{ width: 500, marginBottom: 20 }}
            />
            <br></br>
            <button onClick={handleSummarize}>요약하기</button>
            <div style={{ marginTop: 20, maxWidth:500}}>
                <h3>요약 결과:</h3>
                <p>{summary}</p> {/* summary 텍스트를 출력 */}
            </div>
        </div>
    );
}

export default MeetingSummaryComponent;
