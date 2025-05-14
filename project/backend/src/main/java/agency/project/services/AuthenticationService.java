package agency.project.services;


import agency.project.dto.autorization.JwtAuthenticationResponse;
import agency.project.dto.autorization.RefreshTokenRequest;
import agency.project.dto.autorization.SignUpRequest;
import agency.project.dto.autorization.SigninRequest;
import agency.project.entity.User;

public interface AuthenticationService {
    User signup(SignUpRequest signUpRequest);

    JwtAuthenticationResponse signin(SigninRequest signinRequest);
    JwtAuthenticationResponse refreshToken(RefreshTokenRequest refreshTokenRequest);
}
