package agency.project.repository;
import agency.project.entity.User;
import agency.project.entity.enumerated.Role;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User,Integer> {

    Optional<User> findByEmail(String email);
    User findByRole(Role role);
    void deleteUserByEmail(String email);
    boolean existsByEmail(String email);

}
