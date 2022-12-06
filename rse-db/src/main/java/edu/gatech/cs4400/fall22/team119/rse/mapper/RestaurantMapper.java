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
    Integer purchaseIngredient(String longName, String id, Integer tag, String barcode, Integer quantity);
}
