package lk.fably.dao;

import lk.fably.entity.Privilege;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

public interface PrivilegeDao extends JpaRepository<Privilege, Integer> {

    //get query for get privilege object by given roleid and moduleid
    @Query(value = "select p from Privilege p where p.role_id.id = ?1 and p.module_id.id =?2")
    Privilege getByRoleAndModule(Integer role_id, Integer module_id);

    //bit_or used to check more roles in one user
    @Query(value = "SELECT bit_or(p.sel),bit_or(p.ins),bit_or(p.upd),bit_or(p.del) FROM fably.privilege as p " +
            "where p.role_id in (select uhr.role_id from fably.user_has_role as uhr " +
            "where uhr.user_id in (select u.id from fably.user as u " +
            "where u.username = ?1)) and p.module_id in (select m.id from fably.module as m " +
            "where m.name = ?2);" , nativeQuery = true)
    String getPrivilegeByUserModule(String username, String modulename);
}
