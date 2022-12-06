package edu.gatech.cs4400.fall22.team119.rse.mapper;

import edu.gatech.cs4400.fall22.team119.rse.pojo.WorkFor;
import org.apache.ibatis.annotations.Mapper;

import java.util.List;

/**
 * @author Zhaodong Kang
 */
@Mapper
public interface WorkForMapper {
    List<WorkFor> displayWorkFor();
}
