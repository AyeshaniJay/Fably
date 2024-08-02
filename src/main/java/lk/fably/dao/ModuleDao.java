package lk.fably.dao;

import lk.fably.entity.Module;
import lk.fably.entity.Role;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface ModuleDao extends JpaRepository<Module, Integer> {

    @Query(value = "select m from Module m where m.id not in(select p.module_id.id from Privilege p where p.role_id.id=?1)")
    List<Module> getModuleWithoutPrivilege(Integer id);

    @Query(value = "SELECT m.name FROM fably.module as m where m.id not in" +
            "(select p.module_id from privilege as p where p.sel=1 and p.role_id in" +
            "(select ur.role_id from user_has_role as ur where ur.user_id in" +
            "(select u.id from user as u where u.username=?1)));",nativeQuery = true)
    List getByUser(String username);
}
