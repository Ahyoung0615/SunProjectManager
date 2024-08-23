import React, { useEffect, useState } from 'react';

const BoardListComponent = () => {
    const [notices, setNotices] = useState([]);

    useEffect(() => {
        // 게시글 목록 가져오기
        fetch('http://localhost:8787/boardList')
            .then(response => response.json())
            .then(data => {
                setNotices(data);
            })
            .catch(error => {
                console.error("게시글불러오기 오류", error);
            });
    }, []);
    return (
        <div>
            <h2>게시판 목록</h2>
            <table border="1">
                <thead>
                    <tr>
                        <th>번호</th>
                        <th>제목</th>
                        <th>내용</th>
                        <th>작성자</th>
                        <th>작성일</th>
                        <th>상태</th>
                    </tr>
                </thead>
                <tbody>
                    {notices.map((notice, index) => (
                        <tr key={index}>
                            <td>{notice.notiCode}</td>
                            <td>{notice.notiTitle}</td>
                            <td>{notice.notiContent}</td>
                            <td>{notice.empCode}</td>
                            <td>{notice.notiDate}</td>
                            <td>{notice.notiStatus}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default BoardListComponent;