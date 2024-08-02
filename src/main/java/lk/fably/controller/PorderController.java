package lk.fably.controller;

import lk.fably.dao.*;
import lk.fably.entity.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.ModelAndView;

import javax.transaction.Transactional;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.List;


@RestController //converts class to request handler and converts the response to JSON or XML
@RequestMapping(value = "/purchaseorder")
public class PorderController {

    @Autowired
    private PorderDao porderDao;
    @Autowired
    private PorderstatusDao porderstatusDao;
    @Autowired
    private PorderProductDao porderProductDao;
    @Autowired
    private UserDao userDao;
    @Autowired
    private PrivilegeController privilegeController;

    //get mapping for link html file
    @GetMapping
    public ModelAndView orderUi(){
        ModelAndView orderUi = new ModelAndView();
        orderUi.setViewName("porder.html");

        return orderUi;
    }

    //get mapping for get porder by given path variable id -->(purchaseorder/getbyid/1)
    @GetMapping(value = "/getbyid/{id}", produces = "application/json") //if return dada-->produces
    public Porder getProductByPVId(@PathVariable("id") Integer id){
        return porderDao.getReferenceById(id);
    }

    //get mapping for get porder by given path variable id -->(purchaseorder/getbyid/1)
    @GetMapping(value = "/bysupplier/{id}", produces = "application/json") //if return dada-->produces
    public List<Porder> porderBySupplier(@PathVariable("id") Integer id){
        return porderDao.getPorderBySupplier(id);
    }

    //get mapping for get porder by given path variable id -->(purchaseorder/withoutgrn)
    @GetMapping(value = "/withoutgrn", produces = "application/json") //if return dada-->produces
    public List<Porder> PorderWithoutGrn(){
        return porderDao.getPorderWithoutGrn();
    }

//    // get mapping for get All order details --> [/purchaseorder/findall]
    @GetMapping(value = "/findall", produces = "application/json")
    public List<Porder> porderFindAll() {
        // return orderDao.findAll(Sort.by(Sort.Direction.DESC,"id"));

        //need to check privilage for loged user
        Authentication auth = SecurityContextHolder.getContext().getAuthentication(); //get security authentication instance for logged user
        User loggedUser = userDao.findUserByUsername((auth.getName())); //get logged user by DB user table using authentication instance

        //get privilage object for logged user and given module
        HashMap<String, Boolean> loggedUserPrivilege = privilegeController.getPrivilegeByUserModule(auth.getName(), "Porder");

        if (loggedUser != null && loggedUserPrivilege.get("sel")) {
            return porderDao.findAll();
        } else {
            return null;
        }
    }

    //(order/list)
    @GetMapping(value = "/list", produces = "application/json")
    public List<Porder> porderList(){
        return porderDao.list();
    }

    //create mapping for add order [/order]
    @PostMapping
    @Transactional
    public String insertPorder(@RequestBody Porder porder) {
        //check privilege for logged user
        Authentication auth = SecurityContextHolder.getContext().getAuthentication(); //get security authentication instance for logged user
        User loggedUser = userDao.findUserByUsername((auth.getName())); //get logged user by DB user table using authentication instance

        //get privilege object for logged user and given module
        HashMap<String, Boolean> loggedUserPrivilege = privilegeController.getPrivilegeByUserModule(auth.getName(), "Porder");

        if (loggedUser != null && loggedUserPrivilege.get("ins")) {
            //check duplicate value for unique

            try {
                //set automatic values
                porder.setAdded_datetime(LocalDateTime.now());
                porder.setAddeduser_id(loggedUser);

                //set next porder code by Year
                String lastPorderCode = porderDao.lastPorderCode();
                String nextPorderCode = new String();
                LocalDate currentDate = LocalDate.now();
                int currentYear = currentDate.getYear();

                if (lastPorderCode != null){
                    if (String.valueOf(currentYear).substring(2,4).equals(lastPorderCode.substring(0,2))){
                        nextPorderCode = String.valueOf(currentYear).substring(2,4) +
                                String.format("%04d",(Integer.valueOf(lastPorderCode.substring(2)) + 1));
                    }else {
                        nextPorderCode = String.valueOf(currentYear).substring(2,4) + "0001";
                    }

                }else {
                    nextPorderCode = String.valueOf(currentYear).substring(2,4) + "0001";
                }

                porder.setCode(nextPorderCode);

                //operator
                Porder newPorder = porderDao.save(porder);
                //
                for (PorderProduct pop : porder.getPorderProductList()){
                    pop.setPorder_id(newPorder);
                    porderProductDao.save(pop);
                }

                //dependency update
                return "0";

            } catch (Exception ex) {
                return "Purchase Order insert not completed ! " + ex.getMessage();
            }
        } else {
            return "Purchase Order insert not completed. You have no privilege !";
        }


    }

//    //create mapping for update order
    @PutMapping
    public String updatePorder(@RequestBody Porder porder) {
        //need to check privilege for logged users
        Authentication auth = SecurityContextHolder.getContext().getAuthentication(); //get security authentication instance for logged user
        User loggedUser = userDao.findUserByUsername((auth.getName())); //get logged user by DB user table using authentication instance

        //get privilege object for logged user and given module
        HashMap<String, Boolean> loggedUserPrivilege = privilegeController.getPrivilegeByUserModule(auth.getName(), "Porder");

        if (loggedUser != null && loggedUserPrivilege.get("upd")) {

            //need to check existing
            Porder extPorder = porderDao.getReferenceById(porder.getId());
            if (extPorder == null) {
                return "Purchase order update not completed. Purchase order does not exist !";

            }


            try {
                porder.setLastupdated_datetime(LocalDateTime.now());
                porderDao.save(porder);
                return "0";
            } catch (Exception ex) {
                return "Purchase order Update not completed ! " + ex.getMessage();
            }

            //update auto set values

            //update dependency modules
        } else {
            return "Order Update not completed : You have No Privilege";
        }

    }

//    create mapping for delete order [/order]
    @DeleteMapping
    public String deleteOrder(@RequestBody Porder porder) {
        //check privilege
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        User loggedUser = userDao.findUserByUsername(auth.getName());
        HashMap<String, Boolean> loggedUserPrivilege = privilegeController.getPrivilegeByUserModule(auth.getName(), "Porder");

        if (loggedUser != null && loggedUserPrivilege.get("del")) {
            //check object existing
            Porder exOrder = porderDao.getReferenceById(porder.getId());

            if (exOrder != null) {
                //use try catch for catch errors given by the db server
                try {
                    //object exist
                    exOrder.setDeleted_datetime(LocalDateTime.now());
                    exOrder.setPorderstatus_id(porderstatusDao.getReferenceById(4));

                    //orderDao.delete(exPro);
                    porderDao.save(exOrder);

                    //run correctly
                    return "0";

                } catch (Exception ex) {
                    return "Delete not completed !" + ex.getMessage();
                }
            } else {
                //object not exist
                return "Delete not completed. Purchase order not found !";
            }
        } else {
            return "Delete not completed. User not found !";
        }
    }
}
