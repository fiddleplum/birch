import { Shader } from './shader';
import { Mesh } from './mesh';
import { Texture } from './texture';
import { State } from './state';
import { UniqueId } from '../utils/unique_id';

export class Model extends UniqueId.Object {
	/** Renders the model. */
	render(state: State, stageUniformsFunction: Model.UniformsFunction, sceneUniformsFunction: Model.UniformsFunction): void {
		if (this.shader === null || this.mesh === null) {
			return;
		}
		// Activate the shader and run the uniform functions.
		if (state.activeShader !== this.shader) {
			this.shader.activate();
			state.activeShader = this.shader;
			if (stageUniformsFunction !== null) {
				stageUniformsFunction(this.shader);
			}
			if (sceneUniformsFunction !== null) {
				sceneUniformsFunction(this.shader);
			}
		}
		if (this.uniformsFunction !== null) {
			this.uniformsFunction(this.shader);
		}
		// Activate any new textures.
		for (let slot = 0; slot < this.textures.length; slot++) {
			if (state.activeTextures[slot] !== this.textures[slot]) {
				this.textures[slot].activate(slot);
				state.activeTextures[slot] = this.textures[slot];
			}
		}
		// Turn off unused texture slots.
		for (let slot = this.textures.length; slot < state.activeTextures.length; slot++) {
			state.activeTextures[slot].deactivate(slot);
		}
		state.activeTextures.splice(this.textures.length, state.activeTextures.length - this.textures.length);
		// Render the mesh.
		this.mesh.render();
	}

	/** The mesh. */
	mesh: Mesh | null = null;

	/** The model. */
	shader: Shader | null = null;

	/** The list of textures. */
	textures: Texture[] = [];

	/** The depth used for sorting. */
	depth: number = 0;

	/** The blending mode. */
	blending: Model.Blending = Model.Blending.None;

	/** The depth test. */
	depthTest: Model.DepthTest = Model.DepthTest.LessOrEqual;

	/** The uniforms function for this model. */
	uniformsFunction: Model.UniformsFunction | null = null;
}

export namespace Model {
	export enum Blending { None, Alpha, Additive }

	export enum DepthTest { Never, Always, Less, Greater, Equal, NotEqual, LessOrEqual, GreaterOrEqual }

	export type UniformsFunction = (shader: Shader) => {} | null;
}
