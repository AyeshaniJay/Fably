package lk.fably.controller;

import lk.fably.dao.InvoicestatusDao;
import lk.fably.entity.Invoicestatus;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping(value = "/invoicestatus")
public class InvoicestatusController {

    @Autowired
    private InvoicestatusDao invoicestatusDao;

    @GetMapping(value = "/list", produces = "application/json")
    public List<Invoicestatus> invoicestatusList(){
        return invoicestatusDao.findAll();
    }
}
