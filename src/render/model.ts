import { Shader } from './shader';
import { Mesh } from './mesh';
import { Texture } from './texture';
import { State } from './state';
import { FastMap } from '../utils/fast_map';

export class Model {
	/** Gets the mesh. */
	get mesh(): Mesh | null {
		return this._mesh;
	}

	/** Sets the mesh. */
	set mesh(mesh: Mesh | null) {
		this._mesh = mesh;
	}

	/** Gets the shader. */
	get shader(): Shader | null {
		return this._shader;
	}

	/** Sets the shader. */
	set shader(shader: Shader | null) {
		this._shader = shader;
	}

	/** Gets the depth. */
	get depth(): number {
		return this._depth;
	}

	/** Sets the depth. */
	set depth(depth: number) {
		this._depth = depth;
	}

	/** Gets the texture at the slot. */
	getTextureAtSlot(slot: number): Texture | null {
		const texture = this._textures.get(slot);
		if (texture !== undefined) {
			return texture;
		}
		return null;
	}

	/** Sets the texture at the slot. */
	setTextureAtSlot(slot: number, texture: Texture): void {
		this._textures.set(slot, texture);
	}

	/** Renders the model. */
	render(state: State, stageUniformsFunction: Model.UniformsFunction, sceneUniformsFunction: Model.UniformsFunction): void {
		if (this._shader === null || this._mesh === null) {
			return;
		}
		// Activate the shader and run the uniform functions.
		if (state.activeShader !== this._shader) {
			this._shader.activate();
			state.activeShader = this._shader;
			if (stageUniformsFunction !== null) {
				stageUniformsFunction(this._shader);
			}
			if (sceneUniformsFunction !== null) {
				sceneUniformsFunction(this._shader);
			}
		}
		if (this._uniformsFunction !== null) {
			this._uniformsFunction(this._shader);
		}
		// Turn off unused texture slots.
		for (let i = 0; i < state.activeTextures.size; i++) {
			const activeTextureEntry = state.activeTextures.getAt(i);
			const slot = activeTextureEntry.key;
			const texture = activeTextureEntry.value;
			if (!this._textures.has(slot)) {
				texture.deactivate(slot);
				state.activeTextures.delete(slot);
				i--;
			}
		}
		// Activate any new textures.
		for (let i = 0; i < this._textures.size; i++) {
			const textureEntry = this._textures.getAt(i);
			const slot = textureEntry.key;
			const texture = textureEntry.value;
			if (!state.activeTextures.has(slot) || state.activeTextures.get(slot) !== texture) {
				texture.activate(slot);
				state.activeTextures.set(slot, texture);
			}
		}
		// Render the mesh.
		this._mesh.render();
	}

	/** The mesh. */
	private _mesh: Mesh | null = null;

	/** The model. */
	private _shader: Shader | null = null;

	/** The list of textures. */
	private _textures: FastMap<number, Texture> = new FastMap();

	/** The depth used for sorting. */
	private _depth: number = 0;

	/** The blending mode. */
	private _blending: Model.Blending = Model.Blending.None;

	/** The depth test. */
	private _depthTest: Model.DepthTest = Model.DepthTest.LessOrEqual;

	/** The uniforms function for this model. */
	private _uniformsFunction: Model.UniformsFunction | null = null;
}

export namespace Model {
	export enum Blending { None, Alpha, Additive }

	export enum DepthTest { Never, Always, Less, Greater, Equal, NotEqual, LessOrEqual, GreaterOrEqual }

	export type UniformsFunction = (shader: Shader) => {} | null;
}
