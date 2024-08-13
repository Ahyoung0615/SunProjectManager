import React from 'react';

const HeaderSearchComponent = () => {
    return (
        <form className="d-none d-md-inline-block form-inline ms-auto me-0 me-md-3 my-2 my-md-0">
            <div className="input-group">
                <input className="form-control" type="text" placeholder="사내 게시판 검색" aria-label="Search for..." aria-describedby="btnNavbarSearch" />
                <button className="btn btn-primary" id="btnNavbarSearch" type="button">
                    <i className="fas fa-search"></i>
                </button>
            </div>
        </form>
    );
};

export default HeaderSearchComponent;
