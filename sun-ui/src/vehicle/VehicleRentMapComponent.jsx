import React, { useEffect, useState } from 'react';
import axios from 'axios';

const VehicleRentMapComponent = ({ arrivalAddress }) => {
    const [coordinates, setCoordinates] = useState({ lat: 37.4765002, lng: 126.8799586 });

    useEffect(() => {
        const geocodeAddress = async (address) => {
            try {
                const response = await axios.get('https://maps.googleapis.com/maps/api/geocode/json', {
                    params: {
                        address: address,
                        key: 'AIzaSyCBBLx-PR-gzbEOq-CUdp3fNDeo9BzvOtM' // Google API Key
                    }
                });
                if (response.data.status === "OK") {
                    const location = response.data.results[0].geometry.location;
                    setCoordinates({ lat: location.lat, lng: location.lng });
                } else {
                    console.error('Geocoding Error:', response.data.status);
                }
            } catch (error) {
                console.error('Geocoding Error:', error);
            }
        };

        if (arrivalAddress) {
            geocodeAddress(arrivalAddress);
        }
    }, [arrivalAddress]);

    useEffect(() => {
        const loadKakaoMap = () => {
            const { kakao } = window;
            if (kakao && kakao.maps) {
                const container = document.getElementById('vehicleRentMap');
                const options = {
                    center: new kakao.maps.LatLng(coordinates.lat, coordinates.lng), // Google Geocoding으로 얻은 좌표
                    level: 4
                };
                const map = new kakao.maps.Map(container, options);

                // 마커 추가
                const markerPosition = new kakao.maps.LatLng(coordinates.lat, coordinates.lng);
                const marker = new kakao.maps.Marker({
                    position: markerPosition
                });
                marker.setMap(map);
            } else {
                console.error("Kakao Maps API가 로드되지 않았습니다.");
            }
        };

        // Kakao Maps API 스크립트가 로드되었는지 확인
        if (!window.kakao || !window.kakao.maps) {
            const script = document.createElement('script');
            script.src = `//dapi.kakao.com/v2/maps/sdk.js?appkey=e690150b13ddf822391de1b02d294f79&libraries=services`;
            script.async = true;
            document.head.appendChild(script);

            script.onload = () => {
                if (window.kakao && window.kakao.maps) {
                    loadKakaoMap();
                } else {
                    console.error("Kakao Maps API가 로드되지 않았습니다.");
                }
            };
        } else {
            loadKakaoMap();
        }
    }, [coordinates]); // coordinates가 변경될 때마다 지도 재로딩

    return (
        <div id="vehicleRentMap" style={{ width: '100%', height: '350px' }}></div>
    );
};

export default VehicleRentMapComponent;
