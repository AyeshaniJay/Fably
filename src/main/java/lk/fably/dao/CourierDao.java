package lk.fably.dao;

import lk.fably.entity.Courier;
import org.springframework.data.jpa.repository.JpaRepository;

public interface CourierDao extends JpaRepository<Courier, Integer> {
}
