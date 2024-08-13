package com.brs.sun.comm.aop;

import java.util.Arrays;

import org.aspectj.lang.JoinPoint;
import org.aspectj.lang.annotation.AfterReturning;
import org.aspectj.lang.annotation.AfterThrowing;
import org.aspectj.lang.annotation.Aspect;
import org.aspectj.lang.annotation.Before;
import org.aspectj.lang.annotation.Pointcut;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Component;

@Aspect
@Component
public class LogAop {

	private static final Logger log = LoggerFactory.getLogger(LogAop.class);
	
	@Pointcut(value = "execution(public * com.brs.sun.model.service.*Service*.*(..))")
	public void pointCut() {}
	
	@Before("pointCut()")
	public void before(JoinPoint joinPoint) {
		log.info("[AOP Logger]Start Method: {}", joinPoint.getSignature().getName());
		
		Object[] obj = joinPoint.getArgs();
		if(obj != null) {
			log.info("[AOP Logger] Arguments: {}", Arrays.toString(obj));
		}
	}
	
	@AfterReturning(pointcut = "pointCut()", returning = "returnValue")
	public void afterReturning(JoinPoint joinPoint, Object returnValue) {
		log.info("[AOP Logger] ResultValue: {}",returnValue);
	}
	
	@AfterThrowing(pointcut = "pointCut()", throwing = "error")
	public void afterThrowing(JoinPoint joinPoint, Exception error) {
		log.info("[AOP Logger] Exception Method: {}", joinPoint.getSignature().getName());
		log.info("[AOP Logger] Error Message: {}", error.getMessage());
	}
}
