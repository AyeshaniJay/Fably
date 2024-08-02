package lk.fably.dao;

import lk.fably.entity.Invoicestatus;
import lk.fably.entity.Supplierstatus;
import org.springframework.data.jpa.repository.JpaRepository;

public interface InvoicestatusDao extends JpaRepository<Invoicestatus, Integer> {
}
