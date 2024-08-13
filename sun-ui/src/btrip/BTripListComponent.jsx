import React from 'react';

const BTripListComponent = () => {
    return (
        <div style={{ padding: '20px' }}>
            {/* 출장 사항 */}
            <div style={{ marginBottom: '30px' }}>
                <h3 style={{ fontSize: '20px', fontWeight: 'bold' }}>출장 사항</h3>
                <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '10px' }}>
                    <thead>
                        <tr style={{ backgroundColor: '#f2f2f2' }}>
                            <th style={{ padding: '8px', border: '1px solid #ddd' }}>연번</th>
                            <th style={{ padding: '8px', border: '1px solid #ddd' }}>출장지</th>
                            <th style={{ padding: '8px', border: '1px solid #ddd' }}>출장목적</th>
                            <th style={{ padding: '8px', border: '1px solid #ddd' }}>출장기간</th>
                            <th style={{ padding: '8px', border: '1px solid #ddd' }}>비고</th>
                            <th style={{ padding: '8px', border: '1px solid #ddd' }}>차량이용여부</th>
                            <th style={{ padding: '8px', border: '1px solid #ddd' }}>여비적용구분</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td style={{ padding: '8px', border: '1px solid #ddd', textAlign: 'center' }}>1</td>
                            <td style={{ padding: '8px', border: '1px solid #ddd', textAlign: 'center' }}>부산</td>
                            <td style={{ padding: '8px', border: '1px solid #ddd', color: '#3498db', cursor: 'pointer', textAlign: 'center' }}>제조 공장 검사</td>
                            <td style={{ padding: '8px', border: '1px solid #ddd', textAlign: 'center' }}>2024.07.17 ~ 2024.07.21</td>
                            <td style={{ padding: '8px', border: '1px solid #ddd', textAlign: 'center' }}>1회1234</td>
                            <td style={{ padding: '8px', border: '1px solid #ddd', textAlign: 'center' }}>적용</td>
                            <td style={{ padding: '8px', border: '1px solid #ddd', textAlign: 'center' }}>적용</td>
                        </tr>
                        <tr>
                            <td style={{ padding: '8px', border: '1px solid #ddd', textAlign: 'center' }}>2</td>
                            <td style={{ padding: '8px', border: '1px solid #ddd', textAlign: 'center' }}>여수</td>
                            <td style={{ padding: '8px', border: '1px solid #ddd', color: '#3498db', cursor: 'pointer', textAlign: 'center' }}>품질 관리 및 검사</td>
                            <td style={{ padding: '8px', border: '1px solid #ddd', textAlign: 'center' }}>2024.07.05 ~ 2024.07.05</td>
                            <td style={{ padding: '8px', border: '1px solid #ddd', textAlign: 'center' }}>1회1222</td>
                            <td style={{ padding: '8px', border: '1px solid #ddd', textAlign: 'center' }}>적용</td>
                            <td style={{ padding: '8px', border: '1px solid #ddd', textAlign: 'center' }}>적용</td>
                        </tr>
                        <tr>
                            <td style={{ padding: '8px', border: '1px solid #ddd', textAlign: 'center' }}>3</td>
                            <td style={{ padding: '8px', border: '1px solid #ddd', textAlign: 'center' }}>울산</td>
                            <td style={{ padding: '8px', border: '1px solid #ddd', color: '#3498db', cursor: 'pointer', textAlign: 'center' }}>물품 구매</td>
                            <td style={{ padding: '8px', border: '1px solid #ddd', textAlign: 'center' }}>2024.06.22 ~ 2024.06.22</td>
                            <td style={{ padding: '8px', border: '1px solid #ddd', textAlign: 'center' }}>3인</td>
                            <td style={{ padding: '8px', border: '1px solid #ddd', textAlign: 'center' }}>미이용</td>
                            <td style={{ padding: '8px', border: '1px solid #ddd', textAlign: 'center' }}>적용</td>
                        </tr>
                    </tbody>
                </table>
            </div>

            {/* 출장지 정보 */}
            <div>
                <h3 style={{ fontSize: '20px', fontWeight: 'bold' }}>출장지정보</h3>
                <div style={{ display: 'flex', marginTop: '20px' }}>
                    <img src="map-placeholder.png" alt="Map" style={{ width: '50%', height: 'auto', border: '1px solid #ddd' }} />
                    <div style={{ marginLeft: '20px', width: '50%' }}>
                        <input type="text" placeholder="부산" style={{ width: '100%', padding: '10px', marginBottom: '10px', border: '1px solid #ddd' }} />
                        <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '10px' }}>
                            <thead>
                                <tr style={{ backgroundColor: '#f2f2f2' }}>
                                    <th style={{ padding: '8px', border: '1px solid #ddd' }}>연번</th>
                                    <th style={{ padding: '8px', border: '1px solid #ddd' }}>사명</th>
                                    <th style={{ padding: '8px', border: '1px solid #ddd' }}>주소</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td style={{ padding: '8px', border: '1px solid #ddd', textAlign: 'center' }}>1</td>
                                    <td style={{ padding: '8px', border: '1px solid #ddd', textAlign: 'center' }}>부산제철</td>
                                    <td style={{ padding: '8px', border: '1px solid #ddd', textAlign: 'center' }}>부산시 동래구</td>
                                </tr>
                                <tr>
                                    <td style={{ padding: '8px', border: '1px solid #ddd', textAlign: 'center' }}>2</td>
                                    <td style={{ padding: '8px', border: '1px solid #ddd', textAlign: 'center' }}>부산철강</td>
                                    <td style={{ padding: '8px', border: '1px solid #ddd', textAlign: 'center' }}>부산시 남포동</td>
                                </tr>
                                <tr>
                                    <td style={{ padding: '8px', border: '1px solid #ddd', textAlign: 'center' }}>3</td>
                                    <td style={{ padding: '8px', border: '1px solid #ddd', textAlign: 'center' }}>부산반도</td>
                                    <td style={{ padding: '8px', border: '1px solid #ddd', textAlign: 'center' }}>부산시 해운대구</td>
                                </tr>
                                <tr>
                                    <td style={{ padding: '8px', border: '1px solid #ddd', textAlign: 'center' }}>4</td>
                                    <td style={{ padding: '8px', border: '1px solid #ddd', textAlign: 'center' }}>부산엽서</td>
                                    <td style={{ padding: '8px', border: '1px solid #ddd', textAlign: 'center' }}>부산시 동래구</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default BTripListComponent;
