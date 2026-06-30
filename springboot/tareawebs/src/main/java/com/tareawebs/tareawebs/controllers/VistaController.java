package com.tareawebs.tareawebs.controllers;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;

@Controller
public class VistaController {

    @GetMapping("/")
    public String inicio() {
        return "busqueda";
    }

    @GetMapping("/busqueda")
    public String busqueda() {
        return "busqueda";
    }

}