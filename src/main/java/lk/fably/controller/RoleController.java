package lk.fably.controller;

import lk.fably.dao.RoleDao;
import lk.fably.entity.Role;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;


@RestController
@RequestMapping(value = "/role")
public class RoleController {

    @Autowired
    private RoleDao roleDao;

    @GetMapping(value = "/list", produces = "application/json")
    public List<Role> roleList(){
        return roleDao.list();
    }

    @GetMapping(value = "/byuserid/{userid}", produces = "application/json")
    public List<Role> roleListByUser(@PathVariable("userid") Integer userid){
        return roleDao.getByUserId(userid);
    }
}
