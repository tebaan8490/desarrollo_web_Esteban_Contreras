-- Script para poblar la base de datos tarea2
USE `tarea2`;

-- 1. Insertar Miembros (Publicadores)
INSERT INTO miembro (`id`, `nombre_usuario`, `nombre_persona`, `email`, `telefono`, `rut`, `rol`, `fecha_registro`, `comuna_id`, `region_id`, `contrasena`) VALUES 
(1, 'alopez', 'Ana Lopez', 'ana.lopez@ug.uchile.cl', '555-123-4567', '25.876.543-0', 'estudiante', '2023-06-18 18:45:30', 10301, 1, 'Pas123'),
(2, 'mgonzaloez', 'Maria Gonzalez', 'maria.gonzalez@ug.uchile.cl', '987-654-3210', '21.554.332-k', 'estudiante', '2024-04-30 09:00:00', 10302, 1, 'PAS123'),
(3, 'cperez', 'Carlos Perez', 'carlos.perez@ug.uchile.cl', '555-987-6543', '20.123.456-7', 'estudiante', '2022-08-14 14:20:10', 10303, 1, 'Password123'),
(4, 'lmartinez', 'Luis Martinez', 'luis.martinez@ug.uchile.cl', '123-123-5678', '12.456.789-k', 'docente', '2024-03-15 10:30:00', 10305, 1, 'Aa123'),
(5, 'erodriguez', 'Elena Rodriguez', 'elena.rodriguez@ug.uchile.cl', '111-123-1234', '15.342.108-6', 'funcionario', '2024-04-02 09:15:00', 10305, 1, 'Bb123'),
(6, 'jfernandez', 'Jorge Fernandez', 'jorge.fernandez@ug.uchile.cl', '666-123-4321', '18.990.432-1', 'funcionario', '2024-05-10 14:45:00', 10305, 1, 'Cc123');

-- 2. Insertar Actividades
INSERT INTO actividad (`id`, `miembro_id`, `dia`, `hora_inicio`, `duracion`, `tipo`, `lugar`, `nombre_actividad`, `descripcion`) VALUES 
(1, 1, 'lunes', '18:00', '02:00', 'tecnologia', 'B201','Club de Programacion', 'Unete al club de programacion para aprender y compartir tus conocimientos con otros estudiantes del DCC.'),
(2, 2, 'miercoles', '17:00', '02:00', 'deporte', 'Cancha deportiva 850','Club de Futbol', 'Participa en el club de futbol para mantenerte activo y disfrutar de este deporte con tus compañeros del DCC.'),
(3, 3, 'viernes', '16:00', '02:00', 'arte', '-3, 851','Club de Teatro', 'Explora tu creatividad y habilidades de actuación uniéndote al club de teatro del DCC, donde podras participar en diversas producciones y talleres.');

-- 3. Insertar Fotos
INSERT INTO foto (`ruta_archivo`, `nombre_archivo`, `actividad_id`) VALUES 
('../static/uploads/', 'Adobe_Express-file.jpg', 1),
('../static/uploads/', 'Adobe_Express-file(1).jpg', 2),
('../static/uploads/', 'Adobe_Express-file(2).jpg', 3);