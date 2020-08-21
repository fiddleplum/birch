import { Engine } from '../internal';
import { Render } from '../render/index';
import { Entity, EventQueue, System, FrameModelSystem } from './internal';
import { Collection } from '../utils/collection';
import { CollectionTyped } from '../utils/collection_typed';

export class World {
	/** Constructor. */
	constructor(engine: Engine) {
		// Set the engine that contains this.
		this._engine = engine;

		// Create the render scene.
		this._scene = this.engine.renderer.scenes.create();

		// Add a frame model system.
		this._systems.create(FrameModelSystem, 'frameModel');
	}

	/** Destroys this. */
	destroy(): void {
		this.engine.renderer.scenes.destroy(this._scene);
		for (const entry of this._entities) {
			entry.key.destroy();
		}
	}

	/** Updates the world. Called once per frame. */
	update(): void {
		for (const entry of this._systems) {
			const system = entry.key;
			system.processEventsInQueue();
		}
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

	/** Gets the systems. */
	get systems(): CollectionTyped<System> {
		return this._systems;
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

	/** The systems. */
	private _systems = new CollectionTyped<System>((type: { new (world: World): System }) => {
		return new type(this);
	}, (system: System) => {
		system.destroy();
	});
}
