package lk.fably.entity;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import javax.persistence.*;

@Entity //class convert to persistence entity
@Data //auto connect getters, setters ...etc functions
@NoArgsConstructor //auto connect default constructor
@AllArgsConstructor //auto connect all argument constructors
@Table(name = "category") //connect database table
public class Category {

    @Id //primary key
    @GeneratedValue(strategy = GenerationType.IDENTITY) //auto increment
    @Column(name = "id") //connect database column
    private Integer id;

    @Column(name = "code")
    private String code;

    @Column(name = "name")
    private String name;
}
