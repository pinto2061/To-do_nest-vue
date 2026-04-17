/**
 * ========================================================================
 * DTO: UpdateTaskDto (Data Transfer Object para actualizar tareas)
 * ========================================================================
 *
 * Este DTO extiende de CreateTaskDto usando PartialType().
 *
 * ¿Qué hace PartialType()?
 * Toma TODAS las propiedades de CreateTaskDto (nombre, descripcion)
 * y las convierte en OPCIONALES. Es decir, al actualizar no es
 * obligatorio enviar todos los campos, solo los que quieras cambiar.
 *
 * Equivale a escribir manualmente:
 *   export class UpdateTaskDto {
 *     nombre?: string;       // <- opcional
 *     descripcion?: string;  // <- opcional
 *   }
 *
 * Nota: Actualmente este DTO NO se usa en el controller porque
 * la actualización solo cambia el "estado" (ver PATCH /:id/estado).
 * Sin embargo, se mantiene por si en el futuro se quiere permitir
 * actualizar el nombre o la descripción de una tarea.
 */
import { PartialType } from '@nestjs/mapped-types';
import { CreateTaskDto } from './create-task.dto';

export class UpdateTaskDto extends PartialType(CreateTaskDto) {}
