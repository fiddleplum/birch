import { Shader } from './shader';
import { Mesh } from './mesh';
import { UniqueId } from '../utils/unique_id';
import { Uniforms } from './uniforms';
import { State } from './state';

export class Model extends UniqueId.Object {
	/** The mesh. */
	mesh: Mesh | undefined = undefined;

	/** The model. */
	shader: Shader | undefined = undefined;

	/** The depth used for sorting. */
	depth: number = 0;

	/** The blending mode. */
	blending: Model.Blending = Model.Blending.None;

	/** The depth test. */
	depthTest: Model.DepthTest = Model.DepthTest.LessOrEqual;

	/** Constructor. */
	constructor(gl: WebGL2RenderingContext) {
		super();

		// Save the WebGL context.
		this._gl = gl;

		// Create the uniform block.
		this._uniforms = new Uniforms(this._gl);

		// If the WebGL state object hasn't been created, create it.
		if (!Model._state.has(gl)) {
			Model._state.set(gl, new State());
		}
	}

	/** Destroys this. */
	destroy(): void {
		this._uniforms.destroy();
	}

	/** Gets the uniforms associated with this model. */
	get uniforms(): Uniforms {
		return this._uniforms;
	}

	/** Renders the model. */
	render(stageUniforms: Uniforms, sceneUniforms: Uniforms): void {
		if (this.shader === undefined || this.mesh === undefined) {
			return;
		}
		// Get the state for this WebGL context. Used by other functions to keep track of things.
		const state = Model._state.get(this._gl) as State;
		// Initialize the texture units used this frame to 0.
		for (let i = 0; i < state.textureUnitsUsedThisFrame.length; i++) {
			state.textureUnitsUsedThisFrame[i] = false;
		}
		// Bind the stage uniform buffer to 0 if the stage has changed.
		if (stageUniforms !== state.activeStageUniforms) {
			stageUniforms.bindUniformBuffer(0);
		}
		stageUniforms.sendChangedUniforms();
		// Bind the scene uniform buffer to 1 if the scene has changed.
		if (sceneUniforms !== state.activeSceneUniforms) {
			sceneUniforms.bindUniformBuffer(1);
		}
		sceneUniforms.sendChangedUniforms();
		if (stageUniforms !== state.activeStageUniforms || this.shader !== state.activeShader) {
			this._bindTextures(stageUniforms, this.shader, state);
		}
		if (sceneUniforms !== state.activeSceneUniforms || this.shader !== state.activeShader) {
			this._bindTextures(sceneUniforms, this.shader, state);
		}
		// Bind the textures if the shader or stage changed.
		state.activeStageUniforms = stageUniforms;
		state.activeSceneUniforms = sceneUniforms;
		// Bind the model uniform buffer to 2.
		this._uniforms.bindUniformBuffer(2);
		this._uniforms.sendChangedUniforms();
		this._bindTextures(this._uniforms, this.shader, state);
		// Unbind the unused uniform buffers and texture slots.
		this._unbindUnusedUniformBuffers(state);
		this._unbindUnusedTextures(state);
		// Render the mesh.
		this.mesh.render();
	}

	/** Binds the textures of uniforms and shaders. */
	private _bindTextures(uniforms: Uniforms, shader: Shader, state: State): void {
		for (const entry of uniforms.textures) {
			const texture = entry.value;
			const textureUnit = shader.getSamplerTextureUnit(entry.key);
			if (textureUnit !== undefined) {
				texture.bind(textureUnit);
				state.activeTextures[textureUnit] = texture;
				state.textureUnitsUsedThisFrame[textureUnit] = true;
			}
		}
	}

	/** Unbinds any unused textures. */
	private _unbindUnusedTextures(state: State): void {
		for (let i = 0; i < state.activeTextures.length; i++) {
			const activeTexture = state.activeTextures[i];
			if (activeTexture !== undefined && state.textureUnitsUsedThisFrame[i] === false) {
				activeTexture.unbind(i);
				state.activeTextures[i] = undefined;
			}
		}
	}

	/** Unbinds any unused uniform buffers. */
	private _unbindUnusedUniformBuffers(state: State): void {
		// Start at 3 since 0, 1, and 2 are reserved.
		for (let i = 3; i < state.activeUniformBuffers.length; i++) {
			const activeUniformBuffer = state.activeUniformBuffers[i];
			if (activeUniformBuffer !== undefined && state.uniformBufferBindingPointsUsedThisFrame[i] === false) {
				activeUniformBuffer.unbindUniformBuffer(i);
				state.activeUniformBuffers[i] = undefined;
			}
		}
	}

	/**  The WebGL context. */
	private _gl: WebGL2RenderingContext;

	/** The scene-specific uniform block. */
	private _uniforms: Uniforms;

	/** The WebGL state, one for each WebGL context. */
	private static _state: Map<WebGL2RenderingContext, State> = new Map();
}

export namespace Model {
	/** The different blending modes. */
	export enum Blending { None, Alpha, Additive }

	/** The depth test modes. */
	export enum DepthTest { Never, Always, Less, Greater, Equal, NotEqual, LessOrEqual, GreaterOrEqual }

	/** The function for setting uniforms. */
	export type UniformsFunction = (shader: Shader) => {} | undefined;
}
