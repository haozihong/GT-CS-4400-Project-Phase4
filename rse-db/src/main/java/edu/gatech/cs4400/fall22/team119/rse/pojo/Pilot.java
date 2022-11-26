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
public class Pilot {
    private String username;

    private String licenseID;

    private Integer experience;

    private Integer numDrones;

    private Integer numLocations;

}
