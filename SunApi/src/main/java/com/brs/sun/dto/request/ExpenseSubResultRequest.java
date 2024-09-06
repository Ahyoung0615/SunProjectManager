package com.brs.sun.dto.request;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;

@Getter
@Setter
@Builder
@ToString
@NoArgsConstructor
@AllArgsConstructor
public class ExpenseSubResultRequest {

	@Schema(description = "수량")
	private String count;
	@Schema(description = "상품 이름")
	private String name;
	@Schema(description = "가격")
	private String price;
}
