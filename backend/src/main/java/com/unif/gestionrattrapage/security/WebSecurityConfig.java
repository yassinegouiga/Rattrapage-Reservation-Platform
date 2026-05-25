package com.unif.gestionrattrapage.security;

import com.unif.gestionrattrapage.security.jwt.AuthEntryPointJwt;
import com.unif.gestionrattrapage.security.jwt.AuthTokenFilter;
import com.unif.gestionrattrapage.security.services.UserDetailsServiceImpl;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.dao.DaoAuthenticationProvider;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

@Configuration
@EnableMethodSecurity // Permet d'utiliser @PreAuthorize dans nos contrôleurs
public class WebSecurityConfig {

    @Autowired
    UserDetailsServiceImpl userDetailsService;

    @Autowired
    private AuthEntryPointJwt unauthorizedHandler;

    @Bean
    public AuthTokenFilter authenticationJwtTokenFilter() {
        return new AuthTokenFilter();
    }

    // Fournisseur d'authentification : fait le lien entre la base de données et Spring Security
    @Bean
    public DaoAuthenticationProvider authenticationProvider() {
        DaoAuthenticationProvider authProvider = new DaoAuthenticationProvider();
        
        authProvider.setUserDetailsService(userDetailsService);
        authProvider.setPasswordEncoder(passwordEncoder()); // Utilise BCrypt
        
        return authProvider;
    }

    // Gestionnaire d'authentification (utilisé dans AuthController)
    @Bean
    public AuthenticationManager authenticationManager(AuthenticationConfiguration authConfig) throws Exception {
        return authConfig.getAuthenticationManager();
    }

    // Le hacheur de mot de passe (BCrypt)
    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    // La chaîne de filtres principale
    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        // 1. Désactiver CSRF (inutile pour une API REST) et autoriser CORS
        http.csrf(csrf -> csrf.disable())
            .cors(cors -> {})
            // 2. Gérer les erreurs (si pas de token)
            .exceptionHandling(exception -> exception.authenticationEntryPoint(unauthorizedHandler))
            // 3. API Stateless (pas de session stockée sur le serveur, tout est dans le token)
            .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
            // 4. Définir quelles routes sont publiques et lesquelles sont protégées
            .authorizeHttpRequests(auth -> 
                auth.requestMatchers("/api/auth/**").permitAll() // Routes publiques (login)
                    // Toutes les autres requêtes nécessitent une authentification
                    .anyRequest().authenticated()
            );

        // Assigner notre fournisseur d'authentification
        http.authenticationProvider(authenticationProvider());

        // Ajouter notre filtre JWT AVANT le filtre standard de Spring
        http.addFilterBefore(authenticationJwtTokenFilter(), UsernamePasswordAuthenticationFilter.class);
        
        return http.build();
    }
}
