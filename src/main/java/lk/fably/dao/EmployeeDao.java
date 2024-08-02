package lk.fably.dao;

import lk.fably.entity.Employee;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface EmployeeDao extends JpaRepository<Employee, Integer> {

    @Query(value = "select e from Employee e where e.nic = ?1")//?1 means this use in first parameter in the function
    Employee getByNic(String nic);//mapping function for above query - with query

    //create mapping function for get employee by given email - without query
    Employee getEmployeeByEmail(String email);

    @Query(value = "SELECT lpad(max(e.number)+1,6,'0') FROM employee as e ;" , nativeQuery = true)//when use native query
    String nextEmpNumber();

    @Query("select e from Employee e where e.number = ?1")
    Employee findEmpByNumber(String number);

    @Query(value = "select new Employee(e.id, e.callingname, e.number, e.fullname, e.nic, e.gender, e.employeestatus_id, e.designation_id, e.photo,e.mobileno) from Employee e order by e.id desc")
    List<Employee> findAll();

    @Query("select new Employee(e.id, e.number, e.callingname) from Employee e")
    List<Employee> list();

    @Query(value = "select new Employee(e.id, e.number, e.callingname) from Employee e " +
            "where e.id not in (select u.employee_id.id from User u where u.employee_id is not null)")
    List<Employee> withoutuseraccount();
}
