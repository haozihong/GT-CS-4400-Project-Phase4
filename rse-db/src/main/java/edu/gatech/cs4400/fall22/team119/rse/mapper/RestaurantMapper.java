package edu.gatech.cs4400.fall22.team119.rse.mapper;

import edu.gatech.cs4400.fall22.team119.rse.pojo.Restaurant;
import org.apache.ibatis.annotations.Mapper;

/**
 * @author Zhaodong Kang
 */
@Mapper
public interface RestaurantMapper {
    Integer addRestaurant(Restaurant restaurant);
    Integer startFunding(Restaurant restaurant);
}
