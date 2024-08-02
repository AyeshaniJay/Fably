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
@Table(name = "privilege") //connect database table
public class Privilege {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Integer id;

    @ManyToOne(optional = false)
    @JoinColumn(name = "module_id", referencedColumnName = "id")
    private Module module_id;

    @ManyToOne(optional = false)
    @JoinColumn(name = "role_id", referencedColumnName = "id")
    private Role role_id;

    @Column(name = "sel")
    private Boolean sel;

    @Column(name = "ins")
    private Boolean ins;

    @Column(name = "upd")
    private Boolean upd;

    @Column(name = "del")
    private Boolean del;

    @Column(name = "added_datetime")
    private LocalDateTime added_datetime;

    @Column(name = "lastupdate_datetime")
    private LocalDateTime lastupdate_datetime;

    @Column(name = "delete_datetime")
    private LocalDateTime delete_datetime;

    @ManyToOne
    @JoinColumn(name = "addeduser_id", referencedColumnName = "id")
    private User addeduser_id;

    @ManyToOne
    @JoinColumn(name = "lastupdateduser_id", referencedColumnName = "id")
    private User lastupdateduser_id;
}
