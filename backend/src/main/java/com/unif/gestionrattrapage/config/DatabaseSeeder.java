package com.unif.gestionrattrapage.config;

import com.unif.gestionrattrapage.models.ERole;
import com.unif.gestionrattrapage.models.Role;
import com.unif.gestionrattrapage.repositories.RoleRepository;
import com.unif.gestionrattrapage.models.User;
import com.unif.gestionrattrapage.repositories.UserRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.util.HashSet;
import java.util.Set;

@Component
public class DatabaseSeeder implements CommandLineRunner {

    private final RoleRepository roleRepository;
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public DatabaseSeeder(RoleRepository roleRepository, UserRepository userRepository, PasswordEncoder passwordEncoder) {
        this.roleRepository = roleRepository;
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    public void run(String... args) throws Exception {
        if (!roleRepository.findByName(ERole.ROLE_ENSEIGNANT).isPresent()) {
            Role r1 = new Role();
            r1.setName(ERole.ROLE_ENSEIGNANT);
            roleRepository.save(r1);
        }
        if (!roleRepository.findByName(ERole.ROLE_ADMIN).isPresent()) {
            Role r2 = new Role();
            r2.setName(ERole.ROLE_ADMIN);
            roleRepository.save(r2);
        }

        // Création d'un administrateur par défaut si aucun n'existe
        if (!userRepository.existsByEmail("admin@universite.edu")) {
            User admin = new User();
            admin.setNomComplet("Administrateur Principal");
            admin.setEmail("admin@universite.edu");
            admin.setPassword(passwordEncoder.encode("password123"));
            
            Set<Role> roles = new HashSet<>();
            Role adminRole = roleRepository.findByName(ERole.ROLE_ADMIN)
                    .orElseThrow(() -> new RuntimeException("Erreur: Role non trouvé."));
            roles.add(adminRole);
            
            admin.setRoles(roles);
            userRepository.save(admin);
            System.out.println("Compte admin par défaut créé ! (Email: admin@universite.edu / MDP: password123)");
        }
    }
}
