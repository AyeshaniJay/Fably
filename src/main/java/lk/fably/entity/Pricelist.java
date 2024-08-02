package lk.fably.entity;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import javax.persistence.*;
import java.math.BigDecimal;
import java.util.Date;
import java.util.List;

@Entity //class convert to persistence entity
@Data //auto connect getters, setters ...etc functions
@NoArgsConstructor //auto connect default constructor
@AllArgsConstructor //auto connect all argument constructors
@Table(name = "pricelist") //connect database table
public class Pricelist {

    @Id //primary key
    @GeneratedValue(strategy = GenerationType.IDENTITY) //auto increment
    @Column(name = "id") //connect database column
    private Integer id;

    @Column(name = "code")
    private String code;

    @Column(name = "deadline")
    private Date deadline;

    @Column(name = "reciveddate")
    private Date reciveddate;

    @ManyToOne(optional = false)
    @JoinColumn(name = "priceliststatus_id", referencedColumnName = "id")
    private Priceliststatus priceliststatus_id;

    @OneToMany(mappedBy = "pricelist_id" ,cascade = CascadeType.ALL, orphanRemoval = true)
    private List<PricelistProduct> pricelistProducts;
}
