package lk.fably.entity;

import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor //empty constructor
public class LoggedUser {
    private String username;
    private String role;
    private String photoname;
    private String photopath;
}
