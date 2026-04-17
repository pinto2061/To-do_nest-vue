/**
 * ========================================================================
 * SERVICIO: TasksService (Lógica de negocio de Tareas)
 * ========================================================================
 *
 * ¿Qué es un Service en NestJS?
 * Es la capa donde vive la LÓGICA DE NEGOCIO. El Controller recibe
 * la petición HTTP y delega el trabajo pesado al Service.
 *
 * ¿Por qué separar Controller y Service?
 * - El Controller solo se encarga de recibir/responder peticiones HTTP.
 * - El Service se encarga de interactuar con la base de datos.
 * - Esto permite reutilizar la lógica en otros contextos (ej: otro controller,
 *   un cron job, un WebSocket, etc.) sin duplicar código.
 *
 * Flujo de una petición:
 *   Cliente → Controller → Service → Repository (TypeORM) → Base de Datos
 *
 * El decorador @Injectable() indica que esta clase puede ser INYECTADA
 * en otros componentes usando el sistema de inyección de dependencias
 * de NestJS. Esto se hace a través del constructor.
 */
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Task, TaskStatus } from './entities/task.entity';
import { CreateTaskDto } from './dto/create-task.dto';

@Injectable()
export class TasksService {
  /**
   * Constructor - Inyección de dependencias
   *
   * @InjectRepository(Task) le dice a NestJS que inyecte el
   * Repository de TypeORM para la entidad Task. Este repository
   * ya viene con métodos listos para usar:
   * - .create()    → Crea una instancia (NO la guarda en DB)
   * - .save()      → Guarda/actualiza en la DB
   * - .find()      → Busca todos los registros
   * - .findOneBy() → Busca un registro por condición
   * - .delete()    → Elimina un registro por ID
   *
   * "private readonly" hace que taskRepository sea accesible
   * solo dentro de esta clase y no se pueda reasignar.
   */
  constructor(
    @InjectRepository(Task)
    private readonly taskRepository: Repository<Task>,
  ) {}

  /**
   * CREAR una nueva tarea
   *
   * Paso 1: .create() crea un objeto Task en memoria a partir del DTO.
   *         NO toca la base de datos todavía.
   *         Ejemplo: { nombre: "Estudiar", descripcion: "..." }
   *         Se convierte en: Task { nombre: "Estudiar", descripcion: "...", estado: "pendiente" }
   *
   * Paso 2: .save() inserta el objeto en la base de datos y devuelve
   *         el registro completo con el id y fechas generados.
   *
   * @param createTaskDto - Datos enviados por el cliente (nombre y descripcion)
   * @returns La tarea recién creada con todos sus campos (incluido id, estado, fechas)
   */
  async create(createTaskDto: CreateTaskDto): Promise<Task> {
    const task = this.taskRepository.create(createTaskDto);
    return await this.taskRepository.save(task);
  }

  /**
   * LISTAR todas las tareas
   *
   * .find() sin parámetros equivale a: SELECT * FROM task;
   * Devuelve un array con todas las tareas de la base de datos.
   *
   * @returns Array con todas las tareas existentes
   */
  async findAll(): Promise<Task[]> {
    return await this.taskRepository.find();
  }

  /**
   * BUSCAR una tarea por su ID
   *
   * .findOneBy({ id }) busca un registro cuyo campo "id" coincida.
   * Si no encuentra nada, devuelve null.
   *
   * En caso de no encontrar la tarea, lanzamos NotFoundException
   * que automáticamente devuelve un error HTTP 404 al cliente:
   * { "statusCode": 404, "message": "Tarea con ID xxx no encontrada" }
   *
   * Este método también es reutilizado internamente por updateStatus()
   * para verificar que la tarea existe antes de actualizarla.
   *
   * @param id - UUID de la tarea a buscar
   * @returns La tarea encontrada
   * @throws NotFoundException si no existe la tarea
   */
  async findOne(id: string): Promise<Task> {
    const task = await this.taskRepository.findOneBy({ id });
    if (!task) throw new NotFoundException(`Tarea con ID ${id} no encontrada`);
    return task;
  }

  /**
   * ACTUALIZAR el estado de una tarea
   *
   * Paso 1: Busca la tarea usando findOne() (lanza 404 si no existe).
   * Paso 2: Cambia el campo "estado" al nuevo valor recibido.
   * Paso 3: .save() detecta que el objeto YA tiene un id, así que
   *         ejecuta un UPDATE en vez de un INSERT.
   *         También actualiza automáticamente la columna "actualizado".
   *
   * @param id - UUID de la tarea a actualizar
   * @param nuevoEstado - Nuevo estado: 'hecho' o 'pendiente'
   * @returns La tarea actualizada con la nueva fecha de "actualizado"
   * @throws NotFoundException si no existe la tarea
   */
  async updateStatus(id: string, nuevoEstado: TaskStatus): Promise<Task> {
    const task = await this.findOne(id);
    task.estado = nuevoEstado;
    return await this.taskRepository.save(task);
  }

  /**
   * ELIMINAR una tarea
   *
   * .delete(id) ejecuta: DELETE FROM task WHERE id = 'xxx';
   * Devuelve un objeto con la propiedad "affected" que indica
   * cuántas filas fueron eliminadas.
   *
   * Si affected === 0, significa que no existía una tarea con ese ID,
   * así que lanzamos NotFoundException (HTTP 404).
   *
   * @param id - UUID de la tarea a eliminar
   * @throws NotFoundException si no existe la tarea
   */
  async remove(id: string): Promise<void> {
    const result = await this.taskRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Tarea con ID ${id} no encontrada`);
    }
  }
}