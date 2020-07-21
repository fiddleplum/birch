import { System } from './systems/system';
import { List } from '../utils/list';
import { Component } from './components/component';

/** The event queue. Passes events on to registered systems. */
export class EventQueue {
	/** Adds an event. */
	addEvent(component: Component, type: symbol): void {
		const listeningSystems = this._eventSubscribers.get(type);
		if (listeningSystems === undefined) {
			return;
		}
		for (const system of listeningSystems) {
			system.addEvent(component, type);
		}
	}

	/** Adds an event listener. */
	subscribeToEvent(system: System, eventType: symbol): void {
		let systems = this._eventSubscribers.get(eventType);
		if (systems === undefined) {
			systems = new List();
			this._eventSubscribers.set(eventType, systems);
		}
		systems.add(system);
	}

	/** Removes an event listener. Returns true if it existed. */
	unsubscribeFromEvent(system: System, eventType: symbol): boolean {
		const systems = this._eventSubscribers.get(eventType);
		if (systems === undefined) {
			return false;
		}
		const existed = systems.remove(system);
		if (existed && systems.isEmpty()) {
			this._eventSubscribers.delete(eventType);
		}
		return existed;
	}

	/** The event subscribers. */
	private _eventSubscribers: Map<symbol, List<System>> = new Map();
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
