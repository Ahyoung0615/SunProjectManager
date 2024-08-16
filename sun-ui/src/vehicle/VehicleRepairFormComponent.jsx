import React, { useState } from 'react';
import axios from 'axios';
import ModalComponent from './../commodule/ModalComponent';
import { useParams } from 'react-router-dom';
import DateTimeComponent from '../commodule/DateTimeComponent';

const VehicleRepairFormComponent = ({ onRegisterComplete }) => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const { vehicleCode } = useParams();
    const [repairDetail, setRepairDetail] = useState('');
    const [repairReason, setRepairReason] = useState('');
    const [repairDate, setRepairDate] = useState(new Date());
    const [repairStatus, setRepairStatus] = useState('O');

    const openModal = () => {
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const repairData = {
            vehicleCode,
            repairDetail,
            repairReason,
            repairDate,
            repairStatus
        };

        try {
            const response = await axios.post('http://localhost:8787/api/insertRepair', repairData);
            if (response.status === 200) {
                alert("수리 내역이 성공적으로 등록되었습니다.");
                if (onRegisterComplete) {
                    onRegisterComplete();
                }
                closeModal();
            }
        } catch (error) {
            console.error('수리 내역 등록 실패:', error);
            alert("수리 내역 등록에 실패했습니다.");
        }
    };

    return (
        <div>
            <button className="btn btn-warning" onClick={openModal}>수리등록</button>
            <ModalComponent
                open={isModalOpen}
                close={closeModal}
                title="수리 내역 등록"
                body={
                    <div>
                        <form onSubmit={handleSubmit}>
                            <div>
                                <label>차량등록번호</label>
                                <input type='text' readOnly value={vehicleCode} style={{ width: "100%" }} />
                            </div>
                            <div>
                                <label>수리 내역</label>
                                <input
                                    type='text'
                                    value={repairDetail}
                                    onChange={(e) => setRepairDetail(e.target.value)}
                                    style={{ width: "100%" }}
                                    required
                                />
                            </div>
                            <div>
                                <label>수리 사유</label>
                                <input
                                    type='text'
                                    value={repairReason}
                                    onChange={(e) => setRepairReason(e.target.value)}
                                    style={{ width: "100%" }}
                                    required
                                />
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop:20 , marginBottom:10}}>
                                <label>수리 일자</label>
                                <DateTimeComponent
                                    selectedDate={repairDate}
                                    setSelectedDate={setRepairDate}
                                    style={{ width: "70%" }}
                                    required
                                />
                                <label>완료 여부</label>
                                <select
                                    value={repairStatus}
                                    onChange={(e) => setRepairStatus(e.target.value)}
                                    style={{ width: "25%" }}
                                    required
                                >
                                    <option value="O">완료</option>
                                    <option value="I">진행 중</option>
                                </select>
                            </div>
                            <div style={{ marginTop: "10px", marginLeft:200 }}>
                                <input type='submit' value='등록' className="btn btn-primary" />
                            </div>
                        </form>
                    </div>
                }
            />
        </div>
    );
};

export default VehicleRepairFormComponent;
