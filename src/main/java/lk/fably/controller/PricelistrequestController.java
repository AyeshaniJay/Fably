package lk.fably.controller;

import lk.fably.dao.*;
import lk.fably.entity.Pricelist;
import lk.fably.entity.Pricelistrequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;


@RestController //converts class to request handler and converts the response to JSON or XML
@RequestMapping(value = "/pricelistrequest")
public class PricelistrequestController {

    @Autowired
    private PricelistrequestDao pricelistrequestDao;
    @Autowired
    private PricelistrequeststatusDao pricelistrequeststatusDao;
    @Autowired
    private UserDao userDao;
    @Autowired
    private PrivilegeController privilegeController;

    @GetMapping(value = "/findall", produces = "application/json")
    public List<Pricelistrequest> pricelistrequests(){
        return pricelistrequestDao.findAll();
    }

//    //get mapping for link html file
//    @GetMapping
//    public ModelAndView orderUi(){
//        ModelAndView orderUi = new ModelAndView();
//        orderUi.setViewName("order.html");
//
//        return orderUi;
//    }
//
//    // get mapping for get All order details --> [/order/findall]
//    @GetMapping(value = "/findall", produces = "application/json")
//    public List<CustomerOrder> orderFindAll() {
//        // return orderDao.findAll(Sort.by(Sort.Direction.DESC,"id"));
//
//        //need to check privilage for loged user
//        Authentication auth = SecurityContextHolder.getContext().getAuthentication(); //get security authentication instance for logged user
//        User loggedUser = userDao.findUserByUsername((auth.getName())); //get logged user by DB user table using authentication instance
//
//        //get privilage object for logged user and given module
//        HashMap<String, Boolean> loggedUserPrivilege = privilegeController.getPrivilegeByUserModule(auth.getName(), "Order");
//
//        if (loggedUser != null && loggedUserPrivilege.get("sel")) {
//            return orderDao.findAll();
//        } else {
//            return null;
//        }
//    }
//
//    //(order/list)
//    @GetMapping(value = "/list", produces = "application/json")
//    public List<CustomerOrder> productSelectList(){
//        return orderDao.list();
//    }
//
//    //get mapping for get order by given path variable id -->(order/getbyid/1)
//    @GetMapping(value = "/getbyid/{id}", produces = "application/json") //if return dada-->produces
//    public CustomerOrder getOrderByPVId(@PathVariable("id") Integer id){
//        return orderDao.getReferenceById(id);
//    }
//
//    //create mapping for add order [/order]
//    @PostMapping
//    public String insertOrder(@RequestBody CustomerOrder customerOrder) {
//        //check privilege for logged user
//        Authentication auth = SecurityContextHolder.getContext().getAuthentication(); //get security authentication instance for logged user
//        User loggedUser = userDao.findUserByUsername((auth.getName())); //get logged user by DB user table using authentication instance
//
//        //get privilege object for logged user and given module
//        HashMap<String, Boolean> loggedUserPrivilege = privilegeController.getPrivilegeByUserModule(auth.getName(), "Order");
//
//        if (loggedUser != null && loggedUserPrivilege.get("ins")) {
//            //check duplicate value for unique
//            CustomerOrder extCustomerOrderByCode = orderDao.findOrderByCode(customerOrder.getCode());
//            if (extCustomerOrderByCode != null) {
//                return "Order insert operation not completed : Given Code is already exist";
//            }
//
//            try {
//                //set automatic values
//                customerOrder.setAdded_datetime(LocalDateTime.now());
//                customerOrder.setAddeduser_id(loggedUser);
//                //order.setNumber("0000000004");
//                customerOrder.setCode(orderDao.nextOrderCode());
//
//                //operator
//                orderDao.save(customerOrder);
//
//                //dependency update
//
//                return "0";
//
//            } catch (Exception ex) {
//                return "Order insert not completed : " + ex.getMessage();
//            }
//        } else {
//            return "Order insert not completed : You have no access";
//        }
//
//
//    }
//
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
