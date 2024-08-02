package lk.fably.dao;

import lk.fably.entity.Porder;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface PorderDao extends JpaRepository<Porder, Integer> {

    //get last porder code by year
    @Query("SELECT max(po.code) FROM Porder po")
    String lastPorderCode();

    @Query(value = "select new Porder(p.id, p.code, p.requiredate, p.totalamount, p.added_datetime, p.porderstatus_id, p.supplier_id) from Porder p order by p.id desc")
    List<Porder> findAll();

    @Query("select new Porder (p.id, p.code, p.requiredate, p.totalamount, p.added_datetime, p.porderstatus_id, p.supplier_id) from Porder p where p.id not in(select g.porder_id.id from GRN g)")
    List<Porder> getPorderWithoutGrn();

    @Query(value = "select new Porder (p.id,p.code) from Porder p")
    List<Porder> list();

    @Query(value = "select new Porder (p.id,p.code) from Porder p where p.supplier_id.id=?1")
    List<Porder> getPorderBySupplier(Integer id);
}
