package agency.project.repository;

import agency.project.entity.Client;
import agency.project.entity.Property;
import agency.project.entity.TravelRequest;
import agency.project.entity.enumerated.RequestStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface TravelRequestRepository extends JpaRepository<TravelRequest, Long> {
    List<TravelRequest> findByStatus(RequestStatus status);
    Optional<TravelRequest> findByTravelerAndProperty(Client traveler, Property property);

    @Query("SELECT tr FROM TravelRequest tr WHERE tr.assignedManager.id = :managerId AND tr.status <> 'PENDING'")
    List<TravelRequest> findByManagerIdAndStatusNotPending(@Param("managerId") Long managerId);

}
