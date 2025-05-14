package agency.project.services;

import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Service;

import java.util.Map;

public interface JWTService {

    String extractUsername(String token);
    String generateToken(UserDetails userDetails);
    boolean isTokenValid(String token,UserDetails userDetails);
    String generateRefreshToken(Map<String,Object> extractClaims, UserDetails userDetails);
}
