package agency.project.services;

import agency.project.entity.Manager;
import agency.project.repository.ManagerRepository;
import jakarta.persistence.EntityNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class ManagerService {

    private final ManagerRepository managerRepository;

    public ManagerService(ManagerRepository managerRepository) {
        this.managerRepository = managerRepository;
    }

    @Transactional(readOnly = true)
    public Manager getManagerByUserId(Long userId) {
        return managerRepository.findByAuthUserId(userId)
                .orElseThrow(() -> new EntityNotFoundException("Manager not found for user id: " + userId));
    }
    @Transactional(readOnly = true)
    public List<Manager> getAllManagers() {
        return managerRepository.findAll();  // Получаем всех менеджеров
    }
    public Manager getManagerById(Long id) {
        return managerRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Manager not found for ID: " + id));  // Генерируем исключение, если менеджер не найден
    }
}