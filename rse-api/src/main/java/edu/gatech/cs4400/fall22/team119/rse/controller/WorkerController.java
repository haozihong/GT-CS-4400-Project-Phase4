package edu.gatech.cs4400.fall22.team119.rse.controller;

import edu.gatech.cs4400.fall22.team119.rse.pojo.Pilot;
import edu.gatech.cs4400.fall22.team119.rse.pojo.Worker;
import edu.gatech.cs4400.fall22.team119.rse.service.WorkerService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * @author Zhaodong Kang
 */
@RestController
@RequestMapping("/api")
public class WorkerController {
    private WorkerService workerService;

    @Autowired
    public WorkerController(WorkerService workerService) {
        this.workerService = workerService;
    }

    @PostMapping("/workers")
    public Integer addWorker(@RequestBody String username) {
//        System.out.println(worker);
//        System.out.println(username);
        return workerService.addWorker(username);
    }
}
