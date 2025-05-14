package agency.project.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Embeddable;
import lombok.Data;

@Embeddable
@Data
public class Address {
    @Column(nullable = false)
    private String city;       // Город

    private String district;   // Район
    private String street;     // Улица
    private String building;   // Дом/корпус

    @Column(name = "postal_code")
    private String postalCode; // Индекс

    private Double latitude;   // Широта
    private Double longitude; // Долгота

    public Address() {}
    // Getters and setters
    public String getCity() { return city; }
    public void setCity(String city) { this.city = city; }

    public String getDistrict() { return district; }
    public void setDistrict(String district) { this.district = district; }

    public String getStreet() { return street; }
    public void setStreet(String street) { this.street = street; }

    public String getBuilding() { return building; }
    public void setBuilding(String building) { this.building = building; }

    public String getPostalCode() { return postalCode; }
    public void setPostalCode(String postalCode) { this.postalCode = postalCode; }

    public Double getLatitude() { return latitude; }
    public void setLatitude(Double latitude) { this.latitude = latitude; }

    public Double getLongitude() { return longitude; }
    public void setLongitude(Double longitude) { this.longitude = longitude; }
}