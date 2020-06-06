import { Shader } from './shader';
import { Mesh } from './mesh';
import { Texture } from './texture';
import { State } from './state';

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

	/** Gets the blendng mode. */
	get blending(): Model.Blending {
		return this._blending;
	}

	/** Sets the blending mode. */
	set blending(blending: Model.Blending) {
		this._blending = blending;
	}

	/** Gets the depth test. */
	get depthTest(): Model.DepthTest {
		return this._depthTest;
	}

	/** Sets the depth test. */
	set depthTest(depthTest: Model.DepthTest) {
		this._depthTest = depthTest;
	}

	/** Gets the texture at the slot. */
	getTextureAtSlot(slot: number): Texture | null {
		const texture = this._textures[slot];
		if (texture !== undefined) {
			return texture;
		}
		return null;
	}

	/** Sets the texture at the slot. */
	setTextureAtSlot(slot: number, texture: Texture): void {
		this._textures[slot] = texture;
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
		// Activate any new textures.
		for (let slot = 0; slot < this._textures.length; slot++) {
			if (state.activeTextures[slot] !== this._textures[slot]) {
				this._textures[slot].activate(slot);
				state.activeTextures[slot] = this._textures[slot];
			}
		}
		// Turn off unused texture slots.
		for (let slot = this._textures.length; slot < state.activeTextures.length; slot++) {
			state.activeTextures[slot].deactivate(slot);
		}
		state.activeTextures.splice(this._textures.length, state.activeTextures.length - this._textures.length);
		// Render the mesh.
		this._mesh.render();
	}

	/** The mesh. */
	private _mesh: Mesh | null = null;

	/** The model. */
	private _shader: Shader | null = null;

	/** The list of textures. */
	private _textures: Texture[] = [];

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
