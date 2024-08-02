package lk.fably.controller;

import lk.fably.dao.ModuleDao;
import lk.fably.entity.Module;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;


@RestController
@RequestMapping(value = "/module")
public class ModuleController {

    @Autowired
    private ModuleDao moduleDao;

    @GetMapping(value = "/list", produces = "application/json")
    public List<Module> moduleList(){
        return moduleDao.findAll();
    }

    @GetMapping(value = "/withoutPrivilege/{id}", produces = "application/json")
    public List<Module> withoutPrivilegeList(@PathVariable("id") Integer id){
        return moduleDao.getModuleWithoutPrivilege(id);
    }

//    @GetMapping(value = "/byuserid/{userid}", produces = "application/json")
//    public List<Module> moduleListByUser(@PathVariable("userid") Integer userid){
//        return moduleDao.getByUserId(userid);
//    }
}
