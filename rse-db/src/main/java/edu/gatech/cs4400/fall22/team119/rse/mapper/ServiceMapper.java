package edu.gatech.cs4400.fall22.team119.rse.mapper;

import edu.gatech.cs4400.fall22.team119.rse.pojo.Service;
import org.apache.ibatis.annotations.Mapper;

import java.util.List;

/**
 * @author Zhaodong Kang
 */
@Mapper
public interface ServiceMapper {
    List<Service> displayServiceView();
    List<Service> displayService();
    Integer addService(Service service);
    Integer manageService(Service service);

}
