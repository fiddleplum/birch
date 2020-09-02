import { Engine, Entity, EventQueue, UniqueId } from '../../internal';

/** The base component in the Component-Entity-System framework from which all other components are subclassed. */
export abstract class Component extends UniqueId.Object {
	/** Constructs the component. */
	constructor(entity: Entity) {
		super();

		// Set the entity that contains this.
		this._entity = entity;

		// Set the event queue.
		this._eventQueue = entity.world.engine.eventQueue;
	}

	/** Destroys the component. */
	destroy(): void {
	}

	/** Gets the engine as a shortcut. */
	get engine(): Engine {
		return this._entity.world.engine;
	}

	/** Gets the entity that contains this. */
	get entity(): Entity {
		return this._entity;
	}

	/** Gets the event queue. */
	protected get eventQueue(): EventQueue {
		return this._eventQueue;
	}

	/** The entity that contains this. */
	private _entity: Entity;

	/** The event queue. */
	private _eventQueue: EventQueue;
}
