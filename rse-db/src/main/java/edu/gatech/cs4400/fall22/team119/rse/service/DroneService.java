package edu.gatech.cs4400.fall22.team119.rse.service;

import edu.gatech.cs4400.fall22.team119.rse.mapper.DroneMapper;
import edu.gatech.cs4400.fall22.team119.rse.mapper.WorkerMapper;
import edu.gatech.cs4400.fall22.team119.rse.pojo.Drone;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

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

    public Integer addDrone(Drone drone) {
        return droneMapper.addDrone(drone);
    }

}
