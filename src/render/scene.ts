import { Sort } from '../utils/sort';
import { FastSet } from '../utils/fast_set';
import { Model } from './model';

export class Scene {
	render(): void {
		this._models.sort(Sort.insertionSort, Scene._compareModels);
	}

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

	private _models: FastSet<Model> = new FastSet();
}
