package lk.fably.controller;

import lk.fably.dao.PricelistrequeststatusDao;
import lk.fably.dao.PriceliststatusDao;
import lk.fably.entity.Pricelistrequest;
import lk.fably.entity.Pricelistrequeststatus;
import lk.fably.entity.Priceliststatus;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping(value = "/pricelistrequeststatus")
public class PricelistrequeststatusController {

    @Autowired
    private PricelistrequeststatusDao pricelistrequeststatusDao;

    @GetMapping(value = "/list", produces = "application/json")
    public List<Pricelistrequeststatus> pricelistrequests(){
        return pricelistrequeststatusDao.findAll();
    }
}
