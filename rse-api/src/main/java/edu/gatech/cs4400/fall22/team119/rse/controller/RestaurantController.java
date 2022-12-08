package edu.gatech.cs4400.fall22.team119.rse.controller;

import edu.gatech.cs4400.fall22.team119.rse.pojo.Restaurant;
import edu.gatech.cs4400.fall22.team119.rse.service.RestaurantService;
import edu.gatech.cs4400.fall22.team119.rse.service.WorkerService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * @author Zhaodong Kang
 */
@RestController
@RequestMapping("/api")
public class RestaurantController {
    private RestaurantService restaurantService;

    @Autowired
    public RestaurantController(RestaurantService restaurantService) {
        this.restaurantService = restaurantService;
    }

    @GetMapping("/restaurants/view")
    public List<Restaurant> displayRestaurant(){
        return restaurantService.displayRestaurant();
    }
    @PostMapping("/restaurants")
    public Integer addRestaurant(@RequestBody Restaurant restaurant) {
//        System.out.println(restaurant);
        return restaurantService.addRestaurant(restaurant);
    }

    @PutMapping("/restaurants")
    public Integer startFunding(@RequestBody Restaurant restaurant) {
        System.out.println(restaurant);
        return restaurantService.startFunding(restaurant);
    }

    @PutMapping("/restaurants/purchase")
    public Integer purchaseIngredient(@RequestParam String longName, @RequestParam String id, @RequestParam Integer tag,
                                      @RequestParam String barcode, @RequestParam Integer quantity){
        return restaurantService.purchaseIngredient(longName, id, tag, barcode, quantity);
    }
}
