package lk.fably.controller;

import lk.fably.dao.CustomerDao;
import lk.fably.dao.CustomerstatusDao;
import lk.fably.dao.UserDao;
import lk.fably.entity.Customer;
import lk.fably.entity.User;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.ModelAndView;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.List;

@RestController
@RequestMapping(value = "/customer")
public class CustomerController {

    @Autowired
    private CustomerDao customerDao;

    @Autowired
    private UserDao userDao;

    @Autowired
    private CustomerstatusDao customerstatusDao;

    @Autowired
    private PrivilegeController privilegeController;

    //get mapping for link html file
    @GetMapping
    public ModelAndView customerUI(){
        ModelAndView customerUi = new ModelAndView();
        customerUi.setViewName("customer.html");

        return customerUi;
    }

    //get mapping for get All customer details --> [/customer/findall]
    @GetMapping(value = "/findall", produces = "application/json")
    public List<Customer> CustomerFindAll(){
        // return customerDao.findAll(Sort.by(Sort.Direction.DESC,"id"));

        //need to check privilege for loged user
        Authentication auth = SecurityContextHolder.getContext().getAuthentication(); //get security authentication instance for logged user
        User loggedUser = userDao.findUserByUsername((auth.getName())); //get logged user by DB user table using authentication instance

        //get privilege object for logged user and given module
        HashMap<String, Boolean> loggedUserPrivilege = privilegeController.getPrivilegeByUserModule(auth.getName(), "Customer");

        if (loggedUser != null && loggedUserPrivilege.get("sel")) {
            return customerDao.findAll();
        } else {
            return null;
        }
    }

    //get mapping for get Customer by given path variable id -->(customer/getbyid/1)
    @GetMapping(value = "/getbyid/{id}", produces = "application/json") //if return dada-->produces
    public Customer getCustomerByPVId(@PathVariable("id") Integer id){
        return customerDao.getReferenceById(id);
    }

    //get mapping for get Customer by given path variable id -->(/customer/byorder/1)
    @GetMapping(value = "/byorder/{cid}", produces = "application/json") //if return dada-->produces
    public Customer getCustomerByOrder(@PathVariable("cid") Integer cid){
        return customerDao.getCustomerByOrder(cid);
    }

    //create mapping for add customer [/customer]
    @PostMapping
    public String insertCus(@RequestBody Customer customer) {
        //check privilege for logged user
        Authentication auth = SecurityContextHolder.getContext().getAuthentication(); //get security authentication instance for logged user
        User loggedUser = userDao.findUserByUsername((auth.getName())); //get logged user by DB user table using authentication instance

        //get privilage object for logged user and given module
        HashMap<String, Boolean> loggedUserPrivilege = privilegeController.getPrivilegeByUserModule(auth.getName(), "Customer");

        if (loggedUser != null && loggedUserPrivilege.get("ins")) {
            //check duplicate value for unique

            Customer extCusByEmail = customerDao.getCustomerByEmail(customer.getEmail());
            if (extCusByEmail != null) {
                return "Given Email already exist ! \n" +
                        "It means customer already in the system and no need to add. Please select customer and continue the order";
            }

            Customer extCusByMobile = customerDao.getCustomerByMobile(customer.getMobile());
            if (extCusByMobile != null) {
                return "Given Mobile already exist ! \n" +
                        "It means customer already in the system and no need to add. Please select customer and continue the order";
            }

            try {
                //set automatic values
                customer.setAdded_datetime(LocalDateTime.now());
                //customer.setCode("004");
                customer.setCode(customerDao.nextCusNumber());

                customer.setAddeduser_id(loggedUser);
                //operator
                customerDao.save(customer);

                //dependency update

                return "0";

            } catch (Exception ex) {
                return "Customer insert not completed ! " + ex.getMessage();
            }
        } else {
            return "Customer insert not completed. You have no access !";
        }


    }

    //create mapping for update customer
    @PutMapping
    public String updateCustomer(@RequestBody Customer customer) {
        //need to check privilege for logged users
        Authentication auth = SecurityContextHolder.getContext().getAuthentication(); //get security authentication instance for logged user
        User loggedUser = userDao.findUserByUsername((auth.getName())); //get logged user by DB user table using authentication instance

        //get privilege object for logged user and given module
        HashMap<String, Boolean> loggedUserPrivilege = privilegeController.getPrivilegeByUserModule(auth.getName(), "Customer");

        if (loggedUser != null && loggedUserPrivilege.get("upd")) {

            //need to check existing
            Customer extCus = customerDao.getReferenceById(customer.getId());
            if (extCus == null) {
                return "Customer update not completed : Customer does not exist";

            }


            try {
                customer.setLastupdated_datetime(LocalDateTime.now());
                customerDao.save(customer);
                return "0";
            } catch (Exception ex) {
                return "Customer Update not completed : " + ex.getMessage();
            }

            //update auto set values

            //update dependency modules
        } else {
            return "Customer update not completed : You have No Privilege";
        }

    }

    //create mapping for delete customer [/customer]
    @DeleteMapping
    public String deleteCustomer(@RequestBody Customer customer) {
        //check privilege
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        User loggedUser = userDao.findUserByUsername(auth.getName());
        HashMap<String, Boolean> loggedUserPrivilege = privilegeController.getPrivilegeByUserModule(auth.getName(), "Customer");

        if (loggedUser != null && loggedUserPrivilege.get("del")) {
            //check object existing
            Customer exCus = customerDao.getReferenceById(customer.getId());

            if (exCus != null) {
                //use try catch for catch errors given by the db server
                try {
                    //object exist
                    exCus.setDeleted_datetime(LocalDateTime.now());
                    exCus.setCustomerstatus_id(customerstatusDao.getReferenceById(2));

                    //customerDao.delete(exCus);
                    customerDao.save(exCus);

                    //run correctly
                    return "0";

                } catch (Exception ex) {
                    return "Delete not completed " + ex.getMessage();
                }
            } else {
                //object not exist
                return "Delete not completed : Customer not found ";
            }
        } else {
            return "Delete not completed : User not found ";
        }
    }
}
