package lk.fably.dao;

import lk.fably.entity.Civilstatus;
import lk.fably.entity.Employeestatus;
import org.springframework.data.jpa.repository.JpaRepository;

public interface CivilstatusDao extends JpaRepository<Civilstatus, Integer> {
}
