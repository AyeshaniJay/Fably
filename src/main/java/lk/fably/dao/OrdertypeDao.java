package lk.fably.dao;

import lk.fably.entity.Orderstatus;
import lk.fably.entity.Ordertype;
import org.springframework.data.jpa.repository.JpaRepository;

public interface OrdertypeDao extends JpaRepository<Ordertype, Integer> {
}
