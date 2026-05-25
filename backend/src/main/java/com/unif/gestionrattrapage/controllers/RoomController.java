package com.unif.gestionrattrapage.controllers;

import com.unif.gestionrattrapage.models.Salle;
import com.unif.gestionrattrapage.services.SalleService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/rooms")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class RoomController {
    private final SalleService salleService;

    @GetMapping
    public List<Salle> getAllRooms() {
        return salleService.getAllSalles();
    }

    @GetMapping("/{id}")
    public ResponseEntity<Salle> getRoomById(@PathVariable Long id) {
        return ResponseEntity.ok(salleService.getSalleById(id));
    }

    @PostMapping
    @PreAuthorize("hasRole('ADMIN')") // Seulement Admin
    public Salle createRoom(@RequestBody Salle salle) {
        return salleService.saveSalle(salle);
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')") // Seulement Admin
    public ResponseEntity<?> updateRoom(@PathVariable Long id, @RequestBody Salle salle) {
        try {
            Salle updated = salleService.updateSalle(id, salle);
            return ResponseEntity.ok(updated);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')") // Seulement Admin
    public ResponseEntity<?> deleteRoom(@PathVariable Long id) {
        salleService.deleteSalle(id);
        return ResponseEntity.ok().build();
    }
}
