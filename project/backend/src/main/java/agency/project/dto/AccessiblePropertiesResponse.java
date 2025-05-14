package agency.project.dto;

import java.math.BigDecimal;

public record AccessiblePropertiesResponse(
        Long propertyId,
        String address,
        BigDecimal price
) {}
