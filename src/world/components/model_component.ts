import { Component, Entity } from '../internal';
import { Render } from '../../render/index';

/** A simple component that contains an accessible model. */
export class ModelComponent extends Component {
	constructor(entity: Entity) {
		super(entity);

		// Create the model.
		this._model = entity.world.engine.renderer.models.create();
		// Add the model to the scene.
		this.entity.world.scene.models.add(this._model);
	}

	/** Destroys the model component. */
	destroy(): void {
		this.entity.world.scene.models.remove(this._model);
		this.engine.renderer.models.destroy(this._model);
	}

	/** Gets the model. */
	get model(): Render.Model {
		return this._model;
	}

	/** The model. */
	private _model: Render.Model;
}
