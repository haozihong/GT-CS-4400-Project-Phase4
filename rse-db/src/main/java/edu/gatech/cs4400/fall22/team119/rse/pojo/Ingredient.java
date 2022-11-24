package edu.gatech.cs4400.fall22.team119.rse.pojo;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * @author Zihong Hao
 * @date 2022/11/23 14:32
 */
@Data
@AllArgsConstructor
@NoArgsConstructor
public class Ingredient {
    private String barcode;

    private String iname;

    private Integer weight;
}
