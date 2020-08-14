import { Component, Entity } from '../internal';
import { Render } from '../../render/index';

export class ModelComponent extends Component {
	constructor(entity: Entity) {
		super(entity);

		this._model = entity.world.engine.renderer.createModel();
	}

	/** Gets the model. */
	get model(): Render.Model {
		return this._model;
	}

	private _model: Render.Model;
}

export namespace ModelComponent {
	export enum Events {
	}
}
