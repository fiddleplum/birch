import { CollectionTyped } from '../internal';
import { World, Component } from './internal';

export class Entity {
	/** Constructor. */
	constructor(world: World, name: string | undefined) {
		// Set the world that contains this.
		this._world = world;
		// Set the name.
		this._name = name;
	}

	/** Gets the name. */
	get name(): string | undefined {
		return this._name;
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

	/** The name. */
	private _name: string | undefined;

	/** The list of components this contains. */
	private _components = new CollectionTyped<Component>((type: { new (entity: Entity): Component }) => {
		return new type(this);
	}, (component: Component) => {
		component.destroy();
	}, (component: Component) => {
		for (const entry of this._world.systems) {
			const system = entry.key;
			if (system.getMonitoredComponentTypes().includes(Object.getPrototypeOf(component).constructor)) {
				system.processEvent(component, Entity.ComponentCreated);
			}
		}
	});

	static ComponentCreated = Symbol('ComponentCreated');
}
