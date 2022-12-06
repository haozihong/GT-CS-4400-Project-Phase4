package edu.gatech.cs4400.fall22.team119.rse.controller;


import edu.gatech.cs4400.fall22.team119.rse.pojo.Owner;
import edu.gatech.cs4400.fall22.team119.rse.pojo.Pilot;
import edu.gatech.cs4400.fall22.team119.rse.service.PilotService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * @author Zhaodong Kang
 */
@RestController
@RequestMapping("/api")
public class PilotController {
    private PilotService pilotService;

    @Autowired
    public PilotController(PilotService pilotService) {
        this.pilotService = pilotService;
    }

    @GetMapping("/pilots/view")
    public List<Pilot> displayPilotView() {
        return pilotService.displayPilotView();
    }

    @GetMapping("/pilots/view")
    public List<Pilot> displayPilot() {
        return pilotService.displayPilot();
    }

    @PostMapping("/pilots")
    public Integer addPilot(@RequestBody Pilot pilot) {
//        System.out.println(pilot);
        return pilotService.addPilot(pilot);
    }
}
