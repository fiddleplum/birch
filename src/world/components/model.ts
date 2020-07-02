import { Component } from './component';
import { Entity } from '../../internal';
// import { Model as RenderModel, Shader } from '../../internal';
import { Render } from '../../render/index';

export class Model extends Component {
	constructor(entity: Entity) {
		super(entity);

		this._model = new Render.Model(entity.world.game.renderer.gl);
	}

	/** Gets the model. */
	get model(): Render.Model {
		return this._model;
	}

	private _model: Render.Model;
}

export namespace Model {
	export enum Events {
	}
}
