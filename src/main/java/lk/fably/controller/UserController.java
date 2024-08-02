package lk.fably.controller;

import lk.fably.dao.UserDao;
import lk.fably.entity.Customer;
import lk.fably.entity.Employee;
import lk.fably.entity.User;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.ModelAndView;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.List;


@RestController
@RequestMapping(value = "/user")
public class UserController {

    @Autowired
    private UserDao userDao;

    @Autowired
    private BCryptPasswordEncoder bCryptPasswordEncoder;

    @Autowired
    public PrivilegeController privilegeController;

    @GetMapping
    public ModelAndView userUi(){
        ModelAndView userUi = new ModelAndView();
        userUi.setViewName("user.html");

        return userUi;
    }

    @GetMapping(value = "/findall", produces = "application/json")
    public List<User> userList(){
        //need to check privilege for logged user
        Authentication auth = SecurityContextHolder.getContext().getAuthentication(); //get security authentication instance for logged user
        User loggedUser = userDao.findUserByUsername((auth.getName())); //get logged user by DB user table using authentication instance

        //get privilege object for logged user and given module
        HashMap<String, Boolean> loggedUserPrivilege = privilegeController.getPrivilegeByUserModule(auth.getName(), "User");

        if (loggedUser != null && loggedUserPrivilege.get("sel")) {
            return userDao.findAll();
        } else {
            return null;
        }

    }

    //get mapping for get user by given path variable id -->(user/getbyid/1)
    @GetMapping(value = "/getbyid/{id}", produces = "application/json") //if return dada-->produces
    public User getUserByPVId(@PathVariable("id") Integer id){
        return userDao.getReferenceById(id);
    }


    @PostMapping
    public String insertUser(@RequestBody User user){
        //need to check privilege

        //need to check duplicate
        User extUserByEmp = userDao.getUserByEmployee(user.getEmployee_id().getId());
        if (extUserByEmp !=null){
            return "Save not Completed : Employee already has user account ";
        }

        //do operation
        try{
            //set the value automatically
            user.setAdded_datetime(LocalDateTime.now());

            //need to encrypt password
            user.setPassword(bCryptPasswordEncoder.encode(user.getPassword()));
            user.setPhotoname("profile.png");
            user.setPhotopath("resources/images/");
            userDao.save(user);

            return "0";
        }
        catch (Exception ex){
            return "Save not completed : " + ex.getMessage();
        }
    }

    //create mapping for update user
    @PutMapping
    public String updateUser(@RequestBody User user) {
        //need to check privilege for logged users
        Authentication auth = SecurityContextHolder.getContext().getAuthentication(); //get security authentication instance for logged user
        User loggedUser = userDao.findUserByUsername((auth.getName())); //get logged user by DB user table using authentication instance

        //get privilege object for logged user and given module
        HashMap<String, Boolean> loggedUserPrivilege = privilegeController.getPrivilegeByUserModule(auth.getName(), "User");

        if (loggedUser != null && loggedUserPrivilege.get("upd")) {

            //need to check existing
            User extUser = userDao.getReferenceById(user.getId());
            if (extUser == null) {
                return "User update not completed : User does not exist";

            }


            try {
                user.setLastupdate_datetime(LocalDateTime.now());

                user.setPassword(extUser.getPassword());
                user.setAdded_datetime(extUser.getAdded_datetime());
                user.setPhotoname(extUser.getPhotoname());
                user.setPhotopath(extUser.getPhotopath());

                userDao.save(user);
                return "0";
            } catch (Exception ex) {
                return "User Update not completed : " + ex.getMessage();
            }

            //update auto set values

            //update dependency modules
        } else {
            return "User Update not completed : You have No Privilege";
        }

    }

    //create mapping for delete user [/user]
    @DeleteMapping
    public String deleteUser(@RequestBody User user) {
        //check privilege
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        User loggedUser = userDao.findUserByUsername(auth.getName());
        HashMap<String, Boolean> loggedUserPrivilege = privilegeController.getPrivilegeByUserModule(auth.getName(), "User");

        if (loggedUser != null && loggedUserPrivilege.get("del")) {
            //check object existing
            User exUser = userDao.getReferenceById(user.getId());

            if (exUser != null) {
                //use try catch for catch errors given by the db server
                try {
                    //object exist
                    exUser.setDeleted_datetime(LocalDateTime.now());
                    exUser.setStatus(false);

                    userDao.save(exUser);
                    //run correctly
                    return "0";

                } catch (Exception ex) {
                    return "Delete not completed " + ex.getMessage();
                }
            } else {
                //object not exist
                return "Delete not completed : User not exist ";
            }
        } else {
            return "Delete not completed : User not exist ";
        }
    }

}
