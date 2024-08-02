package lk.fably.controller;

import lk.fably.dao.*;
import lk.fably.entity.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.ModelAndView;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.List;

@RestController
@RequestMapping(value = "/payment")
public class PaymentController {

    @Autowired
    private PaymentDao paymentDao;

    @Autowired
    private UserDao userDao;

    @Autowired
    private PaymentstatusDao paymentstatusDao;

    @Autowired
    private OrderDao orderDao;

    @Autowired
    private OrderstatusDao orderstatusDao;

    @Autowired
    private PrivilegeController privilegeController;

    @GetMapping(value = "/findall", produces = "application/json")
    public List<Payment> paymentList(){
        return paymentDao.findAll();
    }

    @GetMapping
    public ModelAndView paymentUI(){
        ModelAndView paymentUi = new ModelAndView();
        paymentUi.setViewName("orderpayment.html");

        return paymentUi;
    }

    //get mapping for get order by given path variable id -->(payment/getbyid/1)
    @GetMapping(value = "/getbyid/{id}", produces = "application/json") //if return dada-->produces
    public Payment getOrPaymentByPVId(@PathVariable("id") Integer id){
        return paymentDao.getReferenceById(id);
    }

    //get orderPayment by given order id -->(payment/getbyorderid/1)
    @GetMapping(value = "/getbyorderid/{id}", produces = "application/json") //if return dada-->produces
    public Payment getPaymentByOrderId(@PathVariable("id") Integer id){
        return paymentDao.getByOrderId(id);
    }


    //create mapping for add payment order [/payment]
    @PostMapping
    public String insertOrPayment(@RequestBody Payment orderPayment) {
        //check privilege for logged user
        Authentication auth = SecurityContextHolder.getContext().getAuthentication(); //get security authentication instance for logged user
        User loggedUser = userDao.findUserByUsername((auth.getName())); //get logged user by DB user table using authentication instance

        //get privilege object for logged user and given module
        HashMap<String, Boolean> loggedUserPrivilege = privilegeController.getPrivilegeByUserModule(auth.getName(), "OrderPayment");

        if (loggedUser != null && loggedUserPrivilege.get("ins")) {
            //check duplicate value for unique

//            Payment extCusByEmail = paymentDao.getPaymentByOrder(orderPayment.getCorder_id());
//            if (extCusByEmail != null) {
//                return "Already Paid !";
//            }


            try {
                //set automatic values
                orderPayment.setAdded_datetime(LocalDateTime.now());
                orderPayment.setAddeduser_id(loggedUser);

                orderPayment.setPaymentstatus_id(paymentstatusDao.getReferenceById(2));

                //set next payment code by Year
                String lastPayCode = paymentDao.lastPayCode();
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

                orderPayment.setCode(nextPayCode);
                //operator
                paymentDao.save(orderPayment);

                //dependency update
                CustomerOrder customerOrder = orderDao.getReferenceById(orderPayment.getCorder_id().getId());
                customerOrder.setLastupdate_datetime(LocalDateTime.now());
                customerOrder.setLastupdateduser_id(loggedUser);

//                if (customerOrder.getOrdertype_id().getName().equals("Online")){
                    if (customerOrder.getOrderstatus_id().getName().equals("Ordered")){
                        customerOrder.setOrderstatus_id(orderstatusDao.getReferenceById(2));
                    }

                    if (customerOrder.getOrderstatus_id().getName().equals("Invoice Created - COD")){
                        customerOrder.setOrderstatus_id(orderstatusDao.getReferenceById(6));
                    }
//                }

//                if (customerOrder.getOrdertype_id().getName().equals("Physical")){
//                    if (customerOrder.getOrderstatus_id().getName().equals("Ordered - PaidOnline")){
//                        customerOrder.setOrderstatus_id(orderstatusDao.getReferenceById(6));
//                    }
//
//                    if (customerOrder.getOrderstatus_id().getName().equals("Ordered - COD")){
//                        customerOrder.setOrderstatus_id(orderstatusDao.getReferenceById(6));
//                    }
//                }

                for (ProductOrder productOrder : customerOrder.getProductorderList()){
                    productOrder.setCorder_id(customerOrder);
                }

                orderDao.save(customerOrder);

                return "0";

            } catch (Exception ex) {
                return "Payment insert not completed ! " + ex.getMessage();
            }
        } else {
            return "Payment insert not completed. You have no access !";
        }
    }

    //create mapping for update payment order
    @PutMapping
    public String updateOrPayment(@RequestBody Payment orderPayment) {
        //need to check privilege for logged users
        Authentication auth = SecurityContextHolder.getContext().getAuthentication(); //get security authentication instance for logged user
        User loggedUser = userDao.findUserByUsername((auth.getName())); //get logged user by DB user table using authentication instance

        //get privilege object for logged user and given module
        HashMap<String, Boolean> loggedUserPrivilege = privilegeController.getPrivilegeByUserModule(auth.getName(), "OrderPayment");

        if (loggedUser != null && loggedUserPrivilege.get("upd")) {

            //need to check existing
            Payment extCus = paymentDao.getReferenceById(orderPayment.getId());
            if (extCus == null) {
                return "Payment update not completed. Payment does not exist !";

            }


            try {
                orderPayment.setLastupdated_datetime(LocalDateTime.now());
                paymentDao.save(orderPayment);
                return "0";
            } catch (Exception ex) {
                return "Customer Update not completed ! " + ex.getMessage();
            }

            //update auto set values

            //update dependency modules
        } else {
            return "Payment update not completed. You don't have privilege !";
        }

    }

    //create mapping for delete payment order [/payment]
    @DeleteMapping
    public String deleteOrPayment(@RequestBody Payment orderPayment) {
        //check privilege
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        User loggedUser = userDao.findUserByUsername(auth.getName());
        HashMap<String, Boolean> loggedUserPrivilege = privilegeController.getPrivilegeByUserModule(auth.getName(), "OrderPayment");

        if (loggedUser != null && loggedUserPrivilege.get("del")) {
            //check object existing
            Payment exPay = paymentDao.getReferenceById(orderPayment.getId());

            if (exPay != null) {
                //use try catch for catch errors given by the db server
                try {
                    //object exist
                    exPay.setDeleted_datetime(LocalDateTime.now());
                    exPay.setPaymentstatus_id(paymentstatusDao.getReferenceById(4));

                    paymentDao.save(exPay);

                    //run correctly
                    return "0";

                } catch (Exception ex) {
                    return "Delete not completed ! " + ex.getMessage();
                }
            } else {
                //object not exist
                return "Delete not completed. Customer not found !";
            }
        } else {
            return "Delete not completed. User not found !";
        }
    }
}
