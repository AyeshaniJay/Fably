package lk.fably.dao;

import lk.fably.entity.Customerstatus;
import org.springframework.data.jpa.repository.JpaRepository;

public interface CustomerstatusDao extends JpaRepository<Customerstatus, Integer> {
}
