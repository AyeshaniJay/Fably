package lk.fably.dao;

import lk.fably.entity.CustomerOrder;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface OrderDao extends JpaRepository<CustomerOrder, Integer> {
    @Query("select o from CustomerOrder o where o.code = ?1")
    CustomerOrder findOrderByCode(String code);

    @Query("select new CustomerOrder(o.id,o.code,o.added_datetime,o.totalamount,o.orderstatus_id,o.customer_id) from CustomerOrder o order by o.id desc")
    List<CustomerOrder> findAll();

    //get last order code
    @Query("SELECT max(o.code) FROM CustomerOrder o")
    String lastOrderCode();

    @Query("select new CustomerOrder (o.id,o.code) from CustomerOrder o where o.orderstatus_id.id=2  or o.orderstatus_id.id=3")
    List<CustomerOrder> ordersForInvoice();

    @Query(value = "select new CustomerOrder (o.id,o.code) from CustomerOrder o where o.orderstatus_id.id=?1")
    List<CustomerOrder> getOrder(Integer id);

    @Query(value = "select o from CustomerOrder o where o.orderstatus_id.id=4")
    List<CustomerOrder> getByOrderStatus();

    @Query("select new CustomerOrder(count(o.id)) from CustomerOrder o where o.orderstatus_id.id=1 or o.orderstatus_id.id=2 or o.orderstatus_id.id=3 or o.orderstatus_id.id=4 or o.orderstatus_id.id=5")
    CustomerOrder getOrderCount();

    @Query(value = "select o from CustomerOrder o where o.orderstatus_id.id=1 or o.orderstatus_id.id=5")
    List<CustomerOrder> getPaymentByOrderStatus();
}
