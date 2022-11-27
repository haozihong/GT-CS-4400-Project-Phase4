package edu.gatech.cs4400.fall22.team119.rse.controller;

import edu.gatech.cs4400.fall22.team119.rse.pojo.Drone;
import edu.gatech.cs4400.fall22.team119.rse.service.DroneService;
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
public class DroneController {
    private DroneService droneService;

    @Autowired
    public DroneController(DroneService droneService) {
        this.droneService = droneService;
    }

    @PostMapping("/drones")
    public Integer addDrone(@RequestBody Drone drone) {
        System.out.println(drone);
        return droneService.addDrone(drone);
    }
}
