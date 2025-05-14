package agency.project.repository;

import agency.project.entity.Client;
import agency.project.entity.Manager;
import agency.project.entity.User;
import agency.project.entity.enumerated.AccessLevel;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Repository
public interface ClientRepository extends JpaRepository<Client, Long> {
    List<Client> findByCreatedAtBetween(LocalDateTime start, LocalDateTime end);

    // Поиск по номеру телефона
    Optional<Client> findByPhone(String phone);

    // Поиск по номеру паспорта
    Optional<Client> findByPassport(String passport);

    // Поиск по уровню доступа
    List<Client> findByAccessLevel(AccessLevel accessLevel);

    Optional<Client> findByAuthUser_Id(Long userId);


    List<Client> findByCreatedById(Long managerId);


}