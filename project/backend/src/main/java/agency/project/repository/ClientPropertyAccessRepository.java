package agency.project.repository;

import agency.project.entity.Client;
import agency.project.entity.ClientPropertyAccess;
import agency.project.entity.Property;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface ClientPropertyAccessRepository extends JpaRepository<ClientPropertyAccess, Long> {
    boolean existsByClientAndProperty(Client client, Property property);
    boolean existsByClientIdAndPropertyId(Long clientId, Long propertyId);
    List<ClientPropertyAccess> findByClientId(Long clientId);

    @Query("SELECT cpa.property FROM ClientPropertyAccess cpa WHERE cpa.client.id = :clientId")
    List<Property> findPropertiesByClientId(@Param("clientId") Long clientId);

    @Query("SELECT a.property FROM ClientPropertyAccess a WHERE a.id IN :accessIds")
    List<Property> findPropertiesByAccessIds(@Param("accessIds") List<Long> accessIds);



}