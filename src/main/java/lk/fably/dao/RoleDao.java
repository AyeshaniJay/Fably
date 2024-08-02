package lk.fably.dao;

import lk.fably.entity.Role;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface RoleDao extends JpaRepository<Role, Integer> {
    @Query(value = "select r from Role r where r.id in(select ur.role_id.id from UserRole ur where ur.user_id.id = :userid)")
    List<Role> getByUserId(@Param("userid") Integer userid);


    @Query(value = "select r from Role r where r.name<>'Admin'")
    List<Role> list();
}
