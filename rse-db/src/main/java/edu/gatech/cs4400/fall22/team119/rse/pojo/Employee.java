package edu.gatech.cs4400.fall22.team119.rse.pojo;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * @author Zhaodong Kang
 */
@Data
@AllArgsConstructor
@NoArgsConstructor
public class Employee {
    private String username;

    private String taxID;

    private Integer salary;

    private String hired;

    private Integer employeeExperience;

    private String licenseID;

    private String pilotingExperience;

    private String managerStatus;

}
