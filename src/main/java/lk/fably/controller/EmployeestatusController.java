package lk.fably.controller;

import lk.fably.dao.CivilstatusDao;
import lk.fably.dao.EmployeestatusDao;
import lk.fably.entity.Employeestatus;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping(value = "/employeestatus")
public class EmployeestatusController {

    @Autowired
    private EmployeestatusDao employeestatusDao;

    @GetMapping(value = "/list", produces = "application/json")
    public List<Employeestatus> employeestatusList(){
        return employeestatusDao.findAll();
    }
}
