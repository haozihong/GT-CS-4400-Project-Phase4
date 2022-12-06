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
public class Location {
    private String label;

    private Integer xCoord;

    private Integer yCoord;

    private Integer numRestaurants;

    private Integer numDeliveryServices;

    private Integer space;

    private Integer numDrone;

}
