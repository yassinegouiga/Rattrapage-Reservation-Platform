package com.unif.gestionrattrapage.repositories;

import com.unif.gestionrattrapage.models.Reservation;
import com.unif.gestionrattrapage.models.Salle;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;

@Repository
public interface ReservationRepository extends JpaRepository<Reservation, Long> {
    
    List<Reservation> findByDateRes(LocalDate dateRes);
    
    List<Reservation> findByEnseignantId(Long enseignantId);

    // Requête cruciale : Vérifier si une salle est déjà occupée sur un créneau donné
    @Query("SELECT COUNT(r) > 0 FROM Reservation r WHERE r.salle.id = :salleId " +
           "AND r.dateRes = :dateRes " +
           "AND r.heureDebut < :heureFin " +
           "AND r.heureFin > :heureDebut")
    boolean existsConflict(@Param("salleId") Long salleId, 
                           @Param("dateRes") LocalDate dateRes, 
                           @Param("heureDebut") LocalTime heureDebut, 
                           @Param("heureFin") LocalTime heureFin);

    @Query("SELECT COUNT(r) > 0 FROM Reservation r WHERE r.salle.id = :salleId " +
           "AND r.dateRes = :dateRes " +
           "AND r.heureDebut < :heureFin " +
           "AND r.heureFin > :heureDebut " +
           "AND r.id != :reservationId")
    boolean existsConflictForUpdate(@Param("salleId") Long salleId, 
                           @Param("dateRes") LocalDate dateRes, 
                           @Param("heureDebut") LocalTime heureDebut, 
                           @Param("heureFin") LocalTime heureFin,
                           @Param("reservationId") Long reservationId);

    @Query("SELECT r FROM Reservation r WHERE " +
           "(:salleId IS NULL OR r.salle.id = :salleId) AND " +
           "(:dateRes IS NULL OR r.dateRes = :dateRes) AND " +
           "(:enseignantId IS NULL OR r.enseignant.id = :enseignantId)")
    List<Reservation> searchReservations(@Param("salleId") Long salleId,
                                         @Param("dateRes") LocalDate dateRes,
                                         @Param("enseignantId") Long enseignantId);
}
