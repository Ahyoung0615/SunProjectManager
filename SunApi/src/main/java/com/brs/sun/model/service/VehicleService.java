package com.brs.sun.model.service;

import java.io.IOException;
import java.util.List;

import org.springframework.web.multipart.MultipartFile;

import com.brs.sun.vo.RepairVo;
import com.brs.sun.vo.VehicleVo;

public interface VehicleService {
	/**
	 * 차량 전체 조회 메서드. 차량 타입을 넣으면 필터 기능.
	 * 
	 * @param vehicleType (전체 null, 영업 C, 화물 F)
	 * @return List<VehicleVo>
	 */
	public List<VehicleVo> getAllVehicle(int first, int last, String vehicleType);

	/**
	 * 차량 상세 조회
	 * 
	 * @return VehicleVo
	 */
	public VehicleVo getOneVehicle(String vehicleCode);

	/**
	 * 차량 상세 조회시 함께 조회되는 수리 내역 상세 조회
	 * 
	 * @return RepairVo
	 */
	public List<RepairVo> getAllRepair(String vehicleCode);

	/**
	 * 차량 신규 등록
	 * 
	 * @return 0 또는 1
	 * @throws Exception 
	 */
	public int insertVehicle(VehicleVo vo, MultipartFile file) throws Exception;

	/**
	 * 차량 이미지 파일 등록
	 * 
	 * @return 0 또는 1
	 * @throws IOException 파일 처리 중 오류 발생 시
	 * @throws Exception 
	 */
	int updateVehicleImage(String vehicleCode, MultipartFile file) throws IOException, Exception;

	/**
	 * 차량 상태 변경 (출차 O, 보관 I, 수리 R)
	 * 
	 * @return 0 또는 1
	 */
	public int updateVehicleStatus(String vehicleCode, String vehicleStatus);

	/**
	 * 차량 소프트 삭제 (삭제 Y, 유지 N)
	 * 
	 * @return 0 또는 1
	 */
	public int deleteVehicle(String vehicleCode);

	/**
	 * 트랜잭션
	 * 차량 수리 내역 등록 (수리중I, 수리완료O)
	 * 수리중I 상태일 경우 차량 상태 R로 업데이트 (수리중 R)
	 * @param RepairVo
	 * @return 0 또는 1
	 */
	public int updateVRStatusIR(RepairVo vo);
	
	/**
	 * 트랜잭션
	 * 차량 수리 완료 업데이트 (수리완료O)
	 * 차량 수리 완료시 상태 업데이트 (보관 I)
	 * @param RepairCode
	 * @return 0 또는 1
	 */
	public int updateVRStatusOI(String RepairCode);
	
	/**
	 * 차량 조회 갯수 확인
	 * @param vehicleType
	 * @return int
	 */
	public int countVehicle(String vehicleType);
}
