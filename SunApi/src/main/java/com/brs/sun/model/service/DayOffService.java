package com.brs.sun.model.service;

import java.util.Map;

public interface DayOffService {
	

	boolean dayOffTransaction(int empCode, Map<String, Object> map);
}
