package edu.gatech.cs4400.fall22.team119.rse.service;

import edu.gatech.cs4400.fall22.team119.rse.mapper.ServiceMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

/**
 * @author Zhaodong Kang
 */
@Service
public class ServiceService {
    private ServiceMapper serviceMapper;

    @Autowired
    public ServiceService(ServiceMapper serviceMapper) {
        this.serviceMapper = serviceMapper;
    }

    public List<edu.gatech.cs4400.fall22.team119.rse.pojo.Service> displayServiceView() {
        return serviceMapper.displayServiceView();
    }

}
