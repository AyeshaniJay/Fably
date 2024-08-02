package lk.fably.dao;

import lk.fably.entity.Supplier;
import lk.fably.entity.Supplierstatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface SupplierstatusDao extends JpaRepository<Supplierstatus, Integer> {
}
