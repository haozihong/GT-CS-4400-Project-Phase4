package edu.gatech.cs4400.fall22.team119.rse.controller;

import edu.gatech.cs4400.fall22.team119.rse.pojo.Drone;
import edu.gatech.cs4400.fall22.team119.rse.service.DroneService;
import edu.gatech.cs4400.fall22.team119.rse.service.WorkerService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

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
    @GetMapping("/drones")
    public List<Drone> displayDrone(){
        return droneService.displayDrone();
    }
    @PostMapping("/drones")
    public Integer addDrone(@RequestBody Drone drone) {
//        System.out.println(drone);
        return droneService.addDrone(drone);
    }
    @PutMapping("/drones")
    public Integer takeoverDrone(@RequestBody Drone drone) {
//        System.out.println((drone));
        return droneService.takeoverDrone(drone);
    }

    @PutMapping("/drones/swarms")
    public Integer joinSwarm(@RequestBody Drone drone) {
//        System.out.println((drone));
        return droneService.joinSwarm(drone);
    }

    @PutMapping("/drones/fuel")
    public Integer refuelDrone(@RequestBody Drone drone, @RequestParam Integer moreFuel) {
//        System.out.println((drone));
        return droneService.refuelDrone(drone, moreFuel);
    }

    @PutMapping("/drones/fly")
    public Integer flyDrone(@RequestBody Drone drone){
        return droneService.flyDrone(drone);
    }

    // TODO
    @PutMapping("/drones/loading")
    public Integer loadDrone(@RequestParam String id, @RequestParam Integer tag, @RequestParam String barcode,
                             @RequestParam Integer morePackages, @RequestParam Integer price){
        return droneService.loadDrone(id, tag, barcode, morePackages, price);
    }
    // TODO: not sure should I use the DeleteMapping
    @DeleteMapping("/drones/swarms")
    public Integer leaveSwarm(@RequestBody Drone drone) {
//        System.out.println((drone));
        return droneService.leaveSwarm(drone);
    }

    @DeleteMapping("/drones")
    public Integer removeDrone(@RequestBody Drone drone) {
//        System.out.println((drone));
        return droneService.removeDrone(drone);
    }



}
