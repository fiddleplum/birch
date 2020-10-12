// import { FastOrderedSet } from '../utils/fast_ordered_set';
// import { FastOrderedSetReadonly } from '../utils/fast_ordered_set_readonly';
// import { Entity } from './entity';
// import { Component } from './internal';

// export class Query {
// 	constructor(componentTypes: (typeof Component)[], subscriptions: (typeof Component)[], componentAddedCallback?: (component: Component) => void, componentWillBeRemovedCallback?: (component: Component) => void) {
// 		for (let i = 0; i < componentTypes.length; i++) {
// 			this._componentTypes.push(componentTypes[i]);
// 		}
// 		for (let i = 0; i < subscriptions.length; i++) {
// 			this._subscriptions.push(subscriptions[i]);
// 		}

// 		this._componentAddedCallback = componentAddedCallback;
// 		this._componentWillBeRemovedCallback = componentWillBeRemovedCallback;
// 	}

// 	/** Called when the list of components of an entity changed. */
// 	entityComponentListChanged(component: Component, added: boolean): void {
// 		let all = true;
// 		let any = false;
// 		// See if the component is in the entity and if all componentTypes are in the entity.
// 		const entity = component.entity;
// 		for (let i = 0; i < this._componentTypes.length; i++) {
// 			if (entity.components.getFirstOfType(this._componentTypes[i]) !== undefined) {
// 				any = true;
// 			}
// 			else {
// 				all = false;
// 			}
// 		}
// 		// Add/remove the entity to/from the entity list.
// 		const has = this._entities.has(entity);
// 		if (all && !has) {
// 			this._entities.add(entity);
// 		}
// 		else if (!all && has) {
// 			this._entities.remove(entity);
// 		}
// 		// Call the callbacks if the component is in the componentType list.
// 		const componentType = component.constructor as { new (...args: any[]): Component };
// 		if (this._componentTypes.includes(componentType)) {
// 			if (added && this._componentAddedCallback) {
// 				this._componentAddedCallback(component);
// 			}
// 			else if (!added && this._componentWillBeRemovedCallback) {
// 				this._componentWillBeRemovedCallback(component);
// 			}
// 		}
// 		if (this._subscriptions.includes(componentType)) {
// 		}
// 		else {
// 		}
// 	}

// 	get entities(): FastOrderedSetReadonly<Entity> {
// 		return this._entities;
// 	}

// 	/** The entities that match the query. */
// 	private _entities: FastOrderedSet<Entity> = new FastOrderedSet();

// 	/** The component types required to satisfy the query. */
// 	private _componentTypes: (typeof Component)[] = [];

// 	/** The component types to subscribe to. */
// 	private _subscriptions: (typeof Component)[] = [];

// 	/** A callback called when a component is added. */
// 	private _componentAddedCallback: ((component: Component) => void) | undefined = undefined;

// 	/** A callback called when a component will be removed. */
// 	private _componentWillBeRemovedCallback: ((component: Component) => void) | undefined = undefined;

// }
