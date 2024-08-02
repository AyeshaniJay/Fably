package lk.fably.entity;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import javax.persistence.*;
import java.time.LocalDateTime;
import java.util.Set;

@Entity //class convert to persistence entity
@Data //auto connect getters, setters ...etc functions
@NoArgsConstructor //auto connect default constructor
@AllArgsConstructor //auto connect all argument constructors
@Table(name = "user") //connect database table
public class User {

    @Id //primary key
    @GeneratedValue(strategy = GenerationType.IDENTITY) //auto increment
    @Column(name = "id") //connect database column
    private Integer id;

    @Column(name = "username")
    private String username;

    @Column(name = "password")
    private String password;

    @Column(name = "status")
    private Boolean status;

    @Column(name = "added_datetime")
    private LocalDateTime added_datetime;

    @Column(name = "lastupdate_datetime")
    private LocalDateTime lastupdate_datetime;

    @Column(name = "deleted_datetime")
    private LocalDateTime deleted_datetime;

    @Column(name = "email")
    private String email;

    @Column(name = "description")
    private String description;

    @Column(name = "hint")
    private String hint;

    @Column(name = "photoname")
    private String photoname;

    @Column(name = "photopath")
    private String photopath;

    @ManyToOne
    @JoinColumn(name = "employee_id", referencedColumnName = "id")
    private Employee employee_id;

    @ManyToMany
    @JoinTable(name = "user_has_role", joinColumns = @JoinColumn(name = "user_id"), inverseJoinColumns = @JoinColumn(name = "role_id"))
    private Set<Role> roles;

    //constructor function
    public User(Integer id,Employee employee_id, String username, String email, Boolean active){
        this.id = id;
        this.employee_id = employee_id;
        this.username = username;
        this.email = email;
        this.status= active;
    }

}
