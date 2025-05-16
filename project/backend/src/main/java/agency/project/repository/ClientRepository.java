package agency.project.repository;

import agency.project.entity.Client;
import agency.project.entity.Manager;
import agency.project.entity.User;
import agency.project.entity.enumerated.AccessLevel;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Repository
public interface ClientRepository extends JpaRepository<Client, Long> {
    List<Client> findByCreatedAtBetween(LocalDateTime start, LocalDateTime end);

    Optional<Client> findByPhone(String phone);

    Optional<Client> findByPassport(String passport);

    List<Client> findByAccessLevel(AccessLevel accessLevel);

    Optional<Client> findByAuthUser_Id(Long userId);

    List<Client> findByCreatedById(Long managerId);

    boolean existsByPhone(String phone);

    boolean existsByPassport(String passport);

    @Query("SELECT u FROM Client c JOIN c.authUser u WHERE c.id = :clientId")
    Optional<User> findUserByClientId(@Param("clientId") Long clientId);

}