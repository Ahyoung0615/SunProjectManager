import React, { useEffect, useState } from 'react';
import { CKEditor } from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB

const BoardInsertComponent = () => {
    const [emp, setEmp] = useState([]);
    const [notice, setNotice] = useState({
        notiTitle: '',
        notiContent: '',
        empCode: '',
        notiStatus: '',
    });
    const [files, setFiles] = useState([]);
    const [loading, setLoading] = useState(false); // 로딩 상태 추가
    const navigate = useNavigate();

    useEffect(() => {
        const value = window.sessionStorage.getItem('user');
        if (value) {
            setEmp(JSON.parse(value));
        }
    }, []);

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
    
        const validFiles = selectedFiles.filter(file => file.size <= MAX_FILE_SIZE);
        const invalidFiles = selectedFiles.filter(file => file.size > MAX_FILE_SIZE);
    
        if (invalidFiles.length > 0) {
            alert('파일 크기가 5MB를 초과하는 파일이 포함되어 있습니다.');
        }
    
        setFiles(validFiles);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true); // 로딩 시작
    
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
            const response = await axios.post('http://localhost:8787/insertBoard', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            console.log(response.data);
            alert('게시글 등록이 완료되었습니다.');
            navigate('/boardList');
        } catch (error) {
            console.error('게시글 등록 중 오류가 발생했습니다:', error);
    
            const errorMessage = error.response?.data?.message || '게시글 등록 중 오류가 발생했습니다.';
            alert(errorMessage);
        } finally {
            setLoading(false); // 로딩 종료
        }
    };

    const renderFilePreviews = () => {
        return files.map((file, index) => (
            <div key={index} className="file-preview">
                <p>{file.name} ({(file.size / 1024).toFixed(2)} KB)<button 
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

    const handleRemoveFile = (index) => {
        setFiles(prevFiles => prevFiles.filter((_, i) => i !== index));
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
                        config={{
                            ckfinder: {
                                uploadUrl: 'http://localhost:8787/uploadImageBoard', // 이미지 업로드 서버 경로
                            },
                            image: {
                                // 이미지 리사이즈 옵션 추가
                                resizeOptions: [
                                    {
                                        name: 'resizeImage:resize10',
                                        value: '10',
                                        icon: '<svg>...</svg>' // 아이콘 추가
                                    },
                                    {
                                        name: 'resizeImage:resize25',
                                        value: '25',
                                        icon: '<svg>...</svg>' // 아이콘 추가
                                    },
                                    // 추가 사이즈 옵션을 필요에 따라 추가
                                ],
                                toolbar: [
                                    'imageTextAlternative', '|',
                                    'imageStyle:full', 'imageStyle:alignLeft', 'imageStyle:alignCenter', 'imageStyle:alignRight',
                                    'resizeImage:resize10', 'resizeImage:resize25', 'resizeImage:resize50', 'resizeImage:resize75', 'resizeImage:resize100'
                                ]
                            },
                            toolbar: [
                                'heading', '|', 'bold', 'italic', 'link', 'bulletedList', 'numberedList', 'blockQuote', 'imageUpload', '|', 'undo', 'redo'
                            ],
                        }}
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
                <button type="submit" className="btn btn-primary" disabled={loading}>
                    {loading ? '저장 중...' : '저장'}
                </button>
            </form>
        </div>
    );
};

export default BoardInsertComponent;
