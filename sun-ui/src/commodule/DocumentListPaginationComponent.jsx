import React from 'react';
import classNames from 'classnames';
import styles from '../css/DocumentListComponent.module.css';

const DocumentListPaginationComponent = ({ currentPage, totalPages, onPageChange, isEmpty }) => {
    const handlePageChange = (page) => {
        if (page >= 0 && page < totalPages) {
            onPageChange(page);
        }
    };

    return (
        <div className={styles['pagination-container']}>
            <button
                className={classNames(styles['pagination-button'], { [styles['disabled']]: currentPage === 0 || isEmpty })}
                onClick={() => handlePageChange(0)}
                disabled={currentPage === 0 || isEmpty}>
                처음
            </button>
            <button
                className={classNames(styles['pagination-button'], { [styles['disabled']]: currentPage === 0 || isEmpty })}
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 0 || isEmpty}>
                이전
            </button>
            <span>페이지 {currentPage + 1} / {totalPages > 0 ? totalPages : 1}</span>
            <button
                className={classNames(styles['pagination-button'], { [styles['disabled']]: currentPage + 1 === totalPages || isEmpty })}
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage + 1 === totalPages || isEmpty}>
                다음
            </button>
            <button
                className={classNames(styles['pagination-button'], { [styles['disabled']]: currentPage + 1 === totalPages || isEmpty })}
                onClick={() => handlePageChange(totalPages - 1)}
                disabled={currentPage + 1 === totalPages || isEmpty}>
                마지막
            </button>
        </div>
    );
};

export default DocumentListPaginationComponent;
