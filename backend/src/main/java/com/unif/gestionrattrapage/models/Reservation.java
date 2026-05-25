package com.unif.gestionrattrapage.models;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.time.LocalTime;

@Entity
@Table(name = "reservations")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Reservation {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, name = "date_res")
    private LocalDate dateRes;

    @Column(nullable = false)
    private LocalTime heureDebut;

    @Column(nullable = false)
    private LocalTime heureFin;

    @Column(nullable = false)
    private String motif;

    @ManyToOne
    @JoinColumn(name = "id_user", nullable = false)
    private User enseignant;

    @ManyToOne
    @JoinColumn(name = "id_salle", nullable = false)
    private Salle salle;
}
