package agency.project.dto.autorization;

import lombok.Data;

@Data
public class RefreshTokenRequest {

    private String token;
    public RefreshTokenRequest() {}

    public RefreshTokenRequest(String token) {
        this.token = token;
    }

    public String getToken() {
        return token;
    }

    public void setToken(String token) {
        this.token = token;
    }
}
