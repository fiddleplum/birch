import { Component, OrderedSet, World } from '../internal';

export class Entity {
	/** Constructor. */
	constructor(world: World) {
		// Set the world that contains this.
		this._world = world;
	}

	/** Gets the world that contains this. */
	get world(): World {
		return this._world;
	}

	/** Adds a new component of the given *type*. */
	addNewComponent<Type extends Component>(type: { new (entity: Entity): Type }): Type {
		const component = new type(this);
		this._components.add(component);
		this._world.eventQueue.addEvent(component, Entity.Events.ComponentAdded);
		return component;
	}

	/** Removes a component. */
	removeComponent(component: Component): boolean {
		this._world.eventQueue.addEvent(component, Entity.Events.ComponentWillBeRemoved);
		return this._components.remove(component);
	}

	/** The world that contains this. */
	private _world: World;

	/** The list of components this contains. */
	private _components = new OrderedSet<Component>();
}

export namespace Entity {
	export class Events {
		static ComponentAdded = Symbol('ComponentAdded');
		static ComponentWillBeRemoved = Symbol('ComponentWillBeRemoved');
	}
}
