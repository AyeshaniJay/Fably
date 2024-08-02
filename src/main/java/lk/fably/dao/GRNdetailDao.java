package lk.fably.dao;

import lk.fably.entity.GRN;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface GRNdetailDao extends JpaRepository<GRN, Integer> {

    @Query(value = "select new GRN(g.id, g.code, g.receiveddate, g.totalamount, g.taxrate, g.discount, g.added_datetime,g.addeduser_id,g.grndetailstatus_id,g.porder_id) from GRN g order by g.id desc")
    List<GRN> findAll();

    @Query("select new GRN (g.id,g.code) from GRN g")
    List<GRN> list();

    //get last invoice code
    @Query("SELECT max(g.code) FROM GRN g")
    String lastGrnCode();

    @Query("select new GRN (g.id, g.code, g.receiveddate, g.totalamount, g.taxrate, g.discount, g.added_datetime,g.addeduser_id,g.grndetailstatus_id,g.porder_id) from GRN g where g.grndetailstatus_id.id=2")
    List<GRN> getGrnReceived();

    @Query(value = "select g from GRN g where g.porder_id.id=?1")
    GRN getByPorder(Integer id);

    @Query(value = "select new GRN (g.id,g.code) from GRN g where g.grndetailstatus_id.id=2 and g.porder_id.id in(select p.id from Porder p where p.supplier_id.id=?1)")
    List<GRN> getBySupplier(Integer id);
}
