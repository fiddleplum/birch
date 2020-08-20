import { Component, World } from './internal';
import { CollectionTyped } from '../utils/collection_typed';

export class Entity {
	/** Constructor. */
	constructor(world: World) {
		// Set the world that contains this.
		this._world = world;
	}

	/** Destroys this. */
	destroy(): void {
		this._components.clear();
	}

	/** Gets the world that contains this. */
	get world(): World {
		return this._world;
	}

	/** Gets the components. */
	get components(): CollectionTyped<Component> {
		return this._components;
	}

	/** The world that contains this. */
	private _world: World;

	/** The list of components this contains. */
	private _components = new CollectionTyped<Component>((type: { new (entity: Entity): Component }) => {
		return new type(this);
	}, (component: Component) => {
		component.destroy();
	});
}

export namespace Entity {
	export class Events {
		static ComponentAdded = Symbol('ComponentAdded');
		static ComponentWillBeRemoved = Symbol('ComponentWillBeRemoved');
	}
}
