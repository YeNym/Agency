package agency.project.entity;

import agency.project.entity.enumerated.RequestStatus;
import jakarta.persistence.*;
import lombok.Data;
import org.hibernate.annotations.CreationTimestamp;
import com.fasterxml.jackson.annotation.JsonBackReference;

import java.time.LocalDateTime;

@Data
@Entity
public class TravelRequest {
    @Id
    @GeneratedValue
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(nullable = false)
    @JsonBackReference("Client-travelRequests")
    private Client traveler;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(nullable = false)
    @JsonBackReference("property-travelRequests")
    private Property property;

    @Enumerated(EnumType.STRING)
    private RequestStatus status = RequestStatus.PENDING;

    @CreationTimestamp
    private LocalDateTime createdAt;

    @ManyToOne(fetch = FetchType.LAZY)
    @JsonBackReference("Manager-travelRequests")
    private Manager assignedManager;

    // Getters and setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Client getTraveler() { return traveler; }
    public void setTraveler(Client traveler) { this.traveler = traveler; }

    public Property getProperty() { return property; }
    public void setProperty(Property property) { this.property = property; }

    public RequestStatus getStatus() { return status; }
    public void setStatus(RequestStatus status) { this.status = status; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }

    public Manager getAssignedManager() { return assignedManager; }
    public void setAssignedManager(Manager assignedManager) { this.assignedManager = assignedManager; }

}
