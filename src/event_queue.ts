import { System } from './world/systems/system';
import { FastOrderedSet } from './utils/fast_ordered_set';
import { Component } from './world/components/component';

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

	/** Subscribes a system to an event. */
	subscribeToEvent(system: System, eventType: symbol): void {
		let systems = this._eventSubscribers.get(eventType);
		if (systems === undefined) {
			systems = new FastOrderedSet();
			this._eventSubscribers.set(eventType, systems);
		}
		systems.add(system);
	}

	/** Unsubscribes a system from an event. Returns true if it was subscribed before. */
	unsubscribeFromEvent(system: System, eventType: symbol): boolean {
		const systems = this._eventSubscribers.get(eventType);
		if (systems === undefined) {
			return false;
		}
		const existed = systems.remove(system);
		if (existed && systems.size() === 0) {
			this._eventSubscribers.delete(eventType);
		}
		return existed;
	}

	/** The event subscribers. */
	private _eventSubscribers: Map<symbol, FastOrderedSet<System>> = new Map();
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
