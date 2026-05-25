package com.unif.gestionrattrapage.security.jwt;

import com.unif.gestionrattrapage.security.services.UserDetailsServiceImpl;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.util.StringUtils;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;

public class AuthTokenFilter extends OncePerRequestFilter {
    @Autowired
    private JwtUtils jwtUtils;

    @Autowired
    private UserDetailsServiceImpl userDetailsService;

    // Cette méthode est appelée à CHAQUE requête HTTP (GET, POST, etc.)
    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain)
            throws ServletException, IOException {
        try {
            // 1. Récupérer le token depuis l'en-tête (Header) "Authorization: Bearer <token>"
            String jwt = parseJwt(request);

            // 2. Si on a trouvé un token et qu'il est valide
            if (jwt != null && jwtUtils.validateJwtToken(jwt)) {
                // 3. Extraire l'email (qui est notre nom d'utilisateur) depuis le token
                String email = jwtUtils.getUserNameFromJwtToken(jwt);

                // 4. Charger l'utilisateur depuis la base de données
                UserDetails userDetails = userDetailsService.loadUserByUsername(email);
                
                // 5. Créer un objet d'authentification Spring
                UsernamePasswordAuthenticationToken authentication =
                        new UsernamePasswordAuthenticationToken(
                                userDetails,
                                null,
                                userDetails.getAuthorities());
                authentication.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));

                // 6. Dire à Spring Security "C'est bon, cet utilisateur est connecté !"
                SecurityContextHolder.getContext().setAuthentication(authentication);
            }
        } catch (Exception e) {
            System.err.println("Impossible d'authentifier l'utilisateur: " + e);
        }

        // Continuer la chaîne (passer au contrôleur ou au prochain filtre)
        filterChain.doFilter(request, response);
    }

    private String parseJwt(HttpServletRequest request) {
        String headerAuth = request.getHeader("Authorization");

        // Vérifier si l'en-tête existe et commence par "Bearer "
        if (StringUtils.hasText(headerAuth) && headerAuth.startsWith("Bearer ")) {
            return headerAuth.substring(7);
        }

        return null;
    }
}
