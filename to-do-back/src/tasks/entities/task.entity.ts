/**
 * ========================================================================
 * ENTIDAD: Task (Tarea)
 * ========================================================================
 *
 * Este archivo define la entidad "Task" que representa la tabla "task"
 * en la base de datos PostgreSQL. TypeORM usa esta clase como modelo
 * para mapear los registros de la tabla a objetos de TypeScript.
 *
 * Cada propiedad decorada con @Column() se convierte en una columna
 * de la tabla. Los decoradores especiales como @PrimaryGeneratedColumn,
 * @CreateDateColumn y @UpdateDateColumn añaden comportamiento automático.
 *
 * Tabla resultante en la DB:
 * ┌──────────────┬──────────┬───────────────────────────────────┐
 * │ Columna      │ Tipo     │ Descripción                       │
 * ├──────────────┼──────────┼───────────────────────────────────┤
 * │ id           │ UUID     │ Identificador único (auto-gen.)   │
 * │ nombre       │ VARCHAR  │ Nombre de la tarea                │
 * │ descripcion  │ TEXT     │ Descripción (puede ser null)      │
 * │ estado       │ ENUM     │ 'pendiente' o 'hecho'             │
 * │ creado       │ TIMESTAMP│ Fecha de creación (auto-gen.)     │
 * │ actualizado  │ TIMESTAMP│ Última actualización (auto-gen.)  │
 * └──────────────┴──────────┴───────────────────────────────────┘
 */
import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';

/**
 * Enum TaskStatus
 * Define los posibles estados de una tarea.
 * - PENDIENTE: la tarea aún no ha sido completada (valor por defecto).
 * - HECHO: la tarea fue marcada como completada.
 */
export enum TaskStatus {
  HECHO = 'hecho',
  PENDIENTE = 'pendiente',
}

/**
 * Clase Task
 *
 * El decorador @Entity() le dice a TypeORM que esta clase representa
 * una tabla en la base de datos. Si no se pasa un nombre, TypeORM
 * usa el nombre de la clase en minúsculas ("task") como nombre de tabla.
 */
@Entity()
export class Task {
  /**
   * Columna "id" - Clave primaria
   * @PrimaryGeneratedColumn('uuid') genera automáticamente un UUID v4
   * cada vez que se inserta un nuevo registro. Ejemplo: "a1b2c3d4-..."
   */
  @PrimaryGeneratedColumn('uuid')
  id: string;

  /**
   * Columna "nombre" - Nombre/título de la tarea
   * Es un campo obligatorio (NOT NULL por defecto en TypeORM).
   */
  @Column()
  nombre: string;

  /**
   * Columna "descripcion" - Detalle opcional de la tarea
   * - type: 'text' → permite textos largos (sin límite de caracteres).
   * - nullable: true → permite que el campo sea NULL en la DB.
   */
  @Column({ type: 'text', nullable: true })
  descripcion: string;

  /**
   * Columna "estado" - Estado actual de la tarea
   * - type: 'enum' → usa un tipo ENUM de PostgreSQL.
   * - enum: TaskStatus → los valores válidos son 'hecho' y 'pendiente'.
   * - default: TaskStatus.PENDIENTE → si no se envía estado, será 'pendiente'.
   */
  @Column({
    type: 'enum',
    enum: TaskStatus,
    default: TaskStatus.PENDIENTE,
  })
  estado: TaskStatus;

  /**
   * Columna "creado" - Fecha de creación
   * @CreateDateColumn() hace que TypeORM inserte automáticamente
   * la fecha/hora actual cuando se crea un nuevo registro.
   * NO necesitas asignar este valor manualmente.
   */
  @CreateDateColumn()
  creado: Date;

  /**
   * Columna "actualizado" - Fecha de última modificación
   * @UpdateDateColumn() hace que TypeORM actualice automáticamente
   * la fecha/hora cada vez que se modifica el registro con .save().
   * NO necesitas asignar este valor manualmente.
   */
  @UpdateDateColumn()
  actualizado: Date;
}