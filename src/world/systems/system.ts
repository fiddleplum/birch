import { Component } from '../internal';

/** The base class for all systems. */
export abstract class System {
	/** Destroys the system. */
	destroy(): void {
		// Unsubscribe from all components.
		for (const component of this._subscribedComponents) {
			component.unsubscribeFromEvents(this);
		}
	}

	/** Called when a system receives an event it was listening for. */
	abstract processEvent(component: Component, event: symbol): void;

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

	/** Subscribes to a component's events. */
	protected subscribeToComponent(component: Component): void {
		if (!this._subscribedComponents.has(component)) {
			component.subscribeToEvents(this);
			this._subscribedComponents.add(component);
		}
	}

	/** Unsubscribes from a component's events. */
	protected unsubscribeFromComponent(component: Component): void {
		if (this._subscribedComponents.has(component)) {
			component.unsubscribeFromEvents(this);
			this._subscribedComponents.delete(component);
		}
	}

	/** The list of monitored component types. */
	private _monitoredComponentTypes: (typeof Component)[] = [];

	/** The set of subscribed component types. */
	private _subscribedComponents: Set<Component> = new Set();
}
