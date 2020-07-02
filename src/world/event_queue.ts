import { System } from './systems/system';
import { OrderedSet } from '../utils/ordered_set';
import { Component } from './components/component';

/** The event queue. Passes events on to registered systems. */
export class EventQueue {
	/** Adds an event. */
	addEvent(component: Component, type: symbol): void {
		const systems = this._eventListeners.get(type);
		if (systems === undefined) {
			return;
		}
		for (const system of systems) {
			system.addEvent(component, type);
		}
	}

	/** Adds an event listener. */
	addEventListener(system: System, eventType: symbol): void {
		let systems = this._eventListeners.get(eventType);
		if (systems === undefined) {
			systems = new OrderedSet();
			this._eventListeners.set(eventType, systems);
		}
		systems.add(system);
	}

	/** Removes an event listener. Returns true if it existed. */
	removeEventListener(system: System, eventType: symbol): boolean {
		const systems = this._eventListeners.get(eventType);
		if (systems === undefined) {
			return false;
		}
		const existed = systems.remove(system);
		if (existed && systems.isEmpty()) {
			this._eventListeners.delete(eventType);
		}
		return existed;
	}

	/** The event listeners. */
	private _eventListeners: Map<symbol, OrderedSet<System>> = new Map();
}

export namespace EventQueue {
	/** An event. */
	export class Event {
		/** The component associated with the event. */
		component: Component | undefined = undefined;

		/** The type of event. */
		type: symbol = Symbol();
	}
}
