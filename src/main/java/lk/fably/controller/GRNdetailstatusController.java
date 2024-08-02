package lk.fably.controller;

import lk.fably.dao.GRNdetailstatusDao;
import lk.fably.dao.OrderstatusDao;
import lk.fably.entity.GRNdetailstatus;
import lk.fably.entity.Orderstatus;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping(value = "/grndetailstatus")
public class GRNdetailstatusController {

    @Autowired
    private GRNdetailstatusDao grndetailstatusDao;

    @GetMapping(value = "/list", produces = "application/json")
    public List<GRNdetailstatus> grndetailstatusList(){
        return grndetailstatusDao.findAll();
    }
}
