import { ResourceSet } from '../utils/resource_set';
import { Mesh } from './mesh';
import { Shader } from './shader';
import { Texture } from './texture';
import { Stage } from './stage';
import { UniformBlock } from './uniform_block';
import { Scene } from './scene';
import { Model } from './model';

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

	/** Gets the meshes. */
	get meshes(): ResourceSet<Mesh> {
		return this._meshes;
	}

	/** Gets the shaders. */
	get shaders(): ResourceSet<Shader> {
		return this._shaders;
	}

	/** Gets the textures. */
	get textures(): ResourceSet<Texture> {
		return this._textures;
	}

	/** Gets the models. */
	get models(): ResourceSet<Model> {
		return this._models;
	}

	/** Gets the stages. */
	get stages(): ResourceSet<Stage> {
		return this._stages;
	}

	/** Gets the uniform blocks. */
	get uniformBlocks(): ResourceSet<UniformBlock> {
		return this._uniformBlocks;
	}

	/** Gets the scenes. */
	get scenes(): ResourceSet<Scene> {
		return this._scenes;
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
	private _meshes: ResourceSet<Mesh> = new ResourceSet(() => {
		return new Mesh(this._gl);
	}, (mesh: Mesh) => {
		mesh.destroy();
	});

	/** The shaders. */
	private _shaders: ResourceSet<Shader> = new ResourceSet(() => {
		return new Shader(this._gl);
	}, (shader: Shader) => {
		shader.destroy();
	});

	/** The textures. */
	private _textures: ResourceSet<Texture> = new ResourceSet(() => {
		return new Texture(this._gl);
	}, (texture: Texture) => {
		texture.destroy();
	});

	/** The models. */
	private _models: ResourceSet<Model> = new ResourceSet(() => {
		return new Model(this._gl);
	}, (model: Model) => {
		model.destroy();
	});

	/** The stages. */
	private _stages: ResourceSet<Stage> = new ResourceSet(() => {
		return new Stage(this._gl);
	}, (stage: Stage) => {
		stage.destroy();
	});

	/** The uniform blocks. */
	private _uniformBlocks: ResourceSet<UniformBlock> = new ResourceSet(() => {
		return new UniformBlock(this._gl);
	}, (uniformBlock: UniformBlock) => {
		uniformBlock.destroy();
	});

	/** The scenes. */
	private _scenes: ResourceSet<Scene> = new ResourceSet(() => {
		return new Scene();
	}, () => {
	});
}
