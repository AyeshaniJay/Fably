package lk.fably.service;

import lk.fably.dao.UserDao;
import lk.fably.entity.Role;
import lk.fably.entity.User;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import javax.transaction.Transactional;
import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

@Service
public class MyUserDetailService implements UserDetailsService {

    @Autowired
    private UserDao userDao;

    @Override
    @Transactional
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        User loggedUser = userDao.findUserByUsername(username);

        Set<GrantedAuthority> userGrantedAuthSet = new HashSet<>();
        if (loggedUser != null){
            for (Role userRole : loggedUser.getRoles()){
                userGrantedAuthSet.add(new SimpleGrantedAuthority(userRole.getName()));
            }

            List<GrantedAuthority> userAuth = new ArrayList<>(userGrantedAuthSet);

            return new org.springframework.security.core.userdetails.User(loggedUser.getUsername(),loggedUser.getPassword(),loggedUser.getStatus(),
                    true,true,true,userAuth);

        }else {
            List<GrantedAuthority> userAuth = new ArrayList<>();

            return new org.springframework.security.core.userdetails.User("none","none",false,
                    true,true,true,userAuth);
        }


    }
}
