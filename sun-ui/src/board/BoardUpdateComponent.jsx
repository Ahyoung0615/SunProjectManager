import React, { useEffect, useState } from 'react';
import { CKEditor } from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB

const BoardUpdateComponent = () => {
    const { notiCode } = useParams(); // URL에서 게시글 번호 가져오기
    const [notice, setNotice] = useState({
        notiTitle: '',
        notiContent: '',
        empCode: '',
        notiStatus: '',
    });
    const [emp, setEmp] = useState([]);
    const [files, setFiles] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        // 사용자 정보 가져오기
        const value = window.sessionStorage.getItem('user');
        if (value) {
            setEmp(JSON.parse(value));
        }

        // 게시글 데이터 가져오기
        const fetchNoticeData = async () => {
            try {
                const response = await axios.get(`http://localhost:8787/boardDetail/${notiCode}`);
                const data = response.data;
                setNotice({
                    notiTitle: data.notiTitle,
                    notiContent: data.notiContent,
                    empCode: data.empCode,
                    notiStatus: data.notiStatus,
                });
            } catch (error) {
                console.error("게시글 상세보기 오류", error);
            }
        };

        fetchNoticeData();
    }, [notiCode]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setNotice((prevState) => ({
            ...prevState,
            [name]: value
        }));
    };

    const handleEditorChange = (event, editor) => {
        const data = editor.getData();
        setNotice((prevState) => ({
            ...prevState,
            notiContent: data
        }));
    };

    const handleFileChange = (e) => {
        const selectedFiles = Array.from(e.target.files);
    
        selectedFiles.forEach(file => {
            console.log(`File name: ${file.name}, File size: ${file.size}`);
        });
    
        const validFiles = selectedFiles.filter(file => file.size <= MAX_FILE_SIZE);
        const invalidFiles = selectedFiles.filter(file => file.size > MAX_FILE_SIZE);
    
        if (invalidFiles.length > 0) {
            alert('파일 크기가 5MB를 초과하는 파일이 포함되어 있습니다.');
        }
    
        setFiles(prevFiles => [...prevFiles, ...validFiles]);
    };
    

    const handleSubmit = async (e) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append('notiTitle', notice.notiTitle);
        formData.append('notiContent', notice.notiContent);
        formData.append('empCode', emp.empcode);
        formData.append('notiStatus', notice.notiStatus);

        if (files.length > 0) {
            files.forEach((file) => {
                formData.append('files', file);
            });
        }
        try {
            const response = await axios.post(`http://localhost:8787/updateBoard/${notiCode}`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                },
            });
            console.log(response.data);
            alert('게시글 수정이 완료되었습니다.');
            navigate(`/boardDetail/${notiCode}`);
        } catch (error) {
            console.error('게시글 수정 중 오류가 발생했습니다:', error);
            alert('게시글 수정 중 오류가 발생했습니다.');
        }
    };
    const handleRemoveFile = (index) => {
        setFiles(prevFiles => prevFiles.filter((_, i) => i !== index));
    };
    const renderFilePreviews = () => {
        return files.map((file, index) => (
            <div key={index} className="file-preview">
                <p>{file.name} ({(file.size / 1024).toFixed(2)} KB) <button 
                        type="button"
                        className="btn btn-danger"
                        onClick={() => handleRemoveFile(index)}
                        style={{ marginLeft: '10px'}}
                    >
                        제거
                    </button></p>
                
            </div>
        ));
    };

    return (
        <div className="container" style={{ marginTop: 30 }}>
            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label htmlFor="notiTitle">제목</label>
                    <input
                        type='text'
                        id="notiTitle"
                        name="notiTitle"
                        value={notice.notiTitle}
                        onChange={handleChange}
                        className="form-control"
                        required
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="notiContent">내용</label>
                    <CKEditor
                        editor={ClassicEditor}
                        data={notice.notiContent}
                        onChange={handleEditorChange}
                        config={{}}
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="notiStatus">상태</label>
                    <select
                        id="notiStatus"
                        name="notiStatus"
                        value={notice.notiStatus}
                        onChange={handleChange}
                        className="form-control"
                        required
                    >
                        <option value="">상태를 선택하세요</option>
                        <option value="I">중요</option>
                        <option value="N">일반</option>
                    </select>
                </div>
                <div className="form-group">
                    <label htmlFor="fileUpload">파일 업로드 (최대 5MB)</label>
                    <input
                        type="file"
                        id="fileUpload"
                        onChange={handleFileChange}
                        className="form-control"
                        multiple
                    />
                    <div className="mt-2">
                        {renderFilePreviews()}
                    </div>
                </div>
                <button type="submit" className="btn btn-primary">저장</button>
            </form>
        </div>
    );
};

export default BoardUpdateComponent;
