import { Component, FastOrderedSet, System } from './internal';
import { Entity } from './world/entity';

/** The event queue. Passes events on to registered systems. */
export class EventQueue {
	/** Adds an event. */

	// THIS IS VERY FLEXIBLE, BUT IT IS TOO MUCH FOR EVERY EVENT.
	// LOOKING INTO EACH COMPONENT HAVING A SUBSCRIBERS ARRAY.
	// SYSTEMS WOULD SUBSCRIBE TO WHOLE COMPONENTS (MAKE IT SIMPLE)
	// SYSTEMS WOULD STILL MONITOR COMPONENT TYPE CREATES/DESTROYS.

	addEvent(component: Component, event: symbol): void {
		// It's a create/desetroy event.
		if (event === Entity.ComponentCreated || event === Entity.ComponentWillBeDestroyed) {
			const systems = this._createDestroySubscribers.get(Object.getPrototypeOf(component));
			if (systems !== undefined) {
				for (const system of systems) {
					system.addEvent(component, event);
				}
			}
		}
		// It's a regular event.
		else {
			// Add the event to the systems subscribed to the event on any component.
			const systems = this._eventSubscribers.get(event);
			if (systems !== undefined) {
				for (const system of systems) {
					system.addEvent(component, event);
				}
			}
			// Add the event to the systems subscribed to the event on the component.
			const eventSystems = this._componentEventSubscribers.get(component);
			if (eventSystems !== undefined) {
				const systems = eventSystems.get(event);
				if (systems !== undefined) {
					for (const system of systems) {
						system.addEvent(component, event);
					}
				}
			}
		}
	}

	/** Subscribe to events on any component. */
	subscribeToEvent(system: System, event: symbol): void {
		let systems = this._eventSubscribers.get(event);
		if (systems === undefined) {
			systems = new FastOrderedSet();
			this._eventSubscribers.set(event, systems);
		}
		systems.add(system);
	}

	/** Unsubscribe from events on any component. */
	unsubscribeFromEvent(system: System, event: symbol): void {
		const systems = this._eventSubscribers.get(event);
		if (systems !== undefined) {
			systems.remove(system);
			if (systems.size() === 0) {
				this._eventSubscribers.delete(event);
			}
		}
	}

	/** Subscribes a system to events on a component. */
	subscribeToComponentEvent(system: System, component: Component, event: symbol): void {
		let eventSystems = this._componentEventSubscribers.get(component);
		if (eventSystems === undefined) {
			eventSystems = new Map();
			this._componentEventSubscribers.set(component, eventSystems);
		}
		let systems = eventSystems.get(event);
		if (systems === undefined) {
			systems = new FastOrderedSet();
			eventSystems.set(event, systems);
		}
		systems.add(system);
	}

	/** Unsubscribes a system from events on a component. */
	unsubscribeFromComponentEvent(system: System, component: Component, event: symbol): void {
		const eventSystems = this._componentEventSubscribers.get(component);
		if (eventSystems !== undefined) {
			const systems = eventSystems.get(event);
			if (systems !== undefined) {
				systems.remove(system);
				if (systems.size() === 0) {
					eventSystems.delete(event);
				}
				if (eventSystems.size === 0) {
					this._componentEventSubscribers.delete(component);
				}
			}
		}
	}

	// /** Adds an component create or destroy event. */
	// addComponentCreateDestroyEvent(component: Component, type: symbol): void {
	// 	const systems = this._createDestroySubscribers.get(Object.getPrototypeOf(component));
	// 	if (systems === undefined) {
	// 		return;
	// 	}
	// 	for (const system of systems) {
	// 		system.addEvent(component, type);
	// 	}
	// }

	/** Subscribes a system to the creation or destruction of a component type. */
	subscribeToCreateDestroy(system: System, componentType: typeof Component): void {
		let systems = this._createDestroySubscribers.get(componentType);
		if (systems === undefined) {
			systems = new FastOrderedSet();
			this._createDestroySubscribers.set(componentType, systems);
		}
		systems.add(system);
	}

	/** Unsubscribes a system from the creation and destruction of a component type.
	 *  Returns true if it was subscribed before. */
	unsubscribeFromCreateDestroy(system: System, componentType: typeof Component): boolean {
		const systems = this._createDestroySubscribers.get(componentType);
		if (systems === undefined) {
			return false;
		}
		const existed = systems.remove(system);
		if (existed && systems.size() === 0) {
			this._createDestroySubscribers.delete(componentType);
		}
		return existed;
	}

	// /** Notifies the subscribed systems that a component has been created or destroyed.
	//  *  Called by Entity. */
	// componentTypeEvent(component: Component): void {
	// 	const systems = this._createDestroySubscribers.get(Object.getPrototypeOf(component));
	// 	if (systems === undefined) {
	// 		return;
	// 	}
	// 	for (const system of systems) {
	// 		system.processEvent(component, event);
	// 	}
	// }

	// /** Notifies the subscribed systems that a component will be destroyed.
	//  *  Called by Entity. */
	// componentWillBeDestroyed(component: Component): void {
	// 	const systems = this._createDestroySubscribers.get(Object.getPrototypeOf(component));
	// 	if (systems === undefined) {
	// 		return;
	// 	}
	// 	for (const system of systems) {
	// 	}
	// }

	/** Subscriptions to events on any component. */
	private _eventSubscribers: Map<symbol, FastOrderedSet<System>> = new Map();

	/** Subscriptions to events on a specific component. */
	private _componentEventSubscribers: Map<Component, Map<symbol, FastOrderedSet<System>>> = new Map();

	/** Subscriptions to create and destroy events on a component type. */
	private _createDestroySubscribers: Map<typeof Component, FastOrderedSet<System>> = new Map();
}
