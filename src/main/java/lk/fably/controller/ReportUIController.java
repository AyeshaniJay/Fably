package lk.fably.controller;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.servlet.ModelAndView;

@RestController
public class ReportUIController {

    @GetMapping(value = "/samplereport")
    public ModelAndView sampleReportUI(){
        ModelAndView sampleReportView = new ModelAndView();
        sampleReportView.setViewName("report.html");
        return sampleReportView;
    }

    @GetMapping(value = "/invoicereport")
    public ModelAndView invoiceReportUI(){
        ModelAndView invoiceReportView = new ModelAndView();
        invoiceReportView.setViewName("reportinvoice.html");
        return invoiceReportView;
    }

    @GetMapping(value = "/productusagereport")
    public ModelAndView productusageReportUI(){
        ModelAndView productusageView = new ModelAndView();
        productusageView.setViewName("reportproductusage.html");
        return productusageView;
    }

    @GetMapping(value = "/samplechart")
    public ModelAndView sampleChartUI(){
        ModelAndView sampleChartView = new ModelAndView();
        sampleChartView.setViewName("samplechart.html");
        return sampleChartView;
    }
}
