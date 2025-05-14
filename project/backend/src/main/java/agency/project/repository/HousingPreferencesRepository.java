package agency.project.repository;

import agency.project.entity.HousingPreferences;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface HousingPreferencesRepository extends JpaRepository<HousingPreferences, Long> {
    List<HousingPreferences> findByClientId(Long clientId);
    Optional<HousingPreferences> findByIdAndClientId(Long id, Long clientId);

}