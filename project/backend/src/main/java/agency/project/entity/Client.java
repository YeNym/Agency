package agency.project.entity;

import agency.project.entity.enumerated.AccessLevel;
import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonManagedReference;
import jakarta.persistence.*;
import lombok.Data;
import org.hibernate.annotations.CreationTimestamp;

import javax.validation.constraints.Pattern;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Data
@JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})

public class Client{
    @Id
    @GeneratedValue
    private Long id;

    @OneToOne(cascade = CascadeType.ALL, orphanRemoval = true)
    @JoinColumn(name = "auth_user_id")
    private User authUser;

    @Column(nullable = false, unique = true)
    @Pattern(regexp = "^(\\+7|8)[0-9]{10}$")
    private String phone;

    @Column(unique = true)
    @Pattern(regexp = "^[0-9]{4} [0-9]{6}$")
    private String passport;

    @OneToMany(mappedBy = "client", cascade = CascadeType.ALL, orphanRemoval = true)
    @JsonManagedReference("Client-preferences")
    private List<HousingPreferences> preferences = new ArrayList<>();

    @Enumerated(EnumType.STRING)
    private AccessLevel accessLevel = AccessLevel.BASIC;

    @OneToMany(mappedBy = "traveler", cascade = CascadeType.ALL, orphanRemoval = true)
    @JsonManagedReference("Client-travelRequests")
    private List<TravelRequest> travelRequests = new ArrayList<>();

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "created_by_id")
    @JsonBackReference("Client-createdBy")
    private Manager createdBy;

    @OneToMany(mappedBy = "owner")
    @JsonManagedReference("Client-ownedProperties")
    private List<Property> ownedProperties = new ArrayList<>();


    @OneToMany(mappedBy = "client")
    @JsonManagedReference("Client-propertyAccesses")
    private List<ClientPropertyAccess> propertyAccesses = new ArrayList<>();

    @CreationTimestamp
    @Column(nullable = false, updatable = false)
    private LocalDateTime createdAt;


    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public User getAuthUser() {
        return authUser;
    }

    public void setAuthUser(User authUser) {
        this.authUser = authUser;
    }

    public String getPhone() {
        return phone;
    }


    public void setPhone(String phone) {
        this.phone = phone;
    }

    public String getPassport() {
        return passport;
    }

    public void setPassport(String passport) {
        this.passport = passport;
    }

    public List<HousingPreferences> getPreferences() {
        return preferences;
    }

    public void setPreferences(List<HousingPreferences> preferences) {
        this.preferences = preferences;
    }

    public AccessLevel getAccessLevel() {
        return accessLevel;
    }

    public void setAccessLevel(AccessLevel accessLevel) {
        this.accessLevel = accessLevel;
    }

    public Manager getCreatedBy() {
        return createdBy;
    }

    public void setCreatedBy(Manager createdBy) {
        this.createdBy = createdBy;
    }

    public List<Property> getOwnedProperties() {
        return ownedProperties;
    }

    public void setOwnedProperties(List<Property> ownedProperties) {
        this.ownedProperties = ownedProperties;
    }

    public List<ClientPropertyAccess> getPropertyAccesses() {
        return propertyAccesses;
    }

    public void setPropertyAccesses(List<ClientPropertyAccess> propertyAccesses) {
        this.propertyAccesses = propertyAccesses;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }
}