import { Entity } from '../../internal';

export class Component {
	constructor(entity: Entity) {
		// Set the entity that contains this.
		this._entity = entity;
	}

	/** Gets the entity that contains this. */
	get entity(): Entity {
		return this._entity;
	}

	/** The entity that contains this. */
	private _entity: Entity;
}
