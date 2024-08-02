package lk.fably.controller;

import lk.fably.dao.ProductDao;
import lk.fably.dao.ProductstatusDao;
import lk.fably.dao.StoreDao;
import lk.fably.dao.UserDao;
import lk.fably.entity.PStore;
import lk.fably.entity.Product;
import lk.fably.entity.User;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.ModelAndView;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.List;


@RestController //converts class to request handler and converts the response to JSON or XML
@RequestMapping(value = "/store")
public class StoreController {

    @Autowired
    private ProductDao productDao;
    @Autowired
    private ProductstatusDao productstatusDao;
    @Autowired
    private UserDao userDao;
    @Autowired
    private StoreDao storeDao;
    @Autowired
    private PrivilegeController privilegeController;

    //get mapping for link html file
    @GetMapping
    public ModelAndView storeUi(){
        ModelAndView storeUi = new ModelAndView();
        storeUi.setViewName("store.html");

        return storeUi;
    }

    // get mapping for get All product details --> [/store/findall]
    @GetMapping(value = "/findall", produces = "application/json")
    public List<PStore> productFindAll() {
        // return productDao.findAll(Sort.by(Sort.Direction.DESC,"id"));

        //need to check privilege for loged user
        Authentication auth = SecurityContextHolder.getContext().getAuthentication(); //get security authentication instance for logged user
        User loggedUser = userDao.findUserByUsername((auth.getName())); //get logged user by DB user table using authentication instance

        //get privilege object for logged user and given module
        HashMap<String, Boolean> loggedUserPrivilege = privilegeController.getPrivilegeByUserModule(auth.getName(), "Product");

        if (loggedUser != null && loggedUserPrivilege.get("sel")) {
            return storeDao.findAll();
        } else {
            return null;
        }
    }

//    //get mapping for get product by given path variable id -->(product/getbyid/1)
//    @GetMapping(value = "/getbyid/{id}", produces = "application/json") //if return dada-->produces
//    public Product getProductByPVId(@PathVariable("id") Integer id){
//        return productDao.getReferenceById(id);
//    }
//
//    //(product/list)
//    @GetMapping(value = "/list", produces = "application/json")
//    public List<Product> productSelectList(){
//        return productDao.list();
//    }
//
//    //get product details by given path variable id -->(product/getpdetailbyid/1)
//    @GetMapping(value = "/getpdetailbyid/{id}", produces = "application/json") //if return dada-->produces
//    public Product getPrice(@PathVariable("id") Integer id){
//        return productDao.getPriceById(id);
//    }
//
//
//    //get product list by given supplier using path variable (product/listbysupplier/{sid})
//    @GetMapping(value = "/listbysupplier/{sid}", produces = "application/json") //if return dada-->produces
//    public List<Product> getListBySId(@PathVariable("sid") Integer sid){
//        return productDao.getListBySupplier(sid);
//    }
//
//    //get product list by given supplier using path variable (product/listbysupplier/{sid})
//    @GetMapping(value = "/listbysupplierhavenot/{sid}", produces = "application/json") //if return dada-->produces
//    public List<Product> getListBySHaveNotId(@PathVariable("sid") Integer sid){
//        return productDao.getListBySupplierHaveNot(sid);
//    }

    //create mapping for add product [/product]
    @PostMapping
    public String insertPro(@RequestBody Product product) {
        //check privilege for logged user
        Authentication auth = SecurityContextHolder.getContext().getAuthentication(); //get security authentication instance for logged user
        User loggedUser = userDao.findUserByUsername((auth.getName())); //get logged user by DB user table using authentication instance

        //get privilege object for logged user and given module
        HashMap<String, Boolean> loggedUserPrivilege = privilegeController.getPrivilegeByUserModule(auth.getName(), "Product");

        if (loggedUser != null && loggedUserPrivilege.get("ins")) {
            //check duplicate value for unique
           /* Product extProByCode = productDao.findProByCode(product.getCode());
            if (extProByCode != null) {
                return "Product insert operation not completed : Given Code is already exist";
            }*/

            try {

                System.out.println(
                        product
                );
                //set automatic values
                product.setAdded_datetime(LocalDateTime.now());
                product.setAddeduser_id(loggedUser);
                String nextCode = productDao.nextCode(product.getCategory_id().getId());
                if(nextCode != null)
                    product.setCode(product.getCategory_id().getCode()+nextCode);
                else
                    product.setCode(product.getCategory_id().getCode()+"0001");

//                Category selCategory = categoryDao.selCategoryCode();
//                if (selCategory != null){
//                    for (selCategory.getCode()){
//                        product.setCode(productDao.nextProCode());
//                    }
//                }
             //   product.setCode(productDao.nextProCode());

                //operator
                productDao.save(product);

                //dependency update

                return "0";

            } catch (Exception ex) {
                return "Product insert not completed : " + ex.getMessage();
            }
        } else {
            return "Product insert not completed : You have no access";
        }
    }

    //create mapping for update product
    @PutMapping
    public String updateProduct(@RequestBody Product product) {
        //need to check privilege for logged users
        Authentication auth = SecurityContextHolder.getContext().getAuthentication(); //get security authentication instance for logged user
        User loggedUser = userDao.findUserByUsername((auth.getName())); //get logged user by DB user table using authentication instance

        //get privilage object for logged user and given module
        HashMap<String, Boolean> loggedUserPrivilege = privilegeController.getPrivilegeByUserModule(auth.getName(), "Product");

        if (loggedUser != null && loggedUserPrivilege.get("upd")) {

            //need to check existing
            Product extPro = productDao.getReferenceById(product.getId());
            if (extPro == null) {
                return "Product update not completed : Product does not exist";

            }


            try {
                product.setLastupdate_datetime(LocalDateTime.now());
                productDao.save(product);
                return "0";
            } catch (Exception ex) {
                return "Product Update not completed : " + ex.getMessage();
            }

            //update auto set values

            //update dependency modules
        } else {
            return "Product Update not completed : You have No Privilege";
        }

    }

    //create mapping for delete product [/product]
    @DeleteMapping
    public String deleteProduct(@RequestBody Product product) {
        //check privilage
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        User loggedUser = userDao.findUserByUsername(auth.getName());
        HashMap<String, Boolean> loggedUserPrivilege = privilegeController.getPrivilegeByUserModule(auth.getName(), "Product");

        if (loggedUser != null && loggedUserPrivilege.get("del")) {
            //check object existing
            Product exPro = productDao.getReferenceById(product.getId());

            if (exPro != null) {
                //use try catch for catch errors given by the db server
                try {
                    //object exist
                    exPro.setDeleted_datetime(LocalDateTime.now());
                    exPro.setProductstatus_id(productstatusDao.getReferenceById(4));

                    //productDao.delete(exPro);
                    productDao.save(exPro);

                    //run correctly
                    return "0";

                } catch (Exception ex) {
                    return "Delete not completed " + ex.getMessage();
                }
            } else {
                //object not exist
                return "Delete not completed : Product not found ";
            }
        } else {
            return "Delete not completed : User not found ";
        }
    }
}
