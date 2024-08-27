// Pagination.js
import React from 'react';

const Pagination = ({ currentPage, totalPages, pageGroupSize, onPageChange }) => {
    const currentGroupStart = Math.floor((currentPage - 1) / pageGroupSize) * pageGroupSize + 1;
    const currentGroupEnd = Math.min(currentGroupStart + pageGroupSize - 1, totalPages);

    const pageButtons = [];
    for (let page = currentGroupStart; page <= currentGroupEnd; page++) {
        pageButtons.push(
            <button
                key={page}
                onClick={() => onPageChange(page)}
                style={{
                    margin: '0 5px',
                    padding: '5px 10px',
                    backgroundColor: currentPage === page ? '#007bff' : '#fff',
                    color: currentPage === page ? '#fff' : '#000',
                    border: '1px solid #007bff',
                    borderRadius: '5px',
                }}
            >
                {page}
            </button>
        );
    }

    const showPrevGroup = currentGroupStart > 1;
    const showNextGroup = currentGroupEnd < totalPages;

    return (
        <div style={{ display: 'flex', justifyContent: 'center', marginTop: '20px' }}>
            {/* 이전 페이지 그룹 버튼 */}
            {showPrevGroup && (
                <button
                    onClick={() => onPageChange(currentGroupStart - pageGroupSize)}
                    style={{
                        margin: '0 5px',
                        padding: '5px 10px',
                        backgroundColor: '#007bff',
                        color: '#fff',
                        border: '1px solid #007bff',
                        borderRadius: '5px',
                    }}
                >
                    &laquo; 이전
                </button>
            )}
            {/* 페이지 버튼 */}
            {pageButtons}
            {/* 다음 페이지 그룹 버튼 */}
            {showNextGroup && (
                <button
                    onClick={() => onPageChange(currentGroupEnd + 1)}
                    style={{
                        margin: '0 5px',
                        padding: '5px 10px',
                        backgroundColor: '#007bff',
                        color: '#fff',
                        border: '1px solid #007bff',
                        borderRadius: '5px',
                    }}
                >
                    다음 &raquo;
                </button>
            )}
        </div>
    );
};

export default Pagination;
