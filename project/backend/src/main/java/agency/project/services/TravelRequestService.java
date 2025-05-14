package agency.project.services;

import agency.project.dto.TravelRequestDTO;
import agency.project.entity.Client;
import agency.project.entity.Manager;
import agency.project.entity.Property;
import agency.project.entity.TravelRequest;
import agency.project.entity.enumerated.AccessLevel;
import agency.project.entity.enumerated.RequestStatus;
import agency.project.repository.ClientRepository;
import agency.project.repository.ManagerRepository;
import agency.project.repository.PropertyRepository;
import agency.project.repository.TravelRequestRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.time.temporal.ChronoUnit;
import java.util.List;
import java.util.Optional;

@Service
public class TravelRequestService {

    private final TravelRequestRepository travelRequestRepository;
    private final ClientRepository clientRepository;
    private final PropertyRepository propertyRepository;
    private final ManagerRepository managerRepository;

    public TravelRequestService(
            TravelRequestRepository travelRequestRepository,
            ClientRepository clientRepository,
            PropertyRepository propertyRepository,
            ManagerRepository managerRepository
    ) {
        this.travelRequestRepository = travelRequestRepository;
        this.clientRepository = clientRepository;
        this.propertyRepository = propertyRepository;
        this.managerRepository = managerRepository;

    }

    public String createTravelRequest(TravelRequestDTO dto) {
        Optional<Client> clientOpt = clientRepository.findById(dto.getClientId());
        Optional<Property> propertyOpt = propertyRepository.findById(dto.getPropertyId());

        if (clientOpt.isEmpty()) {
            throw new IllegalArgumentException("Клиент не найден");
        }
        if (propertyOpt.isEmpty()) {
            throw new IllegalArgumentException("Недвижимость не найдена");
        }

        Client client = clientOpt.get();
        Property property = propertyOpt.get();

        if (client.getAccessLevel() != AccessLevel.TRAVELER) {
            throw new SecurityException("У клиента нет прав на создание запроса");
        }

        Optional<TravelRequest> existingRequestOpt = travelRequestRepository.findByTravelerAndProperty(client, property);

        if (existingRequestOpt.isPresent()) {
            TravelRequest existingRequest = existingRequestOpt.get();

            LocalDateTime now = LocalDateTime.now();
            LocalDateTime requestTime = existingRequest.getCreatedAt(); // Предполагается, что есть поле createdAt

            long hoursSinceRequest = ChronoUnit.HOURS.between(requestTime, now);

            if (hoursSinceRequest < 48) {
                throw new IllegalArgumentException("Вы можете отправить новый запрос только через 48 часов.");
            }
        }
        TravelRequest request = new TravelRequest();
        request.setTraveler(client);
        request.setProperty(property);
        request.setStatus(RequestStatus.PENDING);
        request.setCreatedAt(LocalDateTime.now());
        travelRequestRepository.save(request);

        return "Запрос успешно отправлен";
    }

    public List<TravelRequest> getPendingRequests() {
        return travelRequestRepository.findByStatus(RequestStatus.PENDING);
    }

    public String updateRequestStatus(Long requestId, RequestStatus newStatus, Long managerId) {
        TravelRequest request = travelRequestRepository.findById(requestId)
                .orElseThrow(() -> new IllegalArgumentException("Заявка не найдена"));

        Manager manager = managerRepository.findById(managerId)
                .orElseThrow(() -> new IllegalArgumentException("Менеджер не найден"));

        request.setStatus(newStatus);
        request.setAssignedManager(manager);
        travelRequestRepository.save(request);

        return "Статус заявки обновлён, менеджер назначен";
    }


    public List<TravelRequest> getNonPendingRequestsByManager(Long managerId) {
        return travelRequestRepository.findByManagerIdAndStatusNotPending(managerId);
    }


}
