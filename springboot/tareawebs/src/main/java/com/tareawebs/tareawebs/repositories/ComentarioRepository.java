package com.tareawebs.tareawebs.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import com.tareawebs.tareawebs.entities.Comentario;

public interface ComentarioRepository extends JpaRepository<Comentario, Integer> {

}