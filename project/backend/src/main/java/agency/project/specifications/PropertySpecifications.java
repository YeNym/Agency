package agency.project.specifications;

import agency.project.entity.Property;
import agency.project.entity.enumerated.PropertyType;
import org.springframework.data.jpa.domain.Specification;

import java.math.BigDecimal;

public class PropertySpecifications {
    public static Specification<Property> withCity(String city) {
        return (root, query, cb) ->
                city == null ? null : cb.equal(root.get("address").get("city"), city);
    }

    public static Specification<Property> withRoomsBetween(Integer min, Integer max) {
        return (root, query, cb) -> {
            if (min == null && max == null) return null;
            if (min == null) return cb.lessThanOrEqualTo(root.get("rooms"), max);
            if (max == null) return cb.greaterThanOrEqualTo(root.get("rooms"), min);
            return cb.between(root.get("rooms"), min, max);
        };
    }

    public static Specification<Property> withPriceBetween(BigDecimal min, BigDecimal max) {
        return (root, query, cb) -> {
            if (min == null && max == null) return null;
            if (min == null) return cb.lessThanOrEqualTo(root.get("price"), max);
            if (max == null) return cb.greaterThanOrEqualTo(root.get("price"), min);
            return cb.between(root.get("price"), min, max);
        };
    }

    public static Specification<Property> withPropertyType(PropertyType type) {
        return (root, query, cb) ->
                type == null ? null : cb.equal(root.get("propertyType"), type);
    }
    //ToDo добавить фильтры
}