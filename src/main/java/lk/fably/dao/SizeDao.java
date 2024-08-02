package lk.fably.dao;

import lk.fably.entity.Size;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface SizeDao extends JpaRepository<Size, Integer> {
    @Query("select s from Size s where s.id in (select po.size_id.id from ProductOrder po where po.corder_id.id=?1 and po.product_id.id=?2)")
    List<Size> getSizesByOrderProduct(Integer oid,Integer pid);

//    @Query("select s from Size s where s.id in (select pp.size_id.id from PorderProduct pp where pp.category_id.id=?1 and pp.product_id.id=?2)")
//    List<Size> getSizesByCategoryProduct(Integer cid,Integer pid);

    @Query("select s from Size s where s.id in (select ps.size_id.id from Productsize ps where ps.product_id.id in(select sp.product_id.id from SupplierProduct sp where sp.supplier_id=?1 and sp.product_id=?2))")
    List<Size> getSizesBySupplierProduct(Integer sid,Integer pid);

    @Query("select s from Size s where s.id in (select po.size_id.id from ProductOrder po where po.product_id.id=?1)")
    List<Size> getSizesByProductOrder(Integer pid);

    //get size by product
    @Query("select s from Size s where s.id in (select ps.size_id.id from Productsize ps where ps.product_id.id=?1)")
    List<Size> getSizesByProduct(Integer pid);

    @Query("select s from Size s where s.id in (select pp.size_id.id from PorderProduct pp where pp.porder_id.id=?1 and pp.product_id.id=?2)")
    List<Size> getSizesByPorderProduct(Integer poid, Integer pid);
}
