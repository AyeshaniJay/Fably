package lk.fably.controller;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.servlet.ModelAndView;

@RestController
public class WebUIController {

    @GetMapping(value = "/webhome")
    public ModelAndView paymentUI(){
        ModelAndView paymentUi = new ModelAndView();
        paymentUi.setViewName("web/Home.html");

        return paymentUi;
    }
}
