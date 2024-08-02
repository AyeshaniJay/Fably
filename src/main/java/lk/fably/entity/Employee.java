package lk.fably.entity;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import javax.persistence.*;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity //class convert to persistence entity
@Data //auto connect getters, setters ...etc functions
@NoArgsConstructor //auto connect default constructor
@AllArgsConstructor //auto connect all argument constructors
@Table(name = "employee") //connect database table
public class Employee {

    @Id //primary key
    @GeneratedValue(strategy = GenerationType.IDENTITY) //auto increment
    @Column(name = "id") //connect database column
    private Integer id;

    @Column(name = "number")
    private String number;

    @Column(name = "callingname")
    private String callingname;

    @Column(name = "fullname")
    private String fullname;

    @Column(name = "nic")
    private String nic;

    @Column(name = "gender")
    private String gender;

    @Column(name = "dob")
    private LocalDate dob;

    @Column(name = "description")
    private String description;

    @Column(name = "mobileno")
    private String mobileno;

    @Column(name = "landno")
    private String landno;

    @Column(name = "email")
    private String email;

    @Column(name = "address")
    private String address;

    @Column(name = "photo")
    private byte[] photo;

    @Column(name = "photoname")
    private String photoname;

    @Column(name = "tocreation")
    private LocalDateTime tocreation;

    @Column(name = "toupdate")
    private LocalDateTime toupdate;

    @Column(name = "todeletion")
    private LocalDateTime todeletion;

    @ManyToOne(optional = false)
    @JoinColumn(name = "designation_id", referencedColumnName = "id")
    private Designation designation_id;

    @ManyToOne(optional = false)
    @JoinColumn(name = "civilstatus_id", referencedColumnName = "id")
    private Civilstatus civilstatus_id;

    @ManyToOne(optional = false)
    @JoinColumn(name = "employeestatus_id", referencedColumnName = "id")
    private Employeestatus employeestatus_id;


    public Employee(Integer id, String callingname, String number, String fullname, String nic, String gender, Employeestatus employeestatus_id, Designation designation_id, byte[] photo, String mobileno){
        this.id = id;
        this.callingname = callingname;
        this.number = number;
        this.fullname = fullname;
        this.nic = nic;
        this.gender = gender;
        this.employeestatus_id = employeestatus_id;
        this.designation_id = designation_id;
        this.photo = photo;
        this.mobileno = mobileno;
    }
    public Employee(Integer id, String number, String callingname){
        this.id = id;
        this.number = number;
        this.callingname = callingname;
    }
}
