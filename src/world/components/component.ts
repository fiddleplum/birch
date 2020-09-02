import { Engine, Entity, System, UniqueId } from '../../internal';

/** The base component in the Component-Entity-System framework from which all other components are subclassed. */
export abstract class Component extends UniqueId.Object {
	/** Constructs the component. */
	constructor(entity: Entity) {
		super();

		// Set the entity that contains this.
		this._entity = entity;
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

	/** Subscribes a system to a component's events. */
	subscribeToEvents(system: System): void {
		this._subscribedSystems.push(system);
	}

	/** Unsubscribes a system from a component's events. */
	unsubscribeFromEvents(system: System): void {
		for (let i = 0, l = this._subscribedSystems.length; i < l; i++) {
			if (this._subscribedSystems[i] === system) {
				this._subscribedSystems.splice(i, 1);
			}
		}
	}

	/** Sends an event to all subscribed systems. */
	protected sendEvent(event: symbol): void {
		for (const system of this._subscribedSystems) {
			system.processEvent(this, event);
		}
	}

	/** The entity that contains this. */
	private _entity: Entity;

	/** Subscribed systems. */
	private _subscribedSystems: System[] = [];
}
