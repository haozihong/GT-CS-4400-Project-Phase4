package edu.gatech.cs4400.fall22.team119.rse.service;

import edu.gatech.cs4400.fall22.team119.rse.mapper.WorkerMapper;
import edu.gatech.cs4400.fall22.team119.rse.pojo.Worker;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

/**
 * @author Zhaodong Kang
 */
@Service
public class WorkerService {
    private WorkerMapper workerMapper;

    @Autowired
    public WorkerService(WorkerMapper workerMapper) {
        this.workerMapper = workerMapper;
    }

    public List<Worker> displayWorker(){
        return workerMapper.displayWorker();
    }
    
    public Integer addWorker(String username) {
        return workerMapper.addWorker(username);
    }
}
