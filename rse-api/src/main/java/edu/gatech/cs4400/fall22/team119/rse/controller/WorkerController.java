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
    @GetMapping("workers/view")
    public List<Worker> displayWorkerView(){
        return workerService.displayWorkerView();
    }
    @GetMapping("workers")
    public List<Worker> displayWorker(){
        return workerService.displayWorker();
    }
    @PostMapping("/workers")
    public Integer addWorker(@RequestBody Worker worker) {
        return workerService.addWorker(worker);
    }
}
