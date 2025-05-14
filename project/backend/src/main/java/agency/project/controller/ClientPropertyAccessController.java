package agency.project.controller;

import agency.project.entity.ClientPropertyAccess;
import agency.project.entity.Property;
import agency.project.repository.ClientPropertyAccessRepository;
import agency.project.service.ClientPropertyAccessService;
import agency.project.services.PropertyService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("api/access")
public class ClientPropertyAccessController {

    private final ClientPropertyAccessService accessService;
    private final PropertyService propertyService;
    private final ClientPropertyAccessRepository accessRepository;

    public ClientPropertyAccessController(ClientPropertyAccessService accessService, PropertyService propertyService, ClientPropertyAccessRepository accessRepository)  {
        this.accessService = accessService;
        this.propertyService = propertyService;
        this.accessRepository = accessRepository;
    }

    @PostMapping("/grant")
    public ResponseEntity<ClientPropertyAccess> grantAccess(
            @RequestParam Long managerId,
            @RequestParam Long clientId,
            @RequestParam Long propertyId
    ) {
        ClientPropertyAccess access = accessService.grantAccess(managerId, clientId, propertyId);
        return ResponseEntity.ok(access);
    }

    @GetMapping("/check")
    public ResponseEntity<Boolean> checkAccess(
            @RequestParam Long clientId,
            @RequestParam Long propertyId
    ) {
        boolean hasAccess = accessService.hasAccess(clientId, propertyId);
        return ResponseEntity.ok(hasAccess);
    }

    @GetMapping("/client-properties")
    public ResponseEntity<List<Property>> getClientProperties(@RequestParam Long clientId) {
        List<ClientPropertyAccess> accesses = accessService.getAccessListByClientId(clientId);

        List<Long> accessIds = accesses.stream()
                .map(ClientPropertyAccess::getId)
                .collect(Collectors.toList());

        List<Property> properties = accessRepository.findPropertiesByAccessIds(accessIds);

        return ResponseEntity.ok(properties);
    }

}
