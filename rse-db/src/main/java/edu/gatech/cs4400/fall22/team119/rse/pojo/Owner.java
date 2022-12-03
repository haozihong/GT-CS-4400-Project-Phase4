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
public class Owner {
    private String username;

    private String firstName;

    private String lastName;

    private String address;

    private Date birthdate;

    private Integer numRestaurants;

    private Integer numPlaces;

    private Integer highs;

    private Integer lows;

    private Integer debt;
}
