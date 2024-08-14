package com.brs.sun.security.config;

import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;
import java.util.Collections;
import org.springframework.security.core.authority.SimpleGrantedAuthority;

import com.brs.sun.model.dao.EmployeeDao;
import com.brs.sun.vo.EmployeeVo;


@Service
public class UserDetailsServiceImpl implements UserDetailsService {
    private final EmployeeDao employeeDao;

    public UserDetailsServiceImpl(EmployeeDao employeeDao) {
        this.employeeDao = employeeDao;
    }

    @Override
    public UserDetails loadUserByUsername(String empcode) throws UsernameNotFoundException {
        System.out.println("넘어온 아이디: " + empcode);
        System.out.println("loadUserByUsername 실행");

        
        // 사용자 조회, 없으면 예외 발생
        EmployeeVo emp = employeeDao.Info(empcode);
        String empCodet = String.valueOf(emp.getEmpCode());
        String commCode = String.valueOf(emp.getEmpAuth());
        if (empCodet == null) {
            throw new UsernameNotFoundException("User not found with ID: " + empcode);
        }

        // 사용자가 있다면 UserDetails 객체 생성
        return new org.springframework.security.core.userdetails.User(
        		empCodet,
                emp.getEmpPw(),
                Collections.singleton(new SimpleGrantedAuthority(commCode)));
        
    }

}
