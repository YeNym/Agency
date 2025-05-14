package agency.project.dto;

public class TravelRequestDTO {
    private Long clientId;
    private Long propertyId;
    private Long travelRequestId;

    public Long getTravelRequestId() { return travelRequestId; }
    public void setTravelRequestId(Long travelRequestId) { this.travelRequestId = travelRequestId; }

    public Long getClientId() { return clientId; }
    public void setClientId(Long clientId) { this.clientId = clientId; }

    public Long getPropertyId() { return propertyId; }
    public void setPropertyId(Long propertyId) { this.propertyId = propertyId; }
}
