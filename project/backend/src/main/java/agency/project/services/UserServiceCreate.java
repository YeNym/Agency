package agency.project.services;

import agency.project.dto.UserRegistrationDto;
import agency.project.entity.Client;
import agency.project.entity.Manager;
import agency.project.entity.User;
import agency.project.entity.enumerated.AccessLevel;
import agency.project.entity.enumerated.Role;
import agency.project.repository.ClientRepository;
import agency.project.repository.ManagerRepository;
import agency.project.repository.UserRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.security.access.AccessDeniedException;


@Service
//@RequiredArgsConstructor
public class UserServiceCreate {
    private final UserRepository userRepository;
    private final ClientRepository clientRepository;
    private final ManagerRepository managerRepository;
    private final PasswordEncoder passwordEncoder;
    public UserServiceCreate(UserRepository userRepository,
                             ClientRepository clientRepository,
                             ManagerRepository managerRepository,
                             PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.clientRepository = clientRepository;
        this.managerRepository = managerRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Transactional
    public void registerUser(UserRegistrationDto registrationDto, User createdBy) {
        // Проверка прав доступа
        checkCreationPermissions(createdBy, registrationDto.getRole());

        // Создаем базового пользователя
        User user = new User();
        user.setFirstname(registrationDto.getFirstname());
        user.setLastname(registrationDto.getLastname());
        user.setPatronymic(registrationDto.getPatronymic());
        user.setEmail(registrationDto.getEmail());
        user.setPassword(passwordEncoder.encode(registrationDto.getPassword()));
        user.setRole(registrationDto.getRole());

        User savedUser = userRepository.save(user);

        // В зависимости от роли создаем соответствующую сущность
        switch (registrationDto.getRole()) {
            case CLIENT:
                createClient(savedUser, registrationDto, createdBy);
                break;
            case MANAGER:
                createManager(savedUser, registrationDto);
                break;
            case ADMIN:
                // Для админа не нужно создавать дополнительных сущностей
                break;
        }
    }

    private void createClient(User user, UserRegistrationDto dto, User createdBy) {
        Client client = new Client();
        client.setAuthUser(user);
        client.setPhone(dto.getPhone());
        client.setPassport(dto.getPassport());

        client.setAccessLevel(dto.getAccessLevel() != null ?
                dto.getAccessLevel() :
                AccessLevel.BASIC);

        // Если создает менеджер, устанавливаем связь
        if (createdBy != null && createdBy.getRole() == Role.MANAGER) {
            Manager manager = managerRepository.findByAuthUser(createdBy)
                    .orElseThrow(() -> new IllegalStateException("Manager not found"));
            client.setCreatedBy(manager);
        }

        clientRepository.save(client);
    }

    private void createManager(User user, UserRegistrationDto dto) {
        Manager manager = new Manager();
        manager.setId(user.getId()); // Используем тот же ID
        manager.setAuthUser(user);
        manager.setDepartment(dto.getDepartment());
        managerRepository.save(manager);
    }

    private void checkCreationPermissions(User creator, Role newUserRole) {
        if (creator == null) {
            // Системное создание (например, первичный админ)
            return;
        }

        switch (creator.getRole()) {
            case ADMIN:
                break;
            case MANAGER:
                if (newUserRole != Role.CLIENT) {
                    throw new AccessDeniedException("Manager can only create clients");
                }
                break;
            default:
                throw new AccessDeniedException("You don't have permissions to create users");
        }
    }
}