import { List } from '../utils/list';
import { Mesh } from './mesh';
import { Model } from './model';
import { Scene } from './scene';
import { Shader } from './shader';
import { Stage } from './stage';
import { Texture } from './texture';
import { UniformBlock } from './uniform_block';

export class Renderer {
	/** Constructs this. */
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

	/** Destroys this. */
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
	createMesh(): Mesh {
		const mesh = new Mesh(this._gl);
		this._meshes.add(mesh);
		return mesh;
	}

	/** Destroys a mesh. */
	destroyMesh(mesh: Mesh): void {
		if (this._meshes.has(mesh)) {
			mesh.destroy();
			this._meshes.remove(mesh);
		}
	}

	/** Creates a shader. */
	createShader(): Shader {
		const shader = new Shader(this._gl);
		this._shaders.add(shader);
		return shader;
	}

	/** Destroys a shader. */
	destroyShader(shader: Shader): void {
		if (this._shaders.has(shader)) {
			shader.destroy();
			this._shaders.remove(shader);
		}
	}

	/** Creates a texture. */
	createTexture(): Texture {
		const texture = new Texture(this._gl);
		this._textures.add(texture);
		return texture;
	}

	/** Destroys a texture. */
	destroyTexture(texture: Texture): void {
		if (this._textures.has(texture)) {
			texture.destroy();
			this._textures.remove(texture);
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
		if (this._models.has(model)) {
			model.destroy();
			this._models.remove(model);
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
		if (this._stages.has(stage)) {
			stage.destroy();
			this._stages.remove(stage);
		}
	}

	/** Creates a uniformBlock. */
	createUniformBlock(): UniformBlock {
		const uniformBlock = new UniformBlock(this._gl);
		this._uniformBlocks.add(uniformBlock);
		return uniformBlock;
	}

	/** Destroys a uniformBlock. */
	destroyUniformBlock(uniformBlock: UniformBlock): void {
		if (this._uniformBlocks.has(uniformBlock)) {
			uniformBlock.destroy();
			this._uniformBlocks.remove(uniformBlock);
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
		if (this._scenes.has(scene)) {
			scene.destroy();
			this._scenes.remove(scene);
		}
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
	private _meshes: List<Mesh> = new List();

	/** The shaders. */
	private _shaders: List<Shader> = new List();

	/** The textures. */
	private _textures: List<Texture> = new List();

	/** The models. */
	private _models: List<Model> = new List();

	/** The stages. */
	private _stages: List<Stage> = new List();

	/** The uniform blocks. */
	private _uniformBlocks: List<UniformBlock> = new List();

	/** The scenes. */
	private _scenes: List<Scene> = new List();
}
