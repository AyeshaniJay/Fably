package lk.fably.dao;

import lk.fably.entity.CustomerOrder;
import lk.fably.entity.Invoice;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface InvoiceDao extends JpaRepository<Invoice, Integer> {
//    Invoice getInvoicesByCode(String code);



    @Query("select new Invoice(i.id,i.code,i.added_datetime,i.totalamount,i.invoicestatus_id,i.corder_id,i.noofitem,i.paidamount,i.balanceamount,i.paiddate,i.courier_id,i.netamount) from Invoice i order by i.id desc")
    List<Invoice> findAll();

    //get last invoice code
    @Query("SELECT max(i.code) FROM Invoice i")
    String lastInvoCode();

    @Query(value = "select i from Invoice i where i.corder_id.id=?1")
    Invoice getByOrder(Integer id);

    @Query("select new Invoice(count(i.id)) from Invoice i where i.invoicestatus_id.id=1")
    Invoice getInvoiceCount();

    @Query("select inc from Invoice inc where inc.code=?1")
    Invoice getByInvoiceCode(String code);
}
