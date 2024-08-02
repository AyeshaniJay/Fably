package lk.fably.dao;

import lk.fably.entity.Product;
import lk.fably.entity.ProductOrder;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface ProductDao extends JpaRepository<Product, Integer> {

    @Query("select p from Product p where p.code = ?1")
    Product findProByCode(String code);

    @Query(value = "SELECT lpad(max(p.code)+1,4,'0') FROM product as p;" , nativeQuery = true)//when use native query
    String nextProCode();
    @Query(value = "SELECT lpad(substring(max(p.code),3)+1,4,0) FROM fably.product as p where p.category_id=:catid;" , nativeQuery = true)//when use native query
    String nextCode(@Param("catid") Integer catid);

    @Query(value = "SELECT substring(max(p.code),3) FROM Product p where p.category_id.id=:catid")//when use native query
    String nextCodeNew(@Param("catid") Integer catid);

    @Query("select new Product(p.id,p.code,p.name,p.sellprice,p.purchaseprice) from Product p where p.productstatus_id.id=1")
    List<Product> list();

    //get product details by product id
    @Query("select new Product(p.id,p.code,p.name,p.sellprice,p.purchaseprice) from Product p where p.id=?1")
    Product getPriceById(Integer id);

    @Query("select new Product(p.id,p.code,p.name,p.sellprice,p.purchaseprice) from Product p where p.productstatus_id.id=1 and p.id in(select sp.product_id.id from SupplierProduct sp where sp.supplier_id.id=?1)")
    List<Product> getListBySupplier(Integer sid);
    @Query("select new Product(p.id,p.code,p.name) from Product p where p.productstatus_id.id=1 and p.id not in(select sp.product_id.id from SupplierProduct sp where sp.supplier_id.id=?1)")
    List<Product> getListBySupplierHaveNot(Integer sid);

    @Query("select new Product(p.id,p.code,p.name,p.sellprice,p.purchaseprice) from Product p where p.productstatus_id.id=1 and p.id in (select po.product_id from ProductOrder po where po.corder_id.id=?1)")
    List<Product> getProductsByOrder(Integer oid);

    @Query("select new Product(p.id,p.code,p.name,p.sellprice,p.purchaseprice) from Product p where p.productstatus_id.id=1 and p.id in (select pp.product_id from PorderProduct pp where pp.porder_id.id=?1)")
    List<Product> getProductsByPorder(Integer pid);

    @Query("select new Product(p.id,p.code,p.name,p.sellprice,p.purchaseprice) from Product p where p.category_id.id=?1")
    List<Product> getProductsByCat(Integer cid);

    @Query("select new Product(count(p.id)) from Product p where p.productstatus_id.id=1")
    Product getProductCount();

    //get product name for cart
//    @Query("select new ProductOrder(po.unitprice,po.qty,po.linetotal) from ProductOrder po where po.corder_id.id=?1 and po.product_id.id=?2 and po.size_id.id=?3")
//    Product productName(Integer oid, Integer pid, Integer sid);

}
