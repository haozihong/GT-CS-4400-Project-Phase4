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
public class Drone {
    private String id;

    private Integer tag;

    private Integer fuel;

    private Integer capacity;

    private Integer sales;

    private String flownBy;

    private String swarmId;

    private Integer swarmTag;

    private String hover;

    private String destination;

}
