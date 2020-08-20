import { Engine } from '../internal';
import { Render } from '../render/index';
import { Entity, EventQueue } from './internal';
import { Collection } from '../utils/collection';

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

	/** Gets the entities. */
	get entities(): Collection<Entity> {
		return this._entities;
	}

	/** The entities. */
	private _entities: Collection<Entity> = new Collection(() => {
		return new Entity(this);
	}, () => {
	});

	/** The render scene for the world. */
	private _scene: Render.Scene;

	private _eventQueue: EventQueue = new EventQueue();

	/** The engine that contains this. */
	private _engine: Engine;
}
