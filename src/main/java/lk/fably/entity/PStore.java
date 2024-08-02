package lk.fably.entity;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import javax.persistence.*;

@Entity //class convert to persistence entity
@Data //auto connect getters, setters ...etc functions
@NoArgsConstructor //auto connect default constructor
@AllArgsConstructor //auto connect all argument constructors
@Table(name = "store") //connect database table
public class PStore {

    @Id //primary key
    @GeneratedValue(strategy = GenerationType.IDENTITY) //auto increment
    @Column(name = "id") //connect database column
    private Integer id;

    @ManyToOne(optional = false)
    @JoinColumn(name = "product_id", referencedColumnName = "id")
    private Product product_id;

    @ManyToOne(optional = false)
    @JoinColumn(name = "size_id", referencedColumnName = "id")
    private Size size_id;

    @ManyToOne(optional = false)
    @JoinColumn(name = "storestatus_id", referencedColumnName = "id")
    private Storestatus storestatus_id;

    @Column(name = "totalqty")
    private Integer totalqty;

    @Column(name = "availableqty")
    private Integer availableqty;
}
