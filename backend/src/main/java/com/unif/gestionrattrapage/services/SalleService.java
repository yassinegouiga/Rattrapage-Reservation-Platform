package com.unif.gestionrattrapage.services;

import com.unif.gestionrattrapage.models.Salle;
import com.unif.gestionrattrapage.repositories.SalleRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class SalleService {
    private final SalleRepository salleRepository;

    public List<Salle> getAllSalles() {
        return salleRepository.findAll();
    }

    public Salle saveSalle(Salle salle) {
        return salleRepository.save(salle);
    }

    public void deleteSalle(Long id) {
        salleRepository.deleteById(id);
    }

    public Salle getSalleById(Long id) {
        return salleRepository.findById(id).orElseThrow(() -> new RuntimeException("Salle non trouvée"));
    }

    public Salle updateSalle(Long id, Salle updatedSalle) {
        Salle existing = getSalleById(id);
        existing.setNom(updatedSalle.getNom());
        existing.setCapacite(updatedSalle.getCapacite());
        existing.setEquipements(updatedSalle.getEquipements());
        return salleRepository.save(existing);
    }
}
