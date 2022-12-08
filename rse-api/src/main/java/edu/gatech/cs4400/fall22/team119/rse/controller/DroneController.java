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
    @GetMapping("/drones/view")
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
        System.out.println((drone));
        return droneService.joinSwarm(drone);
    }

    @PutMapping("/drones/fuel/{id}/{tag}")
    public Integer refuelDrone(@PathVariable("id") String id, @PathVariable("tag") Integer tag, @RequestParam Integer moreFuel) {
//        System.out.println((id));
//        System.out.println((tag));
//        System.out.println((moreFuel));

        return droneService.refuelDrone(id, tag, moreFuel);
    }

    @PutMapping("/drones/fly")
    public Integer flyDrone(@RequestBody Drone drone){
        return droneService.flyDrone(drone);
    }

    // TODO
    @PutMapping("/drones/loading/{id}/{tag}")
    public Integer loadDrone(@PathVariable("id") String id, @PathVariable("tag") Integer tag, @RequestParam String barcode,
                             @RequestParam Integer morePackages, @RequestParam Integer price){
        return droneService.loadDrone(id, tag, barcode, morePackages, price);
    }
    // TODO: not sure should I use the DeleteMapping
    @DeleteMapping("/drones/swarms")
    public Integer leaveSwarm(@RequestBody Drone drone) {
        System.out.println((drone));
        return droneService.leaveSwarm(drone);
    }

    @DeleteMapping("/drones/{id}/{tag}")
    public Integer removeDrone(@PathVariable("id") String id, @PathVariable("tag") Integer tag) {
        return droneService.removeDrone(id, tag);
    }



}
