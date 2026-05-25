package com.unif.gestionrattrapage.services;

import com.unif.gestionrattrapage.models.User;
import com.unif.gestionrattrapage.repositories.UserRepository;
import lombok.RequiredArgsConstructor;
import com.unif.gestionrattrapage.models.ERole;
import com.unif.gestionrattrapage.models.Role;
import com.unif.gestionrattrapage.payload.request.SignupRequest;
import com.unif.gestionrattrapage.repositories.RoleRepository;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.util.HashSet;
import java.util.Set;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class UserService {
    private final UserRepository userRepository;
    private final RoleRepository roleRepository;
    private final PasswordEncoder passwordEncoder;

    public List<User> getAllUsers() {
        return userRepository.findAll();
    }

    public User getUserById(Long id) {
        return userRepository.findById(id).orElseThrow(() -> new RuntimeException("Utilisateur non trouvé"));
    }

    public User createUser(SignupRequest request) {
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new RuntimeException("Erreur: L'email est déjà pris !");
        }

        User user = new User();
        user.setNomComplet(request.getNomComplet());
        user.setEmail(request.getEmail());
        user.setPassword(passwordEncoder.encode(request.getPassword()));

        Set<String> strRoles = request.getRoles();
        Set<Role> roles = new HashSet<>();

        if (strRoles == null || strRoles.isEmpty()) {
            // Par défaut, donner le rôle ENSEIGNANT
            Role userRole = roleRepository.findByName(ERole.ROLE_ENSEIGNANT)
                    .orElseThrow(() -> new RuntimeException("Erreur: Rôle ENSEIGNANT non trouvé."));
            roles.add(userRole);
        } else {
            strRoles.forEach(role -> {
                if (role.equals("ROLE_ADMIN") || role.equals("admin")) {
                    Role adminRole = roleRepository.findByName(ERole.ROLE_ADMIN)
                            .orElseThrow(() -> new RuntimeException("Erreur: Rôle ADMIN non trouvé."));
                    roles.add(adminRole);
                } else {
                    Role userRole = roleRepository.findByName(ERole.ROLE_ENSEIGNANT)
                            .orElseThrow(() -> new RuntimeException("Erreur: Rôle ENSEIGNANT non trouvé."));
                    roles.add(userRole);
                }
            });
        }

        user.setRoles(roles);
        return userRepository.save(user);
    }

    public User updateUser(Long id, User updatedUser) {
        User existing = getUserById(id);
        
        // Update email if changed and not taken
        if (!existing.getEmail().equals(updatedUser.getEmail())) {
            if (userRepository.existsByEmail(updatedUser.getEmail())) {
                throw new RuntimeException("Erreur: L'email est déjà pris !");
            }
            existing.setEmail(updatedUser.getEmail());
        }
        
        existing.setNomComplet(updatedUser.getNomComplet());
        // Update password if provided
        if (updatedUser.getPassword() != null && !updatedUser.getPassword().isEmpty()) {
            existing.setPassword(passwordEncoder.encode(updatedUser.getPassword()));
        }

        existing.setRoles(updatedUser.getRoles());
        return userRepository.save(existing);
    }

    public void deleteUser(Long id) {
        userRepository.deleteById(id);
    }
}
