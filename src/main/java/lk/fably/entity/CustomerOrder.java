package lk.fably.entity;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import javax.persistence.*;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Entity //class convert to persistence entity
@Data //auto connect getters, setters ...etc functions
@NoArgsConstructor //auto connect default constructor
@AllArgsConstructor //auto connect all argument constructors
@Table(name = "corder") //connect database table
public class CustomerOrder {

    @Id //primary key
    @GeneratedValue(strategy = GenerationType.IDENTITY) //auto increment
    @Column(name = "id") //connect database column
    private Integer id;

    @Column(name = "code")
    private String code;

    @Column(name = "shippingaddress")
    private String shippingaddress;

    @Column(name = "description")
    private String description;

    @Column(name = "mobile")
    private String mobile;

    @Column(name = "mobile2")
    private String mobile2;

    @Column(name = "email")
    private String email;

    @Column(name = "postalcode")
    private String postalcode;

    @Column(name = "totalamount")
    private BigDecimal totalamount;

    @Column(name = "shippingcost")
    private BigDecimal shippingcost;

    @Column(name = "shippingdistrict")
    private String shippingdistrict;

    @Column(name = "discount")
    private BigDecimal discount;

    @Column(name = "netamount")
    private BigDecimal netamount;

    @Column(name = "paidamount")
    private BigDecimal paidamount;

    @Column(name = "balancedamount")
    private BigDecimal balancedamount;

    @Column(name = "totalweight")
    private BigDecimal totalweight;

    @Column(name = "added_datetime")
    private LocalDateTime added_datetime;

    @Column(name = "lastupdate_datetime")
    private LocalDateTime lastupdate_datetime;

    @Column(name = "deleted_datetime")
    private LocalDateTime deleted_datetime;

    @ManyToOne(optional = false)
    @JoinColumn(name = "addeduser_id", referencedColumnName = "id")
    private User addeduser_id;

    @ManyToOne
    @JoinColumn(name = "lastupdateduser_id", referencedColumnName = "id")
    private User lastupdateduser_id;

    @ManyToOne
    @JoinColumn(name = "deleteduser_id", referencedColumnName = "id")
    private User deleteduser_id;

    @ManyToOne(optional = false)
    @JoinColumn(name = "orderstatus_id", referencedColumnName = "id")
    private Orderstatus orderstatus_id;

    @ManyToOne(optional = false)
    @JoinColumn(name = "ordertype_id", referencedColumnName = "id")
    private Ordertype ordertype_id;

    @ManyToOne(optional = false)
    @JoinColumn(name = "customer_id", referencedColumnName = "id")
    private Customer customer_id;

    @OneToMany(mappedBy = "corder_id" ,cascade = CascadeType.ALL, orphanRemoval = true)
    private List<ProductOrder> productorderList;

    public CustomerOrder(Integer id, String code,LocalDateTime added_datetime, BigDecimal totalamount,Orderstatus orderstatus_id,Customer customer_id){
        this.id = id;
        this.code = code;
        this.added_datetime = added_datetime;
        this.totalamount = totalamount;
        this.orderstatus_id = orderstatus_id;
        this.customer_id = customer_id;
    }

    public CustomerOrder(Integer id, String code){
        this.id = id;
        this.code = code;
    }

    public CustomerOrder(Long count){
        this.id = Integer.valueOf(count.toString());
    }
}
