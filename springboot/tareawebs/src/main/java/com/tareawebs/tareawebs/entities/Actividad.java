package com.tareawebs.tareawebs.entities;

import java.util.List;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;

@Entity
@Table(name = "actividad")
public class Actividad {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @ManyToOne
    @JoinColumn(name = "miembro_id", nullable = false)
    private Miembro miembro;

    @OneToMany(mappedBy = "actividad")
    private List<Foto> fotos;

    @OneToMany(mappedBy = "actividad")
    private List<Comentario> comentarios;

    @OneToMany(mappedBy = "actividad")
    private List<Nota> notas;

    @Column(name = "dia", nullable = false)
    private String dia;

    @Column(name = "hora_inicio", nullable = false, length = 5)
    private String horaInicio;

    @Column(name = "duracion", nullable = false, length = 5)
    private String duracion;

    @Column(name = "tipo", nullable = false)
    private String tipo;

    @Column(name = "lugar", nullable = false, length = 45)
    private String lugar;

    @Column(name = "nombre_actividad", nullable = false, length = 45)
    private String nombreActividad;

    @Column(name = "descripcion", length = 500)
    private String descripcion;

    public Actividad() {
    }

    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public Miembro getMiembro() {
        return miembro;
    }

    public void setMiembro(Miembro miembro) {
        this.miembro = miembro;
    }

    public String getDia() {
        return dia;
    }

    public void setDia(String dia) {
        this.dia = dia;
    }

    public String getHoraInicio() {
        return horaInicio;
    }

    public void setHoraInicio(String horaInicio) {
        this.horaInicio = horaInicio;
    }

    public String getDuracion() {
        return duracion;
    }

    public void setDuracion(String duracion) {
        this.duracion = duracion;
    }

    public String getTipo() {
        return tipo;
    }

    public void setTipo(String tipo) {
        this.tipo = tipo;
    }

    public String getLugar() {
        return lugar;
    }

    public void setLugar(String lugar) {
        this.lugar = lugar;
    }

    public String getNombreActividad() {
        return nombreActividad;
    }

    public void setNombreActividad(String nombreActividad) {
        this.nombreActividad = nombreActividad;
    }

    public String getDescripcion() {
        return descripcion;
    }

    public void setDescripcion(String descripcion) {
        this.descripcion = descripcion;
    }
}