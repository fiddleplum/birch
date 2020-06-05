import { Shader } from './shader';
import { Texture } from './texture';
import { FastMap } from '../utils/fast_map';

export class State {
	/** The active shader. */
	activeShader: Shader | null = null;

	/** The active textures in their slots. */
	activeTextures: FastMap<number, Texture> = new FastMap();
}
