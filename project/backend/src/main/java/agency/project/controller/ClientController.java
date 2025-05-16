package agency.project.controller;

import agency.project.dto.ClientUpdateDTO;
import agency.project.entity.Client;
import agency.project.entity.User;
import agency.project.entity.enumerated.AccessLevel;
import agency.project.repository.ClientRepository;
import agency.project.services.ClientService;
import jakarta.validation.Valid;
import lombok.AllArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/clients")
//@AllArgsConstructor
@Validated
public class ClientController {
    private final ClientService clientService;
    public ClientController(ClientService clientService) {
        this.clientService = clientService;
    }

    // Получить всех клиентов
    @GetMapping
    public List<Client> getAllClients() {
        return clientService.getAll();
    }

    // Получить клиента по ID
    @GetMapping("/{id}")
    public ResponseEntity<Client> getClientById(@PathVariable Long id) {
        Client client = clientService.getById(id);
        return client != null ? ResponseEntity.ok(client) : ResponseEntity.notFound().build();
    }

    @PutMapping("/{id}")
    public ResponseEntity<Client> updateClient(@PathVariable Long id, @RequestBody ClientUpdateDTO dto) {
        Client updated = clientService.update(id, dto);
        return updated != null ? ResponseEntity.ok(updated) : ResponseEntity.notFound().build();
    }

    // Удалить клиента
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteClient(@PathVariable Long id) {
        clientService.deleteClient(id);
        return ResponseEntity.noContent().build();
    }

    // Найти клиентов по диапазону дат создания
    @GetMapping("/by-date")
    public List<Client> getClientsByDateRange(
            @RequestParam String startDate,
            @RequestParam String endDate) {
        LocalDateTime start = LocalDateTime.parse(startDate);
        LocalDateTime end = LocalDateTime.parse(endDate);
        return clientService.getByDateRange(start, end);
    }

    // Поиск по номеру телефона
    @GetMapping("/search-by-phone/{phone}")
    public ResponseEntity<Client> getClientByPhone(@PathVariable String phone) {
        Client client = clientService.getByPhone(phone);
        return client != null ? ResponseEntity.ok(client) : ResponseEntity.notFound().build();
    }

    // Поиск по номеру паспорта
    @GetMapping("/search-by-passport/{passport}")
    public ResponseEntity<Client> getClientByPassport(@PathVariable String passport) {
        Client client = clientService.getByPassport(passport);
        return client != null ? ResponseEntity.ok(client) : ResponseEntity.notFound().build();
    }

    // Поиск по уровню доступа
    @GetMapping("/search-by-accessLevel/{accessLevel}")
    public List<Client> getClientsByAccessLevel(@PathVariable AccessLevel accessLevel) {
        return clientService.getByAccessLevel(accessLevel);
    }

    @GetMapping("/by-manager/{managerId}")
    public List<Client> getClientsByManager(@PathVariable Long managerId) {
        return clientService.getClientsCreatedByManager(managerId);
    }
    @GetMapping("/client-search/{userId}")
    public ResponseEntity<?> getClientByUserId(@PathVariable Long userId) {
        return clientService.getClientByUserId(userId)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }
    // Добавляем новый эндпоинт в контроллер
    @GetMapping("/{clientId}/user")
    public ResponseEntity<User> getUserByClientId(@PathVariable Long clientId) {
        Optional<User> user = clientService.getUserByClientId(clientId);
        return user.map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

}