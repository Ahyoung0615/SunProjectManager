package com.brs.sun.model.service;

import java.io.File;
import java.io.FileInputStream;
import java.io.FileOutputStream;
import java.io.IOException;
import java.util.Base64;
import java.util.List;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import com.brs.sun.model.dao.VehicleDao;
import com.brs.sun.vo.RepairVo;
import com.brs.sun.vo.VehicleVo;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class VehicleServiceImpl implements VehicleService {

	private final VehicleDao dao;
	private final String path = "src/main/resources/static/vehicleImage";

	@Override
	public List<VehicleVo> getAllVehicle(int first, int last, String vehicleType) {
		return dao.getAllVehicle(first, last, vehicleType);
	}

	@Override
	public VehicleVo getOneVehicle(String vehicleCode) {
		return dao.getOneVehicle(vehicleCode);
	}

	@Override
	public List<RepairVo> getAllRepair(String vehicleCode) {
		return dao.getAllRepair(vehicleCode);
	}

	@Override
	public int insertVehicle(VehicleVo vo, MultipartFile file) throws Exception {

		String fileName = "";
		if (file != null) {

			File dir = new File(path);
			if (!dir.exists()) {
				dir.mkdirs();
			}

			fileName = vo.getVehicleCode() + "_" + file.getOriginalFilename();
			FileOutputStream outputStream = new FileOutputStream(new File(path + "/" + fileName));
			outputStream.write(file.getBytes());
			outputStream.flush();
			outputStream.close();

		}
		VehicleVo newVehicle = VehicleVo.builder().vehicleNo(vo.getVehicleNo()).vehicleModel(vo.getVehicleModel())
				.vehicleRegdate(vo.getVehicleRegdate()).vehicleType(vo.getVehicleType())
				.vehicleSize(vo.getVehicleSize()).vehicleImg(fileName).build();

		return dao.insertVehicle(newVehicle);
	}

	@Override
	public int updateVehicleImage(String vehicleCode, MultipartFile file) throws Exception {

		File dir = new File(path);
		if (!dir.exists()) {
			dir.mkdirs();
		}

		String fileName = vehicleCode + "_" + file.getOriginalFilename();
		FileOutputStream outputStream = new FileOutputStream(new File(path + "/" + fileName));
		outputStream.write(file.getBytes());
		outputStream.flush();
		outputStream.close();

		return dao.updateVehicleImage(vehicleCode, fileName);
	}

	@Override
	public int updateVehicleStatus(String vehicleCode, String vehicleStatus) {
		return dao.updateVehicleStatus(vehicleCode, vehicleStatus);
	}

	@Override
	public int deleteVehicle(String vehicleCode) {
		return dao.deleteVehicle(vehicleCode);
	}

	@Transactional
	@Override
	public int updateVRStatusIR(RepairVo vo) {
		RepairVo newRepair = RepairVo.builder().vehicleCode(vo.getVehicleCode()).repairDetail(vo.getRepairDetail())
				.repairDate(vo.getRepairDate()).repairReason(vo.getRepairReason()).repairStatus(vo.getRepairStatus())
				.build();
		int r = dao.insertRepair(newRepair);
		int v = dao.updateVehicleStatusR();
		if ((r + v) > 0) {
			return 1;
		}
		return 0;
	}

	@Transactional
	@Override
	public int updateVRStatusOI(String RepairCode) {
		int r = dao.updateRepairStatusO(RepairCode);
		int v = dao.updateVehicleStatusI(RepairCode);
		if ((r + v) == 2) {
			return 1;
		}
		return 0;
	}

	@Override
	public int countVehicle(String vehicleType) {
		return dao.countVehicle(vehicleType);
	}

	@Override
	public String selectVehicleImages(String vehicleCodes) {

		VehicleVo vehicleImage = dao.selectVehicleImages(vehicleCodes);
		String vehicleImgBase64 = "";
			if (vehicleImage != null && vehicleImage.getVehicleImg() != null) {
				File vehicleImgFile = new File(path + "/" + vehicleImage.getVehicleImg());
				try (FileInputStream fileInputStream = new FileInputStream(vehicleImgFile)) {
					byte[] vehicleImgBytes = new byte[(int) vehicleImgFile.length()];
					fileInputStream.read(vehicleImgBytes);

					// Base64로 인코딩
					String base64Encoded = Base64.getEncoder().encodeToString(vehicleImgBytes);
					vehicleImgBase64 = "data:image/"
							+ (vehicleImage.getVehicleImg().substring(vehicleImage.getVehicleImg().lastIndexOf(".") + 1))
							+ ";base64," + base64Encoded;
					return vehicleImgBase64;
				} catch (IOException e) {
					e.printStackTrace();
				}
			} else {
				return "";
			}
			return vehicleImgBase64;
			
	}
}
