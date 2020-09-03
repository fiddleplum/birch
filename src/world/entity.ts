import { CollectionTyped, Component, World } from '../internal';

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
		const component = new type(this);
		return component;
	}, (component: Component) => {
		for (const entry of this._world.engine.systems) {
			const system = entry.key;
			if (system.getMonitoredComponentTypes().includes(Object.getPrototypeOf(component).constructor)) {
				system.processEvent(component, Entity.ComponentWillBeDestroyed);
			}
		}
		component.destroy();
	}, (component: Component) => {
		for (const entry of this._world.engine.systems) {
			const system = entry.key;
			if (system.getMonitoredComponentTypes().includes(Object.getPrototypeOf(component).constructor)) {
				system.processEvent(component, Entity.ComponentCreated);
			}
		}
	});

	static ComponentCreated = Symbol('ComponentCreated');
	static ComponentWillBeDestroyed = Symbol('ComponentWillBeDestroyed');
}
