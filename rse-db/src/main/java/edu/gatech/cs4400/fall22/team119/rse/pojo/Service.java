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
public class Service {
    private String id;

    private String longName;

    private String homeBase;

    private String manager;

    private Integer revenue;

    private Integer ingredientsCarried;

    private Integer costCarried;

    private Integer weightCarried;



}
