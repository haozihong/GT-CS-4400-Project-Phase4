package edu.gatech.cs4400.fall22.team119.rse.controller;

import edu.gatech.cs4400.fall22.team119.rse.pojo.WorkFor;
import edu.gatech.cs4400.fall22.team119.rse.pojo.Worker;
import edu.gatech.cs4400.fall22.team119.rse.service.WorkForService;
import edu.gatech.cs4400.fall22.team119.rse.service.WorkerService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * @author Zhaodong Kang
 */
@RestController
@RequestMapping("/api")
public class WorkForController {
    private WorkForService workForService;

    @Autowired
    public WorkForController(WorkForService workForService) {
        this.workForService = workForService;
    }
    @GetMapping("work_for")
    public List<WorkFor> displayWorkFor(){
        return workForService.displayWorkFor();
    }
}
