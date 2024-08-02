package lk.fably.entity;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import javax.persistence.*;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Set;

@Entity //class convert to persistence entity
@Data //auto connect getters, setters ...etc functions
@NoArgsConstructor //auto connect default constructor
@AllArgsConstructor //auto connect all argument constructors
@Table(name = "supplier") //connect database table
public class Supplier {

    @Id //primary key
    @GeneratedValue(strategy = GenerationType.IDENTITY) //auto increment
    @Column(name = "id") //connect database column
    private Integer id;

    @Column(name = "code")
    private String code;

    @Column(name = "name")
    private String name;

    @Column(name = "mobile1")
    private String mobile1;

    @Column(name = "mobile2")
    private String mobile2;

    @Column(name = "address")
    private String address;

    @Column(name = "email")
    private String email;

    @Column(name = "brnumber")
    private String brnumber;

    @Column(name = "added_datetime")
    private LocalDateTime added_datetime;

    @Column(name = "lastupdated_datetime")
    private LocalDateTime lastupdated_datetime;

    @Column(name = "deleted_datetime")
    private LocalDateTime deleted_datetime;

    @ManyToOne(optional = false)
    @JoinColumn(name = "supplierstatus_id", referencedColumnName = "id")
    private Supplierstatus supplierstatus_id;

    @ManyToOne(optional = false)
    @JoinColumn(name = "addeduser_id", referencedColumnName = "id")
    private User addeduser_id;

    @ManyToOne
    @JoinColumn(name = "lastupdateduser_id", referencedColumnName = "id")
    private User lastupdateduser_id;

    @ManyToOne
    @JoinColumn(name = "deleteduser_id", referencedColumnName = "id")
    private User deleteduser_id;

    @ManyToMany
    @JoinTable(name = "supplier_has_product", joinColumns = @JoinColumn(name = "supplier_id"), inverseJoinColumns = @JoinColumn(name = "product_id"))
    private Set<Product> productList;

    @OneToMany(mappedBy = "supplier_id", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Supplierbankdetail> supplierbankdetailList;



    public Supplier(Integer id, String code, String name, String email,String mobile1, Supplierstatus supplierstatus_id,String address){
        this.id = id;
        this.code = code;
        this.name = name;
        this.email = email;
        this.mobile1 = mobile1;
        this.supplierstatus_id = supplierstatus_id;
        this.address = address;
    }

    public Supplier(Integer id, String code, String name){
        this.id = id;
        this.code = code;
        this.name = name;
    }

    public Supplier(Long count){
        this.id = Integer.valueOf(count.toString());
    }
}
