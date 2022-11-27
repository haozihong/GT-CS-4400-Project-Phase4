package edu.gatech.cs4400.fall22.team119.rse.mapper;

import edu.gatech.cs4400.fall22.team119.rse.pojo.Drone;
import org.apache.ibatis.annotations.Mapper;

/**
 * @author Zhaodong Kang
 */
@Mapper
public interface DroneMapper {
    Integer addDrone(Drone drone);
}
