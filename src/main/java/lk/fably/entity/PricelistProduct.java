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
@Table(name = "pricelist_has_product") //connect database table
public class PricelistProduct {

    @Id //primary key
    @GeneratedValue(strategy = GenerationType.IDENTITY) //auto increment
    @Column(name = "id") //connect database column
    private Integer id;

    @ManyToOne(optional = false)
    @JsonIgnore
    @JoinColumn(name = "pricelist_id", referencedColumnName = "id")
    private Pricelist pricelist_id;

    @ManyToOne(optional = false)
    @JoinColumn(name = "corder_id", referencedColumnName = "id")
    private Product product_id;

    @Column(name = "purchaseprice")
    private BigDecimal purchaseprice;
}
