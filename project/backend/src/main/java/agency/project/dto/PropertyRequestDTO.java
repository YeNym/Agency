package agency.project.dto;

import agency.project.entity.Client;
import agency.project.entity.Property;
import agency.project.entity.TravelRequest;

public class PropertyRequestDTO {
    private Long requestId;
    private Property property;
    private Client client;

    // Новый конструктор — принимает TravelRequest
    public PropertyRequestDTO(TravelRequest request) {
        this.requestId = request.getId();
        this.property = request.getProperty();
        this.client = request.getTraveler();
    }

    // Геттеры и сеттеры
    public Long getRequestId() {
        return requestId;
    }

    public void setRequestId(Long requestId) {
        this.requestId = requestId;
    }

    public Property getProperty() {
        return property;
    }

    public void setProperty(Property property) {
        this.property = property;
    }

    public Client getClient() {
        return client;
    }

    public void setClient(Client client) {
        this.client = client;
    }
}
