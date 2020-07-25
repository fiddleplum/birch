import { Engine, Entity } from '../../internal';
import { EventQueue } from '../event_queue';

export abstract class Component {
	/** Constructs this. */
	constructor(entity: Entity) {
		// Set the entity that contains this.
		this._entity = entity;

		// Set the event queue.
		this._eventQueue = entity.world.eventQueue;
	}

	/** Destroys this. */
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
