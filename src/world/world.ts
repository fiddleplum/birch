import { FastList } from '../internal';
import { Engine } from '../internal';
import { Render } from '../render/index';
import { Entity, EventQueue } from './internal';

export class World {
	/** Constructor. */
	constructor(engine: Engine) {
		// Set the engine that contains this.
		this._engine = engine;

		// Create the render scene.
		this._scene = this.engine.renderer.scenes.create();
	}

	/** Destroys this. */
	destroy(): void {
		this.engine.renderer.scenes.destroy(this._scene);
	}

	/** Gets the engine that contains this. */
	get engine(): Engine {
		return this._engine;
	}

	/** Gets the scene. */
	get scene(): Render.Scene {
		return this._scene;
	}

	/** Gets the event queue. */
	get eventQueue(): EventQueue {
		return this._eventQueue;
	}

	/** Adds a new entity. */
	createEntity(): Entity {
		const entity = new Entity(this);
		this._entities.add(entity);
		return entity;
	}

	/** Removes an entity. */
	destroyEntity(entity: Entity): boolean {
		return this._entities.remove(entity);
	}

	/** The list of entities this contains. */
	private _entities: FastList<Entity> = new FastList();

	/** The render scene for the world. */
	private _scene: Render.Scene;

	private _eventQueue: EventQueue = new EventQueue();

	/** The engine that contains this. */
	private _engine: Engine;
}
