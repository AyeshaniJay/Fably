package lk.fably.dao;

import lk.fably.entity.PStore;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface StoreDao extends JpaRepository<PStore, Integer> {

    @Query(value = "select s from PStore s order by s.id desc")
    List<PStore> findAll();
    @Query(value = "SELECT s FROM PStore s where s.product_id.id=?1 and s.size_id.id=?2")
    PStore getByProductSize(Integer pid, Integer sid);
}
