import { Component, Entity } from '../internal';
import { Render } from '../../internal';

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
		// Remove the model from the scene.
		this.entity.world.scene.models.remove(this._model);

		// Destroy the model.
		this.engine.renderer.models.destroy(this._model);

		super.destroy();
	}

	/** Gets the model. */
	get model(): Render.Model {
		return this._model;
	}

	/** Gets the uniforms of the model. */
	get uniforms(): Render.UniformGroup {
		return this._model.uniforms;
	}

	/** The model. */
	private _model: Render.Model;
}
