package lk.fably.dao;

import lk.fably.entity.CustomerOrder;
import lk.fably.entity.Payment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

public interface PaymentDao extends JpaRepository<Payment, Integer> {

    @Query(value = "SELECT lpad(max(i.code)+1,6,'0') FROM Invoice as e ;" , nativeQuery = true)//when use native query
    String nextPaymentCode();

    //get last payment code
    @Query("SELECT max(p.code) FROM Payment p")
    String lastPayCode();

    //get last payment code
    @Query(value = "SELECT p FROM Payment p where p.corder_id.id=?1")
    Payment getByOrderId(Integer id);
}
