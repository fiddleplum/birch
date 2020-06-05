import { Shader } from './shader';
import { Mesh } from './mesh';
import { State } from './state';

export enum Blending { None, Alpha, Additive }

export enum DepthTest { Never, Always, Less, Greater, Equal, NotEqual, LessOrEqual, GreaterOrEqual }

export type UniformsFunction = (shader: Shader) => {} | null;

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

	/** Renders the model. */
	render(state: State, stageUniformsFunction: UniformsFunction, sceneUniformsFunction: UniformsFunction): void {
		if (this._shader === null || this._mesh === null) {
			return;
		}
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
	}

	/** The mesh. */
	private _mesh: Mesh | null = null;

	/** The model. */
	private _shader: Shader | null = null;

	/** The depth used for sorting. */
	private _depth: number = 0;

	/** The blending mode. */
	private _blending: Blending = Blending.None;

	/** The depth test. */
	private _depthTest: DepthTest = DepthTest.LessOrEqual;

	private _uniformsFunction: UniformsFunction | null = null;
}
