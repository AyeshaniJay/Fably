package lk.fably.controller;

import lk.fably.dao.PriceliststatusDao;
import lk.fably.dao.SupplierstatusDao;
import lk.fably.entity.Priceliststatus;
import lk.fably.entity.Supplierstatus;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping(value = "/priceliststatus")
public class PriceliststatusController {

    @Autowired
    private PriceliststatusDao priceliststatusDao;

    @GetMapping(value = "/list", produces = "application/json")
    public List<Priceliststatus> priceliststatuses(){
        return priceliststatusDao.findAll();
    }
}
