package com.brs.sun.model.service;

import java.util.List;
import java.util.Map;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.brs.sun.dto.request.BTripRequestDTO;
import com.brs.sun.dto.response.VehicleRentDTO;
import com.brs.sun.model.dao.BTripDao;
import com.brs.sun.vo.BTripVo;
import com.brs.sun.vo.CoWorkVo;
import com.brs.sun.vo.VehicleReservationVo;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class BTripServiceImpl implements BTripService {
	
	private final BTripDao dao;
	
	@Override
	public List<BTripVo> getMyBTrip(String empCode) {
		return dao.getMyBTrip(empCode);
	}

	@Override
	public BTripVo getOneBTrip(String bTripCode, String empCode) {
		return dao.getOneBTrip(bTripCode, empCode);
	}

	@Override
	public List<VehicleReservationVo> getMyVehicleRsv(String bTripCode, String empCode) {
		return dao.getMyVehicleRsv(bTripCode, empCode);
	}

	@Override
	public int insertBTrip(BTripVo vo) {
		return dao.insertBTrip(vo);
	}

	@Override
	public int insertVehicleRsv(VehicleReservationVo vo) {
		return dao.insertVehicleRsv(vo);
	}
	@Transactional
	@Override
	public int insertBTripVRsv(BTripRequestDTO dto) {
	    // BTripVo로 변환
	    BTripVo bTripVo = BTripVo.builder()
	            .empCode(dto.getEmpCode())
	            .bTripStartDate(dto.getBrstartdate())
	            .bTripEndDate(dto.getBrenddate())
	            .bTripDetail(dto.getBrdetail())
	            .bTripDepart(dto.getBrdepart())
	            .bTripArrival(dto.getBrarrival())
	            .vehicleCode(dto.getVehicleCode() != 0 ? dto.getVehicleCode() : null) // vehicleCode가 0이 아닐 때만 설정
	            .build();

	    // BTrip 테이블에 출장 정보 삽입 및 생성된 키 값 가져오기
	    dao.insertBTrip(bTripVo);
	    int generatedBTripCode = bTripVo.getBTripCode(); // MyBatis의 selectKey나 useGeneratedKeys를 통해 값이 설정됨

	    // 배차 신청서가 있는 경우만 처리
	    if (dto.getVehicleCode() != 0 && dto.getVrsvDetail() != null && !dto.getVrsvDetail().isEmpty()) {
	        VehicleReservationVo vehicleReservationVo = VehicleReservationVo.builder()
	                .bTripCode(generatedBTripCode)
	                .vehicleCode(dto.getVehicleCode())
	                .vrsvDate(dto.getVrsvDate())
	                .vrsvDetail(dto.getVrsvDetail())
	                .build();

	        // VEHICLERESERVATION 테이블에 배차 정보 삽입
	        dao.insertVehicleRsv(vehicleReservationVo);
	    }

	    return generatedBTripCode;
	}


	@Override
	public List<VehicleRentDTO> getAllVehicleRsv(int first, int last, String startDate, String endDate) {
		return dao.getAllVehicleRsv(first, last, startDate, endDate);
	}

	@Override
	public List<CoWorkVo> searchCoWork(int first, int last, String cowName, String cowAddress) {
		return dao.searchCoWork(first, last, cowName, cowAddress);
	}

	@Override
	public int countCoWork(String cowName, String cowAddress) {
		return dao.countCoWork(cowName, cowAddress);
	}

	@Override
	public int countVehicleRsv(String startDate, String endDate) {
		return dao.countVehicleRsv(startDate, endDate);
	}

	@Override
	public List<Map<String, Object>> getAvailableVehicles(String startDate, String endDate) {
		return dao.getAvailableVehicles(startDate, endDate);
	}

	@Override
	public int updateVehicleRsrvYes(String vrsvCode) {
		return dao.updateVehicleRsrvYes(vrsvCode);
	}

	@Override
	public int updateVehicleRsrvNo(String vrsvCode, String vrsvReply) {
		return dao.updateVehicleRsrvNo(vrsvCode, vrsvReply);
	}

	@Override
	public VehicleReservationVo getOneVehicleRsv(String vrsvCode) {
		return dao.getOneVehicleRsv(vrsvCode);
	}

}