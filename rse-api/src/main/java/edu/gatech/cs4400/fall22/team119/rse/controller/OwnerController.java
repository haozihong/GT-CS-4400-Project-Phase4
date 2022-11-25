package edu.gatech.cs4400.fall22.team119.rse.controller;

import edu.gatech.cs4400.fall22.team119.rse.pojo.Owner;
import edu.gatech.cs4400.fall22.team119.rse.service.OwnerService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

/**
 * @author Zhaodong Kang
 */
@RestController
public class OwnerController {
    private OwnerService ownerService;

    @Autowired
    public OwnerController(OwnerService ownerService) {
        this.ownerService = ownerService;
    }

    @GetMapping("/owners")
    public List<Owner> displayOwnerView() {
        return ownerService.displayOwnerView();
    }
}
