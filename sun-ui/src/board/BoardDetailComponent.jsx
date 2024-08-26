import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

const BoardDetailComponent = () => {
    const { notiCode } = useParams(); // URL에서 게시글 번호 가져오기
    const [notice, setNotice] = useState(null);
    const [employee, setEmployee] = useState({});
    const [files, setFiles] = useState([]);
    const navigate = useNavigate();
    const [emp, setEmp] = useState([]);

    useEffect(() => {
        const value = window.sessionStorage.getItem('user');
        if (value) {
            setEmp(JSON.parse(value));
        }
    }, []); 

    useEffect(() => {
        const fetchNoticeData = async () => {
            try {
                // 특정 게시글 가져오기
                const response = await fetch(`http://localhost:8787/boardDetail/${notiCode}`);
                const data = await response.json();
                setNotice(data);

                // 사원번호 가져오기 및 사원이름 가져오기
                const empResponse = await fetch(`http://localhost:8787/api/employee/${data.empCode}`);
                if (empResponse.ok) {
                    const empData = await empResponse.json();
                    setEmployee(empData);
                }

                // 파일 목록 가져오기
                const filesResponse = await fetch(`http://localhost:8787/files/${notiCode}`);
                if (filesResponse.ok) {
                    const filesData = await filesResponse.json();
                    setFiles(filesData);
                }
            } catch (error) {
                console.error("게시글 상세보기 오류", error);
            }
        };

        fetchNoticeData();
    }, [notiCode]);

    const handleBack = () => {
        navigate('/boardList'); 
    };

    const handleDelete = async () => {
        try {
            // 게시글 삭제 요청
            const response = await axios({
                url: `http://localhost:8787/deleteBoard/${notiCode}`,
                method: 'POST',
                params: {
                    notiCode: notiCode // `@RequestParam` 사용 시 query parameter로 전달
                },
            });

            if (response.status === 200) {
                alert('게시글이 삭제되었습니다.');
                navigate('/boardList'); // 삭제 후 목록 페이지로 이동
            }
        } catch (error) {
            console.error('게시글 삭제 중 오류 발생', error);
            alert('게시글 삭제 중 오류가 발생했습니다.');
        }
    };

    const handleUpdate = () => {
        if (emp.authorities === "[ROLE_A]") {
            navigate(`/boardUpdate/${notiCode}`); // 수정 페이지로 이동
        } else {
            // 권한이 없는 경우
            alert("관리자만 사용 가능합니다.");
        }
    };

    if (!notice) {
        return <div>Loading...</div>;
    }

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

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        const year = String(date.getFullYear()).slice(2); // 년도 마지막 두 자리
        const month = String(date.getMonth() + 1).padStart(2, '0'); // 월 (2자리)
        const day = String(date.getDate()).padStart(2, '0'); // 일 (2자리)
        return `${year}.${month}.${day}`;
    };

    const formatFileSize = (sizeInBytes) => {
        if (sizeInBytes === 0) return '0 Byte';
        const k = 1024; // 단위 변환을 위한 상수
        const sizes = ['Byte', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
        const i = Math.floor(Math.log(sizeInBytes) / Math.log(k));
        return parseFloat((sizeInBytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    };

    return (
        <div className="container" style={{ marginTop: 30 }}>
            <div className="card">
                <div className="card-body">
                    <h5 className="card-title">
                        {notice.notiStatus === 'I' && <span className="badge badge-danger">중요</span>}
                        {notice.notiTitle}
                    </h5>
                    <h6 className="card-subtitle mb-2 text-muted">
                        {employee.empName || notice.empCode} {' [' + getDeptTitle(employee.deptCode) + ']'} {formatDate(notice.notiDate)}
                    </h6>
                    <hr/>
                    <div
                        className="card-text"
                        dangerouslySetInnerHTML={{ __html: notice.notiContent }}
                    />
                    <div className="mt-3">
                        {files.length > 0 && (
                            <div>
                                <h6>첨부 파일:</h6>
                                <ul>
                                    {files.map(file => (
                                        <li key={file.fileName}>
                                            <a href={`http://localhost:8787/files/download/${file.nfileFakename}`} download>
                                                {file.nfileOriginname}
                                            </a>
                                            ({formatFileSize(file.notiSize)})
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        )}
                    </div>
                </div>
            </div>
            <div style={{ marginBottom: '20px'}}>
                <button className="btn btn-dark" onClick={handleBack} style={{ marginRight: '20px' }}>
                    돌아가기
                </button>
                {emp.authorities === "[ROLE_A]" && (
                <button className="btn btn-success" onClick={handleUpdate} style={{ marginRight: '20px' }}>
                    수정
                </button>
                )}
                {emp.authorities === "[ROLE_A]" && (
                    <button className="btn btn-danger" onClick={handleDelete}>
                        삭제
                    </button>
                )}
            </div>
        </div>
    );
};

export default BoardDetailComponent;
