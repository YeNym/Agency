package agency.project.repository;

import agency.project.entity.Manager;
import agency.project.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ManagerRepository extends JpaRepository<Manager, Long> {
    Optional<Manager> findByAuthUser(User user);
    Optional<Manager> findByAuthUserId(Long userId);
    Optional<Manager> findById(Long id);  // Найти менеджера по ID

    List<Manager> findAll();
}