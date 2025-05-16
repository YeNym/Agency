package agency.project.controller;

import agency.project.dto.PropertyRequestDTO;
import agency.project.dto.TravelRequestDTO;
import agency.project.entity.Property;
import agency.project.entity.TravelRequest;
import agency.project.entity.enumerated.RequestStatus;
import agency.project.repository.PropertyRepository;
import agency.project.services.PropertyService;
import agency.project.services.TravelRequestService;
import jakarta.transaction.Transactional;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
    @RequestMapping("/api/travel-requests")
public class TravelRequestController {

    private final TravelRequestService travelRequestService;
    private final PropertyRepository propertyRepository;

    public TravelRequestController(TravelRequestService travelRequestService,PropertyRepository propertyRepository) {
        this.travelRequestService = travelRequestService;
        this.propertyRepository = propertyRepository;

    }

    @PostMapping("/create")
    public ResponseEntity<?> createRequest(@RequestBody TravelRequestDTO requestDTO) {
        try {
            String result = travelRequestService.createTravelRequest(requestDTO);
            return ResponseEntity.ok(result);
        } catch (IllegalArgumentException | SecurityException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @GetMapping("/pending")
    @Transactional
    public ResponseEntity<List<PropertyRequestDTO>> getPendingRequestProperties() {
        List<TravelRequest> requests = travelRequestService.getPendingRequests();

        // Инициализация LAZY полей (если нужна)
        for (TravelRequest request : requests) {
            request.getProperty().getId();
            request.getTraveler().getId();
        }

        List<PropertyRequestDTO> propertyRequestDTOs = requests.stream()
                .map(PropertyRequestDTO::new)  // теперь передаём весь request
                .collect(Collectors.toList());

        return ResponseEntity.ok(propertyRequestDTOs);
    }


    @PutMapping("/status")
    public ResponseEntity<?> updateStatus(@RequestBody Map<String, String> body) {
        try {
            Long requestId = Long.parseLong(body.get("requestId"));
            String statusString = body.get("newStatus");
            Long managerId = Long.parseLong(body.get("managerId"));

            if (statusString == null) {
                return ResponseEntity.badRequest().body("Поле newStatus не должно быть null");
            }

            RequestStatus newStatus = RequestStatus.valueOf(statusString.toUpperCase());
            String result = travelRequestService.updateRequestStatus(requestId, newStatus, managerId);
            return ResponseEntity.ok(result);

        } catch (IllegalArgumentException | NullPointerException e) {
            return ResponseEntity.badRequest().body("Ошибка: " + e.getMessage());
        }
    }


    @GetMapping("/non-pending/manager/{managerId}")
    @Transactional
    public ResponseEntity<List<PropertyRequestDTO>> getNonPendingRequestsByManager(@PathVariable Long managerId) {
        List<TravelRequest> requests = travelRequestService.getNonPendingRequestsByManager(managerId);

        // Предзагрузка LAZY связей
        for (TravelRequest request : requests) {
            request.getProperty().getId();
            request.getTraveler().getId();
        }

        List<PropertyRequestDTO> dtos = requests.stream()
                .map(PropertyRequestDTO::new)
                .collect(Collectors.toList());

        return ResponseEntity.ok(dtos);
    }
    @GetMapping("/{id}/status")
    public ResponseEntity<?> getStatusById(@PathVariable Long id) {
        try {
            RequestStatus status = travelRequestService.getStatusById(id);
            return ResponseEntity.ok(status.name());
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }


}
