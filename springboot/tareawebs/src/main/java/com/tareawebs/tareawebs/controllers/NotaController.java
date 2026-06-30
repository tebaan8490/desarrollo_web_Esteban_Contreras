package com.tareawebs.tareawebs.controllers;

import org.springframework.web.bind.annotation.*;

import com.tareawebs.tareawebs.entities.Actividad;
import com.tareawebs.tareawebs.entities.Nota;
import com.tareawebs.tareawebs.repositories.ActividadRepository;
import com.tareawebs.tareawebs.services.NotaService;

@RestController
public class NotaController {

    private final NotaService notaService;
    private final ActividadRepository actividadRepository;

    public NotaController(NotaService notaService,
                          ActividadRepository actividadRepository) {

        this.notaService = notaService;
        this.actividadRepository = actividadRepository;
    }

    @PostMapping("/api/notas")
    public void guardarNota(
        @RequestParam Integer actividadId,
        @RequestParam Integer nota
    ) {

        Actividad actividad = actividadRepository
                .findById(actividadId)
                .orElseThrow();

        Nota newNota = new Nota();

        newNota.setActividad(actividad);
        newNota.setNota(nota);

        notaService.guardar(newNota);

    }

    @GetMapping("/api/notas/promedio")
    public Double obtenerPromedio(@RequestParam Integer actividadId) {
        return notaService.obtenerPromedio(actividadId);
    }
}