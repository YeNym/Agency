package agency.project.entity;

import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonManagedReference;
import jakarta.persistence.*;
import lombok.Data;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;

@Data
@Entity
@Table(name = "client_property_access")
public class ClientPropertyAccess {
    @Id
    @GeneratedValue
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "granted_by_user_id", nullable = false)
    @JsonBackReference("manager_grantedAccesses")
    private Manager propertyGrantedBy;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "client_id", nullable = false)
    @JsonBackReference("Client-propertyAccesses")
    private Client client;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "property_id", nullable = false)
    @JsonBackReference("ClientPropertyAccess-property")
    private Property property;

    @CreationTimestamp
    @Column(nullable = false, updatable = false)
    private LocalDateTime grantedAtTime;

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Manager getPropertyGrantedBy() { return propertyGrantedBy; }
    public void setPropertyGrantedBy(Manager propertyGrantedBy) { this.propertyGrantedBy = propertyGrantedBy; }

    public Client getClient() { return client; }
    public void setClient(Client client) { this.client = client; }

    public Property getProperty() { return property; }
    public void setProperty(Property property) { this.property = property; }

    public LocalDateTime getGrantedAtTime() { return grantedAtTime; }
    public void setGrantedAtTime(LocalDateTime grantedAtTime) { this.grantedAtTime = grantedAtTime; }

}
