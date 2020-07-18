import { ColorReadonly } from '../utils/color_readonly';
import { Mesh } from './mesh';
import { Shader } from './shader';
import { Texture } from './texture';
import { Stage } from './stage';
import { UniformBlock } from './uniform_block';
import { Scene } from './scene';
import { Model } from './model';

export class Renderer {
	constructor(canvas: HTMLCanvasElement, antialias: boolean) {
		// Save the canvas.
		this._canvas = canvas;
		// Create the WebGL context.
		const gl = this._canvas.getContext('webgl2', { antialias: antialias });
		if (gl === null) {
			throw new Error('Could not get a WebGL 2.0 context. Your browser may not support WebGL 2.0.');
		}
		this._gl = gl;
	}

	/** Destroys the renderer. */
	destroy(): void {
		// Destroy the WebGL context.
		const loseContextExtension = this._gl.getExtension('WEBGL_lose_context');
		if (loseContextExtension !== null) {
			loseContextExtension.loseContext();
		}
		// Clean up the resources.
		for (const mesh of this._meshes) {
			mesh.destroy();
		}
		for (const shader of this._shaders) {
			shader.destroy();
		}
		for (const texture of this._textures) {
			texture.destroy();
		}
		for (const model of this._models) {
			model.destroy();
		}
		for (const stage of this._stages) {
			stage.destroy();
		}
		for (const uniformBlock of this._uniformBlocks) {
			uniformBlock.destroy();
		}
		for (const scene of this._scenes) {
			scene.destroy();
		}
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

	/** Creates a model. */
	createModel(): Model {
		const model = new Model(this._gl);
		this._models.add(model);
		return model;
	}

	/** Destroys a model. */
	destroyModel(model: Model): void {
		if (this._models.delete(model)) {
			model.destroy();
		}
	}

	/** Creates a stage. */
	createStage(): Stage {
		const stage = new Stage(this._gl);
		this._stages.add(stage);
		return stage;
	}

	/** Destroys a stage. */
	destroyStage(stage: Stage): void {
		if (this._stages.delete(stage)) {
			stage.destroy();
		}
	}

	/** Creates a uniform block. */
	createUniformBlock(uniforms: UniformBlock.Uniform[]): UniformBlock {
		const uniformBlock = new UniformBlock(this._gl, uniforms);
		this._uniformBlocks.add(uniformBlock);
		return uniformBlock;
	}

	/** Destroys a uniform block. */
	destroyUniformBlock(uniformBlock: UniformBlock): void {
		if (this._uniformBlocks.delete(uniformBlock)) {
			uniformBlock.destroy();
		}
	}

	/** Creates a scene. */
	createScene(): Scene {
		const scene = new Scene();
		this._scenes.add(scene);
		return scene;
	}

	/** Destroys a scene. */
	destroyScene(scene: Scene): void {
		if (this._scenes.delete(scene)) {
			scene.destroy();
		}
	}

	clear(color: ColorReadonly): void {
		this._gl.clearColor(color.r, color.g, color.b, color.a);
		this._gl.clear(this._gl.COLOR_BUFFER_BIT);
	}

	/** Render the stages. */
	render(): void {
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

	/** The models. */
	private _models: Set<Model> = new Set();

	/** The stages. */
	private _stages: Set<Stage> = new Set();

	/** The uniform blocks. */
	private _uniformBlocks: Set<UniformBlock> = new Set();

	/** The scenes. */
	private _scenes: Set<Scene> = new Set();
}
