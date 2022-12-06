package edu.gatech.cs4400.fall22.team119.rse.mapper;

import edu.gatech.cs4400.fall22.team119.rse.pojo.Restaurant;
import org.apache.ibatis.annotations.Mapper;

import java.util.List;

/**
 * @author Zhaodong Kang
 */
@Mapper
public interface RestaurantMapper {
    List<Restaurant> displayRestaurant();
    Integer addRestaurant(Restaurant restaurant);
    Integer startFunding(Restaurant restaurant);
}
