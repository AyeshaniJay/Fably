package lk.fably.dao;

import lk.fably.entity.PorderProduct;
import lk.fably.entity.ProductOrder;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

public interface PorderProductDao extends JpaRepository<PorderProduct, Integer> {

    @Query("select new PorderProduct (po.unitprice,po.qty,po.linetotal) from PorderProduct po where po.porder_id.id=?1 and po.product_id.id=?2 and po.size_id.id=?3")
    PorderProduct list(Integer poid, Integer pid, Integer sid);
}
