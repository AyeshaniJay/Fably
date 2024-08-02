package lk.fably.dao;

import lk.fably.entity.Designation;
import org.springframework.data.jpa.repository.JpaRepository;

public interface DesignationDao extends JpaRepository<Designation,Integer> {
}
