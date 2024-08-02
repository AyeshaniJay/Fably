package lk.fably.controller;

import lk.fably.dao.PaymentstatusDao;
import lk.fably.entity.Paymentstatus;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping(value = "/paymentstatus")
public class PaymentstatusController {

    @Autowired
    private PaymentstatusDao paymentstatusDao;

    @GetMapping(value = "/list", produces = "application/json")
    public List<Paymentstatus> paymentstatusList(){
        return paymentstatusDao.findAll();
    }
}
