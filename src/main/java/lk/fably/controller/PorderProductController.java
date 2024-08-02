package lk.fably.controller;

import lk.fably.dao.PorderProductDao;
import lk.fably.dao.ProductOrderDao;
import lk.fably.entity.PorderProduct;
import lk.fably.entity.ProductOrder;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping(value = "/porderproduct")
public class PorderProductController {

    @Autowired
    private PorderProductDao porderProductDao;

    //get unit price by oder, product, size ("/productorder/bypops/1/1/1")
    @GetMapping(value = "/bypops/{poid}/{pid}/{sid}", produces = "application/json")
    public PorderProduct productOrderList(@PathVariable("poid") Integer poid, @PathVariable("pid") Integer pid, @PathVariable("sid") Integer sid){
        return porderProductDao.list(poid,pid,sid);
    }

    //get ordered products by oder("/productorder/byorder/1")
//    @GetMapping(value = "/byorder/{oid}", produces = "application/json")
//    public List<PorderProduct> productOrderListByOrder(@PathVariable("oid") Integer oid){
//        return porderProductDao.getByOrder(oid);
//    }
}
