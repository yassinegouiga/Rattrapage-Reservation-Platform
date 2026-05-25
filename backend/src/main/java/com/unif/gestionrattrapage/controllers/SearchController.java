package com.unif.gestionrattrapage.controllers;

import com.unif.gestionrattrapage.models.Reservation;
import com.unif.gestionrattrapage.models.Salle;
import com.unif.gestionrattrapage.repositories.ReservationRepository;
import com.unif.gestionrattrapage.repositories.SalleRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
@PreAuthorize("hasRole('ADMIN') or hasRole('ENSEIGNANT')") // Accessible à tous
public class SearchController {
    
    private final ReservationRepository reservationRepository;
    private final SalleRepository salleRepository;

    @GetMapping("/rooms/available")
    public List<Salle> getAvailableRooms(
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate date,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.TIME) LocalTime heureDebut,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.TIME) LocalTime heureFin) {
        
        List<Salle> allRooms = salleRepository.findAll();
        
        return allRooms.stream().filter(salle -> {
            if (!salle.isEstDisponible()) {
                return false;
            }
            boolean hasConflict = reservationRepository.existsConflict(salle.getId(), date, heureDebut, heureFin);
            return !hasConflict;
        }).collect(Collectors.toList());
    }

    @GetMapping("/reservations/search")
    public List<Reservation> searchReservations(
            @RequestParam(required = false) Long salleId,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate dateRes,
            @RequestParam(required = false) Long enseignantId) {
        
        return reservationRepository.searchReservations(salleId, dateRes, enseignantId);
    }

    @GetMapping("/schedule/daily")
    public List<Reservation> getDailySchedule(
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate date) {
        
        return reservationRepository.findByDateRes(date);
    }
}
