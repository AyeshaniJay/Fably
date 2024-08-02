package lk.fably.controller;

import lk.fably.dao.CustomerstatusDao;
import lk.fably.entity.Customerstatus;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping(value = "/customerstatus")
public class CustomerstatusController {

    @Autowired
    private CustomerstatusDao customerstatusDao;

    @GetMapping(value = "/list", produces = "application/json")
    public List<Customerstatus> customerstatusList(){
        return customerstatusDao.findAll();
    }
}
