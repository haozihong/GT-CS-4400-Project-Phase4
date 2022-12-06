package edu.gatech.cs4400.fall22.team119.rse.mapper;

import edu.gatech.cs4400.fall22.team119.rse.pojo.Drone;
import org.apache.ibatis.annotations.Mapper;

import java.util.List;

/**
 * @author Zhaodong Kang
 */
@Mapper
public interface DroneMapper {
    List<Drone> displayDrone();
    Integer addDrone(Drone drone);
    Integer takeoverDrone(Drone drone);
    Integer joinSwarm(Drone drone);
    Integer leaveSwarm(Drone drone);
    Integer removeDrone(String id, Integer tag);
    Integer flyDrone(Drone drone);
    Integer refuelDrone(String id, Integer tag, Integer moreFuel);
    Integer loadDrone(String id, Integer tag, String barcode, Integer morePackages, Integer price);
}

