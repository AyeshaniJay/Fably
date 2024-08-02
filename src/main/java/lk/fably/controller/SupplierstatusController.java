package lk.fably.controller;

import lk.fably.dao.SupplierstatusDao;
import lk.fably.entity.Supplierstatus;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping(value = "/supplierstatus")
public class SupplierstatusController {

    @Autowired
    private SupplierstatusDao supplierstatusDao;

    @GetMapping(value = "/list", produces = "application/json")
    public List<Supplierstatus> supplierstatusList(){
        return supplierstatusDao.findAll();
    }
}
