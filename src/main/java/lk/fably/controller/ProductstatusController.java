package lk.fably.controller;

import lk.fably.dao.ProductstatusDao;
import lk.fably.entity.Productstatus;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping(value = "/productstatus")
public class ProductstatusController {

    @Autowired
    private ProductstatusDao productstatusDao;

    @GetMapping(value = "/list", produces = "application/json")
    public List<Productstatus> productstatusList(){
        return productstatusDao.findAll();
    }
}
