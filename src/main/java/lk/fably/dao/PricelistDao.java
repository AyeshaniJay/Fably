package lk.fably.dao;

import lk.fably.entity.Porder;
import lk.fably.entity.Pricelist;
import org.springframework.data.jpa.repository.JpaRepository;

public interface PricelistDao extends JpaRepository<Pricelist, Integer> {
//    @Query("select o from CustomerOrder o where o.code = ?1")
//    CustomerOrder findOrderByCode(String code);
//
//    @Query(value = "SELECT lpad(max(o.code)+1,10,'0') FROM corder as o ;" , nativeQuery = true)//when use native query
//    String nextOrderCode();
//
//    @Query("select new CustomerOrder (o.id,o.code) from CustomerOrder o where o.orderstatus_id.id=1")
//    List<CustomerOrder> list();

}
