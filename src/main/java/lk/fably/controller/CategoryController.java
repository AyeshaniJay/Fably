package lk.fably.controller;

import lk.fably.dao.CategoryDao;
import lk.fably.dao.UserDao;
import lk.fably.entity.Category;
import lk.fably.entity.Product;
import lk.fably.entity.Productsize;
import lk.fably.entity.User;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.List;

@RestController
@RequestMapping(value = "/category")
public class CategoryController {

    @Autowired
    private CategoryDao categoryDao;

    @Autowired
    private UserDao userDao;
    @Autowired
    private PrivilegeController privilegeController;

    @GetMapping(value = "/list", produces = "application/json")
    public List<Category> categoryList(){
        return categoryDao.findAll();
    }
    // (/category/byorderproduct/1)
    @GetMapping(value = "/byorderproduct/{id}", produces = "application/json")
    public Category categoryByOrderProduct(@PathVariable ("id") Integer id){
        return categoryDao.getByOrderProducr(id);
    }

    //create mapping for add category [/category]
    @PostMapping
    public String insertCategory(@RequestBody Category category) {
        try {
            categoryDao.save(category);
            return "0";
        } catch (Exception ex) {
            return "Category insert not completed ! " + ex.getMessage();
        }
    }
}
