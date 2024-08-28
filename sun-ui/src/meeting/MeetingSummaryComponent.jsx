import React, { useState } from 'react';
import axios from 'axios';

function MeetingSummaryComponent() {
    const [text, setText] = useState('');
    const [summary, setSummary] = useState('');
    const [title, setTitle] = useState('');
    const [isTextValid, setIsTextValid] = useState(true); // 유효성 검사 상태
    const maxCharCount = 2000;

    const handleSummarize = async () => {
        if (text.length > maxCharCount) {
            return;
        }

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

    const handleTextChange = (e) => {
        const newText = e.target.value;
        setText(newText);
        setIsTextValid(newText.length <= maxCharCount); // 2000자 이하일 때만 유효함
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
                onChange={handleTextChange}
                placeholder="텍스트를 입력하세요"
                rows={10}
                style={{ width: 500, marginBottom: 20 }}
            />
            <div style={{ color: isTextValid ? 'black' : 'red', marginBottom: 10 }}>
                {isTextValid ? `글자 수: ${text.length} / ${maxCharCount}` : `${text.length} / ${maxCharCount} | 2000자 이내로 입력해 주세요.`}
            </div>
            <br></br>
            <button 
                onClick={handleSummarize} 
                disabled={!isTextValid} // 유효하지 않으면 버튼 비활성화
            >
                요약하기
            </button>
            <div style={{ marginTop: 20, maxWidth:500 }}>
                <h3>요약 결과:</h3>
                <p>{summary}</p> {/* summary 텍스트를 출력 */}
            </div>
        </div>
    );
}

export default MeetingSummaryComponent;
