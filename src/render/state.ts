import { Shader } from './shader';
import { Texture } from './texture';

export class State {
	/** The active shader. */
	activeShader: Shader | null = null;

	/** The active textures in their slots. */
	activeTextures: Texture[] = [];
}
