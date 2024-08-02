package lk.fably.controller;

import lk.fably.dao.EmployeeDao;
import lk.fably.dao.EmployeestatusDao;
import lk.fably.dao.UserDao;
import lk.fably.entity.Employee;
import lk.fably.entity.User;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.ModelAndView;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;

@RestController //converts class to request handler and converts the response to JSON or XML
@RequestMapping(value = "/employee")
public class EmployeeController {

    @Autowired
    private EmployeeDao employeeDao;

    @Autowired
    private EmployeestatusDao employeestatusDao;

    @Autowired
    private UserDao userDao;

    @Autowired
    private PrivilegeController privilegeController;

    //get mapping for connect employee.html file --> [employee]
    @GetMapping
    public ModelAndView employeeUi(){
        ModelAndView employeeUi = new ModelAndView();
        employeeUi.setViewName("employee.html");

        return employeeUi;
    }

    //get mapping for get employee by given path variable id --> [employee/getbyid/1]
    @GetMapping(value = "/getbyid/{id}", produces = "application/json") //if return dada-->produces
    public Employee getEmployeeByPVId(@PathVariable("id") Integer id){
        return employeeDao.getReferenceById(id);
    }

    //get mapping for get employee by given query param id --> [/employee/getbyid?id=1]
    @GetMapping(value = "/getbyid",params = {"id"}, produces = "application/json")
    Employee getEmployeeByQPId(@RequestParam("id") Integer id) {
        return employeeDao.getReferenceById(id);
    }

    //get employee without user account --> [/employee/withoutuseraccount]
    @GetMapping(value = "/withoutuseraccount",produces = "application/json")
    public List<Employee> employeeWithoutUserAccount(){
        return employeeDao.withoutuseraccount();
    }

    // get mapping for get All employee details --> [/employee/findall]
    @GetMapping(value = "/findall", produces = "application/json")
    public List<Employee> employeeFindAll() {

        //need to check privilege for logged user
        Authentication auth = SecurityContextHolder.getContext().getAuthentication(); //get security authentication instance for logged user
        User loggedUser = userDao.findUserByUsername((auth.getName())); //get logged user by DB user table using authentication instance

        //get privilege object for logged user and given module
        HashMap<String, Boolean> loggedUserPrivilege = privilegeController.getPrivilegeByUserModule(auth.getName(), "Employee");

        if (loggedUser != null && loggedUserPrivilege.get("sel")) {
            return employeeDao.findAll();
        } else {
            List<Employee> employeeList = new ArrayList<>();
            return employeeList;
        }
    }

    //create mapping for add employee [/employee]
    @PostMapping
    public String insertEmp(@RequestBody Employee employee) {
        //check privilege for logged user
        Authentication auth = SecurityContextHolder.getContext().getAuthentication(); //get security authentication instance for logged user
        User loggedUser = userDao.findUserByUsername((auth.getName())); //get logged user by DB user table using authentication instance

        //get privilege object for logged user and given module
        HashMap<String, Boolean> loggedUserPrivilege = privilegeController.getPrivilegeByUserModule(auth.getName(), "Employee");

        if (loggedUser != null && loggedUserPrivilege.get("ins")) {
            //check duplicate value for unique
            Employee extEmpByNumber = employeeDao.findEmpByNumber(employee.getNumber());
            if (extEmpByNumber != null) {
                return "Employee insert operation not completed. Given Number is already exist !";
            }
            Employee extEmpByNic = employeeDao.getByNic(employee.getNic());
            if (extEmpByNic != null) {
                return "Employee insert operation not completed. Given NIC is already exist !";
            }
            Employee extEmpByEmail = employeeDao.getEmployeeByEmail(employee.getEmail());
            if (extEmpByEmail != null) {
                return "Employee insert operation not completed. Given Email already exist !";
            }


            try {
                //set automatic values
                employee.setTocreation(LocalDateTime.now());
                //employee.setNumber("000004");
                employee.setNumber(employeeDao.nextEmpNumber());


                //operator
                employeeDao.save(employee);

                //dependency update

                return "0";

            } catch (Exception ex) {
                return "Employee insert not completed ! " + ex.getMessage();
            }
        } else {
            return "Employee insert not completed. You have no access !";
        }


    }

    //create mapping for update employee
    @PutMapping
    public String updateEmployee(@RequestBody Employee employee) {
        //need to check privilege for logged users
        Authentication auth = SecurityContextHolder.getContext().getAuthentication(); //get security authentication instance for logged user
        User loggedUser = userDao.findUserByUsername((auth.getName())); //get logged user by DB user table using authentication instance

        //get privilege object for logged user and given module
        HashMap<String, Boolean> loggedUserPrivilege = privilegeController.getPrivilegeByUserModule(auth.getName(), "Employee");

        if (loggedUser != null && loggedUserPrivilege.get("upd")) {

            //need to check existing
            Employee extEmp = employeeDao.getReferenceById(employee.getId());
            if (extEmp == null) {
                return "Employee update not completed. Employee does not exist !";

            }


            try {
                employee.setToupdate(LocalDateTime.now());
                employeeDao.save(employee);
                return "0";
            } catch (Exception ex) {
                return "Employee Update not completed !" + ex.getMessage();
            }

            //update auto set values

            //update dependency modules
        } else {
            return "Employee Update not completed. You have No privilege !";
        }

    }

    //create mapping for delete employee [/employee]
    @DeleteMapping
    public String deleteEmployee(@RequestBody Employee employee) {
        //check privilege
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        User loggedUser = userDao.findUserByUsername(auth.getName());
        HashMap<String, Boolean> loggedUserPrivilege = privilegeController.getPrivilegeByUserModule(auth.getName(), "Employee");

        if (loggedUser != null && loggedUserPrivilege.get("del")) {
            //check object existing
            Employee exEmp = employeeDao.getReferenceById(employee.getId());

            if (exEmp != null) {
                //use try catch for catch errors given by the db server
                try {
                    //object exist
                    exEmp.setTodeletion(LocalDateTime.now());
                    exEmp.setEmployeestatus_id(employeestatusDao.getReferenceById(4));

                    //employeeDao.delete(exEmp);
                    employeeDao.save(exEmp);

                    //run correctly
                    return "0";

                } catch (Exception ex) {
                    return "Delete not completed !" + ex.getMessage();
                }
            } else {
                //object not exist
                return "Delete not completed. Employee not found !";
            }
        } else {
            return "Delete not completed. User not found !";
        }
    }
}
