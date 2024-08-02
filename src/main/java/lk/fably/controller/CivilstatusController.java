package lk.fably.controller;

import lk.fably.dao.CivilstatusDao;
import lk.fably.entity.Civilstatus;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping(value = "/civilstatus")
public class CivilstatusController {
    @Autowired
    private CivilstatusDao civilstatusDao;

    @GetMapping(value = "/list", produces = "application/json")
    public List<Civilstatus> civilstatusList(){
        return civilstatusDao.findAll();
    }
}
