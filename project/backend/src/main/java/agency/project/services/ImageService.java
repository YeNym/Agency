package agency.project.services;

import agency.project.entity.AppProperties;
import agency.project.entity.Property;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Service
public class ImageService {

//    @Value("${property.upload-dir}")
//    private String uploadDir;
    private final String uploadDir;

    public ImageService(@Value("${app.upload-dir}") String uploadDir) {
        this.uploadDir = uploadDir;
    }
    public String saveImage(MultipartFile file) throws IOException {
        if (file.isEmpty()) {
            throw new IOException("Файл пустой");
        }
        // Создаем папку, если не существует
        Path uploadPath = Paths.get(uploadDir);
        if (!Files.exists(uploadPath)) {
            Files.createDirectories(uploadPath);
        }

        // Генерируем уникальное имя файла
        String originalFilename = file.getOriginalFilename();
        String fileExtension = "";

        if (originalFilename != null && originalFilename.contains(".")) {
            fileExtension = originalFilename.substring(originalFilename.lastIndexOf("."));
        }

        String fileName = UUID.randomUUID().toString() + fileExtension;

        Path filePath = uploadPath.resolve(fileName);

        // Сохраняем файл на диск
        Files.copy(file.getInputStream(), filePath, StandardCopyOption.REPLACE_EXISTING);

        // Возвращаем имя файла или путь относительно uploadDir
        return fileName;
    }
}
