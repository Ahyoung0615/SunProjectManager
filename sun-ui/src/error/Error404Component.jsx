import React from 'react';
import errorImage from '../img/error400.png'; // 경로에 맞게 이미지를 import 합니다.
import { Link, useNavigate, useParams } from 'react-router-dom';

const Error404Component = () => {

    const sessionAccess = sessionStorage.getItem('user') !== null;


    const navigate = useNavigate();

  const containerStyle = {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    margin: 0,
    marginTop:50,
    padding: 0,
    overflow: 'hidden',
  };

  const buttonStyle = {
    marginTop: '20px',
    padding: '10px 20px',
    fontSize: '16px',
  };

  const goLogin = () => {
    navigate('/login');
  }


  return (
    <div style={containerStyle}>
      <img src={errorImage} alt="404 Error" style={{ maxWidth: '60%', maxHeight: '60%', objectFit: 'cover' }} />
      {!sessionAccess && (
        <button type="button" className="btn btn-warning" onClick={goLogin} style={buttonStyle}>
          로그인 화면이동
        </button>
      )}
    </div>
  );
};

export default Error404Component;
