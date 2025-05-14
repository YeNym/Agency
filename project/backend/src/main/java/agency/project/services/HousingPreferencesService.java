package agency.project.services;

import agency.project.dto.HousingPreferencesDTO;
import agency.project.entity.HousingPreferences;

import agency.project.entity.Client;
//import agency.project.entity.HousingPreferences;
import agency.project.entity.User;
import agency.project.repository.*;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.security.access.AccessDeniedException;

import java.util.List;

@Service
//@RequiredArgsConstructor
public class HousingPreferencesService {

    private final HousingPreferencesRepository preferencesRepository;
    private final ClientRepository clientRepository;

    public HousingPreferencesService(HousingPreferencesRepository preferencesRepository,
                                 ClientRepository clientRepository) {
        this.preferencesRepository = preferencesRepository;
        this.clientRepository = clientRepository;
    }


    public HousingPreferences createPreferences(HousingPreferencesDTO dto) {
        // Проверяем, есть ли clientId в DTO
        if (dto.getClientId() == null) {
            throw new IllegalArgumentException("Client ID обязателен");
        }

        // Получаем клиента из базы
        Client client = clientRepository.findById(dto.getClientId())
                .orElseThrow(() -> new EntityNotFoundException("Клиент не найден"));

        // Создаем и заполняем сущность предпочтений
        HousingPreferences preferences = new HousingPreferences();
        preferences.setClient(client);
        preferences.setMinArea(dto.getMinArea());
        preferences.setMaxArea(dto.getMaxArea());
        preferences.setMinPrice(dto.getMinPrice());
        preferences.setMaxPrice(dto.getMaxPrice());
        preferences.setRoomsCount(dto.getRoomsCount());
        preferences.setHasBalcony(dto.getHasBalcony());
        preferences.setAllowPets(dto.getAllowPets());
        preferences.setAdditionalNotes(dto.getAdditionalNotes());
        preferences.setCity(dto.getCity());
        preferences.setDistrict(dto.getDistrict());
        preferences.setStreet(dto.getStreet());

        return preferencesRepository.save(preferences);
    }

    public HousingPreferences updatePreferences(Long prefId, HousingPreferencesDTO dto, User currentUser) {
        HousingPreferences existing = preferencesRepository.findById(prefId)
                .orElseThrow(() -> new EntityNotFoundException("Предпочтения не найдены"));

        // Проверка прав (если нужно: принадлежит ли клиенту и т.д.)
        if (!existing.getClient().getId().equals(dto.getClientId())) {
            throw new AccessDeniedException("Вы не можете изменить эти предпочтения");
        }

        // Обновляем поля
        existing.setMinArea(dto.getMinArea());
        existing.setMaxArea(dto.getMaxArea());
        existing.setMinPrice(dto.getMinPrice());
        existing.setMaxPrice(dto.getMaxPrice());
        existing.setRoomsCount(dto.getRoomsCount());
        existing.setHasBalcony(dto.getHasBalcony());
        existing.setAllowPets(dto.getAllowPets());
        existing.setAdditionalNotes(dto.getAdditionalNotes());
        existing.setCity(dto.getCity());
        existing.setDistrict(dto.getDistrict());
        existing.setStreet(dto.getStreet());

        return preferencesRepository.save(existing);
    }





    public List<HousingPreferences> getClientPreferences(Long clientId) {
        return preferencesRepository.findByClientId(clientId);
    }

    public void deletePreferences(Long prefId, User currentUser) {
        HousingPreferences preferences = preferencesRepository.findById(prefId)
                .orElseThrow(() -> new RuntimeException("Preferences not found"));
        checkAccess(preferences.getClient(), currentUser);
        preferencesRepository.delete(preferences);
    }


    private Client findClientById(Long id) {
        return clientRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Client not found"));
    }

    private void checkAccess(Client client, User currentUser) {
        if (!client.getAuthUser().getId().equals(currentUser.getId())) {
            throw new AccessDeniedException("Access denied");
        }
    }

    private HousingPreferences mapDtoToEntity(HousingPreferencesDTO dto) {
        HousingPreferences preferences = new HousingPreferences();
        updateEntityFromDto(preferences, dto);
        return preferences;
    }

    private void updateEntityFromDto(HousingPreferences entity, HousingPreferencesDTO dto) {
        entity.setMinArea(dto.getMinArea());
        entity.setMaxArea(dto.getMaxArea());
        entity.setMinPrice(dto.getMinPrice());
        entity.setMaxPrice(dto.getMaxPrice());
        entity.setRoomsCount(dto.getRoomsCount());
        entity.setHasBalcony(dto.getHasBalcony());
        entity.setAllowPets(dto.getAllowPets());
        entity.setAdditionalNotes(dto.getAdditionalNotes());
        entity.setCity(dto.getCity());
        entity.setDistrict(dto.getDistrict());
        entity.setStreet(dto.getStreet());
    }
}
