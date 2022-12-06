package edu.gatech.cs4400.fall22.team119.rse.service;

import edu.gatech.cs4400.fall22.team119.rse.mapper.PilotMapper;
import edu.gatech.cs4400.fall22.team119.rse.pojo.Pilot;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

/**
 * @author Zhaodong Kang
 */
@Service
public class PilotService {
    private PilotMapper pilotMapper;

    @Autowired
    public PilotService(PilotMapper pilotMapper) {
        this.pilotMapper = pilotMapper;
    }

    public List<Pilot> displayPilotView() {
        return pilotMapper.displayPilotView();
    }

    public List<Pilot> displayPilot() {
        return pilotMapper.displayPilot();
    }

    public Integer addPilot(Pilot pilot) {
        return pilotMapper.addPilot(pilot);
    }
}
