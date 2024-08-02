package lk.fably.controller;

import lk.fably.dao.InvoiceProductDao;
import lk.fably.dao.ProductOrderDao;
import lk.fably.entity.InvoiceProduct;
import lk.fably.entity.ProductOrder;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping(value = "/invoiceproduct")
public class InvoiceProductController {

    @Autowired
    private InvoiceProductDao invoiceProductDao;

    //get unit price by oder, product, size ("/invoiceproduct/list")
    @GetMapping(value = "/list/{id}", produces = "application/json")
    public List<InvoiceProduct> invoiceProductList(@PathVariable("id") Integer id){
        return invoiceProductDao.list(id);
    }

}
