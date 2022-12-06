package edu.gatech.cs4400.fall22.team119.rse.service;

import edu.gatech.cs4400.fall22.team119.rse.mapper.LocationMapper;
import edu.gatech.cs4400.fall22.team119.rse.pojo.Location;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

/**
 * @author Zhaodong Kang
 */
@Service
public class LocationService {
    private LocationMapper locationMapper;

    @Autowired
    public LocationService(LocationMapper locationMapper) {
        this.locationMapper = locationMapper;
    }

    public List<Location> displayLocationView() {
        return locationMapper.displayLocationView();
    }

    public List<Location> displayLocation(){
        return locationMapper.displayLocation();
    }

    public Integer addLocation(Location location) {
        return locationMapper.addLocation(location);
    }

}
