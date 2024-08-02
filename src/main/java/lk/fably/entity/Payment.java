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
@Table(name = "payment") //connect database table
public class Payment {

    @Id //primary key
    @GeneratedValue(strategy = GenerationType.IDENTITY) //auto increment
    @Column(name = "id") //connect database column
    private Integer id;

    @Column(name = "code")
    private String code;

    @Column(name = "totalamount")
    private BigDecimal totalamount;

    @Column(name = "paidamount")
    private BigDecimal paidamount;

//    @Column(name = "discount")
//    private BigDecimal discount;

    @Column(name = "balancedamount")
    private BigDecimal balancedamount;

    @Column(name = "added_datetime")
    private LocalDateTime added_datetime;

    @Column(name = "lastupdated_datetime")
    private LocalDateTime lastupdated_datetime;

    @Column(name = "deleted_datetime")
    private LocalDateTime deleted_datetime;

    @ManyToOne(optional = false)
    @JoinColumn(name = "paymentmethod_id", referencedColumnName = "id")
    private Paymentmethod paymentmethod_id;

    @ManyToOne(optional = false)
    @JoinColumn(name = "paymentstatus_id", referencedColumnName = "id")
    private Paymentstatus paymentstatus_id;

    @ManyToOne(optional = false)
    @JoinColumn(name = "corder_id", referencedColumnName = "id")
    private CustomerOrder corder_id;

    @ManyToOne(optional = false)
    @JoinColumn(name = "invoice_id", referencedColumnName = "id")
    private Invoice invoice_id;

    @ManyToOne(optional = false)
    @JoinColumn(name = "addeduser_id", referencedColumnName = "id")
    private User addeduser_id;

}
