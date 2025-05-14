package agency.project.services;

import agency.project.entity.User;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.stereotype.Service;

import java.util.List;

public interface UserService {
    UserDetailsService userDetailsService();

    List<User> findAllUser();
    User updateUser(User user);
    void deleteUser(String email);
}
