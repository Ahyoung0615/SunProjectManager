package com.brs.sun.dto.response;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

import com.brs.sun.vo.EmployeeVo;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;

@Getter
@Setter
@ToString
@NoArgsConstructor
@AllArgsConstructor
public class ApproverEmployeeResponse {

		@Schema(description = "사원 코드")
		private int empCode;
		@Schema(description = "사원 이름")
		private String empName;
		@Schema(description = "사원 결재 사인 이미지")
		private String empSig;
		@Schema(description = "사원 직급")
		private String jobName;
		@Schema(description = "사원 부서")
		private String deptName;
		@Schema(description = "사원 직급 코드")
		private int jobCode;
		@Schema(description = "사원 부서 코드")
		private int deptCode;
		
		public static List<ApproverEmployeeResponse> of(List<EmployeeVo> vo) {
			List<ApproverEmployeeResponse> appEmployeeList = new ArrayList<ApproverEmployeeResponse>();
			for (EmployeeVo employeeVo : vo) {
				appEmployeeList.add(new ApproverEmployeeResponse(employeeVo.getEmpCode(), employeeVo.getEmpName(), employeeVo.getEmpSig(),
						employeeVo.getJobName(), employeeVo.getDeptName(), employeeVo.getDeptCode(), employeeVo.getJobCode()));
			}
			return appEmployeeList;
		}
}
