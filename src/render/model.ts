import { Shader } from './shader';
import { Mesh } from './mesh';
import { Texture } from './texture';
import { UniqueId } from '../utils/unique_id';

export class Model extends UniqueId.Object {
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

	/** Constructor. */
	constructor(gl: WebGL2RenderingContext) {
		super();

		// If the WebGL state object hasn't been created, create it.
		if (!Model._state.has(gl)) {
			Model._state.set(gl, new WebGLState());
		}
		this._state = Model._state.get(gl) as WebGLState;
	}

	/** Renders the model. */
	render(stageUniformsFunction: Model.UniformsFunction | null, sceneUniformsFunction: Model.UniformsFunction | null): void {
		if (this.shader === null || this.mesh === null) {
			return;
		}
		// Activate the shader and run the uniform functions.
		if (this._state.activeShader !== this.shader) {
			this.shader.activate();
			this._state.activeShader = this.shader;
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
			if (this._state.activeTextures[slot] !== this.textures[slot]) {
				this.textures[slot].activate(slot);
				this._state.activeTextures[slot] = this.textures[slot];
			}
		}
		// Turn off unused texture slots.
		for (let slot = this.textures.length; slot < this._state.activeTextures.length; slot++) {
			this._state.activeTextures[slot].deactivate(slot);
		}
		this._state.activeTextures.splice(this.textures.length, this._state.activeTextures.length - this.textures.length);
		// Render the mesh.
		this.mesh.render();
	}

	/** The WebGL state for the context of this model. */
	private _state: WebGLState;

	/** The WebGL state, one for each WebGL context. */
	private static _state: Map<WebGL2RenderingContext, WebGLState> = new Map();
}

export namespace Model {
	/** The different blending modes. */
	export enum Blending { None, Alpha, Additive }

	/** The depth test modes. */
	export enum DepthTest { Never, Always, Less, Greater, Equal, NotEqual, LessOrEqual, GreaterOrEqual }

	/** The function for setting uniforms. */
	export type UniformsFunction = (shader: Shader) => {} | null;
}

export class WebGLState {
	/** The active shader. */
	activeShader: Shader | null = null;

	/** The active textures in their slots. */
	activeTextures: Texture[] = [];
}
