import axios from 'axios';
import React, { useState } from 'react';
import { Container } from 'react-bootstrap';

const OcrFileFormComponent = () => {
    const [file, setFile] = useState(null);
    const [errorMessage, setErrorMessage] = useState('');
    const [base64String, setBase64String] = useState('');
    const [previewUrl, setPreviewUrl] = useState(''); // 미리보기 URL 상태

    const handleFileChange = (event) => {
        const selectedFile = event.target.files[0];

        if (selectedFile && selectedFile.type.startsWith('image/')) {
            setFile(selectedFile);
            setErrorMessage('');

            // 파일 미리보기 생성
            const reader = new FileReader();
            reader.onloadend = () => {
                setPreviewUrl(reader.result);
            };
            reader.readAsDataURL(selectedFile);
        } else {
            setFile(null);
            setPreviewUrl(''); // 유효하지 않은 파일을 선택했을 때 미리보기 URL 초기화
            setErrorMessage('Please select a valid image file (jpg, png, etc.)');
        }
    };

    const handleUpload = async () => {
        if (!file) {
            alert('Please select a file first!');
            return;
        }

        const formData = new FormData();
        formData.append('file', file);

        try {
            const response = await axios.post('http://localhost:8787/api/edoc/empSigUpload', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            setBase64String(response.data); // Assuming response.data contains the base64 string
        } catch (error) {
            console.error('Error uploading file:', error);
            setErrorMessage('Failed to upload file.');
        }
    };

    return (
        <Container>
            <h1>파일 업로드</h1>
            <h3>하기싫다..</h3>

            <input type="file" accept="image/*" onChange={handleFileChange} />
            <button onClick={handleUpload}>Upload</button>

            {errorMessage && <p style={{ color: 'red' }}>{errorMessage}</p>}

            {previewUrl && (
                <div>
                    <h3>파일 미리보기:</h3>
                    <img
                        src={previewUrl}
                        alt="File Preview"
                        style={{ maxWidth: '100%', height: 'auto' }}
                    />
                </div>
            )}

            {base64String && (
                <div>
                    <h3>Base64 Encoded Image:</h3>
                    <img
                        src={`data:image/png;base64,${base64String}`}
                        alt="Uploaded"
                        style={{ maxWidth: '100%', height: 'auto' }}
                    />
                </div>
            )}
        </Container>
    );
};

export default OcrFileFormComponent;
