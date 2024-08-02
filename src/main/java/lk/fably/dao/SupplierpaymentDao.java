package lk.fably.dao;

import lk.fably.entity.Porder;
import lk.fably.entity.Supplierpayment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface SupplierpaymentDao extends JpaRepository<Supplierpayment, Integer> {
    @Query("select sp from Supplierpayment sp order by sp.id desc")
    List<Supplierpayment> findAll();

    @Query(value = "SELECT lpad(max(sp.code)+1,6,'0') FROM supplierpayment as sp ;" , nativeQuery = true)//when use native query
    String nextPaymentCode();

    //get last payment code
    @Query("SELECT max(sp.code) FROM Supplierpayment sp")
    String lastPayCode();
}
