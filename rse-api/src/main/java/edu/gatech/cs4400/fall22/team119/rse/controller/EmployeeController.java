package edu.gatech.cs4400.fall22.team119.rse.controller;

import edu.gatech.cs4400.fall22.team119.rse.pojo.Employee;
import edu.gatech.cs4400.fall22.team119.rse.service.EmployeeService;
import org.springframework.beans.factory.annotation.Autowired;

import org.springframework.web.bind.annotation.*;


import java.util.List;

/**
 * @author Zhaodong Kang
 */
@RestController
@RequestMapping("/api")
public class EmployeeController {
    private EmployeeService employeeService;

    @Autowired
    public EmployeeController(EmployeeService employeeService) {
        this.employeeService = employeeService;
    }

    @GetMapping("/employees")
    public List<Employee> displayEmployeeView() {
        return employeeService.displayEmployeeView();
    }

    @PostMapping("/employees")
    public Integer addEmployee(@RequestBody Employee employee) {
//        System.out.println(employee);
        return employeeService.addEmployee(employee);
    }

    @PutMapping("/employees")
    public Integer hireEmployee(@RequestParam String username, @RequestParam String id) {
        System.out.println(username);
        System.out.println(id);
        return employeeService.hireEmployee(username, id);
    }

    @DeleteMapping("/employees")
    public Integer fireEmployee(@RequestParam String username, @RequestParam String id) {
        return employeeService.fireEmployee(username, id);
    }

}
