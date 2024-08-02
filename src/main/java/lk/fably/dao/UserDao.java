package lk.fably.dao;

import lk.fably.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository //if u want to import additional functions
public interface UserDao extends JpaRepository<User,Integer> {
    //Query to get user required columns
    @Query(value = "select new User (u.id, u.employee_id, u.username,u.email,u.status)from User u where u.username <> 'Admin' order by u.id desc ")
    List<User> findAll();

    @Query("select u from User u where u.username = ?1")
    User findUserByUsername(String username);

//    @Query("select u from User u where u.id = ?1")
//    User findUserById(Integer id);

    @Query(value = "select u from User u where u.employee_id.id= ?1")
    User getUserByEmployee(Integer empId);
}
