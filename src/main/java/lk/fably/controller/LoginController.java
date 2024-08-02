package lk.fably.controller;

import lk.fably.dao.ModuleDao;
import lk.fably.dao.PrivilegeDao;
import lk.fably.dao.UserDao;
import lk.fably.entity.LoggedUser;
import lk.fably.entity.User;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.AnonymousAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.ModelAndView;

import java.util.HashMap;
import java.util.List;


@RestController
@RequestMapping
public class LoginController {

    @Autowired
    private UserDao userDao;

    @Autowired
    private PrivilegeDao privilegeDao;

    @Autowired
    private ModuleDao moduleDao;

    @Autowired
    private PrivilegeController privilegeController;

    @GetMapping(value = "/login")
    public ModelAndView loginUI(){
        ModelAndView loginUi = new ModelAndView();
        loginUi.setViewName("login.html");

        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        if (auth != null || auth instanceof AnonymousAuthenticationToken){
            SecurityContextHolder.clearContext();
        }
        return loginUi;
    }

    @GetMapping(value = "/login", params = "error")
    public ModelAndView loginErrorUI(@RequestParam("error")String error){
        ModelAndView loginUi = new ModelAndView();
        loginUi.setViewName("login.html");

        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        if (auth != null || auth instanceof AnonymousAuthenticationToken){
            SecurityContextHolder.clearContext();
        }
        return loginUi;
    }

    @GetMapping(value = "/mainwindow")
    public ModelAndView mainWindow(){
        ModelAndView mainwindow = new ModelAndView();
        mainwindow.setViewName("index.html");
        return mainwindow;
    }

    // error UI
//    @GetMapping(value = "/error")
//    public ModelAndView errorUI(){
//        ModelAndView errorUi = new ModelAndView();
//        errorUi.setViewName("404.html");
//        return errorUi;
//    }

    // access denied UI
    @GetMapping(value = "/access-denied")
    public ModelAndView accessDeniedUI(){
        ModelAndView accessDeniedUi = new ModelAndView();
        accessDeniedUi.setViewName("404.html");
        return accessDeniedUi;
    }

    //get mapping for get logged user details
    @GetMapping(value = "/getloggeduser", produces = "application/json")
    public LoggedUser getloggedUser(){

        //get authentication object using security context holder
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();

        //get user object from database user table using authention object
        User loggedUser = userDao.findUserByUsername(authentication.getName());

        if (loggedUser != null){
            LoggedUser currentLoggedUser = new LoggedUser();
            currentLoggedUser.setUsername(loggedUser.getUsername());
            currentLoggedUser.setRole(loggedUser.getRoles().iterator().next().getName());
            currentLoggedUser.setPhotoname(loggedUser.getPhotoname());
            currentLoggedUser.setPhotopath(loggedUser.getPhotopath());

            return currentLoggedUser;
        }else {
            return null;
        }
    }

    //get privilege by user module (/userprivilege/bymodule?modulename=)
    @GetMapping(value = "/userprivilege/bymodule", params = {"modulename"}, produces = "application/json")
    public HashMap<String, Boolean> getPrivilegeByUserModule(@RequestParam("modulename") String modulname){
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        return privilegeController.getPrivilegeByUserModule(auth.getName(), modulname);
    }

    @GetMapping(value = "/modulename/byuser/{username}")
    public List getModuleNameByUser(@PathVariable("username") String username){
        return moduleDao.getByUser(username);
    }
}
