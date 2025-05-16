package agency.project.dto;

import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Data
//@NoArgsConstructor
//@AllArgsConstructor
public class GrantAccessRequest {
    @NotNull
    private Long clientId;

    @NotNull
    private Long propertyId;
    public GrantAccessRequest() {}

    public GrantAccessRequest(Long clientId, Long propertyId) {
        this.clientId = clientId;
        this.propertyId = propertyId;
    }

    public Long getClientId() {
        return clientId;
    }

    public void setClientId(Long clientId) {
        this.clientId = clientId;
    }

    public Long getPropertyId() {
        return propertyId;
    }

    public void setPropertyId(Long propertyId) {
        this.propertyId = propertyId;
    }
}