package edu.gatech.cs4400.fall22.team119.rse.service;

import edu.gatech.cs4400.fall22.team119.rse.mapper.IngredientMapper;
import edu.gatech.cs4400.fall22.team119.rse.pojo.Ingredient;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

/**
 * @author Zihong Hao
 * @date 2022/11/23 14:40
 */
@Service
public class IngredientService {
    private IngredientMapper ingredientMapper;

    @Autowired
    public IngredientService(IngredientMapper ingredientMapper) {
        this.ingredientMapper = ingredientMapper;
    }

    public List<Ingredient> displayIngredientView() {
        return ingredientMapper.displayIngredientView();
    }

    public List<Ingredient> displayIngredient(){
        return ingredientMapper.displayIngredient();
    }

    public Integer addIngredient(Ingredient ingredient) {
        return ingredientMapper.addIngredient(ingredient);
    }

    public Integer removeIngredient(String barcode){
        return ingredientMapper.removeIngredient(barcode);
    }
}
