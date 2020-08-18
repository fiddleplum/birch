import { Uniforms, Shader, Texture } from './internal';

export class State {
	/** The active stage. */
	activeStageUniforms: Uniforms | undefined = undefined;

	/** The active scene. */
	activeSceneUniforms: Uniforms | undefined = undefined;

	/** The active shader. */
	activeShader: Shader | undefined = undefined;

	/** The active uniform buffers in their binding points. */
	activeUniformBuffers: (Uniforms | undefined)[] = [];

	/** Uniform buffers used this frame. Used to know which of the activeUniformBuffer binding points to unbind. */
	uniformBufferBindingPointsUsedThisFrame: boolean[] = [];

	/** The active textures in their texture units. */
	activeTextures: (Texture | undefined)[] = [];

	/** Texture units used this frame. Used to know which of the activeTexture texture units to unbind. */
	textureUnitsUsedThisFrame: boolean[] = [];
}
