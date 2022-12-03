package edu.gatech.cs4400.fall22.team119.rse.controller;

import edu.gatech.cs4400.fall22.team119.rse.pojo.Employee;
import edu.gatech.cs4400.fall22.team119.rse.pojo.Ingredient;
import edu.gatech.cs4400.fall22.team119.rse.service.IngredientService;
import org.springframework.beans.factory.annotation.Autowired;

import org.springframework.web.bind.annotation.*;
import java.util.List;

/**
 * @author Zihong Hao
 * @date 2022/11/23 14:48
 */
@RestController
@RequestMapping("/api")
public class IngredientController {
    private IngredientService ingredientService;

    @Autowired
    public IngredientController(IngredientService ingredientService) {
        this.ingredientService = ingredientService;
    }

//    @GetMapping("/ingredients")
//    public List<Ingredient> getAllIngredients() {
//        return ingredientService.getAllIngredients();
//    }
    @GetMapping("/ingredients")
    public List<Ingredient> displayIngredientView() {
        return ingredientService.displayIngredientView();

    }

    @PostMapping("/ingredients")
    public Integer addIngredient(@RequestBody Ingredient ingredient) {
//        System.out.println(ingredient);
        return ingredientService.addIngredient(ingredient);
    }

}
