package lk.fably.dao;

import lk.fably.entity.Category;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

public interface CategoryDao extends JpaRepository<Category, Integer> {

    @Query(value = "SELECT c FROM Category c where c.id in (select p.category_id.id from Product p where p.id in (select po.product_id.id from ProductOrder po where po.id=?1))")
    Category getByOrderProducr(Integer id);
}
