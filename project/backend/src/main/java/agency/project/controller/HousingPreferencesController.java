package agency.project.controller;

import agency.project.dto.HousingPreferencesDTO;
import agency.project.entity.HousingPreferences;
import agency.project.entity.User;
import agency.project.services.HousingPreferencesService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/clients/{clientId}/preferences")
//@RequiredArgsConstructor
public class HousingPreferencesController {

    private final HousingPreferencesService preferencesService;

    public  HousingPreferencesController (HousingPreferencesService preferencesService){
        this.preferencesService = preferencesService;
    }

    @GetMapping
    public ResponseEntity<List<HousingPreferences>> getClientPreferences(
            @PathVariable Long clientId) {
        List<HousingPreferences> preferences = preferencesService.getClientPreferences(clientId);
        return ResponseEntity.ok(preferences);
    }


    @PostMapping("/create")
    public ResponseEntity<String> createPreferences(
            @PathVariable Long clientId,
            @RequestBody HousingPreferencesDTO dto) {
        try {
            dto.setClientId(clientId); // Присваиваем clientId в DTO, если не передали из фронта
            HousingPreferences preference = preferencesService.createPreferences(dto);
            return ResponseEntity.ok("Предпочтения успешно сохранены! ID: " + preference.getId());
        } catch (RuntimeException e) {
            return ResponseEntity.status(400).body("Ошибка: " + e.getMessage());
        }
    }

    @PutMapping("/{prefId}")
    public ResponseEntity<HousingPreferences> updatePreferences(
            @PathVariable Long clientId,
            @PathVariable Long prefId,
            @Valid @RequestBody HousingPreferencesDTO dto,
            @AuthenticationPrincipal User currentUser) {
        dto.setClientId(clientId);
        HousingPreferences updated = preferencesService.updatePreferences(prefId, dto, currentUser);
        return ResponseEntity.ok(updated);
    }


    @DeleteMapping("/{prefId}")
    public ResponseEntity<Void> deletePreferences(
            @PathVariable Long clientId,
            @PathVariable Long prefId,
            @AuthenticationPrincipal User currentUser) {

        preferencesService.deletePreferences(prefId, currentUser);
        return ResponseEntity.noContent().build();
    }
}
