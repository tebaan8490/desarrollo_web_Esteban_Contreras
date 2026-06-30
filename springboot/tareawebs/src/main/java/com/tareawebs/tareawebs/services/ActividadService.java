package com.tareawebs.tareawebs.services;

import java.util.List;
import org.springframework.stereotype.Service;
import com.tareawebs.tareawebs.entities.Actividad;
import com.tareawebs.tareawebs.repositories.ActividadRepository;

@Service
public class ActividadService {
    private final ActividadRepository actividadRepository;
    
    public ActividadService(ActividadRepository actividadRepository) {
        this.actividadRepository = actividadRepository;
    }

    public List<Actividad> obtenerTodas() {
        return actividadRepository.findAll();
    }

     public List<Actividad> buscar(String texto) {
        if (texto == null || texto.isBlank() || texto.strip().length() < 3) {
            return List.of();
        }

        return actividadRepository.buscar(texto);
    }
}
