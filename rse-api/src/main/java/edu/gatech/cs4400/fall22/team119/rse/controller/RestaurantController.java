package edu.gatech.cs4400.fall22.team119.rse.controller;

import edu.gatech.cs4400.fall22.team119.rse.pojo.Restaurant;
import edu.gatech.cs4400.fall22.team119.rse.service.RestaurantService;
import edu.gatech.cs4400.fall22.team119.rse.service.WorkerService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

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

    @PostMapping("/restaurants")
    public Integer addRestaurant(@RequestBody Restaurant restaurant) {
        System.out.println(restaurant);
        return restaurantService.addRestaurant(restaurant);
    }

    @PostMapping("/restaurants/funding")
    public Integer startFunding(@RequestBody Restaurant restaurant) {
        System.out.println(restaurant);
        return restaurantService.startFunding(restaurant);
    }
}
