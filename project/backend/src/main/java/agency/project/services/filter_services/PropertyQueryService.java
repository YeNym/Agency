package agency.project.services.filter_services;

import agency.project.dto.filter.PropertyFilter;
import agency.project.entity.Property;
import agency.project.repository.PropertyRepository;
import agency.project.specifications.PropertySpecifications;
import agency.project.validator.PropertyFilterValidator;
import jakarta.validation.ValidationException;
import lombok.RequiredArgsConstructor;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;
import org.springframework.validation.BeanPropertyBindingResult;
import org.springframework.validation.Errors;

import java.util.List;

@Service
//@RequiredArgsConstructor
public class PropertyQueryService {
    private final PropertyRepository propertyRepository;
    private final PropertyFilterValidator validator;

    public PropertyQueryService(PropertyRepository propertyRepository , PropertyFilterValidator validator) {
        this.propertyRepository = propertyRepository;
        this.validator = validator;
    }

    public List<Property> findWithFilters(PropertyFilter filter) {
        // Валидация параметров
        Errors errors = new BeanPropertyBindingResult(filter, "filter");
        validator.validate(filter, errors);
        if (errors.hasErrors()) {
            throw new ValidationException("Invalid filter parameters");
        }

        Specification<Property> spec = Specification.where(null);

        if (filter.hasCityFilter()) {
            spec = spec.and(PropertySpecifications.withCity(filter.city()));
        }
        if (filter.hasRoomsFilter()) {
            spec = spec.and(PropertySpecifications.withRoomsBetween(
                    filter.minRooms(), filter.maxRooms()));
        }
        if (filter.hasPriceFilter()) {
            spec = spec.and(PropertySpecifications.withPriceBetween(
                    filter.minPrice(), filter.maxPrice()));
        }
        if (filter.propertyType() != null) {
            spec = spec.and(PropertySpecifications.withPropertyType(filter.propertyType()));
        }

        return propertyRepository.findAll(spec);
    }
}