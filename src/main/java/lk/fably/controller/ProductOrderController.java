package lk.fably.controller;

import lk.fably.dao.ProductOrderDao;
import lk.fably.entity.ProductOrder;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping(value = "/productorder")
public class ProductOrderController {

    @Autowired
    private ProductOrderDao productOrderDao;

    //get unit price by oder, product, size ("/productorder/bycops/1/1/1")
    @GetMapping(value = "/bycops/{oid}/{pid}/{sid}", produces = "application/json")
    public ProductOrder productOrderList(@PathVariable("oid") Integer oid, @PathVariable("pid") Integer pid, @PathVariable("sid") Integer sid){
        return productOrderDao.list(oid,pid,sid);
    }

    //get ordered products by oder("/productorder/byorder/1")
    @GetMapping(value = "/byorder/{oid}", produces = "application/json")
    public List<ProductOrder> productOrderListByOrder(@PathVariable("oid") Integer oid){
        return productOrderDao.getByOrder(oid);
    }
}
