package agency.project.services;

import agency.project.dto.PropertyUpdateDTO;
import agency.project.entity.*;
import agency.project.entity.enumerated.PropertyLevel;
import agency.project.repository.PropertyRepository;
import jakarta.persistence.EntityNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
public class PropertyService {

    private final PropertyRepository propertyRepository;

    public PropertyService(PropertyRepository propertyRepository) {
        this.propertyRepository = propertyRepository;
    }

    public List<Property> getAllProperties() {
        return propertyRepository.findAll();
    }

    public Optional<Property> getPropertyById(Long id) {
        return propertyRepository.findById(id);
    }

    @Transactional
    public Property createProperty(Property property, User creator, Client owner) {
        property.setCreatedBy(creator);
        property.setOwner(owner);
        return propertyRepository.save(property);
    }

    public Property save(Property property) {
        return propertyRepository.save(property);
    }

    public Property updateProperty(Long id, PropertyUpdateDTO dto) {
        Property property = propertyRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Property not found"));

        property.setDescription(dto.getDescription());
        property.setStatus(dto.getStatus());
        property.setPrice(dto.getPrice());
        property.setRooms(dto.getRooms());
        property.setFloor(dto.getFloor());
        property.setHasBalcony(dto.getHasBalcony());
        property.setAllowPets(dto.getAllowPets());
        property.setPropertyLevel(dto.getPropertyLevel());
        property.setPropertyType(dto.getPropertyType());

        if (dto.getAddress() != null) {
            Address address = property.getAddress();
            if (address == null) {
                address = new Address();
                property.setAddress(address);
            }
            address.setCity(dto.getAddress().getCity());
            address.setDistrict(dto.getAddress().getDistrict());
            address.setStreet(dto.getAddress().getStreet());
            address.setBuilding(dto.getAddress().getBuilding());
            address.setPostalCode(dto.getAddress().getPostalCode());
        }

        return propertyRepository.save(property);
    }


    @Transactional
    public void deleteProperty(Long id) {
        propertyRepository.deleteById(id);
    }

    public List<Property> getPropertiesByManagerId(Long managerId) {
        return propertyRepository.findByCreatedByManagerId(managerId);
    }

    public List<Property> getTravelProperties() {
        return propertyRepository.findByPropertyLevel(PropertyLevel.TRAVEL);
    }

}