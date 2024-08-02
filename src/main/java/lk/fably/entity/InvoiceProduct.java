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
@Table(name = "invoice_has_product") //connect database table
public class InvoiceProduct implements Serializable {

    @Id //primary key
    @GeneratedValue(strategy = GenerationType.IDENTITY) //auto increment
    @Column(name = "id") //connect database column
    private Integer id;

    @ManyToOne
    @JsonIgnore
    @JoinColumn(name = "invoice_id", referencedColumnName = "id")
    private Invoice invoice_id;

    @ManyToOne
    @JoinColumn(name = "product_id", referencedColumnName = "id")
    private Product product_id;

    @ManyToOne
    @JoinColumn(name = "size_id", referencedColumnName = "id")
    private Size size_id;

    @Column(name = "orderqty")
    private Integer orderqty;

//    @Column(name = "qty")
//    private Integer qty;

    @Column(name = "sellprice")
    private BigDecimal unitprice;

    @Column(name = "linetotal")
    private BigDecimal linetotal;

    public InvoiceProduct(BigDecimal unitprice, Integer orderqty,BigDecimal linetotal){
        this.unitprice = unitprice;
        this.orderqty = orderqty;
        this.linetotal = linetotal;
    }
}
