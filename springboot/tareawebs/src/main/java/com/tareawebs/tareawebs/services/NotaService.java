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

    public NotaService(NotaRepository notaRepository) {
        this.notaRepository = notaRepository;
    }

    public Nota guardar(Nota nota) {
        return notaRepository.save(nota);
    }

    public Double obtenerPromedio(Integer actividadId) {
        Double promedio = notaRepository.obtenerPromedio(actividadId);
        if (promedio == null) {
            return 0.0;
        }

        return promedio;
    }
}