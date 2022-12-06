package edu.gatech.cs4400.fall22.team119.rse.mapper;

import edu.gatech.cs4400.fall22.team119.rse.pojo.Employee;
import org.apache.ibatis.annotations.Mapper;

import java.util.List;

/**
 * @author Zhaodong Kang
 */
@Mapper
public interface EmployeeMapper {
    List<Employee> displayEmployeeView();
    List<Employee> displayEmployee();
    Integer addEmployee(Employee employee);
    Integer hireEmployee(String username, String id);
    Integer fireEmployee(String username, String id);


}
