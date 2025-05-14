package agency.project.services;

import agency.project.entity.Client;
import agency.project.entity.ClientPropertyAccess;
import agency.project.entity.Manager;
import agency.project.entity.Property;
import agency.project.repository.ClientPropertyAccessRepository;
import agency.project.repository.ClientRepository;
import agency.project.repository.ManagerRepository;
import agency.project.repository.PropertyRepository;
import jakarta.persistence.EntityNotFoundException;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
//@RequiredArgsConstructor
public class PropertyAccessService {
    private final ClientPropertyAccessRepository accessRepository;
    private final ClientRepository clientRepository;
    private final PropertyRepository propertyRepository;
    private final ManagerRepository managerRepository;

    public PropertyAccessService(ClientPropertyAccessRepository accessRepository,
                                     ClientRepository clientRepository,
                                     PropertyRepository propertyRepository,
                                 ManagerRepository managerRepository) {
        this.accessRepository = accessRepository;
        this.clientRepository = clientRepository;
        this.managerRepository = managerRepository;
        this.propertyRepository = propertyRepository;
    }

    @Transactional
    public ClientPropertyAccess grantAccess(Long managerId, Long clientId, Long propertyId) {
        Manager manager = managerRepository.findById(managerId)
                .orElseThrow(() -> new EntityNotFoundException("Manager not found"));

        Client client = clientRepository.findById(clientId)
                .orElseThrow(() -> new EntityNotFoundException("Client not found"));

        Property property = propertyRepository.findById(propertyId)
                .orElseThrow(() -> new EntityNotFoundException("Property not found"));

        // Проверка, не выдан ли уже доступ
        if (accessRepository.existsByClientAndProperty(client, property)) {
            throw new IllegalStateException("Access already granted");
        }

        ClientPropertyAccess access = new ClientPropertyAccess();
        access.setPropertyGrantedBy(manager);
        access.setClient(client);
        access.setProperty(property);

        return accessRepository.save(access);
    }

    @Transactional
    public void revokeAccess(Long accessId) {
        accessRepository.deleteById(accessId);
    }

    public List<Property> getAccessibleProperties(Long clientId) {
        return accessRepository.findPropertiesByClientId(clientId);
    }

    public boolean hasAccess(Long clientId, Long propertyId) {
        return accessRepository.existsByClientIdAndPropertyId(clientId, propertyId);
    }
}