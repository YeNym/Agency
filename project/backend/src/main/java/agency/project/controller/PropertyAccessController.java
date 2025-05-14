package agency.project.controller;

import agency.project.dto.GrantAccessRequest;
import agency.project.entity.ClientPropertyAccess;
import agency.project.entity.Manager;
import agency.project.entity.Property;
import agency.project.entity.User;
import agency.project.services.impl.AuthenticationServiceImpl;
import agency.project.services.PropertyAccessService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/property-access")
//@RequiredArgsConstructor
public class PropertyAccessController {
    private final PropertyAccessService accessService;
    private final AuthenticationServiceImpl authenticationService;

    public PropertyAccessController(PropertyAccessService accessService,
                                    AuthenticationServiceImpl authenticationService) {
        this.accessService = accessService;
        this.authenticationService = authenticationService;
    }


    //предоставление доступа клиенту к квартире
    @PostMapping
    public ResponseEntity<ClientPropertyAccess> grantAccess(
            @RequestBody GrantAccessRequest request,
            @AuthenticationPrincipal User currentUser) {

            //todo вернуть проверку на роль перед выполнением запроса
            // Manager manager = authenticationService.getAuthenticatedManager(currentUser);

        Long managerId = 152L; // ID тестового менеджера или null
        ClientPropertyAccess access = accessService.grantAccess(
//                manager.getId(),
                managerId,
                request.getClientId(),
                request.getPropertyId()
        );

        return ResponseEntity.ok(access);
    }

    @DeleteMapping("/{accessId}")
    public ResponseEntity<Void> revokeAccess(
            @PathVariable Long accessId,
            @AuthenticationPrincipal User currentUser) {

        authenticationService.getAuthenticatedManager(currentUser);
        accessService.revokeAccess(accessId);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/client/{clientId}")
    public ResponseEntity<List<Property>> getClientAccessibleProperties(
            @PathVariable Long clientId,
            @AuthenticationPrincipal User currentUser) {

        authenticationService.getAuthenticatedManager(currentUser);
        List<Property> properties = accessService.getAccessibleProperties(clientId);
        return ResponseEntity.ok(properties);
    }
}