package edu.gatech.cs4400.fall22.team119.rse.service;

import edu.gatech.cs4400.fall22.team119.rse.mapper.EmployeeMapper;
import edu.gatech.cs4400.fall22.team119.rse.pojo.Employee;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

/**
 * @author Zhaodong Kang
 */
@Service
public class EmployeeService {
    private EmployeeMapper employeeMapper;

    @Autowired
    public EmployeeService(EmployeeMapper employeeMapper) {
        this.employeeMapper = employeeMapper;
    }

    public List<Employee> displayEmployeeView() {
        return employeeMapper.displayEmployeeView();
    }

    public Integer addEmployee(Employee employee) {
        return employeeMapper.addEmployee(employee);
    }

    public Integer hireEmployee(String username, String id) {
        return employeeMapper.hireEmployee(username, id);
    }

    public Integer fireEmployee(String username, String id) {
        return employeeMapper.fireEmployee(username, id);
    }
}
