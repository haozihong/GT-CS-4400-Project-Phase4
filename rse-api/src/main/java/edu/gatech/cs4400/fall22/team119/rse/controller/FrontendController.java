package edu.gatech.cs4400.fall22.team119.rse.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;

/**
 * @author Zihong Hao
 * @date 2022/12/3 0:45
 */
@Controller
public class FrontendController {
    @RequestMapping(value = { "/{x:^(?!api|index\\.html$).*}" })
    public String getIndex() {
        return "/index.html";
    }
}
