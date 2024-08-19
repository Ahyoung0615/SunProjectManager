package com.brs.sun.model.service;

import java.util.List;

import com.brs.sun.vo.BTripVo;
import com.brs.sun.vo.CoWorkVo;
import com.brs.sun.vo.VehicleReservationVo;

public interface BTripService {
	/**
	 * 사용자 출장 조회
	 * @param empCode
	 * @return List<BTripVo>
	 */
	public List<BTripVo> getMyBTrip(String empCode);

	/**
	 * 출장 상세 조회
	 * @param bTripCode
	 * @param empCode
	 * @return BTripVo
	 */
	public BTripVo getOneBTrip(String bTripCode, String empCode);
	
	/**
	 * 배차신청 상세조회
	 * @param bTripCode
	 * @param empCode
	 * @return VehicleReservationVo
	 */
	public VehicleReservationVo getMyVehicleRsv(String bTripCode, String empCode);
	
	/**
	 * 출장 단일 입력
	 * @param vo
	 * @return 0 또는 1
	 */
	public int insertBTrip(BTripVo vo);
	
	/**
	 * 배차신청서 단일 입력
	 * @param vo
	 * @return 0 또는 1
	 */
	public int insertVehicleRsv(VehicleReservationVo vo);
	
	/**
	 * 트랜잭션
	 * 출장신청서/배차신청서 동시입력
	 * @param vo
	 * @param vo2
	 * @return 0 또는 1
	 */
	public int insertBTripVRsv(BTripVo vo, VehicleReservationVo vo2);
	
	/**
	 * 관리자 배차신청서 전체 조회, 기간 지정
	 * @param first
	 * @param last
	 * @param startDate
	 * @param endDate
	 * @return List<VehicleReservationVo>
	 */
	public List<VehicleReservationVo> getAllVehicleRsv(int first, int last, String startDate, String endDate);
	
	/**
	 * 협력사 전체조회/검색조회(이름, 주소)
	 * 이름/주소에 null 입력시 전체조회
	 * 페이징 처리
	 * @param first
	 * @param last
	 * @param cowName
	 * @param coAddress
	 * @return List<CoWorkVo>
	 */
	public List<CoWorkVo> searchCoWork(int first, int last, String cowName, String cowAddress);
	
	/**
	 * 협력사 조회 총 갯수
	 * @param cowName
	 * @param cowAddress
	 * @return int (몇 개의 행이 조회되는지)
	 */
	public int countCoWork(String cowName, String cowAddress);
}
