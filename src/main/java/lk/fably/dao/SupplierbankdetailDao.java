package lk.fably.dao;

import lk.fably.entity.Supplier;
import lk.fably.entity.Supplierbankdetail;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface SupplierbankdetailDao extends JpaRepository<Supplierbankdetail, Integer> {

    @Query(value = "select b from Supplierbankdetail b where b.supplier_id.id=?1")
    List<Supplierbankdetail> getbankdetailBySupplier(Integer id);
}
