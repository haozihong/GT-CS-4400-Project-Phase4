package edu.gatech.cs4400.fall22.team119.rse.mapper;

import edu.gatech.cs4400.fall22.team119.rse.pojo.Owner;
import org.apache.ibatis.annotations.Mapper;

import java.util.List;

/**
 * @author Zhaodong Kang
 */
@Mapper
public interface OwnerMapper {
    List<Owner> displayOwnerView();
    List<Owner> displayOwner();
    Integer addOwner(Owner owner);
}
