package lk.fably.controller;

import lk.fably.dao.SizeDao;
import lk.fably.entity.Productsize;
import lk.fably.entity.Size;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping(value = "/size")
public class SizeController {

    @Autowired
    private SizeDao sizeDao;

    @GetMapping(value = "/list", produces = "application/json")
    public List<Size> sizeList(){
        return sizeDao.findAll();
    }

    //get size list by given product using path variable (size/listbyproduct/{oid}/{pid})
    @GetMapping(value = "/listbyorderproduct/{oid}/{pid}", produces = "application/json") //if return dada-->produces
    public List<Size> getListByOrderProductId(@PathVariable("oid") Integer oid,@PathVariable("pid") Integer pid){
        return sizeDao.getSizesByOrderProduct(oid,pid);
    }

    //get size list by given category and product using path variable (size/listbycategoryproduct/1/1) porder
//    @GetMapping(value = "/listbycategoryproduct/{cid}/{pid}", produces = "application/json") //if return dada-->produces
//    public List<Size> getListByCategoryProductId(@PathVariable("cid") Integer cid,@PathVariable("pid") Integer pid){
//        return sizeDao.getSizesByCategoryProduct(cid,pid);
//    }

    //get size list by given category and product using path variable (size/listbysupplierproduct/1/1) porder
//    @GetMapping(value = "/listbysupplierproduct/{sid}/{pid}", produces = "application/json") //if return dada-->produces
//    public List<Size> getListBySupplierProductId(@PathVariable("sid") Integer sid,@PathVariable("pid") Integer pid){
//        return sizeDao.getSizesBySupplierProduct(sid,pid);
//    }

    //get size list by given category and product using path variable (size/listbyporderproduct/1/1) porder
    @GetMapping(value = "/listbyporderproduct/{poid}/{pid}", produces = "application/json") //if return dada-->produces
    public List<Size> getListByPorderProductId(@PathVariable("poid") Integer poid,@PathVariable("pid") Integer pid){
        return sizeDao.getSizesByPorderProduct(poid,pid);
    }

    //get size list by given product using path variable (size/listbyproduct/1)
    @GetMapping(value = "/listbyproduct/{pid}", produces = "application/json") //if return dada-->produces
    public List<Size> getListByProductId(@PathVariable("pid") Integer pid){
        return sizeDao.getSizesByProductOrder(pid);
    }

    //get size by product ("/size/byproduct/1")
    @GetMapping(value = "/byproduct/{pid}", produces = "application/json")
    public List<Size> productsizeList(@PathVariable("pid") Integer pid){
        return sizeDao.getSizesByProduct(pid);
    }
}
