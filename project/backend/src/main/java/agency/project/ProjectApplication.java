package agency.project;

import agency.project.entity.User;
import agency.project.entity.enumerated.Role;
import agency.project.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
//import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;

@SpringBootApplication
//@RequiredArgsConstructor
public class ProjectApplication implements CommandLineRunner {

	private final UserRepository userRepository;

	public ProjectApplication(UserRepository userRepository) {
		this.userRepository = userRepository;
	}

	public static void main(String[] args) {
		// Запуск Spring Boot приложения
		SpringApplication.run(ProjectApplication.class, args);
	}

	@Override
	public void run(String... args) {
		// Создание тестового пользователя (если нужно)

		User adminAccount = userRepository.findByRole(Role.ADMIN);
		if(null == adminAccount) {
			User user = new User();
			user.setEmail("admin@gmail.com");
			user.setFirstname("admin");
			user.setLastname("admin");
			user.setRole(Role.ADMIN);
			user.setPassword(new BCryptPasswordEncoder().encode("admin"));
			userRepository.save(user);
		}

		System.out.println("Приложение запущено! Доступные эндпоинты:");
		System.out.println("GET  /api/user/all_user_find");
		System.out.println("PUT  /api/user/update_user");
		System.out.println("DELETE /api/user/delete_user/{email}");
	}
}
//	public static void main(String[] args) {
//		SpringApplication.run(ProjectApplication.class, args);
//	}
//
//	@Override
//	public void run(String... args) throws Exception {
//		User adminAccount = userRepository.findByRole(Role.ADMIN);
//		if(null == adminAccount) {
//			User user = new User();
//			user.setEmail("admin@gmail.com");
//			user.setFirstname("admin");
//			user.setLastname("admin");
//			user.setRole(Role.ADMIN);
//			user.setPassword(new BCryptPasswordEncoder().encode("admin"));
//			userRepository.save(user);
//		}
//	}
//}
