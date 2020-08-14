import { List } from '../internal';
import { Engine } from '../internal';
import { Render } from '../render/index';
import { Entity, EventQueue } from './internal';

export class World {
	/** Constructor. */
	constructor(engine: Engine) {
		// Set the engine that contains this.
		this._engine = engine;

		// Create the render scene and set the uniforms function.
		this._scene = this.engine.renderer.createScene();
		// this._scene.uniformsFunction = this._sceneUniforms.bind(this);
	}

	/** Destroys this. */
	destroy(): void {
		this.engine.renderer.destroyScene(this._scene);
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

	// private _sceneUniforms(shader: Render.Shader): void {
	// }

	/** The list of entities this contains. */
	private _entities: List<Entity> = new List();

	private _scene: Render.Scene;

	private _eventQueue: EventQueue = new EventQueue();

	/** The engine that contains this. */
	private _engine: Engine;
}
