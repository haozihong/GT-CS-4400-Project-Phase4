package edu.gatech.cs4400.fall22.team119.rse.service;

import edu.gatech.cs4400.fall22.team119.rse.mapper.WorkForMapper;
import edu.gatech.cs4400.fall22.team119.rse.mapper.WorkerMapper;
import edu.gatech.cs4400.fall22.team119.rse.pojo.WorkFor;
import edu.gatech.cs4400.fall22.team119.rse.pojo.Worker;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

/**
 * @author Zhaodong Kang
 */
@Service
public class WorkForService {
    private WorkForMapper workForMapper;

    @Autowired
    public WorkForService(WorkForMapper workForMapper) {
        this.workForMapper = workForMapper;
    }

    public List<WorkFor> displayWorkFor(){
        return workForMapper.displayWorkFor();
    }
}
