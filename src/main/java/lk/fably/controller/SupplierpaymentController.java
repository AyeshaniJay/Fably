package lk.fably.controller;

import lk.fably.dao.PaymentstatusDao;
import lk.fably.dao.SupplierpaymentDao;
import lk.fably.dao.UserDao;
import lk.fably.entity.CustomerOrder;
import lk.fably.entity.Porder;
import lk.fably.entity.Supplierpayment;
import lk.fably.entity.User;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.ModelAndView;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.List;


@RestController //converts class to request handler and converts the response to JSON or XML
@RequestMapping(value = "/supplierpayment")
public class SupplierpaymentController {

    @Autowired
    private SupplierpaymentDao supplierpaymentDao;

    @Autowired
    private PaymentstatusDao paymentstatusDao;
    @Autowired
    private UserDao userDao;
    @Autowired
    private PrivilegeController privilegeController;

    //get mapping for link html file
    @GetMapping
    public ModelAndView supplierpaymentUi(){
        ModelAndView supplierpaymentUi = new ModelAndView();
        supplierpaymentUi.setViewName("supplierpayment.html");

        return supplierpaymentUi;
    }

    //get mapping for get order by given path variable id -->(order/getbyid/1)
    @GetMapping(value = "/getbyid/{id}", produces = "application/json") //if return dada-->produces
    public Supplierpayment getSupplierByPVId(@PathVariable("id") Integer id){
        return supplierpaymentDao.getReferenceById(id);
    }


    // get mapping for get All order details --> [/order/findall]
    @GetMapping(value = "/findall", produces = "application/json")
    public List<Supplierpayment> orderFindAll() {
        // return orderDao.findAll(Sort.by(Sort.Direction.DESC,"id"));

        //need to check privilege for logged user
        Authentication auth = SecurityContextHolder.getContext().getAuthentication(); //get security authentication instance for logged user
        User loggedUser = userDao.findUserByUsername((auth.getName())); //get logged user by DB user table using authentication instance

        //get privilege object for logged user and given module
        HashMap<String, Boolean> loggedUserPrivilege = privilegeController.getPrivilegeByUserModule(auth.getName(), "SupplierPayment");

        if (loggedUser != null && loggedUserPrivilege.get("sel")) {
            return supplierpaymentDao.findAll();
        } else {
            return null;
        }
    }

//    //get mapping for get order by given path variable id -->(order/getbyid/1)
//    @GetMapping(value = "/getbyid/{id}", produces = "application/json") //if return dada-->produces
//    public CustomerOrder getOrderByPVId(@PathVariable("id") Integer id){
//        return orderDao.getReferenceById(id);
//    }
//
    //create mapping for add order [/order]
    @PostMapping
    public String insertOrder(@RequestBody Supplierpayment supplierpayment) {
        //check privilege for logged user
        Authentication auth = SecurityContextHolder.getContext().getAuthentication(); //get security authentication instance for logged user
        User loggedUser = userDao.findUserByUsername((auth.getName())); //get logged user by DB user table using authentication instance

        //get privilege object for logged user and given module
        HashMap<String, Boolean> loggedUserPrivilege = privilegeController.getPrivilegeByUserModule(auth.getName(), "SupplierPayment");

        if (loggedUser != null && loggedUserPrivilege.get("ins")) {
            //check duplicate value for unique

            try {
                //set automatic values
                supplierpayment.setAdded_datetime(LocalDateTime.now());
                supplierpayment.setAddeduser_id(loggedUser);
                //set next supplier payment code by Year
                String lastPayCode = supplierpaymentDao.lastPayCode();
                String nextPayCode = new String();
                LocalDate currentDate = LocalDate.now();
                int currentYear = currentDate.getYear();

                if (lastPayCode != null){
                    if (String.valueOf(currentYear).substring(2,4).equals(lastPayCode.substring(0,2))){
                        nextPayCode = String.valueOf(currentYear).substring(2,4) +
                                String.format("%04d",(Integer.valueOf(lastPayCode.substring(2)) + 1));
                    }else {
                        nextPayCode = String.valueOf(currentYear).substring(2,4) + "0001";
                    }

                }else {
                    nextPayCode = String.valueOf(currentYear).substring(2,4) + "0001";
                }

                supplierpayment.setCode(nextPayCode);

                supplierpayment.setPaymentstatus_id(paymentstatusDao.getReferenceById(2));

                //operator
                supplierpaymentDao.save(supplierpayment);

                //dependency update

                return "0";

            } catch (Exception ex) {
                return "Supplier Payment insert not completed : " + ex.getMessage();
            }
        } else {
            return "Supplier Payment insert not completed : You have no access";
        }


    }

//    //create mapping for update order
//    @PutMapping
//    public String updateOrder(@RequestBody CustomerOrder customerOrder) {
//        //need to check privilege for logged users
//        Authentication auth = SecurityContextHolder.getContext().getAuthentication(); //get security authentication instance for logged user
//        User loggedUser = userDao.findUserByUsername((auth.getName())); //get logged user by DB user table using authentication instance
//
//        //get privilege object for logged user and given module
//        HashMap<String, Boolean> loggedUserPrivilege = privilegeController.getPrivilegeByUserModule(auth.getName(), "Order");
//
//        if (loggedUser != null && loggedUserPrivilege.get("upd")) {
//
//            //need to check existing
//            CustomerOrder extCustomerOrder = orderDao.getReferenceById(customerOrder.getId());
//            if (extCustomerOrder == null) {
//                return "Order update not completed : Order does not exist";
//
//            }
//
//
//            try {
//                customerOrder.setLastupdate_datetime(LocalDateTime.now());
//                orderDao.save(customerOrder);
//                return "0";
//            } catch (Exception ex) {
//                return "Order Update not completed : " + ex.getMessage();
//            }
//
//            //update auto set values
//
//            //update dependency modules
//        } else {
//            return "Order Update not completed : You have No Privilege";
//        }
//
//    }
//
////    create mapping for delete order [/order]
//    @DeleteMapping
//    public String deleteOrder(@RequestBody CustomerOrder customerOrder) {
//        //check privilege
//        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
//        User loggedUser = userDao.findUserByUsername(auth.getName());
//        HashMap<String, Boolean> loggedUserPrivilege = privilegeController.getPrivilegeByUserModule(auth.getName(), "Order");
//
//        if (loggedUser != null && loggedUserPrivilege.get("del")) {
//            //check object existing
//            CustomerOrder exOrder = orderDao.getReferenceById(customerOrder.getId());
//
//            if (exOrder != null) {
//                //use try catch for catch errors given by the db server
//                try {
//                    //object exist
//                    exOrder.setDeleted_datetime(LocalDateTime.now());
//                    exOrder.setOrderstatus_id(orderstatusDao.getReferenceById(4));
//
//                    //orderDao.delete(exPro);
//                    orderDao.save(exOrder);
//
//                    //run correctly
//                    return "0";
//
//                } catch (Exception ex) {
//                    return "Delete not completed " + ex.getMessage();
//                }
//            } else {
//                //object not exist
//                return "Delete not completed : Order not found ";
//            }
//        } else {
//            return "Delete not completed : User not found ";
//        }
//    }
}
