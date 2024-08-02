package lk.fably.dao;

import lk.fably.entity.Productsize;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface ProductSizeDao extends JpaRepository<Productsize, Integer> {

    //get size. weight, rop by product
    @Query("select new Productsize(ps.size_id,ps.weight,ps.rop) from Productsize ps where ps.product_id.id=?1 and ps.size_id.id=?2")
    Productsize listbySize(Integer pid,Integer sid);
}
