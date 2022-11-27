package edu.gatech.cs4400.fall22.team119.rse.service;

import edu.gatech.cs4400.fall22.team119.rse.mapper.RestaurantMapper;
import edu.gatech.cs4400.fall22.team119.rse.mapper.WorkerMapper;
import edu.gatech.cs4400.fall22.team119.rse.pojo.Restaurant;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

/**
 * @author Zhaodong Kang
 */
@Service
public class RestaurantService {
    private RestaurantMapper restaurantMapper;

    @Autowired
    public RestaurantService(RestaurantMapper restaurantMapper) {
        this.restaurantMapper = restaurantMapper;
    }

    public Integer addRestaurant(Restaurant restaurant) {
        return restaurantMapper.addRestaurant(restaurant);
    }

    public Integer startFunding(Restaurant restaurant) {
        return restaurantMapper.startFunding(restaurant);
    }

}
