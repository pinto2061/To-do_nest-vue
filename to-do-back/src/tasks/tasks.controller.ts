/**
 * ========================================================================
 * CONTROLADOR: TasksController (Endpoints HTTP de Tareas)
 * ========================================================================
 *
 * ¿Qué es un Controller en NestJS?
 * Es la capa que RECIBE las peticiones HTTP del cliente y devuelve
 * respuestas. Cada método del controller es un endpoint (ruta).
 *
 * El decorador @Controller('tareas') define el prefijo de la ruta.
 * Todas las rutas dentro de este controller empiezan con /tareas.
 *
 * Endpoints disponibles:
 * ┌────────┬─────────────────────┬──────────────────────────────────┐
 * │ Método │ Ruta                │ Descripción                      │
 * ├────────┼─────────────────────┼──────────────────────────────────┤
 * │ POST   │ /tareas             │ Crear una nueva tarea            │
 * │ GET    │ /tareas             │ Listar todas las tareas          │
 * │ GET    │ /tareas/:id         │ Obtener una tarea por su ID      │
 * │ PATCH  │ /tareas/:id/estado  │ Cambiar el estado de una tarea   │
 * │ DELETE │ /tareas/:id         │ Eliminar una tarea               │
 * └────────┴─────────────────────┴──────────────────────────────────┘
 *
 * Flujo de una petición:
 *   Cliente HTTP (Postman/Bruno/Frontend)
 *     → Controller (recibe la petición)
 *       → Service (ejecuta la lógica)
 *         → Repository/TypeORM (interactúa con la DB)
 *           → PostgreSQL (base de datos)
 */
import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { TasksService } from './tasks.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { TaskStatus } from './entities/task.entity';

/**
 * @Controller('tareas')
 * Define que todas las rutas de este controller empiezan con /tareas.
 * NestJS automáticamente registra este controller porque está declarado
 * en el array "controllers" de TasksModule.
 */
@Controller('tareas')
export class TasksController {
  /**
   * Constructor - Inyección de dependencias
   *
   * NestJS inyecta automáticamente una instancia de TasksService aquí.
   * "private readonly" hace que sea accesible como this.tasksService
   * dentro de cualquier método de esta clase.
   */
  constructor(private readonly tasksService: TasksService) {}

  /**
   * POST /tareas - Crear una nueva tarea
   *
   * @Body() extrae automáticamente el cuerpo (body) de la petición HTTP
   * y lo convierte en un objeto CreateTaskDto.
   *
   * Ejemplo de body esperado:
   * {
   *   "nombre": "Estudiar NestJS",
   *   "descripcion": "Completar el tutorial de TypeORM"
   * }
   *
   * Respuesta: La tarea creada con su id, estado, y fechas generados.
   *
   * @param createTaskDto - Datos de la nueva tarea (nombre, descripcion)
   * @returns La tarea recién creada
   */
  @Post()
  create(@Body() createTaskDto: CreateTaskDto) {
    return this.tasksService.create(createTaskDto);
  }

  /**
   * GET /tareas - Listar todas las tareas
   *
   * No recibe parámetros. Devuelve un array JSON con todas
   * las tareas almacenadas en la base de datos.
   *
   * @returns Array de tareas
   */
  @Get()
  findAll() {
    return this.tasksService.findAll();
  }

  /**
   * GET /tareas/:id - Obtener una tarea específica
   *
   * @Param('id') extrae el parámetro ":id" de la URL.
   * Ejemplo: GET /tareas/a1b2c3d4-e5f6-... → id = "a1b2c3d4-e5f6-..."
   *
   * Si la tarea no existe, devuelve HTTP 404 automáticamente
   * (gracias al NotFoundException del service).
   *
   * @param id - UUID de la tarea (viene de la URL)
   * @returns La tarea encontrada
   */
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.tasksService.findOne(id);
  }

  /**
   * PATCH /tareas/:id/estado - Actualizar el estado de una tarea
   *
   * Usa PATCH (no PUT) porque solo actualiza UN campo parcialmente.
   * La ruta incluye "/estado" para dejar claro que solo modifica el estado.
   *
   * @Param('id') extrae el ID de la URL.
   * @Body('estado') extrae SOLO el campo "estado" del body.
   *   (A diferencia de @Body() sin argumento que extrae TODO el body)
   *
   * Ejemplo de body esperado:
   * {
   *   "estado": "hecho"
   * }
   *
   * Valores válidos para estado: "hecho" | "pendiente"
   *
   * @param id - UUID de la tarea
   * @param estado - Nuevo estado de la tarea
   * @returns La tarea actualizada
   */
  @Patch(':id/estado')
  updateStatus(
    @Param('id') id: string,
    @Body('estado') estado: TaskStatus
  ) {
    return this.tasksService.updateStatus(id, estado);
  }

  /**
   * DELETE /tareas/:id - Eliminar una tarea
   *
   * Elimina permanentemente la tarea de la base de datos.
   * Si la tarea no existe, devuelve HTTP 404.
   * Si se elimina exitosamente, devuelve HTTP 200 (sin body).
   *
   * @param id - UUID de la tarea a eliminar
   */
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.tasksService.remove(id);
  }
}