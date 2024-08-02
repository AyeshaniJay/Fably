package lk.fably.controller;

import lk.fably.dao.PrivilegeDao;
import lk.fably.dao.UserDao;
import lk.fably.entity.Customer;
import lk.fably.entity.Privilege;
import lk.fably.entity.Supplier;
import lk.fably.entity.User;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Sort;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.ModelAndView;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.List;


@RestController //create privilege controller class as router (work as request handler)
@RequestMapping(value = "/privilege") //class level mapping
public class PrivilegeController {

    @Autowired
    private PrivilegeDao privilegeDao;
    @Autowired
    private UserDao userDao;

    @GetMapping
    public ModelAndView privilegeUi(){
        ModelAndView viewPrivilege = new ModelAndView();
        viewPrivilege.setViewName("privilege.html");
        return viewPrivilege;
    }

    //get mapping for get privilege by given path variable id -->(privilege/getbyid/1)
    @GetMapping(value = "/getbyid/{id}", produces = "application/json") //if return dada-->produces
    public Privilege getSupplierByPVId(@PathVariable("id") Integer id){
        return privilegeDao.getReferenceById(id);
    }

    //find all mapping for get all privilege data
    @GetMapping(value = "/findall", produces = "application/json")
    public List<Privilege> findAll(){
        //need to check privilege for loged user
        Authentication auth = SecurityContextHolder.getContext().getAuthentication(); //get security authentication instance for logged user
        User loggedUser = userDao.findUserByUsername((auth.getName())); //get logged user by DB user table using authentication instance

        //get privilege object for logged user and given module
        HashMap<String, Boolean> loggedUserPrivilege =getPrivilegeByUserModule(auth.getName(), "Privilege");

        if (loggedUser != null && loggedUserPrivilege.get("sel")) {
            return privilegeDao.findAll(Sort.by(Sort.Direction.DESC,"id"));
        } else {
            return null;
        }
    }

    //create mapping for and privilege [/privilege --> POST]
    @PostMapping
    public String addPrivilege(@RequestBody Privilege privilege){
        //check privilege for logged user
        Authentication auth = SecurityContextHolder.getContext().getAuthentication(); //get security authentication instance for logged user
        User loggedUser = userDao.findUserByUsername((auth.getName())); //get logged user by DB user table using authentication instance

        //get privilege object for logged user and given module
        HashMap<String, Boolean> loggedUserPrivilege =getPrivilegeByUserModule(auth.getName(), "Privilege");

        if (loggedUser != null && loggedUserPrivilege.get("ins")) {

            //check duplicate
            Privilege extPrivilege = privilegeDao.getByRoleAndModule(privilege.getRole_id().getId(), privilege.getModule_id().getId());
            if (extPrivilege != null) {
                return "Insert not complete. Privilege already insert !";
            }

            try {
                //set auto update value
                privilege.setAdded_datetime(LocalDateTime.now());
                //privilege.setAdded_user_id(userDao.getReferencedById(1));

                privilegeDao.save(privilege);

                return "0";
            } catch (Exception ex) {
                return "Insert not completed ! " + ex.getMessage();
            }
        }else {
            return "Privilege insert not completed. You have no access !";
        }
    }

    //create mapping for update privilege
    @PutMapping
    public String updatePrivilege(@RequestBody Privilege privilege) {
        //need to check privilege for logged users
        Authentication auth = SecurityContextHolder.getContext().getAuthentication(); //get security authentication instance for logged user
        User loggedUser = userDao.findUserByUsername((auth.getName())); //get logged user by DB user table using authentication instance

        //get privilege object for logged user and given module
        HashMap<String, Boolean> loggedUserPrivilege = getPrivilegeByUserModule(auth.getName(), "Privilege");

        if (loggedUser != null && loggedUserPrivilege.get("upd")) {

            //need to check existing
            Privilege extPrivilege = privilegeDao.getReferenceById(privilege.getId());
            if (extPrivilege == null) {
                return "Privilege update not completed. Privilege does not exist !";
            }

            try {
                privilege.setLastupdate_datetime(LocalDateTime.now());
                privilegeDao.save(privilege);
                return "0";
            } catch (Exception ex) {
                return "Privilege update not completed ! " + ex.getMessage();
            }

            //update auto set values

            //update dependency modules
        } else {
            return "Privilege update not completed. You have no privilege !";
        }

    }

    //create delete mapping for delete privilege
    @DeleteMapping
    public String deletePrivilege(@RequestBody Privilege privilege){
        //check privilege for logged user
        Authentication auth = SecurityContextHolder.getContext().getAuthentication(); //get security authentication instance for logged user
        User loggedUser = userDao.findUserByUsername((auth.getName())); //get logged user by DB user table using authentication instance

        //get privilege object for logged user and given module
        HashMap<String, Boolean> loggedUserPrivilege = getPrivilegeByUserModule(auth.getName(), "Privilege");

        if (loggedUser != null && loggedUserPrivilege.get("del")){
            //check existing
            Privilege exrPriv = privilegeDao.getReferenceById(privilege.getId());
            if(exrPriv == null){
                return "Delete not completed. Privilege not exist !";
            }

            try {
                //add data insert value
                exrPriv.setDelete_datetime(LocalDateTime.now());
                exrPriv.setSel(false);
                exrPriv.setIns(false);
                exrPriv.setUpd(false);
                exrPriv.setDel(false);

                //opreator
                privilegeDao.save(exrPriv);
                return "0";

            }catch (Exception ex){
                return "Delete not completed !" + ex.getMessage();
            }
        }else {
            return "Privilege delete not completed. You have no access !";
        }
    }

    //get privilege by logged user by username and given module
    //front end eke button disable
    //backend eke sel ins upd del valata adala privilege genna gnna
    // to return
    public HashMap<String ,Boolean> getPrivilegeByUserModule(String username, String modulename) {

        User logedUser = userDao.findUserByUsername(username);
        HashMap<String,Boolean> userPrivilege  = new HashMap<>();
        if (logedUser != null) {
            if (username.equals("admin") || username.equals("Admin")) {
                userPrivilege.put("sel",true);
                userPrivilege.put("ins",true);
                userPrivilege.put("upd",true);
                userPrivilege.put("del",true);
//                userPrivilege.put("print",true);
                return userPrivilege;
            }else {//when login another user
                String privilegeString = privilegeDao.getPrivilegeByUserModule(username, modulename);
                String[] privilegeArray = privilegeString.split(",");
                userPrivilege.put("sel",privilegeArray[0].equals("1"));
                userPrivilege.put("ins",privilegeArray[1].equals("1"));
                userPrivilege.put("upd",privilegeArray[2].equals("1"));
                userPrivilege.put("del",privilegeArray[3].equals("1"));
//                userPrivilege.put("print",privilegeArray[4].equals("1"));
                return userPrivilege;
            }

        } else {
            userPrivilege.put("sel",false);
            userPrivilege.put("ins",false);
            userPrivilege.put("upd",false);
            userPrivilege.put("del",false);
            return userPrivilege;
        }
    }
}
