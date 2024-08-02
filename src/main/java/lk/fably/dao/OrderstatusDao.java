package lk.fably.dao;

import lk.fably.entity.Orderstatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface OrderstatusDao extends JpaRepository<Orderstatus, Integer> {

    @Query(value = "select os from Orderstatus os where os.id in (select o.id from CustomerOrder o where o.id=?1)")
    List<Orderstatus> getByOrderId(Integer id);

    @Query(value = "select os from Orderstatus os where os.id in (select o.id from CustomerOrder o where o.id in (select i.id from Invoice i where i.id=?1))")
    Orderstatus getByInvoiceId(Integer id);

    @Query(value = "select os from Orderstatus os where os.id=1 or os.id=3")
    List<Orderstatus> getForOrder();
}
