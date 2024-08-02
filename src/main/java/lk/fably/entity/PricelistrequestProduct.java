package lk.fably.entity;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import javax.persistence.*;
import java.io.Serializable;

@Entity //class convert to persistence entity
@Data //auto connect getters, setters ...etc functions
@NoArgsConstructor //auto connect default constructor
@AllArgsConstructor //auto connect all argument constructors
@Table(name = "pricelistrequest_has_product") //connect database table
public class PricelistrequestProduct implements Serializable {

    @Id
    @ManyToOne
    @JoinColumn(name = "Pricelistrequest_id", referencedColumnName = "id")
    private Pricelistrequest Pricelistrequest_id;

    @Id
    @ManyToOne
    @JoinColumn(name = "product_id", referencedColumnName = "id")
    private Product product_id;
}
