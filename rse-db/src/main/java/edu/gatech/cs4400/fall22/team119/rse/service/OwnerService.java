package edu.gatech.cs4400.fall22.team119.rse.service;

import edu.gatech.cs4400.fall22.team119.rse.mapper.OwnerMapper;
import edu.gatech.cs4400.fall22.team119.rse.pojo.Owner;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

/**
 * @author Zhaodong Kang
 */
@Service
public class OwnerService {
    private OwnerMapper ownerMapper;

    @Autowired
    public OwnerService(OwnerMapper ownerMapper) {
        this.ownerMapper = ownerMapper;
    }

    public List<Owner> displayOwnerView() {
        return ownerMapper.displayOwnerView();
    }

    public Integer addOwner(Owner owner) {
        return ownerMapper.addOwner(owner);
    }
}
