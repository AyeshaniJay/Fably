package lk.fably.entity;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import javax.persistence.*;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

@Entity //class convert to persistence entity
@Data //auto connect getters, setters ...etc functions
@NoArgsConstructor //auto connect default constructor
@AllArgsConstructor //auto connect all argument constructors
@Table(name = "invoice") //connect database table
public class Invoice {

    @Id //primary key
    @GeneratedValue(strategy = GenerationType.IDENTITY) //auto increment
    @Column(name = "id") //connect database column
    private Integer id;

    @Column(name = "code")
    private String code;

    @Column(name = "description")
    private String description;

    @Column(name = "noofitem")
    private Integer noofitem;

    @Column(name = "paidamount")
    private BigDecimal paidamount;

    @Column(name = "balanceamount")
    private BigDecimal balanceamount;

    @Column(name = "paiddate")
    private LocalDate paiddate;

    @Column(name = "totalamount")
    private BigDecimal totalamount;

    @Column(name = "discount")
    private BigDecimal discount;

    @Column(name = "netamount")
    private BigDecimal netamount;

    @Column(name = "totalweight")
    private BigDecimal totalweight;

    @Column(name = "courierassigndate")
    private LocalDate courierassigndate;

    @Column(name = "expecteddeliverdate")
    private LocalDate expecteddeliverdate;

    @Column(name = "added_datetime")
    private LocalDateTime added_datetime;

    @Column(name = "lastupdated_datetime")
    private LocalDateTime lastupdated_datetime;

    @Column(name = "deleted_datetime")
    private LocalDateTime deleted_datetime;

    @ManyToOne(optional = false)
    @JoinColumn(name = "courier_id", referencedColumnName = "id")
    private Courier courier_id;

    @ManyToOne(optional = false)
    @JoinColumn(name = "corder_id", referencedColumnName = "id")
    private CustomerOrder corder_id;

    @ManyToOne(optional = false)
    @JoinColumn(name = "invoicestatus_id", referencedColumnName = "id")
    private Invoicestatus invoicestatus_id;

    @ManyToOne(optional = false)
    @JoinColumn(name = "addeduser_id", referencedColumnName = "id")
    private User addeduser_id;

    @ManyToOne
    @JoinColumn(name = "lastupdateduser_id", referencedColumnName = "id")
    private User lastupdateduser_id;

    @ManyToOne
    @JoinColumn(name = "deleteduser_id", referencedColumnName = "id")
    private User deleteduser_id;

    @OneToMany(mappedBy = "invoice_id", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<InvoiceProduct> invoiceProductList;

    public Invoice(Integer id, String code,LocalDateTime added_datetime, BigDecimal totalamount,Invoicestatus invoicestatus_id,CustomerOrder corder_id,Integer noofitem,BigDecimal paidamount,BigDecimal balanceamount,LocalDate paiddate,Courier courier_id, BigDecimal netamount){
        this.id = id;
        this.code = code;
        this.added_datetime = added_datetime;
        this.totalamount = totalamount;
        this.invoicestatus_id = invoicestatus_id;
        this.corder_id = corder_id;
        this.noofitem = noofitem;
        this.paidamount = paidamount;
        this.balanceamount = balanceamount;
        this.paiddate = paiddate;
        this.courier_id = courier_id;
        this.netamount = netamount;
    }

    public Invoice(Integer id, String code){
        this.id = id;
        this.code = code;
    }

    public Invoice(Long count){
        this.id = Integer.valueOf(count.toString());
    }
}
