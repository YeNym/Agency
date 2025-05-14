package agency.project.dto;

import agency.project.entity.enumerated.AccessLevel;
import agency.project.entity.enumerated.Role;
import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;
import javax.validation.constraints.Pattern;

@Schema(description = "Модель клиента")
@Data
public class UserRegistrationDto {
    @NotBlank
    private String firstname;

    @NotBlank
    private String lastname;
    private String patronymic;

    @Email
    @NotBlank
    private String email;

    @NotBlank
    private String password;

    @NotNull
    private Role role; // MANAGER, CLIENT, ADMIN

    // Клиентские поля
    @Pattern(regexp = "^(\\+7|8)[0-9]{10}$")
    private String phone;

    @Pattern(regexp = "^[0-9]{4} [0-9]{6}$")
    private String passport;


    @Enumerated(EnumType.STRING)
    private AccessLevel accessLevel = AccessLevel.BASIC;


    // Менеджерские поля
    private String department;

    public String getFirstname() { return firstname; }
    public String getLastname() { return lastname; }
    public String getPatronymic() { return patronymic; }
    public String getEmail() { return email; }
    public String getPassword() { return password; }
    public Role getRole() { return role; }
    public String getPhone() { return phone; }
    public String getPassport() { return passport; }
    public AccessLevel getAccessLevel() { return accessLevel; }
    public String getDepartment() { return department; }

}