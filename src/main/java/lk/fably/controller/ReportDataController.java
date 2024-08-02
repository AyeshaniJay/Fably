package lk.fably.controller;

import lk.fably.dao.ReportDao;
import lk.fably.entity.ReportInvoice;
import lk.fably.entity.ReportProductusage;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.ArrayList;
import java.util.List;

@RestController
public class ReportDataController {

    @Autowired
    private ReportDao reportDao;

    //(invoicereport/bysdtetype?sdte=2023-06-01&edte=2023-06-30&type=Monthly)
    @GetMapping(value = "/invoicereport/bysdtetype", params = {"sdte","edte","type"}, produces = "application/json")
    public List<ReportInvoice> getInvoiceBySdteEdteType(@RequestParam("sdte") String sdte,@RequestParam("edte") String edte,@RequestParam("type") String type){

        String[][] reportDataList = new String[100][4];
        if(type.equals("Daily"))
            reportDataList = reportDao.getInvoiceReportDaily(sdte,edte);
        if(type.equals("Weekly"))
            reportDataList = reportDao.getInvoiceReportWeekly(sdte,edte);
        if(type.equals("Monthly"))
            reportDataList = reportDao.getInvoiceReportMonthly(sdte,edte);
        if(type.equals("Annually"))
            reportDataList = reportDao.getInvoiceReportAnnually(sdte,edte);


        List<ReportInvoice> reportInvoiceList = new ArrayList<>();
        for (int i=0; i < reportDataList.length; i++){
            ReportInvoice  reportInvoice = new ReportInvoice();
            reportInvoice.setDate(reportDataList[i][0]+"-"+reportDataList[i][1]);
            reportInvoice.setInvoicecount(reportDataList[i][2]);
            reportInvoice.setTotalamount(reportDataList[i][3]);
            reportInvoiceList.add(reportInvoice);
        }
        return reportInvoiceList;
    }


    //(productusagereport/bysdtetype?sdte=2023-06-01&edte=2023-06-30&type=Monthly)
    @GetMapping(value = "/productusagereport/bysdtetype", params = {"sdte","edte","type"}, produces = "application/json")
    public List<ReportProductusage> getProductUsageBySdteEdteProduct(@RequestParam("sdte") String sdte, @RequestParam("edte") String edte, @RequestParam("product") String product){

        String[][] reportDataList = new String[100][4];
        if(product.equals("Weekly"))
            reportDataList = reportDao.getProductUsageReportByProduct(sdte,edte,product);


        List<ReportProductusage> reportProductusageList = new ArrayList<>();
        for (int i=0; i < reportDataList.length; i++){
            ReportProductusage  reportProductusage = new ReportProductusage();
            reportProductusage.setProduct(reportDataList[i][0]+"-"+reportDataList[i][1]);
            reportProductusage.setSize(reportDataList[i][2]);
            reportProductusage.setCount(reportDataList[i][3]);
            reportProductusageList.add(reportProductusage);
        }
        return reportProductusageList;
    }

    //(productusagereport/bysdte?sdte=2023-06-01&edte=2023-06-30&type)
    @GetMapping(value = "/productusagereport/bysdte", params = {"sdte","edte"}, produces = "application/json")
    public List<ReportProductusage> getProductUsageBySdteEdte(@RequestParam("sdte") String sdte, @RequestParam("edte") String edte){

        String[][] reportDataList = reportDao.getProductUsageReportDateRange(sdte,edte);

        List<ReportProductusage> reportProductusageList = new ArrayList<>();
        for (int i=0; i < reportDataList.length; i++){
            ReportProductusage  reportProductusage = new ReportProductusage();
            reportProductusage.setProduct(reportDataList[i][0]);
            reportProductusage.setSize(reportDataList[i][1]);
            reportProductusage.setCount(reportDataList[i][2]);
            reportProductusageList.add(reportProductusage);
        }
        return reportProductusageList;
    }
}
