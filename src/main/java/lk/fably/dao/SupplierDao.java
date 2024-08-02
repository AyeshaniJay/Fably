package lk.fably.dao;

import lk.fably.entity.Supplier;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface SupplierDao extends JpaRepository<Supplier, Integer> {

    //create mapping function for get customer by given email - without query
    Supplier  getSuppliersByEmail(String email);

    //create mapping function for get customer by given mobile
    Supplier  getSuppliersByMobile1(String mobile1);

    @Query(value = "SELECT lpad(max(s.code)+1,6,'0') FROM Supplier as s ;" , nativeQuery = true)//when use native query
    String nextSupCode();

    @Query("select new Supplier(s.id,s.code,s.name,s.email,s.mobile1,s.supplierstatus_id,s.address) from Supplier s order by s.id desc")
    List<Supplier> findAll();

    @Query("select new Supplier (s.id, s.code, s.name) from Supplier s")
    List<Supplier> list();

    @Query("select new Supplier(count(s.id)) from Supplier s where s.supplierstatus_id.id=1")
    Supplier getSupplierCount();

    @Query("select new Supplier (s.id,s.code,s.name,s.email,s.mobile1,s.supplierstatus_id,s.address) from Supplier s where s.id in (select p.supplier_id from Porder p where p.id=?1)")
    Supplier getSupplierByPorder(Integer pid);

    @Query("select new Supplier (s.id, s.code, s.name) from Supplier s where s.supplierstatus_id.id=1")
    List<Supplier> getActiveSupplier();
}
