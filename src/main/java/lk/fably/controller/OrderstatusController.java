package lk.fably.controller;

import lk.fably.dao.OrderstatusDao;
import lk.fably.dao.ProductstatusDao;
import lk.fably.entity.Orderstatus;
import lk.fably.entity.Productstatus;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping(value = "/orderstatus")
public class OrderstatusController {

    @Autowired
    private OrderstatusDao orderstatusDao;

    @GetMapping(value = "/list", produces = "application/json")
    public List<Orderstatus> orderstatusList(){
        return orderstatusDao.findAll();
    }

    @GetMapping(value = "/listfororder", produces = "application/json")
    public List<Orderstatus> orderstatusListForOrder(){
        return orderstatusDao.getForOrder();
    }

    //get orderstatus by order Id (/orderstatus/byorderid/1)
    @GetMapping(value = "/byorderid/{id}", produces = "application/json")
    public List<Orderstatus> orderstatusByOrderid(@PathVariable("id") Integer id){
        return orderstatusDao.getByOrderId(id);
    }

    //get orderstatus by invoice Id (/orderstatus/byinvoiceid/1)
    @GetMapping(value = "/byinvoiceid/{id}", produces = "application/json")
    public Orderstatus orderstatusByInvoiceid(@PathVariable("id") Integer id){
        return orderstatusDao.getByInvoiceId(id);
    }
}
