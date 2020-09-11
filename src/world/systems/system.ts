import { EventSink } from '../../internal';
import { Component, World } from '../internal';

/** The base class for all systems. */
export abstract class System extends EventSink {
	constructor(world: World) {
		super();

		// Set the world.
		this._world = world;
	}

	/** Destroys the system. */
	destroy(): void {
		super.destroy();
	}

	/** Gets the world. */
	get world(): World {
		return this._world;
	}

	/** An update function that does something every frame. */
	update(): void {
	}

	/** Gets the monitored component types. */
	getMonitoredComponentTypes(): (typeof Component)[] {
		return this._monitoredComponentTypes;
	}

	/** Monitor the given component types.
	 *  The system will receive Entity.ComponentCreated events events after this call. */
	protected monitorComponentTypes(componentTypes: (typeof Component)[]): void {
		this._monitoredComponentTypes = [];
		for (const componentType of componentTypes) {
			this._monitoredComponentTypes.push(componentType);
		}
	}

	/** The world. */
	private _world: World;

	/** The list of monitored component types. */
	private _monitoredComponentTypes: (typeof Component)[] = [];
}
