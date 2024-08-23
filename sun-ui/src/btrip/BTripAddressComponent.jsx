import React, { useEffect } from 'react';
import { useDaumPostcodePopup } from 'react-daum-postcode';

const BTripAddressComponent = ({ setAddressObj }) => {
  const postcodeScriptUrl = "https://t1.daumcdn.net/mapjsapi/bundle/postcode/prod/postcode.v2.js";

  // 클릭 시 수행될 팝업 생성 함수
  const open = useDaumPostcodePopup(postcodeScriptUrl);

  const handleComplete = (data) => {
    let fullAddress = data.address;
    let extraAddress = ''; // 추가될 주소
    let localAddress = data.sido + ' ' + data.sigungu; // 지역주소(시, 도 + 시, 군, 구)
    if (data.addressType === 'R') { // 주소타입이 도로명주소일 경우
      if (data.bname !== '') {
        extraAddress += data.bname; // 법정동, 법정리
      }
      if (data.buildingName !== '') { // 건물명
        extraAddress += (extraAddress !== '' ? `, ${data.buildingName}` : data.buildingName);
      }
      // 지역주소 제외 전체주소 치환
      fullAddress = fullAddress.replace(localAddress, '');
      // 조건 판단 완료 후 지역 주소 및 상세주소 state 수정
      setAddressObj({
        areaAddress: localAddress,
        townAddress: fullAddress += (extraAddress !== '' ? `(${extraAddress})` : '')
      });
    }

    // 주소 선택 후 팝업 자동 닫기
    if (window) {
      window.postMessage({ event: 'closeDaumPostcodePopup' }, '*');
    }
  };

  useEffect(() => {
    open({ 
      onComplete: handleComplete,
      onClose: () => console.log("팝업이 닫혔습니다.") // 팝업이 닫힐 때 추가 작업이 필요하면 여기에 작성
    });
  }, []); // 빈 배열을 두어 최초 렌더링 시 한 번만 실행되도록 설정

  return null; // 아무것도 렌더링하지 않음
};

export default BTripAddressComponent;
