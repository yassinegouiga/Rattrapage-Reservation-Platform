package com.unif.gestionrattrapage.repositories;

import com.unif.gestionrattrapage.models.Seance;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface SeanceRepository extends JpaRepository<Seance, Long> {
}
