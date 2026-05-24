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

    @Column(nullable = false)
    private LocalDate date;

    @Column(nullable = false)
    private LocalTime heureDebut;

    @Column(nullable = false)
    private LocalTime heureFin;

    @ManyToOne
    @JoinColumn(name = "enseignant_id", nullable = false)
    private User enseignant;

    @ManyToOne
    @JoinColumn(name = "salle_id", nullable = false)
    private Salle salle;

    @ManyToOne(cascade = CascadeType.ALL)
    @JoinColumn(name = "seance_id", nullable = false)
    private Seance seance;

    @Enumerated(EnumType.STRING)
    private EStatus status = EStatus.PENDING;
}
