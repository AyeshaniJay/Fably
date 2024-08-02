package lk.fably.dao;

import lk.fably.entity.Customer;
import lk.fably.entity.Product;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface CustomerDao extends JpaRepository<Customer, Integer> {

    //create mapping function for get customer by given email - without query
    Customer getCustomerByEmail(String email);
    Customer getCustomerByMobile(String mobile);

    @Query(value = "SELECT lpad(max(c.code)+1,6,'0') FROM customer as c ;" , nativeQuery = true)//when use native query
    String nextCusNumber();

    @Query(value = "select new Customer (c.id, c.code,c.firstname, c.gender, c.mobile, c.email, c.customerstatus_id) from Customer c order by c.id desc")
    List<Customer> findAll();

    @Query("select new Customer (c.id, c.code, c.firstname) from Customer c")
    List<Customer> list();

    @Query("select new Customer (c.id,c.code,c.firstname,c.mobile,c.address,c.email) from Customer c where c.id in (select co.customer_id from CustomerOrder co where co.id=?1)")
    Customer getCustomerByOrder(Integer oid);

}
