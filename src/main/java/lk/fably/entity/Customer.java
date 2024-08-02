package lk.fably.entity;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import javax.persistence.*;
import java.time.LocalDateTime;

@Entity //class convert to persistence entity
@Data //auto connect getters, setters ...etc functions
@NoArgsConstructor //auto connect default constructor
@AllArgsConstructor //auto connect all argument constructors
@Table(name = "customer") //connect database table
public class Customer {

    @Id //primary key
    @GeneratedValue(strategy = GenerationType.IDENTITY) //auto increment
    @Column(name = "id") //connect database column
    private Integer id;

    @Column(name = "code")
    private String code;

    @Column(name = "name")
    private String firstname;

    @Column(name = "gender")
    private String gender;

    @Column(name = "description")
    private String description;

    @Column(name = "mobile")
    private String mobile;

    @Column(name = "address")
    private String address;

    @Column(name = "email")
    private String email;

    @Column(name = "added_datetime")
    private LocalDateTime added_datetime;

    @Column(name = "lastupdated_datetime")
    private LocalDateTime lastupdated_datetime;

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
    @JoinColumn(name = "customerstatus_id", referencedColumnName = "id")
    private Customerstatus customerstatus_id;

    public Customer(Integer id, String code, String firstname, String gender, String mobile, String email,Customerstatus customerstatus_id){
        this.id = id;
        this.code = code;
        this.firstname = firstname;
        this.gender = gender;
        this.mobile = mobile;
        this.email = email;
        this.customerstatus_id = customerstatus_id;
    }

    public Customer(Integer id, String code, String firstname){
        this.id = id;
        this.code = code;
        this.firstname = firstname;
    }

    public Customer(Integer id, String code, String firstname,String mobile,String address, String email){
        this.id = id;
        this.code = code;
        this.firstname = firstname;
        this.mobile = mobile;
        this.address = address;
        this.email = email;
    }
}
