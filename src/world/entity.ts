import { Component, OrderedMap, World } from '../internal';

export class Entity {
	/** Constructor. */
	constructor(world: World) {
		// Set the world that contains this.
		this._world = world;
	}

	/** Destroys this. */
	destroy(): void {
		for (const entry of this._components) {
			const componentsOfType = entry.value;
			for (let i = 0, l = componentsOfType.length; i < l; i++) {
				componentsOfType[i].destroy();
			}
		}
	}

	/** Gets the world that contains this. */
	get world(): World {
		return this._world;
	}

	/** Gets the component of the given type. If there are more than 1, the index specifies which component. If no component is found, it returns undefined. */
	getComponent(type: typeof Component, index: number): Component | undefined {
		// Get the list of components of the same type.
		const componentsOfType = this._components.get(type);
		if (componentsOfType === undefined) {
			return undefined;
		}
		return componentsOfType[index];
	}

	/** Gets the number of components of a given type. */
	getNumComponentsOfType(type: typeof Component): number {
		// Get the list of components of the same type.
		const componentsOfType = this._components.get(type);
		if (componentsOfType === undefined) {
			return 0;
		}
		return componentsOfType.length;
	}

	/** Adds a new component of the given *type*. */
	addNewComponent<Type extends Component>(type: { new (entity: Entity): Type }): Type {
		// Create the component.
		const component = new type(this);
		// Get the list of components of the same type, creating it if needed.
		let componentsOfType = this._components.get(type);
		if (componentsOfType === undefined) {
			componentsOfType = [];
			this._components.set(type, componentsOfType);
		}
		// Add the component.
		componentsOfType.push(component);
		// Send an event that a new component has been added.
		this._world.eventQueue.addEvent(component, Entity.Events.ComponentAdded);
		// Return the component.
		return component;
	}

	/** Removes a component. Returns true if it existed. Takes O(# components of same type). */
	removeComponent(component: Component): boolean {
		// Send an event that a component will be removed.
		this._world.eventQueue.addEvent(component, Entity.Events.ComponentWillBeRemoved);
		// Get the list of components of the same type.
		const type = component.constructor as typeof Component;
		const componentsOfType = this._components.get(type);
		if (componentsOfType === undefined) {
			return false;
		}
		// Find the component to remove.
		let index = 0;
		while (index < componentsOfType.length) {
			if (componentsOfType[index] === component) {
				break;
			}
			index++;
		}
		// Didn't find it so return false.
		if (index === componentsOfType.length) {
			return false;
		}
		// Destroy the component.
		component.destroy();
		// Remove the component from the array.
		componentsOfType.splice(index, 1);
		// If the componentsOfType is empty, remove the array.
		if (componentsOfType.length === 0) {
			this._components.remove(type);
		}
		return true;
	}

	/** The world that contains this. */
	private _world: World;

	/** The list of components this contains. */
	private _components = new OrderedMap<typeof Component, Component[]>();
}

export namespace Entity {
	export class Events {
		static ComponentAdded = Symbol('ComponentAdded');
		static ComponentWillBeRemoved = Symbol('ComponentWillBeRemoved');
	}
}
