package edu.gatech.cs4400.fall22.team119.rse.mapper;

import edu.gatech.cs4400.fall22.team119.rse.pojo.Location;
import edu.gatech.cs4400.fall22.team119.rse.pojo.Pilot;
import org.apache.ibatis.annotations.Mapper;

import java.util.List;

/**
 * @author Zhaodong Kang
 */
@Mapper
public interface LocationMapper {
    List<Location> displayLocationView();
}
