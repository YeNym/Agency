package agency.project.controller;

import agency.project.dto.PropertyUpdateDTO;
import agency.project.dto.filter.PropertyFilter;
import agency.project.entity.Client;
import agency.project.entity.Manager;
import agency.project.entity.Property;
import agency.project.entity.User;
import agency.project.entity.enumerated.*;
import agency.project.services.*;
import agency.project.services.filter_services.PropertyQueryService;
import com.fasterxml.jackson.databind.ObjectMapper;
import jakarta.persistence.EntityNotFoundException;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import org.springframework.http.ResponseEntity;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.math.BigDecimal;
import java.util.Arrays;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/properties")
//@RequiredArgsConstructor
public class PropertyController {
    private final PropertyService propertyService;
    private ManagerService managerService;
    private final PropertyQueryService propertyQueryService;
    private final ClientService clientService;
    private final ImageService imageService;

    public PropertyController(PropertyService propertyService,
                              ManagerService managerService,
                              PropertyQueryService propertyQueryService,
                              ClientService clientService,ImageService imageService) {
        this.propertyService = propertyService;
        this.propertyQueryService = propertyQueryService;
        this.managerService = managerService;
        this.clientService = clientService;
        this.imageService = imageService;

    }

    @GetMapping
    public List<Property> getAllProperties() {
        return propertyService.getAllProperties();
    }

    @GetMapping("/{id}")
    public ResponseEntity<Property> getPropertyById(@PathVariable Long id) {
        return propertyService.getPropertyById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }



//    @PostMapping
//    public Property createProperty(@RequestBody Property property,
//                                   @AuthenticationPrincipal User authUser) {
//        Manager manager = managerService.getManagerByUserId(authUser.getId());
//
//        property.setCreatedByManager(manager);
//        Client owner = clientService.getById(property.getOwner().getId());
//        property.setOwner(owner);
//        return propertyService.save(property);
//    }

    @PostMapping
    public ResponseEntity<Property> createProperty(
            @RequestParam("file") MultipartFile[] files,
            @RequestParam("propertyData") String propertyDataJson,
            @AuthenticationPrincipal User authUser) {

        try {
            ObjectMapper mapper = new ObjectMapper();
            Property property = mapper.readValue(propertyDataJson, Property.class);

            Manager manager = managerService.getManagerByUserId(authUser.getId());
            property.setCreatedByManager(manager);
            Client owner = clientService.getById(property.getOwner().getId());
            property.setOwner(owner);

            // Сохраняем каждое изображение и добавляем путь в property
            for (MultipartFile file : files) {
                String savedFileName = imageService.saveImage(file);
                property.addImagePath(savedFileName);
            }

            Property savedProperty = propertyService.save(property);

            return ResponseEntity.ok(savedProperty);

        } catch (IOException e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null);
        }
    }



    @PostMapping("/upload-image")
    public ResponseEntity<String> uploadImage(@RequestParam("file") MultipartFile file) {
        try {
            String savedFileName = imageService.saveImage(file);
            return ResponseEntity.ok(savedFileName);
        } catch (IOException e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Ошибка при сохранении файла");
        }
    }


//    @GetMapping("/images/{filename:.+}")
//    public ResponseEntity<Resource> getImage(@PathVariable String filename) {
//        Path filePath = Paths.get(uploadPath).resolve(filename);
//        try {
//            Resource resource = new UrlResource(filePath.toUri());
//            return ResponseEntity.ok()
//                    .contentType(MediaType.IMAGE_JPEG)
//                    .body(resource);
//        } catch (MalformedURLException e) {
//            return ResponseEntity.notFound().build();
//        }
//    }


    @GetMapping("/find-by-managers/{managerId}")
    public ResponseEntity<List<Property>> getPropertiesByManagerId(@PathVariable Long managerId) {
        List<Property> properties = propertyService.getPropertiesByManagerId(managerId);
        return ResponseEntity.ok(properties);
    }
    @GetMapping("/enums")
    public Map<String, String[]> getPropertyEnums() {
        return Map.of(
                "propertyTypes", Arrays.stream(PropertyType.values()).map(Enum::name).toArray(String[]::new),
                "propertyLevels", Arrays.stream(PropertyLevel.values()).map(Enum::name).toArray(String[]::new),
                "statuses", Arrays.stream(Status.values()).map(Enum::name).toArray(String[]::new),
                "requestStatuses", Arrays.stream(RequestStatus.values()).map(Enum::name).toArray(String[]::new),
                "accessLevel", Arrays.stream(AccessLevel.values()).map(Enum::name).toArray(String[]::new)

        );
    }

    @PutMapping("/{id}")
    public ResponseEntity<Property> updateProperty(
            @PathVariable Long id,
            @RequestBody PropertyUpdateDTO propertyUpdateDTO) {

        try {
            Property updatedProperty = propertyService.updateProperty(id, propertyUpdateDTO);
            return ResponseEntity.ok(updatedProperty);
        } catch (EntityNotFoundException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteProperty(@PathVariable Long id) {
        propertyService.deleteProperty(id);
        return ResponseEntity.ok().build();
    }

    @GetMapping("/search")
    public ResponseEntity<List<Property>> searchProperties(
            @RequestParam(required = false) String city,
            @RequestParam(required = false) Integer minRooms,
            @RequestParam(required = false) Integer maxRooms,
            @RequestParam(required = false) BigDecimal minPrice,
            @RequestParam(required = false) BigDecimal maxPrice,
            @RequestParam(required = false) PropertyType propertyType,
            @RequestParam(required = false) PropertyLevel propertyLevel,
            @RequestParam(required = false) Status status) {

        PropertyFilter filter = new PropertyFilter(
                city, minRooms, maxRooms, minPrice, maxPrice,
                propertyType, propertyLevel, status);

        List<Property> result = propertyQueryService.findWithFilters(filter);
        return ResponseEntity.ok(result);
    }
    @GetMapping("/travel")
    public List<Property> getTravelProperties() {
        return propertyService.getTravelProperties();
    }
}