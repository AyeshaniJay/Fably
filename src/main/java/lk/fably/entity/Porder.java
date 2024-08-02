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
@Table(name = "porder") //connect database table
public class Porder {

    @Id //primary key
    @GeneratedValue(strategy = GenerationType.IDENTITY) //auto increment
    @Column(name = "id") //connect database column
    private Integer id;

    @Column(name = "code")
    private String code;

    @Column(name = "requiredate")
    private Date requiredate;

    @Column(name = "totalamount")
    private BigDecimal totalamount;

    @Column(name = "added_datetime")
    private LocalDateTime added_datetime;

    @Column(name = "lastupdated_datetime")
    private LocalDateTime lastupdated_datetime;

    @Column(name = "deleted_datetime")
    private LocalDateTime deleted_datetime;

    @ManyToOne(optional = false)
    @JoinColumn(name = "porderstatus_id", referencedColumnName = "id")
    private Porderstatus porderstatus_id;

    @ManyToOne(optional = false)
    @JoinColumn(name = "supplier_id", referencedColumnName = "id")
    private Supplier supplier_id;

    @ManyToOne(optional = false)
    @JoinColumn(name = "addeduser_id", referencedColumnName = "id")
    private User addeduser_id;

    @ManyToOne
    @JoinColumn(name = "lastupdateduser_id", referencedColumnName = "id")
    private User lastupdateduser_id;

    @ManyToOne
    @JoinColumn(name = "deleteduser_id", referencedColumnName = "id")
    private User deleteduser_id;

    @OneToMany(mappedBy = "porder_id" , orphanRemoval = true)
    private List<PorderProduct> porderProductList;

    public Porder(Integer id, String code){
        this.id = id;
        this.code = code;
    }
    public Porder(Integer id, String code, Date requiredate, BigDecimal totalamount, LocalDateTime added_datetime, Porderstatus porderstatus_id, Supplier supplier_id){
        this.id = id;
        this.code = code;
        this.requiredate = requiredate;
        this.totalamount = totalamount;
        this.added_datetime = added_datetime;
        this.porderstatus_id = porderstatus_id;
        this.supplier_id = supplier_id;
    }
}
