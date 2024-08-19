import React, { useEffect } from 'react';
import axios from 'axios';

const CoWorkMapComponent = ({ showRoute, btripDepartAdd, btripArrivalAdd, selectedAddress }) => {

  useEffect(() => {
    console.log("CoWorkMapComponent 렌더링됨");
    console.log("출발 주소:", btripDepartAdd);
    console.log("도착 주소:", btripArrivalAdd);
    console.log("경로보기 버튼 활성화", showRoute);
    console.log("선택된 주소:", selectedAddress);

    const initMap = (lat = 37.4765002, lng = 126.8799586) => {
      const map = new window.google.maps.Map(document.getElementById("map"), {
        center: { lat, lng },
        zoom: 15,
        mapTypeId: window.google.maps.MapTypeId.ROADMAP,
        mapTypeControl: false,
      });

      new window.google.maps.Marker({
        position: { lat, lng },
        map: map,
      });

      if (showRoute) {
        calculateRoute(map);
      }
    };

    const calculateRoute = async (map) => {
      if (!btripDepartAdd || !btripArrivalAdd) {
        console.error("출발지나 도착지가 정의되지 않았습니다.");
        return;
      }

      try {
        const [originResponse, destinationResponse] = await Promise.all([
          geocodeAddress(btripDepartAdd),
          geocodeAddress(btripArrivalAdd),
        ]);

        const originLocation = originResponse.data.results[0].geometry.location;
        const destinationLocation = destinationResponse.data.results[0].geometry.location;

        console.log("출발 좌표:", originLocation);
        console.log("도착 좌표:", destinationLocation);

        const directionsService = new window.google.maps.DirectionsService();
        const directionsRenderer = new window.google.maps.DirectionsRenderer();
        directionsRenderer.setMap(map);

        const result = await directionsService.route({
          origin: originLocation,
          destination: destinationLocation,
          travelMode: window.google.maps.TravelMode.TRANSIT,
        });

        if (result.status === 'ZERO_RESULTS') {
          console.error("경로를 찾을 수 없습니다.");
        } else {
          directionsRenderer.setDirections(result);
        }
      } catch (error) {
        console.error("경로 계산 오류", error);
      }
    };

    const geocodeAddress = async (address) => {
      try {
        const response = await axios.get('https://maps.googleapis.com/maps/api/geocode/json', {
          params: {
            address: address,
            key: 'AIzaSyCBBLx-PR-gzbEOq-CUdp3fNDeo9BzvOtM'
          }
        });
        return response;
      } catch (error) {
        console.error('Geocoding Error:', error);
        throw error;
      }
    };

    const loadGoogleMapsScript = () => {
      const script = document.createElement('script');
      script.src = `https://maps.googleapis.com/maps/api/js?key=YOUR_GOOGLE_API_KEY&callback=initMap`;
      script.async = true;
      script.defer = true;
      window.initMap = () => {
        const addressToUse = selectedAddress || btripArrivalAdd;
        if (addressToUse) {
          geocodeAddress(addressToUse).then(response => {
            const location = response.data.results[0].geometry.location;
            initMap(location.lat, location.lng);
          }).catch(() => {
            initMap(); // 오류 발생 시 기본 위치로 초기화
          });
        } else {
          initMap();
        }
      };
      document.head.appendChild(script);
    };

    if (!window.google || !window.google.maps) {
      loadGoogleMapsScript();
    } else {
      const addressToUse = selectedAddress || btripArrivalAdd;
      if (addressToUse) {
        geocodeAddress(addressToUse).then(response => {
          const location = response.data.results[0].geometry.location;
          initMap(location.lat, location.lng);
        }).catch(() => {
          initMap(); // 오류 발생 시 기본 위치로 초기화
        });
      } else {
        initMap();
      }
    }
  }, [btripArrivalAdd, showRoute, selectedAddress]);

  return <div id="map" style={{ width: 400, height: 350, marginLeft: 20, marginRight: 20 }}></div>;
};

export default CoWorkMapComponent;
