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
@Table(name = "grndetail_has_product") //connect database table
public class GRNProduct implements Serializable {

    @Id //primary key
    @GeneratedValue(strategy = GenerationType.IDENTITY) //auto increment
    @Column(name = "id") //connect database column
    private Integer id;

    @ManyToOne
    @JsonIgnore
    @JoinColumn(name = "grndetail_id", referencedColumnName = "id")
    private GRN grndetail_id;

    @ManyToOne
    @JoinColumn(name = "product_id", referencedColumnName = "id")
    private Product product_id;

    @ManyToOne
    @JoinColumn(name = "size_id", referencedColumnName = "id")
    private Size size_id;

    @Column(name = "unitprice")
    private BigDecimal unitprice;

    @Column(name = "qty")
    private Integer qty;

    @Column(name = "orderqty")
    private Integer orderqty;

    @Column(name = "linetotal")
    private BigDecimal linetotal;
}
