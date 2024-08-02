package lk.fably.dao;

import lk.fably.entity.InvoiceProduct;
import lk.fably.entity.ProductOrder;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface InvoiceProductDao extends JpaRepository<InvoiceProduct, Integer> {

    @Query("select new InvoiceProduct (io.unitprice,io.orderqty,io.linetotal) from InvoiceProduct io where io.size_id.id=?1")
    List<InvoiceProduct> list(Integer id);
}
