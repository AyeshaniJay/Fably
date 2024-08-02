package lk.fably.dao;

import lk.fably.entity.Paymentmethod;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface PaymentmethodDao extends JpaRepository<Paymentmethod, Integer> {

    //get list for order payment
    @Query(value = "select p from Paymentmethod p where p.id=1 or p.id=2")
    List<Paymentmethod> list();
}
