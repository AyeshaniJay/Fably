package lk.fably.controller;

import lk.fably.dao.SupplierDao;
import lk.fably.dao.SupplierstatusDao;
import lk.fably.dao.UserDao;
import lk.fably.entity.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.ModelAndView;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;

@RestController
@RequestMapping(value = "/supplier")
public class SupplierController {

    @Autowired
    private SupplierDao supplierDao;

    @Autowired
    private UserDao userDao;

    @Autowired
    private SupplierstatusDao supplierstatusDao;

    @Autowired
    private PrivilegeController privilegeController;

    //get mapping for link html file
    @GetMapping
    public ModelAndView supplierUI(){
        ModelAndView supplierUi = new ModelAndView();
        supplierUi.setViewName("supplier.html");

        return supplierUi;
    }

    @GetMapping(value = "/getcount", produces = "application/json")
    public Supplier getSupplierCount(){
        return supplierDao.getSupplierCount();
    }

    @GetMapping(value = "/list", produces = "application/json")
    public List<Supplier> supplierList(){
        return supplierDao.list();
    }

    @GetMapping(value = "/active", produces = "application/json")
    public List<Supplier> activeSupplierList(){
        return supplierDao.getActiveSupplier();
    }

    //get mapping for get All supplier details --> [/supplier/findall]
    @GetMapping(value = "/findall", produces = "application/json")
    public List<Supplier> supplierFindAll(){
        // return supplierDao.findAll(Sort.by(Sort.Direction.DESC,"id"));

        //need to check privilege for loged user
        Authentication auth = SecurityContextHolder.getContext().getAuthentication(); //get security authentication instance for logged user
        User loggedUser = userDao.findUserByUsername((auth.getName())); //get logged user by DB user table using authentication instance

        //get privilege object for logged user and given module
        HashMap<String, Boolean> loggedUserPrivilege = privilegeController.getPrivilegeByUserModule(auth.getName(), "Supplier");

        if (loggedUser != null && loggedUserPrivilege.get("sel")) {
//            List<Supplier> supplierList = new ArrayList<>();
            return supplierDao.findAll();

//            List<Supplier> supplierList = new ArrayList<>();
//            return deletesupplierDao.findAll();
        } else {
            return null;
        }
    }

    //get mapping for get supplier by given path variable id -->(supplier/getbyid/1)
    @GetMapping(value = "/getbyid/{id}", produces = "application/json") //if return dada-->produces
    public Supplier getSupplierByPVId(@PathVariable("id") Integer id){
        return supplierDao.getReferenceById(id);
    }

    //get mapping for get Supplier by given porder id -->(/supplier/byporder/1)
    @GetMapping(value = "/byporder/{pid}", produces = "application/json") //if return dada-->produces
    public Supplier getSupplierByPorder(@PathVariable("pid") Integer pid){
        return supplierDao.getSupplierByPorder(pid);
    }

    //create mapping for add supplier [/supplier]
    @PostMapping
    public String insertSupplier(@RequestBody Supplier supplier) {
        //check privilege for logged user
        Authentication auth = SecurityContextHolder.getContext().getAuthentication(); //get security authentication instance for logged user
        User loggedUser = userDao.findUserByUsername((auth.getName())); //get logged user by DB user table using authentication instance

        //get privilege object for logged user and given module
        HashMap<String, Boolean> loggedUserPrivilege = privilegeController.getPrivilegeByUserModule(auth.getName(), "Supplier");

        if (loggedUser != null && loggedUserPrivilege.get("ins")) {
            //check duplicate value for unique

            Supplier extSupplierByEmail = supplierDao.getSuppliersByEmail(supplier.getEmail());
            if (extSupplierByEmail != null) {
                return "Supplier insert not completed. Given Email already exist !";
            }

            Supplier extSupplierByMobile = supplierDao.getSuppliersByMobile1(supplier.getMobile1());
            if (extSupplierByMobile != null) {
                return "Supplier insert not completed. Given Mobile already exist !";
            }


            try {
                //set automatic values
                supplier.setAdded_datetime(LocalDateTime.now());
                //supplier.setNumber("004");
                supplier.setCode(supplierDao.nextSupCode());

                supplier.setAddeduser_id(loggedUser);
                //operator
                for (Supplierbankdetail supplierbankdetail : supplier.getSupplierbankdetailList()){
                    supplierbankdetail.setSupplier_id(supplier);
                }
                //save
                supplierDao.save(supplier);

                //dependency update

                return "0";

            } catch (Exception ex) {
                return "Supplier insert not completed : " + ex.getMessage();
            }
        } else {
            return "Supplier insert not completed : You have no access";
        }


    }

    //create mapping for update supplier
    @PutMapping
    public String updateSupplier(@RequestBody Supplier supplier) {
        //need to check privilege for logged users
        Authentication auth = SecurityContextHolder.getContext().getAuthentication(); //get security authentication instance for logged user
        User loggedUser = userDao.findUserByUsername((auth.getName())); //get logged user by DB user table using authentication instance

        //get privilege object for logged user and given module
        HashMap<String, Boolean> loggedUserPrivilege = privilegeController.getPrivilegeByUserModule(auth.getName(), "Supplier");

        if (loggedUser != null && loggedUserPrivilege.get("upd")) {

            //need to check existing
            Supplier extSupplier = supplierDao.getReferenceById(supplier.getId());
            if (extSupplier == null) {
                return "Supplier update not completed : Supplier does not exist";
            }


            try {
                supplier.setLastupdated_datetime(LocalDateTime.now());
                //operator
                for (Supplierbankdetail supplierbankdetail : supplier.getSupplierbankdetailList()){
                    supplierbankdetail.setSupplier_id(supplier);
                }
                supplierDao.save(supplier);
                return "0";
            } catch (Exception ex) {
                return "Supplier Update not completed : " + ex.getMessage();
            }

            //update auto set values

            //update dependency modules
        } else {
            return "Supplier Update not completed : You have No Privilege";
        }

    }

    //create mapping for delete Supplier [/supplier]
    @DeleteMapping
    public String deleteSupplier(@RequestBody Supplier supplier) {
        //check privilege
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        User loggedUser = userDao.findUserByUsername(auth.getName());
        HashMap<String, Boolean> loggedUserPrivilege = privilegeController.getPrivilegeByUserModule(auth.getName(), "Supplier");

        if (loggedUser != null && loggedUserPrivilege.get("del")) {
            //check object existing
            Supplier extSupplier = supplierDao.getReferenceById(supplier.getId());

            if (extSupplier != null) {
                //use try catch for catch errors given by the db server
                try {
                    //object exist
                    extSupplier.setDeleted_datetime(LocalDateTime.now());
                    extSupplier.setSupplierstatus_id(supplierstatusDao.getReferenceById(3));

                    //supplierDao.delete(exSupplier);
                    supplierDao.save(extSupplier);

                    //run correctly
                    return "0";

                } catch (Exception ex) {
                    return "Delete not completed " + ex.getMessage();
                }
            } else {
                //object not exist
                return "Delete not completed : Supplier not found ";
            }
        } else {
            return "Delete not completed : User not found ";
        }
    }
}
