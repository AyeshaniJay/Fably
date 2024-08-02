package lk.fably.entity;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import javax.persistence.*;

@Entity //class convert to persistence entity
@Table(name = "designation") //database table
@Data //generate setters and getters
@NoArgsConstructor //no argument constructor
@AllArgsConstructor //all argument constructor
public class Designation {
    @Id //primary key
    @GeneratedValue(strategy = GenerationType.IDENTITY) //auto increment
    @Column(name = "id")
    private Integer id;

    @Column(name = "name")
    private String name;
}
