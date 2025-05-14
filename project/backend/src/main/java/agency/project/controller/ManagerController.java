package agency.project.controller;

import agency.project.entity.Manager;
import agency.project.services.ManagerService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/managers")
public class ManagerController {

    private final ManagerService managerService;

    public ManagerController(ManagerService managerService) {
        this.managerService = managerService;
    }
    @GetMapping("/manager/{id}")
    public Manager getManagerById(@PathVariable Long id) {
        return managerService.getManagerById(id);  // Получаем менеджера через сервис
    }
    @GetMapping
    public ResponseEntity<List<Manager>> getAllManagers() {
        List<Manager> managers = managerService.getAllManagers();
        return ResponseEntity.ok(managers);
    }
    @GetMapping("/by-user/{userId}")
    public ResponseEntity<Manager> getManagerByUserId(@PathVariable Long userId) {
        Manager manager = managerService.getManagerByUserId(userId);
        return ResponseEntity.ok(manager);
    }
}