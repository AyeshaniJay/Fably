package lk.fably.dao;

import lk.fably.entity.Porderstatus;
import lk.fably.entity.Priceliststatus;
import org.springframework.data.jpa.repository.JpaRepository;

public interface PriceliststatusDao extends JpaRepository<Priceliststatus, Integer> {
}
