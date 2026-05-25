package com.unif.gestionrattrapage.models;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "salles")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Salle {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true)
    private String nom;

    private int capacite;

    private String equipements;

    @Column(columnDefinition = "boolean default true")
    private boolean estDisponible = true;

    @OneToMany(mappedBy = "salle")
    @com.fasterxml.jackson.annotation.JsonIgnore
    private java.util.List<Reservation> reservations;
}
