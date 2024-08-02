package lk.fably.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import javax.persistence.*;
import java.io.Serializable;
import java.math.BigDecimal;

@Entity //class convert to persistence entity
@Data //auto connect getters, setters ...etc functions
@NoArgsConstructor //auto connect default constructor
@AllArgsConstructor //auto connect all argument constructors
@Table(name = "porder_has_product") //connect database table
public class PorderProduct implements Serializable {

    @Id //primary key
    @GeneratedValue(strategy = GenerationType.IDENTITY) //auto increment
    @Column(name = "id") //connect database column
    private Integer id;

    @ManyToOne(optional = false)
    @JsonIgnore
    @JoinColumn(name = "porder_id", referencedColumnName = "id")
    private Porder porder_id;

//    @ManyToOne(optional = false)
//    @JoinColumn(name = "category_id", referencedColumnName = "id")
//    private Product category_id;

    @ManyToOne(optional = false)
    @JoinColumn(name = "product_id", referencedColumnName = "id")
    private Product product_id;

    @Column(name = "purchaseprice")
    private BigDecimal unitprice;

    @Column(name = "qty")
    private Integer qty;

    @Column(name = "linetotal")
    private BigDecimal linetotal;

    @ManyToOne(optional = false)
    @JoinColumn(name = "size_id", referencedColumnName = "id")
    private Size size_id;

    public PorderProduct(BigDecimal unitprice, Integer qty,BigDecimal linetotal){
        this.unitprice = unitprice;
        this.qty = qty;
        this.linetotal = linetotal;
    }
}
