package lk.fably;

import lk.fably.dao.RoleDao;
import lk.fably.dao.UserDao;
import lk.fably.entity.Role;
import lk.fably.entity.User;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.security.crypto.bcrypt.BCrypt;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.servlet.ModelAndView;

import java.time.LocalDateTime;
import java.util.HashSet;
import java.util.Set;

@SpringBootApplication
@RestController
public class FablyApplication {

	@Autowired
	private UserDao userDao;

	@Autowired
	private RoleDao roleDao;

	@Autowired
	private BCryptPasswordEncoder bCryptPasswordEncoder;

	public static void main(String[] args) {
		SpringApplication.run(FablyApplication.class, args);
	}

	@GetMapping(value = "/createadmin")
	public String createLogin(){
		User adminUser = userDao.findUserByUsername("Admin");
		if (adminUser == null){
			User newUser = new User();
			newUser.setUsername(("Admin"));
			newUser.setPassword(bCryptPasswordEncoder.encode("12345"));
			newUser.setEmail(("admin@gmail.com"));
			newUser.setStatus((true));
			newUser.setAdded_datetime((LocalDateTime.now()));

			Set<Role> userRole = new HashSet<>();
			userRole.add(roleDao.getReferenceById(1));
			newUser.setRoles(userRole);

			userDao.save(newUser);

		}

		return "<script>window.location.replace('/login');</script>";
	}

}
