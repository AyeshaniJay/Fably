package lk.fably.controller;

import lk.fably.dao.SupplierbankdetailDao;
import lk.fably.entity.CustomerOrder;
import lk.fably.entity.Supplierbankdetail;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping(value = "/supplierbankdetail")
public class SupplierbankdetailController {

    @Autowired
    private SupplierbankdetailDao supplierbankdetailDao;

    @GetMapping(value = "/list", produces = "application/json")
    public List<Supplierbankdetail> supplierbankdetailList(){
        return supplierbankdetailDao.findAll();
    }

    //get mapping for get bank detail by given path variable id -->(order/getbyid/1)
    @GetMapping(value = "/getbyid/{id}", produces = "application/json") //if return dada-->produces
    public Supplierbankdetail getOrderByPVId(@PathVariable("id") Integer id){
        return supplierbankdetailDao.getReferenceById(id);
    }

    //(/supplierbankdetail/bysupplier/1)
    @GetMapping(value = "/bysupplier/{id}", produces = "application/json")
    public List<Supplierbankdetail> bankdetailListBySupplier(@PathVariable("id") Integer id){
        return supplierbankdetailDao.getbankdetailBySupplier(id);
    }
}
