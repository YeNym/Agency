package agency.project.entity;

import agency.project.entity.enumerated.PropertyLevel;
import agency.project.entity.enumerated.PropertyType;
import agency.project.entity.enumerated.Status;
import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonManagedReference;
import jakarta.persistence.*;
import lombok.Data;
import org.hibernate.annotations.CreationTimestamp;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Data
@Entity
@JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})

public class Property {
    @Id
    @GeneratedValue
    private Long id;
    @Embedded
    private Address address;
    private Integer rooms;
    private BigDecimal price;
    private Integer floor;

    private Boolean hasBalcony;

    private Boolean allowPets;

    @CreationTimestamp
    private LocalDateTime createdAt;
    private PropertyLevel propertyLevel;
    private String description;

    @Enumerated(EnumType.STRING)
    private PropertyType propertyType;

    @Enumerated(EnumType.STRING)
    private Status status;

    // 1. Менеджер, создавший объявление
    @ManyToOne(fetch = FetchType.LAZY)
    @JsonBackReference("property-manager")
    @JoinColumn(name = "created_by_manager_id", nullable = true)
    private Manager createdByManager;


    // 2. Клиент-владелец (с пометкой "Owner")
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "owner_client_id", nullable = true)
    @JsonBackReference("Client-ownedProperties")
    private Client owner;

    @OneToMany(mappedBy = "property", cascade = CascadeType.ALL)
    @JsonManagedReference("ClientPropertyAccess-property")
    private List<ClientPropertyAccess> accessHistory;

    @OneToMany(mappedBy = "property")
    @JsonManagedReference("property-travelRequests")
    private List<TravelRequest> travelRequests;

    @ElementCollection
    private List<String> imagePaths = new ArrayList<>();

    public void addImagePath(String path) {
        this.imagePaths.add(path);
    }
    // Getters and setters
    public List<String> getImagePaths() {
        return imagePaths;
    }

    public void setImagePaths(List<String> imagePaths) {
        this.imagePaths = imagePaths;
    }


    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Address getAddress() { return address; }
    public void setAddress(Address address) { this.address = address; }

    public Integer getRooms() { return rooms; }
    public void setRooms(Integer rooms) { this.rooms = rooms; }

    public BigDecimal getPrice() { return price; }
    public void setPrice(BigDecimal price) { this.price = price; }

    public Integer getFloor() { return floor; }
    public void setFloor(Integer floor) { this.floor = floor; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }

    public PropertyLevel getPropertyLevel() { return propertyLevel; }
    public void setPropertyLevel(PropertyLevel propertyLevel) { this.propertyLevel = propertyLevel; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public PropertyType getPropertyType() { return propertyType; }
    public void setPropertyType(PropertyType propertyType) { this.propertyType = propertyType; }

    public Status getStatus() { return status; }
    public void setStatus(Status status) { this.status = status; }

    public Manager getCreatedByManager() { return createdByManager; }
    public void setCreatedByManager(Manager createdByManager) { this.createdByManager = createdByManager; }

    public Client getOwner() { return owner; }
    public void setOwner(Client owner) { this.owner = owner; }

    public List<ClientPropertyAccess> getAccessHistory() { return accessHistory; }
    public void setAccessHistory(List<ClientPropertyAccess> accessHistory) { this.accessHistory = accessHistory; }

    public List<TravelRequest> getTravelRequests() { return travelRequests; }
    public void setTravelRequests(List<TravelRequest> travelRequests) { this.travelRequests = travelRequests; }



    public void setCreatedBy(User creator) {

    }
    public Boolean getHasBalcony() {
        return hasBalcony;
    }

    public void setHasBalcony(Boolean hasBalcony) {
        this.hasBalcony = hasBalcony;
    }

    public Boolean getAllowPets() {
        return allowPets;
    }

    public void setAllowPets(Boolean allowPets) {
        this.allowPets = allowPets;
    }

}
