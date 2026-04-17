import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';

export enum TaskStatus {
  HECHO = 'hecho',
  PENDIENTE = 'pendiente',
}

@Entity() // Esto indica que es una tabla
export class Task {
  @PrimaryGeneratedColumn('uuid') // Genera IDs automáticos (UUID)
  id: string;

  @Column()
  nombre: string;

  @Column({ type: 'text', nullable: true })
  descripcion: string;

  @Column({
    type: 'enum',
    enum: TaskStatus,
    default: TaskStatus.PENDIENTE,
  })
  estado: TaskStatus;

  @CreateDateColumn() // Se llena sola al insertar
  creado: Date;

  @UpdateDateColumn() // Se actualiza sola al modificar
  actualizado: Date;
}