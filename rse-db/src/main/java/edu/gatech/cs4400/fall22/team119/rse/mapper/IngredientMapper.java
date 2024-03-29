package edu.gatech.cs4400.fall22.team119.rse.mapper;

import edu.gatech.cs4400.fall22.team119.rse.pojo.Ingredient;
import org.apache.ibatis.annotations.Mapper;

import java.util.List;

/**
 * @author Zihong Hao
 * @date 2022/11/23 14:39
 */
@Mapper
public interface IngredientMapper {

    List<Ingredient> displayIngredientView();
    List<Ingredient> displayIngredient();
    Integer addIngredient(Ingredient ingredient);
    Integer removeIngredient(String barcode);
}
