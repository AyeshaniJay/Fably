package lk.fably.controller;

import lk.fably.dao.StorestatusDao;
import lk.fably.entity.PStore;
import lk.fably.entity.Storestatus;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping(value = "/storestatus")
public class StorestatusController {

    @Autowired
    private StorestatusDao storestatusDao;

    @GetMapping(value = "/list", produces = "application/json")
    public List<Storestatus> storestatusList(){
        return storestatusDao.findAll();
    }
}
