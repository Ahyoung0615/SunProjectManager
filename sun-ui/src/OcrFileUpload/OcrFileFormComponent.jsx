import React, { useState } from 'react';
import { Container } from 'react-bootstrap';

const OcrFileFormComponent = () => {

    const [file, setFile] = useState(null);
    
    const handleChangeFile = (event) => {
        setFile(event.target.files);
    };

    const send = () => {
        const formData = new FormData();
    };

    return (
        <div>
            <h1>파일 업로드</h1><h3>하기싫다..</h3>

            <div>
                파일: <input type='file' id='file' multiple="multiple"/>
                <button>전송</button>
            </div>
        </div>
    );
};

export default OcrFileFormComponent;