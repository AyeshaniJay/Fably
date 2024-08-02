package lk.fably.configuration;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.util.matcher.AntPathRequestMatcher;

import javax.servlet.DispatcherType;

@Configuration
@EnableWebSecurity
public class WebConfig {
    @Bean //use created function --> filterChain()
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception{
        http.csrf().disable(). //disable to access out of browser
                formLogin()
                .loginPage("/login") //login UI service
                .failureUrl("/login?error=usernamepassworderror")
                .defaultSuccessUrl("/mainwindow", true)
                .usernameParameter("username")
                .passwordParameter("password")
        .and().httpBasic()
        .and().authorizeRequests(authorize -> {
            authorize
//                    .dispatcherTypeMatchers(DispatcherType.FORWARD).permitAll()
                    .antMatchers("/images/**").permitAll() // permitAll() give permission for all users even without user accounts
                    .antMatchers("/resources/**").permitAll()
                    .antMatchers("/webhome/**").permitAll()
                    .antMatchers("/login").permitAll()
                    .antMatchers("/createadmin").permitAll()
                    .antMatchers("/mainwindow","/userprivilege/**").hasAnyAuthority("Admin","Owner","Manager","Accountant","SalesManager","SalesExecutive")

                    .antMatchers("/employee/**").hasAnyAuthority("Admin","Owner","Manager","Accountant")
                    .antMatchers("/user/**").hasAnyAuthority("Admin","Owner","Manager")
                    .antMatchers("/privilege/**").hasAnyAuthority("Admin","Owner","Manager")

                    .antMatchers("/customer/**").hasAnyAuthority("Admin","Owner","Manager","Accountant","SalesManager")
                    .antMatchers("/product/**").hasAnyAuthority("Admin","Owner","Manager","Accountant","SalesManager")
                    .antMatchers("/order/**").hasAnyAuthority("Admin","Owner","Manager","Accountant","SalesManager")
                    .antMatchers("/delivery/**").hasAnyAuthority("Admin","Owner","Manager","Accountant")
                    .antMatchers("/payment/**").hasAnyAuthority("Admin","Owner","Manager","Accountant")
                    .antMatchers("/invoice/**").hasAnyAuthority("Admin","Owner","Manager","Accountant")
                    .antMatchers("/invoicecreate/**").hasAnyAuthority("Admin","Owner","Manager","Accountant")
                    .antMatchers("/invoiceview/**").hasAnyAuthority("Admin","Owner","Manager","Accountant")
                    .antMatchers("/store/**").hasAnyAuthority("Admin","Owner","Manager","SalesManager","Accountant")

                    .antMatchers("/grn/**").hasAnyAuthority("Admin","Owner","Manager","Accountant")
                    .antMatchers("/Porder/**").hasAnyAuthority("Admin","Owner","Manager","Accountant")
                    .antMatchers("/supplierpayment/**").hasAnyAuthority("Admin","Owner","Manager","Accountant")
                    .antMatchers("/supplier/**").hasAnyAuthority("Admin","Owner","Manager","Accountant")

                    .anyRequest().authenticated();
        })
                .logout()
                .logoutRequestMatcher(new AntPathRequestMatcher("/logout"))
                .logoutSuccessUrl("/login").and()

                .exceptionHandling()
                .accessDeniedPage("/access-denied");

        return http.build();
    }

    @Bean
    public BCryptPasswordEncoder bCryptPasswordEncoder(){
        return new BCryptPasswordEncoder();
    }
}
