package lk.fably.controller;

import lk.fably.dao.PaymentmethodDao;
import lk.fably.entity.Paymentmethod;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping(value = "/paymentmethod")
public class PaymentmethodController {

    @Autowired
    private PaymentmethodDao paymentmethodDao;

    //get list for order payment (/paymentmethod/orderpayment)
    @GetMapping(value = "/orderpayment", produces = "application/json")
    public List<Paymentmethod> paymentmethodForOrderPayment(){
        return paymentmethodDao.list();
    }

    @GetMapping(value = "/list", produces = "application/json")
    public List<Paymentmethod> paymentmethodList(){
        return paymentmethodDao.findAll();
    }
}
