package com.tareawebs.tareawebs.services;

import java.util.List;
import org.springframework.stereotype.Service;
import com.tareawebs.tareawebs.repositories.NotaRepository;
import com.tareawebs.tareawebs.repositories.ActividadRepository;
import com.tareawebs.tareawebs.entities.Nota;
import com.tareawebs.tareawebs.entities.Actividad;

@Service
public class NotaService {

    private final NotaRepository notaRepository;
    private final ActividadRepository actividadRepository;

    public NotaService(NotaRepository notaRepository, ActividadRepository actividadRepository) {
        this.notaRepository = notaRepository;
        this.actividadRepository = actividadRepository;
    }

    public Nota guardar(Nota nota) {
         if (nota.getNota() < 1 || nota.getNota() > 7) {
            throw new IllegalArgumentException("La nota debe estar entre 1 y 7.");
        }

        Actividad actividad = actividadRepository
                .findById(nota.getActividad().getId())
                .orElseThrow(() ->
                    new IllegalArgumentException("Actividad inexistente.")
                );

        Nota nuevaNota = new Nota();

        nuevaNota.setActividad(actividad);
        nuevaNota.setNota(nota.getNota());

        return notaRepository.save(nuevaNota);
    }

    public Double obtenerPromedio(Integer actividadId) {
        Double promedio = notaRepository.obtenerPromedio(actividadId);
        if (promedio == null) {
            return 0.0;
        }

        return promedio;
    }
}