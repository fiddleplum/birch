import { Component, OrderedSet, World } from '../internal';

export class Entity {
	/** Constructor. */
	constructor(world: World) {
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
		return component;
	}

	/** Removes a component. */
	removeComponent(component: Component): boolean {
		return this._components.remove(component);
	}

	/** The world that contains this. */
	private _world: World;

	/** The list of components this contains. */
	private _components = new OrderedSet<Component>();
}
