package com.unif.gestionrattrapage.services;

import com.unif.gestionrattrapage.models.Reservation;
import com.unif.gestionrattrapage.repositories.ReservationRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class ReservationService {
    private final ReservationRepository reservationRepository;

    public List<Reservation> getAllReservations() {
        return reservationRepository.findAll();
    }

    public Reservation createReservation(Reservation reservation) {
        // Logique de validation des conflits
        boolean hasConflict = reservationRepository.existsConflict(
                reservation.getSalle().getId(),
                reservation.getDateRes(),
                reservation.getHeureDebut(),
                reservation.getHeureFin()
        );

        if (hasConflict) {
            throw new RuntimeException("Conflit détecté : La salle est déjà occupée sur ce créneau !");
        }

        return reservationRepository.save(reservation);
    }

    public void deleteReservation(Long id) {
        reservationRepository.deleteById(id);
    }

    public List<Reservation> getReservationsByTeacher(Long teacherId) {
        return reservationRepository.findByEnseignantId(teacherId);
    }

    public Reservation updateReservation(Long id, Reservation updatedReservation) {
        Reservation existing = reservationRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Réservation non trouvée !"));

        boolean hasConflict = reservationRepository.existsConflictForUpdate(
                updatedReservation.getSalle().getId(),
                updatedReservation.getDateRes(),
                updatedReservation.getHeureDebut(),
                updatedReservation.getHeureFin(),
                id
        );

        if (hasConflict) {
            throw new RuntimeException("Conflit détecté : La salle est déjà occupée sur ce créneau !");
        }

        existing.setDateRes(updatedReservation.getDateRes());
        existing.setHeureDebut(updatedReservation.getHeureDebut());
        existing.setHeureFin(updatedReservation.getHeureFin());
        existing.setMotif(updatedReservation.getMotif());
        existing.setSalle(updatedReservation.getSalle());
        
        return reservationRepository.save(existing);
    }
}
