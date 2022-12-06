package edu.gatech.cs4400.fall22.team119.rse.mapper;

import edu.gatech.cs4400.fall22.team119.rse.pojo.Pilot;
import org.apache.ibatis.annotations.Mapper;

import java.util.List;

/**
 * @author Zhaodong Kang
 */
@Mapper
public interface PilotMapper {
    List<Pilot> displayPilotView();
    List<Pilot> displayPilot();
    Integer addPilot(Pilot pilot);
    Integer removePilotsRole(String username);
}
