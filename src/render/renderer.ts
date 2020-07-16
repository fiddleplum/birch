import { ColorReadonly } from '../utils/color_readonly';
import { OrderedSet } from '../utils/ordered_set';
import { Stage } from './stage';
import { Mesh } from './mesh';
import { Shader } from './shader';
import { Texture } from './texture';

export class Renderer {
	constructor(canvas: HTMLCanvasElement, antialias: boolean) {
		// Save the canvas.
		this._canvas = canvas;
		canvas.width = canvas.clientWidth * devicePixelRatio;
		canvas.height = canvas.clientHeight * devicePixelRatio;
		canvas.style.imageRendering = 'crisp-edges';
		canvas.style.imageRendering = 'pixelated';
		// Get the WebGL context.
		const gl = this._canvas.getContext('webgl2', { antialias: antialias });
		if (gl === null) {
			throw new Error('Could not get a WebGL 2.0 context. Your browser may not support WebGL 2.0.');
		}
		this._gl = gl;
	}

	/** Destroys the renderer. */
	destroy(): void {
		// Lose the WebGL context.
		const loseContextExtension = this._gl.getExtension('WEBGL_lose_context');
		if (loseContextExtension !== null) {
			loseContextExtension.loseContext();
		}
	}

	/** Gets the WebGL context. */
	get gl(): WebGL2RenderingContext {
		return this._gl;
	}

	/** Creates a mesh. */
	createMesh(numVerticesPerPrimitive: number, vertexFormat: Mesh.Component[][]): Mesh {
		const mesh = new Mesh(this._gl, numVerticesPerPrimitive, vertexFormat);
		this._meshes.add(mesh);
		return mesh;
	}

	/** Destroys a mesh. */
	destroyMesh(mesh: Mesh): void {
		if (this._meshes.delete(mesh)) {
			mesh.destroy();
		}
	}

	/** Creates a shader. */
	createShader(vertexCode: string, fragmentCode: string, attributeLocations: Map<string, number>): Shader {
		const shader = new Shader(this._gl, vertexCode, fragmentCode, attributeLocations);
		this._shaders.add(shader);
		return shader;
	}

	/** Destroys a shader. */
	destroyShader(shader: Shader): void {
		if (this._shaders.delete(shader)) {
			shader.destroy();
		}
	}

	/** Creates a texture. */
	createTexture(source: null | string | TexImageSource | Uint8Array | Uint16Array | Uint32Array, width?: number, height?: number, format?: Texture.Format): Texture {
		const texture = new Texture(this._gl, source, width, height, format);
		this._textures.add(texture);
		return texture;
	}

	/** Destroys a texture. */
	destroyTexture(texture: Texture): void {
		if (this._textures.delete(texture)) {
			texture.destroy();
		}
	}

	/** Creates a stage. If *beforeStage* is given, it inserts it before that stage, otherwise it adds it at the end. */
	createStage(beforeStage?: Stage): Stage {
		const stage = new Stage(this._gl);
		this._stages.add(stage, beforeStage);
		return stage;
	}

	/** Destroys a stage. */
	destroyStage(stage: Stage): void {
		if (this._stages.remove(stage)) {
			stage.destroy();
		}
	}

	clear(color: ColorReadonly): void {
		this._gl.clearColor(color.r, color.g, color.b, color.a);
		this._gl.clear(this._gl.COLOR_BUFFER_BIT);
	}

	/** Render the stages. */
	render(): void {
		// Check the canvas size and resize if needed.
		const canvas = this._canvas;
		if (canvas.width !== canvas.clientWidth * devicePixelRatio) {
			canvas.width = canvas.clientWidth * devicePixelRatio;
		}
		if (canvas.height !== canvas.clientHeight * devicePixelRatio) {
			canvas.height = canvas.clientHeight * devicePixelRatio;
		}
		// Render the stages in order.
		for (const stage of this._stages) {
			stage.render();
		}
	}

	/** The canvas element. */
	private _canvas: HTMLCanvasElement;

	/** The WebGL context. */
	private _gl: WebGL2RenderingContext;

	/** The meshes. */
	private _meshes: Set<Mesh> = new Set();

	/** The shaders. */
	private _shaders: Set<Shader> = new Set();

	/** The textures. */
	private _textures: Set<Texture> = new Set();

	/** The stages. */
	private _stages: OrderedSet<Stage> = new OrderedSet();
}
