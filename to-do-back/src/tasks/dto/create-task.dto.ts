/**
 * ========================================================================
 * DTO: CreateTaskDto (Data Transfer Object para crear tareas)
 * ========================================================================
 *
 * ¿Qué es un DTO?
 * Un DTO (Data Transfer Object) es un objeto que define la FORMA
 * de los datos que viajan entre el cliente y el servidor.
 * No tiene lógica, solo define qué campos se esperan en el body
 * de la petición HTTP.
 *
 * ¿Por qué usar un DTO en vez de la entidad directamente?
 * 1. Seguridad: Evita que el cliente envíe campos no deseados
 *    (ejemplo: no queremos que el cliente envíe su propio "id").
 * 2. Validación: Se pueden agregar reglas de validación con
 *    class-validator (@IsString(), @IsNotEmpty(), etc.).
 * 3. Separación de responsabilidades: La entidad define la tabla,
 *    el DTO define lo que el cliente puede enviar.
 *
 * Ejemplo de uso (body de un POST /tareas):
 * {
 *   "nombre": "Estudiar NestJS",
 *   "descripcion": "Completar el módulo de TypeORM"
 * }
 *
 * Nota: El campo "estado" NO está aquí porque se asigna automáticamente
 * como "pendiente" en la entidad (valor por defecto).
 */
export class CreateTaskDto {
  /** Nombre o título de la tarea (obligatorio) */
  nombre: string;

  /** Descripción detallada de la tarea (obligatorio en el DTO, nullable en la DB) */
  descripcion: string;
}