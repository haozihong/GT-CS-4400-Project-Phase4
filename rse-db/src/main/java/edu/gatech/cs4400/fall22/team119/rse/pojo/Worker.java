package edu.gatech.cs4400.fall22.team119.rse.pojo;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Date;

/**
 * @author Zhaodong Kang
 */
@Data
@AllArgsConstructor
@NoArgsConstructor
public class Worker {
    private String username;
    private String id;
    private String firstName;
    private String lastName;
    private String address;
    private Date birthdate;
}
