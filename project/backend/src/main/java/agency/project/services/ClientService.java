package agency.project.services;

import agency.project.dto.ClientUpdateDTO;
import agency.project.entity.Client;
import agency.project.entity.User;
import agency.project.entity.enumerated.AccessLevel;
import agency.project.repository.ClientRepository;
import agency.project.repository.UserRepository;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
//@RequiredArgsConstructor
public class ClientService {

    private final ClientRepository clientRepository;
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public ClientService(ClientRepository clientRepository, UserRepository userRepository, PasswordEncoder passwordEncoder) {
        this.clientRepository = clientRepository;
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }
    public List<Client> getAll() {
        return clientRepository.findAll();
    }

    public Optional<Client> getClientByUserId(Long userId) {
        return clientRepository.findByAuthUser_Id(userId);
    }

    public Client getById(Long id) {
        return clientRepository.findById(id).orElse(null);
    }

    public Client create(Client client) {
        return clientRepository.save(client);
    }


    public void delete(Long id) {
        clientRepository.deleteById(id);
    }

    public List<Client> getByDateRange(LocalDateTime start, LocalDateTime end) {
        return clientRepository.findByCreatedAtBetween(start, end);
    }
    public Client getByPhone(String phone) {
        return clientRepository.findByPhone(phone).orElse(null);
    }

    public Client getByPassport(String passport) {
        return clientRepository.findByPassport(passport).orElse(null);
    }

    public List<Client> getByAccessLevel(AccessLevel accessLevel) {
        return clientRepository.findByAccessLevel(accessLevel);
    }

    public List<Client> getClientsCreatedByManager(Long managerId) {
        return clientRepository.findByCreatedById(managerId);
    }

    public Client update(Long clientId, ClientUpdateDTO dto) {
        Optional<Client> existingOpt = clientRepository.findById(clientId);
        if (existingOpt.isEmpty()) {
            return null;
        }

        Client existing = existingOpt.get();
        User user = existing.getAuthUser();
        if (user != null) {
            user.setFirstname(dto.getFirstname());
            user.setLastname(dto.getLastname());
            user.setEmail(dto.getEmail());

            if (dto.getPassword() != null && !dto.getPassword().isEmpty()) {
                user.setPassword(passwordEncoder.encode(dto.getPassword()));
            }

            userRepository.save(user);
        }

        existing.setPhone(dto.getPhone());
        existing.setPassport(dto.getPassport());
        existing.setAccessLevel(dto.getAccessLevel());
        return clientRepository.save(existing);
    }


    public void deleteClient(Long clientId) {
        clientRepository.findById(clientId).orElseThrow(
                () -> new EntityNotFoundException("Клиент не найден с ID: " + clientId)
        );
        clientRepository.deleteById(clientId);
    }


    public Optional<User> getUserByClientId(Long clientId) {
        return clientRepository.findUserByClientId(clientId);
    }

}