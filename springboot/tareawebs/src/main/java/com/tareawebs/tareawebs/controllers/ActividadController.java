package com.tareawebs.tareawebs.controllers;

import java.util.List;
import com.tareawebs.tareawebs.entities.Actividad;
import com.tareawebs.tareawebs.services.ActividadService;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.RestController;


@RestController
public class ActividadController {

    private final ActividadService actividadService;

    public ActividadController(ActividadService actividadService) {
        this.actividadService = actividadService;
    }

    @GetMapping("/api/actividades")
    public List<Actividad> obtenerActividades(
            @RequestParam(required = false) String buscar) {

        return actividadService.buscar(buscar);

    }

}