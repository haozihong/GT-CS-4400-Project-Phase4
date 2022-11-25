package edu.gatech.cs4400.fall22.team119.rse.controller;

import edu.gatech.cs4400.fall22.team119.rse.pojo.Service;
import edu.gatech.cs4400.fall22.team119.rse.service.ServiceService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

/**
 * @author Zhaodong Kang
 */
@RestController
public class ServiceController {
    private ServiceService serviceService;

    @Autowired
    public ServiceController(ServiceService serviceService) {
        this.serviceService = serviceService;
    }

    @GetMapping("/services")
    public List<Service> displayServiceView() {
        return serviceService.displayServiceView();
    }
}
