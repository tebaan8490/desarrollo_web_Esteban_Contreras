package com.tareawebs.tareawebs.repositories;

import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import com.tareawebs.tareawebs.entities.Actividad;

public interface ActividadRepository extends JpaRepository<Actividad, Integer> {

    @Query("""
        SELECT a from Actividad a
        WHERE LOWER(a.nombreActividad) LIKE LOWER(CONCAT('%', :texto, '%'))
        OR LOWER(a.descripcion) LIKE LOWER(CONCAT('%', :texto, '%'))
        OR LOWER(a.miembro.comuna.nombreComuna) LIKE LOWER(CONCAT('%', :texto, '%'))
    """)
    List<Actividad> buscar(@Param("texto") String texto);
}