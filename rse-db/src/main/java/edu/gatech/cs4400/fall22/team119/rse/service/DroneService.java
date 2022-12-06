package edu.gatech.cs4400.fall22.team119.rse.service;

import edu.gatech.cs4400.fall22.team119.rse.mapper.DroneMapper;
import edu.gatech.cs4400.fall22.team119.rse.mapper.WorkerMapper;
import edu.gatech.cs4400.fall22.team119.rse.pojo.Drone;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

/**
 * @author Zhaodong Kang
 */
@Service
public class DroneService {
    private DroneMapper droneMapper;

    @Autowired
    public DroneService(DroneMapper droneMapper) {
        this.droneMapper = droneMapper;
    }

    public List<Drone> displayDrone(){
        return droneMapper.displayDrone();
    }
    public Integer addDrone(Drone drone) {
        return droneMapper.addDrone(drone);
    }

    public Integer takeoverDrone(Drone drone) {
        return droneMapper.takeoverDrone(drone);
    }

    public Integer joinSwarm(Drone drone) {
        return droneMapper.joinSwarm(drone);
    }

    public Integer leaveSwarm(Drone drone) {
        return droneMapper.leaveSwarm(drone);
    }
}
