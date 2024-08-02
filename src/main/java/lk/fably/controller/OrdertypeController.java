package lk.fably.controller;

import lk.fably.dao.OrderstatusDao;
import lk.fably.dao.OrdertypeDao;
import lk.fably.entity.Orderstatus;
import lk.fably.entity.Ordertype;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping(value = "/ordertype")
public class OrdertypeController {

    @Autowired
    private OrdertypeDao ordertypeDao;

    @GetMapping(value = "/list", produces = "application/json")
    public List<Ordertype> ordertypeList(){
        return ordertypeDao.findAll();
    }
}
