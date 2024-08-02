package lk.fably.controller;

import lk.fably.dao.ProductSizeDao;
import lk.fably.entity.Productsize;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping(value = "/productsize")
public class ProductSizeController {

    @Autowired
    private ProductSizeDao productSizeDao;

    //get weight, rop by product ("/productsize/detailbysize/1/1")
    @GetMapping(value = "/detailbysize/{pid}/{sid}", produces = "application/json")
    public Productsize productsizeList(@PathVariable("pid") Integer pid, @PathVariable("sid") Integer sid){
        return productSizeDao.listbySize(pid,sid);
    }
}
