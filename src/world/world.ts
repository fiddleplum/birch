import { Collection, CollectionTyped, Engine, Render } from '../internal';
import { System, Entity } from './internal';

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
		for (const entry of this._entities) {
			entry.key.destroy();
		}
	}

	/** Updates the world. Called once per frame. */
	update(): void {
		// Update the systems.
		for (const entry of this._systems) {
			const system = entry.key;
			system.update();
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

	/** Gets the entities. */
	get entities(): Collection<Entity> {
		return this._entities;
	}

	/** Gets the systems. */
	get systems(): CollectionTyped<System> {
		return this._systems;
	}

	/** Gets the ith component of the given type. i is zero based and defaults to zero. */
	getEntity(name: string): Entity | undefined {
		return this._entities.get(name);
	}

	/** Gets the ith component of the given type. i is zero based and defaults to zero. */
	getSystem<Type extends System>(typeOrName: { new (world: World): Type } | string, i: number = 0): Type | undefined {
		if (typeof typeOrName === 'string') {
			return this._systems.get(typeOrName) as (Type | undefined);
		}
		else {
			return this._systems.getAllOfType(typeOrName)?.getIndex(i);
		}
	}

	/** The entities. */
	private _entities: Collection<Entity> = new Collection((name: string | undefined) => {
		return new Entity(this, name);
	}, (entity: Entity) => {
		entity.destroy();
	});

	/** The systems. */
	private _systems = new CollectionTyped<System>((type: { new (world: World): System }) => {
		return new type(this);
	}, (system: System) => {
		system.destroy();
	});

	/** The render scene for the world. */
	private _scene: Render.Scene;

	/** The engine that contains this. */
	private _engine: Engine;
}
