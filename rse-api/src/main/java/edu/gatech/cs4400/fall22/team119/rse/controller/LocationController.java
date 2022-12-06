package edu.gatech.cs4400.fall22.team119.rse.controller;

import edu.gatech.cs4400.fall22.team119.rse.pojo.Location;

import edu.gatech.cs4400.fall22.team119.rse.pojo.Pilot;
import edu.gatech.cs4400.fall22.team119.rse.service.LocationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * @author Zhaodong Kang
 */
@RestController
@RequestMapping("/api")
public class LocationController {
    private LocationService locationService;

    @Autowired
    public LocationController(LocationService locationService) {
        this.locationService = locationService;
    }

    @GetMapping("/locations/view")
    public List<Location> displayLocationView() {
        return locationService.displayLocationView();
    }

    @GetMapping("/locations")
    public List<Location> displayLocation() {
        return locationService.displayLocation();
    }


    @PostMapping("/locations")
    public Integer addLocation(@RequestBody Location location) {
//        System.out.println(location);
        return locationService.addLocation(location);
    }
}
