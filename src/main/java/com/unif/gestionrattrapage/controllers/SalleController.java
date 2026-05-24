package com.unif.gestionrattrapage.controllers;

import com.unif.gestionrattrapage.models.Salle;
import com.unif.gestionrattrapage.services.SalleService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/salles")
@RequiredArgsConstructor
@CrossOrigin(origins = "*") // Permet à React d'appeler l'API
public class SalleController {
    private final SalleService salleService;

    @GetMapping
    public List<Salle> getAllSalles() {
        return salleService.getAllSalles();
    }

    @GetMapping("/{id}")
    public ResponseEntity<Salle> getSalleById(@PathVariable Long id) {
        return ResponseEntity.ok(salleService.getSalleById(id));
    }

    @PostMapping
    public Salle createSalle(@RequestBody Salle salle) {
        return salleService.saveSalle(salle);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteSalle(@PathVariable Long id) {
        salleService.deleteSalle(id);
        return ResponseEntity.ok().build();
    }
}
