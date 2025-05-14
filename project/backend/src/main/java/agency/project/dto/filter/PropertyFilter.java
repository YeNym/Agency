package agency.project.dto.filter;

import agency.project.entity.enumerated.PropertyLevel;
import agency.project.entity.enumerated.PropertyType;
import agency.project.entity.enumerated.Status;

import java.math.BigDecimal;

public record PropertyFilter(
        String city,
        Integer minRooms,
        Integer maxRooms,
        BigDecimal minPrice,
        BigDecimal maxPrice,
        PropertyType propertyType,
        PropertyLevel propertyLevel,
        Status status
) {
    public boolean hasCityFilter() {
        return city != null && !city.isBlank();
    }

    public boolean hasRoomsFilter() {
        return minRooms != null || maxRooms != null;
    }

    public boolean hasPriceFilter() {
        return minPrice != null || maxPrice != null;
    }
    //ToDo добавить фильтры
}