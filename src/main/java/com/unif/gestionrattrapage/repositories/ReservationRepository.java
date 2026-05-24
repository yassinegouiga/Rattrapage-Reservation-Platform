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
    
    List<Reservation> findByDate(LocalDate date);
    
    List<Reservation> findByEnseignantId(Long enseignantId);

    // Requête cruciale : Vérifier si une salle est déjà occupée sur un créneau donné
    @Query("SELECT COUNT(r) > 0 FROM Reservation r WHERE r.salle.id = :salleId " +
           "AND r.date = :date " +
           "AND r.heureDebut < :heureFin " +
           "AND r.heureFin > :heureDebut")
    boolean existsConflict(@Param("salleId") Long salleId, 
                           @Param("date") LocalDate date, 
                           @Param("heureDebut") LocalTime heureDebut, 
                           @Param("heureFin") LocalTime heureFin);
}
