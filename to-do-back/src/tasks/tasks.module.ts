/**
 * ========================================================================
 * MÓDULO: TasksModule (Módulo de Tareas)
 * ========================================================================
 *
 * ¿Qué es un Module en NestJS?
 * Es la unidad organizativa principal. Agrupa componentes relacionados
 * (controllers, services, entities) en un solo paquete reutilizable.
 *
 * Piensa en un módulo como una "caja" que contiene todo lo necesario
 * para que una funcionalidad completa opere:
 *
 *   TasksModule
 *   ├── Entity:     Task           → Define la tabla en la DB
 *   ├── Controller: TasksController → Define las rutas HTTP
 *   └── Service:    TasksService    → Contiene la lógica de negocio
 *
 * Propiedades del decorador @Module():
 * - imports:      Otros módulos que este módulo necesita.
 *                 TypeOrmModule.forFeature([Task]) registra el Repository
 *                 de Task para que pueda ser inyectado en el Service.
 * - controllers:  Los controllers que pertenecen a este módulo.
 * - providers:    Los services (y otros providers) de este módulo.
 * - exports:      (Opcional) Services que otros módulos pueden usar.
 *
 * Este módulo se importa en AppModule para que NestJS lo cargue
 * al iniciar la aplicación.
 */
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TasksService } from './tasks.service';
import { TasksController } from './tasks.controller';
import { Task } from './entities/task.entity';

@Module({
  /**
   * TypeOrmModule.forFeature([Task])
   * Registra la entidad Task dentro de este módulo, lo que permite
   * que el TasksService pueda usar @InjectRepository(Task) para
   * obtener el Repository y hacer operaciones en la base de datos.
   *
   * Sin esta línea, NestJS lanzaría un error:
   * "Nest can't resolve dependencies of TasksService"
   */
  imports: [TypeOrmModule.forFeature([Task])],

  /** Controllers que manejan las rutas HTTP de este módulo */
  controllers: [TasksController],

  /** Services/Providers que contienen la lógica de negocio */
  providers: [TasksService],
})
export class TasksModule {}