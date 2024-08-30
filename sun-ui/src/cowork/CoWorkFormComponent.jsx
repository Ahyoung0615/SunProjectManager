import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import BTripAddressComponent from '../btrip/BTripAddressComponent';

const CoWorkFormComponent = () => {
    const [openAddress, setOpenAddress] = useState(false);
    const [formData, setFormData] = useState({
        cowName: '',
        cowAddress: '',
        cowTel: '',
        cowManager: '',
        cowMgrjob: '',
        cowRegdate: ''
    });

    const navigate = useNavigate();

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post('http://localhost:8787/api/insertCoWork', formData);
            if (response.status === 200) {
                alert('협력사가 성공적으로 등록되었습니다.');
                navigate('/coworkAdList');
            }
        } catch (error) {
            console.error('협력사 등록 중 오류가 발생했습니다:', error);
            alert('협력사 등록 중 오류가 발생했습니다.');
        }
    };

    const handleAddressSelect = (addressObj) => {
        setFormData((prevState) => ({
            ...prevState,
            cowAddress: addressObj.areaAddress + ' ' + addressObj.townAddress
        }));
        setOpenAddress(false); 
    };

    return (
        <div style={{ width: '40%', margin: '0 auto', marginTop: '70px', padding: 40, backgroundColor: '#DBE9EF', borderRadius: 30 }}>
            <h4 style={{ textAlign: 'center' }}>협력사 신규 등록</h4>
            <br></br>
            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label>협력사 이름</label>
                    <input
                        type="text"
                        name="cowName"
                        value={formData.cowName}
                        onChange={handleChange}
                        className="form-control"
                        required
                    />
                </div>
                <div className="form-group">
                    <label>주소</label>
                    <input
                        type="text"
                        name="cowAddress"
                        value={formData.cowAddress}
                        onClick={() => setOpenAddress(true)}
                        className="form-control"
                        required
                        placeholder='주소를 입력해주세요'
                        readOnly
                    />
                </div>
                {openAddress && (
                    <BTripAddressComponent setAddressObj={handleAddressSelect} />
                )}
                <div className="form-group">
                    <label>전화번호</label>
                    <input
                        type="text"
                        name="cowTel"
                        value={formData.cowTel}
                        onChange={handleChange}
                        className="form-control"
                        required
                    />
                </div>
                <div className="form-group">
                    <label>협력 담당자</label>
                    <input
                        type="text"
                        name="cowManager"
                        value={formData.cowManager}
                        onChange={handleChange}
                        className="form-control"
                        required
                    />
                </div>
                <div className="form-group">
                    <label>직급</label>
                    <input
                        type="text"
                        name="cowMgrjob"
                        value={formData.cowMgrjob}
                        onChange={handleChange}
                        className="form-control"
                        required
                    />
                </div>
                <div className="form-group">
                    <label>등록일</label>
                    <input
                        type="date"
                        name="cowRegdate"
                        value={formData.cowRegdate}
                        onChange={handleChange}
                        className="form-control"
                        required
                    />
                </div>
                <div style={{ textAlign: 'center', marginTop: 40 }}>
                    <button type="submit" className="btn btn-primary">
                        등록
                    </button>
                </div>
            </form>
        </div>
    );
};

export default CoWorkFormComponent;
