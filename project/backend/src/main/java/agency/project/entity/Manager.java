package agency.project.entity;

import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonManagedReference;
import jakarta.persistence.*;
import lombok.Data;

import java.util.ArrayList;
import java.util.List;

// Сущность менеджера
@Entity
@Data
public class Manager{
    @Id
    private Long id;

    private String department;

    @OneToOne(cascade = CascadeType.ALL, orphanRemoval = true)
    @JoinColumn(name = "user_id", referencedColumnName = "id")
    private User authUser;

    @JsonManagedReference("Client-createdBy")
    @OneToMany(mappedBy = "createdBy")
    private List<Client> createdClients = new ArrayList<>();

    @OneToMany(mappedBy = "assignedManager")
    @JsonIgnore
    @JsonManagedReference("Manager-travelRequests")
    private List<TravelRequest> travelRequests = new ArrayList<>();

    @OneToMany(mappedBy = "propertyGrantedBy")
    @JsonManagedReference("manager_grantedAccesses")
    private List<ClientPropertyAccess> grantedAccesses = new ArrayList<>();

    @OneToMany(mappedBy = "createdByManager")
    private List<Property> createdProperties = new ArrayList<>();


    public void addCreatedProperty(Property property) {
        createdProperties.add(property);
        property.setCreatedByManager(this);
    }

    public void removeCreatedProperty(Property property) {
        createdProperties.remove(property);
        property.setCreatedByManager(null);
    }
    // Геттеры
    public Long getId() {
        return id;
    }

    public String getDepartment() {
        return department;
    }

    public User getAuthUser() {
        return authUser;
    }

    public List<Client> getCreatedClients() {
        return createdClients;
    }

    public List<TravelRequest> getTravelRequests() {
        return travelRequests;
    }

    public List<ClientPropertyAccess> getGrantedAccesses() {
        return grantedAccesses;
    }

    // Сеттеры
    public void setId(Long id) {
        this.id = id;
    }

    public void setDepartment(String department) {
        this.department = department;
    }

    public void setAuthUser(User authUser) {
        this.authUser = authUser;
    }

    public void setCreatedClients(List<Client> createdClients) {
        this.createdClients = createdClients;
    }

    public void setTravelRequests(List<TravelRequest> travelRequests) {
        this.travelRequests = travelRequests;
    }

    public void setGrantedAccesses(List<ClientPropertyAccess> grantedAccesses) {
        this.grantedAccesses = grantedAccesses;
    }

    // Дополнительные методы для удобства работы с коллекциями
    public void addCreatedClient(Client client) {
        createdClients.add(client);
        client.setCreatedBy(this);
    }

    public void removeCreatedClient(Client client) {
        createdClients.remove(client);
        client.setCreatedBy(null);
    }
}