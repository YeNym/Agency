package agency.project.validator;

import agency.project.dto.filter.PropertyFilter;
import jakarta.validation.ConstraintViolation;
import org.springframework.validation.Validator;
import jakarta.validation.executable.ExecutableValidator;
import jakarta.validation.metadata.BeanDescriptor;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;
import org.springframework.validation.Errors;

import java.util.Set;

@Component
public class PropertyFilterValidator implements Validator {

    @Override
    public boolean supports(Class<?> clazz) {
        return PropertyFilter.class.isAssignableFrom(clazz);
    }

    @Override
    public void validate(Object target, Errors errors) {
        PropertyFilter filter = (PropertyFilter) target;

        if (filter.minPrice() != null && filter.maxPrice() != null
                && filter.minPrice().compareTo(filter.maxPrice()) > 0) {
            errors.rejectValue("minPrice", "invalid.range", "Min price cannot be greater than max price");
        }

        if (filter.minRooms() != null && filter.maxRooms() != null
                && filter.minRooms() > filter.maxRooms()) {
            errors.rejectValue("minRooms", "invalid.range", "Min rooms cannot be greater than max rooms");
        }
    }
}