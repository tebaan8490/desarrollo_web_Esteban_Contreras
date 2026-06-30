package com.tareawebs.tareawebs.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.tareawebs.tareawebs.entities.Nota;

public interface NotaRepository extends JpaRepository<Nota, Integer> {

    @Query("""
        SELECT AVG(n.nota)
        FROM Nota n
        WHERE n.actividad.id = :actividadId
    """)
    Double obtenerPromedio(@Param("actividadId") Integer actividadId);
}