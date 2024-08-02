package lk.fably.entity;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import javax.persistence.*;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Set;

@Entity //class convert to persistence entity
@Data //auto connect getters, setters ...etc functions
@NoArgsConstructor //auto connect default constructor
@AllArgsConstructor //auto connect all argument constructors
@Table(name = "product") //connect database table
public class Product {

    @Id //primary key
    @GeneratedValue(strategy = GenerationType.IDENTITY) //auto increment
    @Column(name = "id") //connect database column
    private Integer id;

    @Column(name = "code")
    private String code;

    @Column(name = "name")
    private String name;

    @Column(name = "sellprice")
    private BigDecimal sellprice;

    @Column(name = "purchesprice")
    private BigDecimal purchaseprice;

    @Column(name = "description")
    private String description;

    @Column(name = "discount")
    private BigDecimal mindiscount;

    @Column(name = "profit")
    private BigDecimal profit;

    @Column(name = "photo")
    private byte[] photo;

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
    @JoinColumn(name = "category_id", referencedColumnName = "id")
    private Category category_id;

    @ManyToOne(optional = false)
    @JoinColumn(name = "productstatus_id", referencedColumnName = "id")
    private Productstatus productstatus_id;

    @OneToMany(mappedBy = "product_id" ,cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Productsize> productsizeList;

    public Product(Integer id, String code,String name){
        this.id = id;
        this.code = code;
        this.name = name;
    }

    public Product(Integer id, String code,String name, BigDecimal sellprice, BigDecimal purchaseprice){
        this.id = id;
        this.code = code;
        this.name = name;
        this.sellprice = sellprice;
        this.purchaseprice = purchaseprice;
    }

    public Product(Long count){
        this.id = Integer.valueOf(count.toString());
    }
}
