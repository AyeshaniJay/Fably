package lk.fably.entity;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import javax.persistence.*;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.Date;
import java.util.List;

@Entity //class convert to persistence entity
@Data //auto connect getters, setters ...etc functions
@NoArgsConstructor //auto connect default constructor
@AllArgsConstructor //auto connect all argument constructors
@Table(name = "grndetail") //connect database table
public class GRN {

    @Id //primary key
    @GeneratedValue(strategy = GenerationType.IDENTITY) //auto increment
    @Column(name = "id") //connect database column
    private Integer id;

    @Column(name = "code")
    private String code;

    @Column(name = "receiveddate")
    private Date receiveddate;

    @Column(name = "totalamount")
    private BigDecimal totalamount;

    @Column(name = "taxrate")
    private BigDecimal taxrate;

    @Column(name = "discount")
    private BigDecimal discount;

    @Column(name = "added_datetime")
    private LocalDateTime added_datetime;

    @Column(name = "lastupdated_datetime")
    private LocalDateTime lastupdated_datetime;

    @Column(name = "deleted_datetime")
    private LocalDateTime deleted_datetime;

    @ManyToOne(optional = false)
    @JoinColumn(name = "porder_id", referencedColumnName = "id")
    private Porder porder_id;

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
    @JoinColumn(name = "grndetailstatus_id", referencedColumnName = "id")
    private GRNdetailstatus grndetailstatus_id;

    @OneToMany(mappedBy = "grndetail_id", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<GRNProduct> grnProductList;

    public GRN(Integer id, String code,Date receiveddate,BigDecimal totalamount,BigDecimal taxrate,BigDecimal discount,LocalDateTime added_datetime,User addeduser_id,GRNdetailstatus grndetailstatus_id, Porder porder_id){
        this.id = id;
        this.code = code;
        this.receiveddate = receiveddate;
        this.totalamount = totalamount;
        this.taxrate = taxrate;
        this.discount = discount;
        this.added_datetime = added_datetime;
        this.addeduser_id = addeduser_id;
        this.grndetailstatus_id = grndetailstatus_id;
        this.porder_id = porder_id;
    }

    public GRN(Integer id, String code){
        this.id = id;
        this.code = code;
    }
}
