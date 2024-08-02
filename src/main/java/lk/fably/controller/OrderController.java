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
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;


@RestController //converts class to request handler and converts the response to JSON or XML
@RequestMapping(value = "/order")
public class OrderController {

    @Autowired
    private OrderDao orderDao;
    @Autowired
    private OrderstatusDao orderstatusDao;
    @Autowired
    private UserDao userDao;
    @Autowired
    private StoreDao storeDao;
    @Autowired
    private PrivilegeController privilegeController;

    //get mapping for link html file
    @GetMapping
    public ModelAndView orderUi(){
        ModelAndView orderUi = new ModelAndView();
        orderUi.setViewName("order.html");

        return orderUi;
    }

    //get mapping for get order by given path variable id -->(order/getbyid/1)
    @GetMapping(value = "/getbyid/{id}", produces = "application/json") //if return dada-->produces
    public CustomerOrder getOrderByPVId(@PathVariable("id") Integer id){
        return orderDao.getReferenceById(id);
    }

    // get mapping for get All order details --> [/order/findall]
    @GetMapping(value = "/findall", produces = "application/json")
    public List<CustomerOrder> orderFindAll() {
        // return orderDao.findAll(Sort.by(Sort.Direction.DESC,"id"));
        //need to check privilege for logged user
        Authentication auth = SecurityContextHolder.getContext().getAuthentication(); //get security authentication object for logged user
        User loggedUser = userDao.findUserByUsername((auth.getName())); //get logged user by DB user table using authentication instance

        //get privilege object for logged user and given module
        HashMap<String, Boolean> loggedUserPrivilege = privilegeController.getPrivilegeByUserModule(auth.getName(), "Order");

        if (loggedUser != null && loggedUserPrivilege.get("sel")) {
            return orderDao.findAll();
        } else {
            List<CustomerOrder> customerOrderList = new ArrayList<>(); //return empty array
            return customerOrderList;
        }
    }

    //get mapping for link delivery html file (order/delivery)
    @GetMapping(value = "/delivery")
    public ModelAndView deliveryUi(){
        ModelAndView deliveryUi = new ModelAndView();
        deliveryUi.setViewName("delivery.html");

        return deliveryUi;
    }

    @GetMapping(value = "/getcount", produces = "application/json")
    public CustomerOrder getOrderCount(){
        return orderDao.getOrderCount();
    }

    // get mapping for get orders to delivery list where order status is invoice create --> [/order/byorderstatus]
    @GetMapping(value = "/byorderstatus", produces = "application/json")
    public List<CustomerOrder> orderByOrderStatus() {
        return orderDao.getByOrderStatus();
    }

    // get mapping for get orders to delivery list where order status is invoice create --> [/order/paymentbyorderstatus]
    @GetMapping(value = "/paymentbyorderstatus", produces = "application/json")
    public List<CustomerOrder> orderPaymentByOrderStatus() {
        return orderDao.getPaymentByOrderStatus();
    }

    //(order/list) not deleted orders
    @GetMapping(value = "/forinvoice", produces = "application/json")
    public List<CustomerOrder> productSelectList(){
        return orderDao.ordersForInvoice();
    }

    //get order list by order status
    @GetMapping(value = "/byorderstatus/{id}", produces = "application/json")
    public List<CustomerOrder> getOrders(@PathVariable("id") Integer id){
        return orderDao.getOrder(id);
    }

    //create mapping for add order [/order]
    @PostMapping
    public String insertOrder(@RequestBody CustomerOrder customerOrder) {
        //check privilege for logged user
        Authentication auth = SecurityContextHolder.getContext().getAuthentication(); //get security authentication instance for logged user
        User loggedUser = userDao.findUserByUsername((auth.getName())); //get logged user by DB user table using authentication instance

        //get privilege object for logged user and given module
        HashMap<String, Boolean> loggedUserPrivilege = privilegeController.getPrivilegeByUserModule(auth.getName(), "Order");

        if (loggedUser != null && loggedUserPrivilege.get("ins")) {
            //check duplicate for unique value
            CustomerOrder extCustomerOrderByCode = orderDao.findOrderByCode(customerOrder.getCode());
            if (extCustomerOrderByCode != null) {
                return "Order insert operation not completed. Given Code is already exist !";
            }

            try {
                //check inventory availability
                Boolean inventoryAvailability = true;
                String inventoryNotAvailabilityProductName = "";
                for (ProductOrder productOrder : customerOrder.getProductorderList()){
                    productOrder.setCorder_id(customerOrder);

                    PStore pStore = storeDao.getByProductSize(productOrder.getProduct_id().getId(),productOrder.getSize_id().getId());

                    if (pStore != null){
                        if (pStore.getAvailableqty() < productOrder.getQty() ){
                            inventoryAvailability = false;
                            inventoryNotAvailabilityProductName = productOrder.getProduct_id().getName();
                            break;
                        }
                    }else {
                        return "Product not available in inventory !";
                    }
                }

                if (!inventoryAvailability){
                    return "Order insert not completed. " + inventoryNotAvailabilityProductName + " inventory not enough !";
                }

                //set automatic values
                customerOrder.setAdded_datetime(LocalDateTime.now());
                customerOrder.setAddeduser_id(loggedUser);

                //set next order code by Year
                String lastOrderCode = orderDao.lastOrderCode();
                String nextOrderCode = new String();
                LocalDate currentDate = LocalDate.now();
                int currentYear = currentDate.getYear();

                if (lastOrderCode != null){
                    if (String.valueOf(currentYear).substring(2,4).equals(lastOrderCode.substring(0,2))){
                        nextOrderCode = String.valueOf(currentYear).substring(2,4) +
                                String.format("%04d",(Integer.valueOf(lastOrderCode.substring(2)) + 1));
                    }else {
                        nextOrderCode = String.valueOf(currentYear).substring(2,4) + "0001";
                    }

                }else {
                    nextOrderCode = String.valueOf(currentYear).substring(2,4) + "0001";
                }

                customerOrder.setCode(nextOrderCode);

                for (ProductOrder productOrder : customerOrder.getProductorderList()){
                    productOrder.setCorder_id(customerOrder);
                }

                //operator
                orderDao.save(customerOrder);

                //inventory down
                for (ProductOrder productOrder : customerOrder.getProductorderList()){
                    productOrder.setCorder_id(customerOrder);

                    PStore pStore = storeDao.getByProductSize(productOrder.getProduct_id().getId(),productOrder.getSize_id().getId());
                    pStore.setAvailableqty(pStore.getAvailableqty()-productOrder.getQty());
                    storeDao.save(pStore);
                }

                //dependency update

                return "0";

            } catch (Exception ex) {
                return "Order insert not completed ! " + ex.getMessage();
            }
        } else {
            return "Order insert not completed. You have no access !";
        }


    }

    //create mapping for update order
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

                for (ProductOrder productOrder : customerOrder.getProductorderList()){
                    productOrder.setCorder_id(customerOrder);
                }
                orderDao.save(customerOrder);
                return "0";
            } catch (Exception ex) {
                return "Order Update not completed ! " + ex.getMessage();
            }

            //update auto set values

            //update dependency modules

        } else {
            return "Order Update not completed. You have No Privilege !";
        }

    }

//    create mapping for delete order [/order]
    @DeleteMapping
    public String deleteOrder(@RequestBody CustomerOrder customerOrder) {
        //check privilege
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        User loggedUser = userDao.findUserByUsername(auth.getName());
        HashMap<String, Boolean> loggedUserPrivilege = privilegeController.getPrivilegeByUserModule(auth.getName(), "Order");

        if (loggedUser != null && loggedUserPrivilege.get("del")) {
            //check object existing
            CustomerOrder exOrder = orderDao.getReferenceById(customerOrder.getId());

            if (exOrder != null) {
                //use try catch for catch errors given by the db server
                try {
                    //object exist
                    exOrder.setDeleted_datetime(LocalDateTime.now());
                    exOrder.setOrderstatus_id(orderstatusDao.getReferenceById(7));

                    //orderDao.delete(exPro);
                    orderDao.save(exOrder);

                    //run correctly
                    return "0";

                } catch (Exception ex) {
                    return "Delete not completed ! " + ex.getMessage();
                }
            } else {
                // if object not exist
                return "Delete not completed. Order not found !";
            }
        } else {
            // if user dont have privilege
            return "Delete not completed. User not found !";
        }
    }
}
