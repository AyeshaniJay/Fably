package lk.fably.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import javax.persistence.*;
import java.math.BigDecimal;

@Entity //class convert to persistence entity
@Data //auto connect getters, setters ...etc functions
@NoArgsConstructor //auto connect default constructor
@AllArgsConstructor //auto connect all argument constructors
@Table(name = "product_has_order") //connect database table
public class ProductOrder {

    @Id //primary key
    @GeneratedValue(strategy = GenerationType.IDENTITY) //auto increment
    @Column(name = "id") //connect database column
    private Integer id;

    @Column(name = "sellprice")
    private BigDecimal unitprice;

    @Column(name = "qty")
    private Integer qty;

    @Column(name = "linetotal")
    private BigDecimal linetotal;

    @Column(name = "weight")
    private BigDecimal weight;

    @ManyToOne(optional = false)
    @JsonIgnore
    @JoinColumn(name = "corder_id", referencedColumnName = "id")
    private CustomerOrder corder_id;

    @ManyToOne(optional = false)
    @JoinColumn(name = "product_id", referencedColumnName = "id")
    private Product product_id;

    @ManyToOne(optional = false)
    @JoinColumn(name = "size_id", referencedColumnName = "id")
    private Size size_id;

    public ProductOrder(BigDecimal unitprice, Integer qty,BigDecimal linetotal, BigDecimal weight){
        this.unitprice = unitprice;
        this.qty = qty;
        this.linetotal = linetotal;
        this.weight = weight;
    }
}
