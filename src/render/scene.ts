import { Sort } from '../utils/sort';
import { FastSet } from '../utils/fast_set';
import { Model } from './model';

export class Scene {
	render(): void {
		this._models.sort(Sort.insertionSort, Scene._compareModels);
	}

	private static _compareModels(a: Model, b: Model): number {
		if (!a.shader && b.shader) {
			return -1;
		}
		if (!a.shader || !b.shader) {
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
			for (let slot = 0; slot < a.textures.size() && slot < b.images.size(); slot++) {
				if (slot == images.size() && slot < b.images.size()) {
					return -1;
				}
				if (slot == b.images.size()) {
					return +1;
				}
				if (a.getTextureAtSlot(slot) !== b.getTextureAtSlot(slot)) {
					return images[slot] < b.images[slot];
				}
			}
			return mesh < b.mesh;
		}
		else if (getDepth() < b.getDepth()) { // Since there is some blending, sort by depth.
			return -1;
		}
		else if (getDepth() > b.getDepth()) {
			return +1;
		}
		else { // just do the pointer to guarantee an explicit ordering.
			return this < &model;
		}
	}

	private _models: FastSet<Model> = new FastSet();
}
