package lk.fably.controller;

import lk.fably.dao.OrderDao;
import lk.fably.dao.OrderstatusDao;
import lk.fably.dao.UserDao;
import lk.fably.entity.CustomerOrder;
import lk.fably.entity.ProductOrder;
import lk.fably.entity.User;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.ModelAndView;

import java.time.LocalDateTime;
import java.util.HashMap;

@RestController //converts class to request handler and converts the response to JSON or XML
@RequestMapping(value = "/delivery")
public class DeliveryController {

    @Autowired
    private UserDao userDao;

    @Autowired
    private PrivilegeController privilegeController;

    @Autowired
    private OrderDao orderDao;

    @Autowired
    private OrderstatusDao orderstatusDao;

    //get mapping for link delivery html file (order/delivery)
    @GetMapping
    public ModelAndView deliveryUi(){
        ModelAndView deliveryUi = new ModelAndView();
        deliveryUi.setViewName("delivery.html");

        return deliveryUi;
    }

    @PutMapping
    public String updateOrder(@RequestBody CustomerOrder customerOrder) {
        //need to check privilege for logged users
        Authentication auth = SecurityContextHolder.getContext().getAuthentication(); //get security authentication instance for logged user
        User loggedUser = userDao.findUserByUsername((auth.getName())); //get logged user by DB user table using authentication instance

        //get privilege object for logged user and given module
        HashMap<String, Boolean> loggedUserPrivilege = privilegeController.getPrivilegeByUserModule(auth.getName(), "Order");

        if (loggedUser != null && loggedUserPrivilege.get("upd")) {

            //need to check existing
            CustomerOrder extCustomerOrder = orderDao.getReferenceById(customerOrder.getId());
            if (extCustomerOrder == null) {
                return "Order update not completed. Order does not exist !";

            }


            try {
                customerOrder.setLastupdate_datetime(LocalDateTime.now());
                customerOrder.setLastupdateduser_id(loggedUser);

                if (customerOrder.getOrderstatus_id().getName().equals("Invoice Created - PaidOnline")){
                    customerOrder.setOrderstatus_id(orderstatusDao.getReferenceById(6));
                }

                for (ProductOrder productOrder : customerOrder.getProductorderList()){
                    productOrder.setCorder_id(customerOrder);
                }

                //operator
                orderDao.save(customerOrder);
                orderDao.save(customerOrder);


                return "0";
            } catch (Exception ex) {
                return "Order update not completed ! " + ex.getMessage();
            }

            //update dependency modules

        } else {
            return "Order Update not completed. You have No Privilege !";
        }

    }


}
