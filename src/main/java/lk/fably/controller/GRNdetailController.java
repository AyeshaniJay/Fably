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
@RequestMapping(value = "/grn")
public class GRNdetailController {

    @Autowired
    private GRNdetailDao grndetailDao;
    @Autowired
    private GRNdetailstatusDao grndetailstatusDao;
    @Autowired
    private UserDao userDao;
    @Autowired
    private StoreDao storeDao;
    @Autowired
    private StorestatusDao storestatusDao;
    @Autowired
    private PrivilegeController privilegeController;

    //get mapping for link html file
    @GetMapping
    public ModelAndView grnUI(){
        ModelAndView grnUi = new ModelAndView();
        grnUi.setViewName("grn.html");

        return grnUi;
    }

    // get mapping for get All order details --> [/grn/findall]
    @GetMapping(value = "/findall", produces = "application/json")
    public List<GRN> orderFindAll() {
        // return orderDao.findAll(Sort.by(Sort.Direction.DESC,"id"));

        //need to check privilege for logged user
        Authentication auth = SecurityContextHolder.getContext().getAuthentication(); //get security authentication instance for logged user
        User loggedUser = userDao.findUserByUsername((auth.getName())); //get logged user by DB user table using authentication instance

        //get privilege object for logged user and given module
        HashMap<String, Boolean> loggedUserPrivilege = privilegeController.getPrivilegeByUserModule(auth.getName(), "GRN");

        if (loggedUser != null && loggedUserPrivilege.get("sel")) {
            return grndetailDao.findAll();
        } else {
            return null;
        }
    }

    //(grn/list)
    @GetMapping(value = "/list", produces = "application/json")
    public List<GRN> grnList(){
        return grndetailDao.list();
    }

    //GRN received list for supplier payment(grn/received)
    @GetMapping(value = "/received", produces = "application/json")
    public List<GRN> grnReceivedList(){
        return grndetailDao.getGrnReceived();
    }

    //get mapping for get order by given path variable id -->(grn/getbyid/1)
    @GetMapping(value = "/getbyid/{id}", produces = "application/json") //if return dada-->produces
    public GRN getGrnByPVId(@PathVariable("id") Integer id){
        return grndetailDao.getReferenceById(id);
    }

    //get grn by porder id (grn/getbyporder/1)
    @GetMapping(value = "getbyporder/{id}", produces = "application/json") //if return dada-->produces
    public GRN getGrnByOrder(@PathVariable("id") Integer id){
        return grndetailDao.getByPorder(id);
    }

    //get grn by porder id (grn/getbysupplier/1)
    @GetMapping(value = "getbysupplier/{id}", produces = "application/json") //if return dada-->produces
    public List<GRN> getGrnBySupplier(@PathVariable("id") Integer id){
        return grndetailDao.getBySupplier(id);
    }

    //create mapping for add order [/order]
    @PostMapping
    @Transactional
    public String insertOrder(@RequestBody GRN grndetail) {
        //check privilege for logged user
        Authentication auth = SecurityContextHolder.getContext().getAuthentication(); //get security authentication instance for logged user
        User loggedUser = userDao.findUserByUsername((auth.getName())); //get logged user by DB user table using authentication instance

        //get privilege object for logged user and given module
        HashMap<String, Boolean> loggedUserPrivilege = privilegeController.getPrivilegeByUserModule(auth.getName(), "GRN");

        if (loggedUser != null && loggedUserPrivilege.get("ins")) {
            //check duplicate value for unique


            try {
                //set automatic values
                grndetail.setAdded_datetime(LocalDateTime.now());
                grndetail.setAddeduser_id(loggedUser);

                grndetail.setGrndetailstatus_id(grndetailstatusDao.getReferenceById(2));

                //set next grn code by Year Month
                String lastGrnCode = grndetailDao.lastGrnCode();
                String nextGrnCode = new String();
                LocalDate currentDate = LocalDate.now();
                int currentYear = currentDate.getYear();

                if (lastGrnCode != null){
                    if (String.valueOf(currentYear).substring(2,4).equals(lastGrnCode.substring(0,2))){
                        nextGrnCode = String.valueOf(currentYear).substring(2,4) +
                                String.format("%04d",(Integer.valueOf(lastGrnCode.substring(2)) + 1));
                    }else {
                        nextGrnCode = String.valueOf(currentYear).substring(2,4) + "0001";
                    }

                }else {
                    nextGrnCode = String.valueOf(currentYear).substring(2,4) + "0001";
                }
                grndetail.setCode(nextGrnCode);
                //operator
                for (GRNProduct grnProduct : grndetail.getGrnProductList()){
                    grnProduct.setGrndetail_id(grndetail);
                }
                grndetailDao.save(grndetail);

                //dependency update //inventory Up
                for (GRNProduct grnProduct : grndetail.getGrnProductList()){

                    PStore pStore = storeDao.getByProductSize(grnProduct.getProduct_id().getId(),grnProduct.getSize_id().getId());
                    //check inventory availability
                   if(pStore != null){
                    pStore.setAvailableqty(pStore.getAvailableqty()+grnProduct.getQty());
                    storeDao.save(pStore);

                   }else {
                       PStore newStore = new PStore();
                       newStore.setProduct_id(grnProduct.getProduct_id());
                       newStore.setSize_id(grnProduct.getSize_id());
                       newStore.setAvailableqty(grnProduct.getQty());
                       newStore.setTotalqty(grnProduct.getQty());
                       newStore.setStorestatus_id(storestatusDao.getReferenceById(1));
                       storeDao.save(newStore);
                   }
                }

                return "0";

            } catch (Exception ex) {
                return "GRN insert not completed ! " + ex.getMessage();
            }
        } else {
            return "GRN insert not completed. You have no access !";
        }


    }

    //create mapping for update order
    @PutMapping
    public String updateOrder(@RequestBody GRN grndetail) {
        //need to check privilege for logged users
        Authentication auth = SecurityContextHolder.getContext().getAuthentication(); //get security authentication instance for logged user
        User loggedUser = userDao.findUserByUsername((auth.getName())); //get logged user by DB user table using authentication instance

        //get privilege object for logged user and given module
        HashMap<String, Boolean> loggedUserPrivilege = privilegeController.getPrivilegeByUserModule(auth.getName(), "GRN");

        if (loggedUser != null && loggedUserPrivilege.get("upd")) {

            //need to check existing
            GRN extGRN = grndetailDao.getReferenceById(grndetail.getId());
            if (extGRN == null) {
                return "GRN update not completed. GRN does not exist !";

            }


            try {
                //update auto set values
                grndetail.setLastupdateduser_id(loggedUser);
                grndetail.setLastupdated_datetime(LocalDateTime.now());

                //operator
                for (GRNProduct grnProduct : grndetail.getGrnProductList()){
                    grnProduct.setGrndetail_id(grndetail);
                }
                //save
                grndetailDao.save(grndetail);


                return "0";
            } catch (Exception ex) {
                return "GRN Update not completed !" + ex.getMessage();
            }

            //update dependency modules
        } else {
            return "GRN Update not completed. You don't have privilege !";
        }

    }

//    create mapping for delete order [/order]
    @DeleteMapping
    public String deleteOrder(@RequestBody GRN grndetail) {
        //check privilege
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        User loggedUser = userDao.findUserByUsername(auth.getName());
        HashMap<String, Boolean> loggedUserPrivilege = privilegeController.getPrivilegeByUserModule(auth.getName(), "GRN");

        if (loggedUser != null && loggedUserPrivilege.get("del")) {
            //check object existing
            GRN exGRN = grndetailDao.getReferenceById(grndetail.getId());

            if (exGRN != null) {
                //use try catch for catch errors given by the db server
                try {
                    //object exist
                    exGRN.setDeleted_datetime(LocalDateTime.now());
                    exGRN.setDeleteduser_id(loggedUser);
                    exGRN.setGrndetailstatus_id(grndetailstatusDao.getReferenceById(3));

                    //orderDao.delete(exPro);
                    grndetailDao.save(exGRN);

                    //run correctly
                    return "0";

                } catch (Exception ex) {
                    return "Delete not completed !" + ex.getMessage();
                }
            } else {
                //object not exist
                return "Delete not completed. GRN not found !";
            }
        } else {
            return "Delete not completed. User not found !";
        }
    }
}
