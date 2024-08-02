package lk.fably.controller;

import lk.fably.dao.CourierDao;
import lk.fably.dao.InvoicestatusDao;
import lk.fably.entity.Courier;
import lk.fably.entity.CustomerOrder;
import lk.fably.entity.Invoicestatus;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping(value = "/courier")
public class CourierController {

    @Autowired
    private CourierDao courierDao;

    @GetMapping(value = "/list", produces = "application/json")
    public List<Courier> courierList(){
        return courierDao.findAll();
    }

    //get mapping for get order by given path variable id -->(order/getbyid/1)
    @GetMapping(value = "/getbyid/{id}", produces = "application/json") //if return dada-->produces
    public Courier getCourierByPVId(@PathVariable("id") Integer id) {
        return courierDao.getReferenceById(id);
    }
}
