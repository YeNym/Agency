package agency.project.repository;

import agency.project.entity.Property;
import agency.project.entity.enumerated.PropertyLevel;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface PropertyRepository extends JpaRepository<Property, Long>,
        JpaSpecificationExecutor<Property> {

    @EntityGraph(attributePaths = {"address", "owner"})
    @Override
    List<Property> findAll(Specification<Property> spec);
    List<Property> findByCreatedByManagerId(Long managerId);
    List<Property> findByPropertyLevel(PropertyLevel propertyLevel);
    Optional<Property> findById(Long id);

}