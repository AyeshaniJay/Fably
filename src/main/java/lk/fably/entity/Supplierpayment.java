package lk.fably.entity;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import javax.persistence.*;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.Date;

@Entity //class convert to persistence entity
@Data //auto connect getters, setters ...etc functions
@NoArgsConstructor //auto connect default constructor
@AllArgsConstructor //auto connect all argument constructors
@Table(name = "supplierpayment") //connect database table
public class Supplierpayment {

    @Id //primary key
    @GeneratedValue(strategy = GenerationType.IDENTITY) //auto increment
    @Column(name = "id") //connect database column
    private Integer id;

    @Column(name = "code")
    private String code;

//    @Column(name = "date")
//    private Date date;

    @Column(name = "grnamount")
    private BigDecimal totalamount;

    @Column(name = "paidamount")
    private BigDecimal paidamount;

    @Column(name = "balanceamount")
    private BigDecimal balanceamount;

    @Column(name = "chequeno")
    private String chequeno;

    @Column(name = "chequedate")
    private Date chequedate;

    @Column(name = "deposit_datetime")
    private LocalDateTime deposit_datetime;

    @Column(name = "added_datetime")
    private LocalDateTime added_datetime;

    @Column(name = "lastupdated_datetime")
    private LocalDateTime lastupdated_datetime;

    @ManyToOne(optional = false)
    @JoinColumn(name = "paymentmethod_id", referencedColumnName = "id")
    private Paymentmethod paymentmethod_id;

    @ManyToOne(optional = false)
    @JoinColumn(name = "paymentstatus_id", referencedColumnName = "id")
    private Paymentstatus paymentstatus_id;

    @ManyToOne(optional = false)
    @JoinColumn(name = "supplier_id", referencedColumnName = "id")
    private Supplier supplier_id;

    @ManyToOne
    @JoinColumn(name = "supplierbankdetail_id", referencedColumnName = "id")
    private Supplierbankdetail supplierbankdetail_id;

    @ManyToOne
    @JoinColumn(name = "grndetail_id", referencedColumnName = "id")
    private GRN grndetail_id;

    @ManyToOne(optional = false)
    @JoinColumn(name = "addeduser_id", referencedColumnName = "id")
    private User addeduser_id;

    @ManyToOne
    @JoinColumn(name = "lastupdateduser_id", referencedColumnName = "id")
    private User lastupdateduser_id;

//    public Supplierpayment(Integer id,String code,Date date,BigDecimal grnamount,BigDecimal paidamount,BigDecimal balanceamount,String chequeno,Date chequedate,LocalDateTime depositdatetime
//        Paymentmethod paymentmethod_id
//        Supplier supplier_id
//        Supplierbankdetail supplierbankdetail_id
//        GRN grndetail_id)

}
