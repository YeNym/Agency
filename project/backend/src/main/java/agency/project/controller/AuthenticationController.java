package agency.project.controller;


import agency.project.dto.UserRegistrationDto;
import agency.project.dto.autorization.JwtAuthenticationResponse;
import agency.project.dto.autorization.RefreshTokenRequest;
import agency.project.dto.autorization.SignUpRequest;
import agency.project.dto.autorization.SigninRequest;
import agency.project.entity.User;
import agency.project.services.AuthenticationService;
import agency.project.services.UserServiceCreate;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import javax.validation.Valid;

@RestController
@RequestMapping("/api/auth")
@Tag(name = "Auth_Controller")
@CrossOrigin(maxAge = 3600L)
public class AuthenticationController {

    private final AuthenticationService authenticationService;
    private final UserServiceCreate userService;
    public AuthenticationController(AuthenticationService authenticationService,
                                    UserServiceCreate userService) {
        this.authenticationService = authenticationService;
        this.userService = userService;
    }
    @PostMapping("/signin")
    public ResponseEntity<JwtAuthenticationResponse> signin(@RequestBody SigninRequest signinRequest) {
        return ResponseEntity.ok(authenticationService.signin(signinRequest));
    }


    @PostMapping("/refresh")
    public ResponseEntity<JwtAuthenticationResponse> refresh(@RequestBody RefreshTokenRequest refreshTokenRequest) {
        return ResponseEntity.ok(authenticationService.refreshToken(refreshTokenRequest));
    }

    @PostMapping("/register")
    @PreAuthorize("isAuthenticated() and !hasRole('CLIENT')")

    public ResponseEntity<?> registerUser(
            @RequestBody @Valid UserRegistrationDto registrationDto,
            @AuthenticationPrincipal User currentUser) { //@AuthenticationPrincipal автоматически получает данные текущего авторизованного пользователя

        try {
            userService.registerUser(registrationDto, currentUser);
            return ResponseEntity.ok().build();
        } catch (AccessDeniedException e) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body(e.getMessage());
        }
    }
}