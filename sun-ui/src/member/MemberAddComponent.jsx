import React, { useState } from 'react';
import axios from 'axios';

const MemberAddComponent = () => {
    const [emp, setEmp] = useState({
        EmpName: '',
        EmpJob: '',
        EmpDept: '',
        Gender: '',
        EmpTel: '',
        EmpEmail: '',
        EmpAddress: '',
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setEmp((prevState) => ({
            ...prevState,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const formData  = new FormData();
            formData.append('EmpName', emp.EmpName);
            formData.append('EmpJob', emp.EmpJob);
            formData.append('EmpDept', emp.EmpDept);
            formData.append('Gender', emp.Gender);
            formData.append('EmpTel', emp.EmpTel);
            formData.append('EmpEmail', emp.EmpEmail);
            formData.append('EmpAddress', emp.EmpAddress);

        try {
            const response = await axios({
                url: 'http://localhost:8787/NewEmp',
                method: 'POST',
                data: formData,
                headers: {
                    'Content-Type': 'multipart/form-data'
                },
                withCredentials: true, // 필요한 경우 크로스 사이트 요청 시 쿠키를 포함
              });
              console.log(response.data); // 서버에서 반환한 데이터를 로그로 출력합니다.
              alert('사원 등록이 완료되었습니다.');
              window.close();
        } catch (error) {
            console.error('사원 등록 중 오류가 발생했습니다:', error);
            alert('사원 등록 중 오류가 발생했습니다.');
        }
    };

    return (
        <div>
            <h2>사원 등록 폼</h2>
            <form onSubmit={handleSubmit}>
                <div>
                    <label>이름:</label>
                    <input
                        type="text"
                        name="EmpName"
                        value={emp.EmpName}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div>
                    <label>직무:</label>
                    <select
                        type="text"
                        name="EmpJob"
                        value={emp.EmpJob}
                        onChange={handleChange}
                        required>
                        <option value="">선택하세요</option>
                        <option value="1">대표</option>
                        <option value="11">이사</option>
                        <option value="21">부장</option>
                        <option value="31">차장</option>
                        <option value="41">과장</option>
                        <option value="51">대리</option>
                        <option value="61">주임</option>
                        <option value="71">사원</option>
                    </select>
                </div>
                <div>
                    <label>부서:</label>
                    <select
                        type="text"
                        name="EmpDept"
                        value={emp.EmpDept}
                        onChange={handleChange}
                        required>
                        <option value="">선택하세요</option>
                        <option value="1">경영총괄</option>
                        <option value="11">경영지원</option>
                        <option value="21">연구개발</option>
                        <option value="31">고객지원</option>
                        <option value="41">운송관리</option>
                        <option value="51">품질관리</option>
                        <option value="61">자재관리</option>
                        <option value="71">생산제조</option>
                    </select>
                </div>
                <div>
                    <label>성별:</label>
                    <select
                        name="Gender"
                        value={emp.Gender}
                        onChange={handleChange}
                        required
                    >
                        <option value="">선택하세요</option>
                        <option value="M">남</option>
                        <option value="F">여</option>
                    </select>
                </div>
                <div>
                    <label>전화번호:</label>
                    <input
                        type="text"
                        name="EmpTel"
                        value={emp.EmpTel}
                        onChange={handleChange}
                       
                    />
                </div>
                <div>
                    <label>이메일:</label>
                    <input
                        type="email"
                        name="EmpEmail"
                        value={emp.EmpEmail}
                        onChange={handleChange}
                      
                    />
                </div>
                <div>
                    <label>주소:</label>
                    <input
                        type="text"
                        name="EmpAddress"
                        value={emp.EmpAddress}
                        onChange={handleChange}
                       
                    />
                </div>
                <button type="submit">사원 등록</button>
            </form>
        </div>
    );
};

export default MemberAddComponent;
