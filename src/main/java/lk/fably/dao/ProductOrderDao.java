package lk.fably.dao;

import lk.fably.entity.ProductOrder;
import lk.fably.entity.Productstatus;
import lk.fably.entity.Size;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface ProductOrderDao extends JpaRepository<ProductOrder, Integer> {

    @Query("select new ProductOrder(po.unitprice,po.qty,po.linetotal,po.weight) from ProductOrder po where po.corder_id.id=?1 and po.product_id.id=?2 and po.size_id.id=?3")
    ProductOrder list(Integer oid, Integer pid, Integer sid);

    //get ordered products by oder
    @Query("select po from ProductOrder po where po.corder_id.id=?1")
    List<ProductOrder> getByOrder(Integer oid);
}
