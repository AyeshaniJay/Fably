package lk.fably.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import javax.persistence.*;
import java.io.Serializable;

@Entity //class convert to persistence entity
@Data //auto connect getters, setters ...etc functions
@NoArgsConstructor //auto connect default constructor
@AllArgsConstructor //auto connect all argument constructors
@Table(name = "productsize") //connect database table
public class Productsize implements Serializable {

    @Id //primary key
    @GeneratedValue(strategy = GenerationType.IDENTITY) //auto increment
    @Column(name = "id") //connect database column
    private Integer id;

    @Column(name = "weight")
    private String weight;

    @Column(name = "rop")
    private String rop;

    @ManyToOne(optional = false)
    @JoinColumn(name = "product_id", referencedColumnName = "id")
    @JsonIgnore
    private Product product_id;

    @ManyToOne(optional = false)
    @JoinColumn(name = "size_id", referencedColumnName = "id")
    private Size size_id;

    public Productsize(Size size_id,String weight, String rop){
        this.size_id = size_id;
        this.weight = weight;
        this.rop = rop;
    }
}
