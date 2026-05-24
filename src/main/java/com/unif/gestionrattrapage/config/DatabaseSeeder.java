package com.unif.gestionrattrapage.config;

import com.unif.gestionrattrapage.models.ERole;
import com.unif.gestionrattrapage.models.Role;
import com.unif.gestionrattrapage.repositories.RoleRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

@Component
public class DatabaseSeeder implements CommandLineRunner {

    private final RoleRepository roleRepository;

    public DatabaseSeeder(RoleRepository roleRepository) {
        this.roleRepository = roleRepository;
    }

    @Override
    public void run(String... args) throws Exception {
        if (!roleRepository.findByName(ERole.ROLE_ENSEIGNANT).isPresent()) {
            roleRepository.save(new Role(null, ERole.ROLE_ENSEIGNANT));
        }
        if (!roleRepository.findByName(ERole.ROLE_ADMIN).isPresent()) {
            roleRepository.save(new Role(null, ERole.ROLE_ADMIN));
        }
    }
}
