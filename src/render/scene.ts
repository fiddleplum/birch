import { OrderedSet } from '../utils/ordered_set';
import { Model } from './model';

export class Scene {
	/** The uniforms function for this scene. */
	uniformsFunction: Model.UniformsFunction | null = null;

	/** Gets the set of models. */
	get models(): OrderedSet<Model> {
		return this._models;
	}

	/** Renders the scene. */
	render(stageUniformsFunction: Model.UniformsFunction | null): void {
		// Sort the models to be optimal in terms of state changes and blending.
		this._models.sort(Scene._isModelLess);

		// Render each model.
		for (const model of this._models) {
			model.render(stageUniformsFunction, this.uniformsFunction);
		}
	}

	/** Compares two models for sorting into the optimal order to reduce WebGL calls. */
	private static _isModelLess(a: Model, b: Model): boolean {
		if (a.shader === null || a.mesh === null) {
			return true;
		}
		if (b.shader === null || b.mesh === null) {
			return false;
		}
		if (a.blending === Model.Blending.None && b.blending !== Model.Blending.None) {
			return true;
		}
		if (a.blending !== Model.Blending.None && b.blending === Model.Blending.None) {
			return false;
		}
		if (a.blending === Model.Blending.None) { // Sort by shader and textures.
			if (a.shader !== b.shader) {
				return a.shader.id < b.shader.id;
			}
			for (let slot = 0, maxSlot = Math.min(Math.max(a.textures.length, b.textures.length) - 1, 32); slot <= maxSlot; slot++) {
				if (slot == a.textures.length && slot < b.textures.length) {
					return true;
				}
				if (slot == b.textures.length) {
					return false;
				}
				if (a.textures[slot] !== b.textures[slot]) {
					return a.textures[slot].id < b.textures[slot].id;
				}
			}
			return a.mesh.id < b.mesh.id;
		}
		else if (a.depth < b.depth) { // Since there is some blending, sort by depth.
			return true;
		}
		else if (a.depth > b.depth) {
			return false;
		}
		else { // just do the pointer to guarantee an explicit ordering.
			return a.id < b.id;
		}
	}

	/** The set of models. */
	private _models: OrderedSet<Model> = new OrderedSet();
}
