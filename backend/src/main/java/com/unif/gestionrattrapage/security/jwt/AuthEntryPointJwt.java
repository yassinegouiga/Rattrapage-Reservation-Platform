package com.unif.gestionrattrapage.security.jwt;

import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.web.AuthenticationEntryPoint;
import org.springframework.stereotype.Component;

import java.io.IOException;

@Component
public class AuthEntryPointJwt implements AuthenticationEntryPoint {

    // Cette méthode est déclenchée chaque fois qu'un utilisateur non authentifié essaie d'accéder à une ressource protégée.
    @Override
    public void commence(HttpServletRequest request, HttpServletResponse response,
                         AuthenticationException authException) throws IOException, ServletException {
        // Renvoie une erreur 401 (Non Autorisé) au frontend
        response.sendError(HttpServletResponse.SC_UNAUTHORIZED, "Erreur: Non Autorisé - Vous devez vous connecter !");
    }
}
