import React from 'react';

const PaginationComponent = () => {
    return (
        <div className="container" style={{ display: 'flex', justifyContent: 'center', marginTop: '20px' }}>
            <ul className="pagination">
                <li className="page-item"><a className="page-link" href="#">{ '<' }</a></li>
                <li className="page-item"><a className="page-link" href="#">1</a></li>
                <li className="page-item active"><a className="page-link" href="#">2</a></li>
                <li className="page-item"><a className="page-link" href="#">3</a></li>
                <li className="page-item"><a className="page-link" href="#">{ '>' }</a></li>
            </ul>
        </div>
    );
};

export default PaginationComponent;
