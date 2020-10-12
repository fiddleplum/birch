import { CollectionTyped } from '../internal';
import { World, Component } from './internal';
import { UniqueId } from '../utils/unique_id';
import { FastOrderedSetReadonly } from '../utils/fast_ordered_set_readonly';

export class Entity extends UniqueId.Object {
	/** Constructor. */
	constructor(world: World, name: string | undefined) {
		super();
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

	/** Returns true if the entity has at least one component of the given type. */
	has(type: typeof Component): boolean {
		return this._components.getFirstOfType(type) !== undefined;
	}

	/** Gets the ith component of the given type. i is zero based and defaults to zero. */
	get<Type extends Component>(typeOrName: { new (entity: Entity): Type } | string, i: number = 0): Type | undefined {
		if (typeof typeOrName === 'string') {
			return this._components.get(typeOrName) as Type | undefined;
		}
		else {
			return this._components.getAllOfType(typeOrName)?.getIndex(i);
		}
	}

	/** Gets all components of the given type. */
	getAll<Type extends Component>(type: { new (entity: Entity): Type }): FastOrderedSetReadonly<Type> | undefined {
		return this._components.getAllOfType(type);
	}

	/** The world that contains this. */
	private _world: World;

	/** The name. */
	private _name: string | undefined;

	/** The list of components this contains. */
	private _components = new CollectionTyped<Component>((type: { new (entity: Entity): Component }) => {
		return new type(this);
	}, (component: Component) => {
		for (const entry of this._world.systems) {
			const system = entry.key;
			if (system.getMonitoredComponentTypes().includes(Object.getPrototypeOf(component).constructor)) {
				system.processEvent(component, Entity.ComponentWillBeDestroyed);
			}
			// for (const query of entry.key.queries) {
			// 	query.entityComponentListChanged(component, false);
			// }
		}
		component.destroy();
	}, (component: Component) => {
		for (const entry of this._world.systems) {
			const system = entry.key;
			if (system.getMonitoredComponentTypes().includes(Object.getPrototypeOf(component).constructor)) {
				system.processEvent(component, Entity.ComponentCreated);
			}
			// for (const query of entry.key.queries) {
			// 	query.entityComponentListChanged(component, true);
			// }
		}
	});

	/** Event for when the component is created. */
	static ComponentCreated = Symbol('ComponentCreated');

	/** Event for when the component is destroyed. */
	static ComponentWillBeDestroyed = Symbol('ComponentWillBeDestroyed');
}
