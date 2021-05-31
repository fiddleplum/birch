import { Engine, EventSource } from '../../internal';
import { Entity } from '../internal';

/** The base component from which all other components are subclassed. */
export class Component extends EventSource {
	/** Constructs the component. */
	constructor(entity: Entity) {
		super();

		// Set the entity that contains this.
		this._entity = entity;
	}

	/** Destroys the component. */
	override destroy(): void {
		super.destroy();
	}

	/** Gets the entity that contains this. */
	get entity(): Entity {
		return this._entity;
	}

	/** Gets the engine as a shortcut. */
	get engine(): Engine {
		return this._entity.world.engine;
	}

	/** The entity that contains this. */
	private _entity: Entity;
}
