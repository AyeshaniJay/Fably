package lk.fably.dao;

import lk.fably.entity.Employee;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;


public interface ReportDao extends JpaRepository<Employee,Integer> {
    @Query(value = "SELECT year(i.added_datetime), date(i.added_datetime), count(i.id), sum(i.totalamount) FROM invoice as i where i.added_datetime between '2023-06-01' and '2023-06-30' group by date(i.added_datetime)",nativeQuery = true)
    String[][] getInvoiceReportDaily(String sdte, String edte);

    @Query(value = "SELECT year(i.added_datetime), weekofyear(i.added_datetime), count(i.id), sum(i.totalamount) FROM invoice as i where i.added_datetime between '2023-06-01' and '2023-06-30' group by week(i.added_datetime)",nativeQuery = true)
    String[][] getInvoiceReportWeekly(String sdte, String edte);

    @Query(value = "SELECT year(i.added_datetime), month(i.added_datetime), count(i.id), sum(i.totalamount) FROM invoice as i where i.added_datetime between '2023-06-01' and '2023-06-30' group by month(i.added_datetime)",nativeQuery = true)
    String[][] getInvoiceReportMonthly(String sdte, String edte);

    @Query(value = "SELECT year(i.added_datetime),i.description, count(i.id), sum(i.totalamount) FROM invoice as i where i.added_datetime between '2023-06-01' and '2023-06-30' group by year(i.added_datetime)",nativeQuery = true)
    String[][] getInvoiceReportAnnually(String sdte, String edte);


    //Product Usage
    @Query(value = "SELECT p.name, s.name ,sum(ihp.qty) FROM invoice_has_product as ihp ,product as p ,size as s,invoice as inc" +
            "where inc.id=ihp.invoice_id and ihp.product_id=p.id and ihp.size_id=s.id and inc.added_datetime between '2023-01-01' and '2023-07-10'" +
            "group by p.id , s.id",nativeQuery = true)
    String[][] getProductUsageReportDateRange(String sdte, String edte);

    @Query(value = "SELECT p.name, s.name ,sum(ihp.qty) FROM invoice_has_product as ihp ,product as p ,size as s,invoice as inc" +
            "where inc.id=ihp.invoice_id and ihp.product_id=p.id and ihp.size_id=s.id and inc.added_datetime between '2023-01-01' and '2023-07-10' and p.id=1" +
            "group by p.id , s.id",nativeQuery = true)
    String[][] getProductUsageReportByProduct(String sdte, String edte, String product);

}
