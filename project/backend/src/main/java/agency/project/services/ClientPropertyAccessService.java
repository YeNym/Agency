package agency.project.service;

import agency.project.entity.Client;
import agency.project.entity.ClientPropertyAccess;
import agency.project.entity.Manager;
import agency.project.entity.Property;
import agency.project.repository.ClientPropertyAccessRepository;
import agency.project.repository.ClientRepository;
import agency.project.repository.ManagerRepository;
import agency.project.repository.PropertyRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class ClientPropertyAccessService {

    private final ClientPropertyAccessRepository accessRepository;
    private final PropertyRepository propertyRepository;
    private final ClientRepository clientRepository;
    private final ManagerRepository managerRepository;

    public ClientPropertyAccessService(ClientPropertyAccessRepository accessRepository,
                                       PropertyRepository propertyRepository,
                                       ClientRepository clientRepository,
                                       ManagerRepository managerRepository) {
        this.accessRepository = accessRepository;
        this.propertyRepository = propertyRepository;
        this.clientRepository = clientRepository;
        this.managerRepository = managerRepository;
    }

    @Transactional
    public ClientPropertyAccess grantAccess(Long managerId, Long clientId, Long propertyId) {
        // Получаем менеджера, клиента и недвижимость по ID
        Manager manager = managerRepository.findById(managerId)
                .orElseThrow(() -> new IllegalArgumentException("Менеджер не найден"));
        Client client = clientRepository.findById(clientId)
                .orElseThrow(() -> new IllegalArgumentException("Клиент не найден"));
        Property property = propertyRepository.findById(propertyId)
                .orElseThrow(() -> new IllegalArgumentException("Недвижимость не найдена"));

        if (accessRepository.existsByClientIdAndPropertyId(clientId, propertyId)) {
            throw new IllegalStateException("Доступ уже выдан");
        }

        ClientPropertyAccess access = new ClientPropertyAccess();
        access.setPropertyGrantedBy(manager);
        access.setClient(client);
        access.setProperty(property);
        return accessRepository.save(access);
    }

    public boolean hasAccess(Long clientId, Long propertyId) {
        return accessRepository.existsByClientIdAndPropertyId(clientId, propertyId);
    }

    public List<ClientPropertyAccess> getAccessListByClientId(Long clientId) {
        return accessRepository.findByClientId(clientId);
    }
}
