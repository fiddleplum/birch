import { Sort } from '../utils/sort';
import { OrderedSet } from '../utils/ordered_set';
import { Model } from './model';
import { State } from './state';

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
		this._models.sort(Sort.insertionSort, Scene._compareModels);

		// Render each model.
		for (let i = 0, l = this._models.size; i < l; i++) {
			this._models.getAt(i)?.render(this._state, stageUniformsFunction, this.uniformsFunction);
		}
	}

	/** Compares two models for sorting into the optimal order to reduce WebGL calls. */
	private static _compareModels(a: Model, b: Model): number {
		if (a.shader === null || a.mesh === null) {
			return -1;
		}
		if (b.shader === null || b.mesh === null) {
			return +1;
		}
		if (a.blending === Model.Blending.None && b.blending !== Model.Blending.None) {
			return -1;
		}
		if (a.blending !== Model.Blending.None && b.blending === Model.Blending.None) {
			return +1;
		}
		if (a.blending === Model.Blending.None) { // Sort by shader and textures.
			if (a.shader !== b.shader) {
				return a.shader.id < b.shader.id ? -1 : +1;
			}
			for (let slot = 0, maxSlot = Math.min(Math.max(a.textures.length, b.textures.length) - 1, 32); slot <= maxSlot; slot++) {
				if (slot == a.textures.length && slot < b.textures.length) {
					return -1;
				}
				if (slot == b.textures.length) {
					return +1;
				}
				if (a.textures[slot] !== b.textures[slot]) {
					return a.textures[slot].id < b.textures[slot].id ? -1 : +1;
				}
			}
			return a.mesh.id < b.mesh.id ? -1 : +1;
		}
		else if (a.depth < b.depth) { // Since there is some blending, sort by depth.
			return -1;
		}
		else if (a.depth > b.depth) {
			return +1;
		}
		else { // just do the pointer to guarantee an explicit ordering.
			return a.id < b.id ? -1 : +1;
		}
	}

	/** The persistent WebGL state. */
	private _state: State = new State();

	/** The set of models. */
	private _models: OrderedSet<Model> = new OrderedSet();
}
