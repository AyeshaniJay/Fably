package lk.fably.controller;

import lk.fably.dao.PorderstatusDao;
import lk.fably.dao.PriceliststatusDao;
import lk.fably.entity.Porderstatus;
import lk.fably.entity.Priceliststatus;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping(value = "/porderstatus")
public class PorderstatusController {

    @Autowired
    private PorderstatusDao porderstatusDao;

    @GetMapping(value = "/list", produces = "application/json")
    public List<Porderstatus> porderstatusList(){
        return porderstatusDao.findAll();
    }
}
