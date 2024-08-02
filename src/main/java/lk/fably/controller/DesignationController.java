package lk.fably.controller;

import lk.fably.dao.DesignationDao;
import lk.fably.entity.Designation;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping(value = "/designation")
public class DesignationController {

    @Autowired
    private DesignationDao designationDao;

    @GetMapping(value = "/list", produces = "application/json")
    public List<Designation> designationList(){
        return designationDao.findAll();
    }
}
