import React, { useState } from 'react';
import axios from 'axios';

function MeetingSummaryComponent() {
    const [text, setText] = useState('');
    const [summary, setSummary] = useState('');

    const handleSummarize = async () => {
        try {
            const response = await axios.post('http://localhost:8787/api/summary', { document: text });
            setSummary(response.data);
        } catch (error) {
            console.error('Error fetching summary:', error);
        }
    };

    return (
        <div style={{marginTop:50, marginLeft:300}}>
            <textarea
                value={text}
                onChange={(e) => setText(e.target.value)}
                placeholder="텍스트를 입력하세요"
                rows={10}
            />
            <button onClick={handleSummarize}>요약하기</button>
            <div>
                <h3>요약 결과:</h3>
                <p>{summary}</p>
            </div>
        </div>
    );
}

export default MeetingSummaryComponent;
