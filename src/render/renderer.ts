import { Mesh } from './mesh';
import { Model } from './model';
import { Scene } from './scene';
import { Shader } from './shader';
import { Stage } from './stage';
import { Texture } from './texture';
import { UniformGroup } from './uniform_group';
import { Collection } from '../utils/collection';
import { FastOrderedSet } from '../utils/fast_ordered_set';
import { Cache } from '../utils/cache';

export class Renderer {
	/** Constructs this. */
	constructor(canvas: HTMLCanvasElement, antialias: boolean) {
		// Save the canvas.
		this._canvas = canvas;
		// Create the WebGL context.
		const gl = this._canvas.getContext('webgl2', { antialias: antialias, alpha: false });
		if (gl === null) {
			throw new Error('Could not get a WebGL 2.0 context. Your browser may not support WebGL 2.0.');
		}
		this._gl = gl;

		// Setup blending.
		this._gl.enable(this._gl.BLEND);
	}

	/** Destroys this. */
	destroy(): void {
		// Destroy the WebGL context.
		const loseContextExtension = this._gl.getExtension('WEBGL_lose_context');
		if (loseContextExtension !== null) {
			loseContextExtension.loseContext();
		}
		this._meshes.clear();
		this._shaders.clear();
		this._textures.destroy();
		this._models.clear();
		this._stages.clear();
		this._uniforms.clear();
		this._scenes.clear();
	}

	/** Gets the stage order. */
	get stageOrder(): FastOrderedSet<Stage> {
		return this._stageOrder;
	}

	/** Gets the meshes. */
	get meshes(): Collection<Mesh> {
		return this._meshes;
	}

	/** Gets the shaders. */
	get shaders(): Collection<Shader> {
		return this._shaders;
	}

	/** Gets the textures. */
	get textures(): Cache<Texture> {
		return this._textures;
	}

	/** Gets the models. */
	get models(): Collection<Model> {
		return this._models;
	}

	/** Gets the stages. New stages are automatically added to the stage order. */
	get stages(): Collection<Stage> {
		return this._stages;
	}

	/** Gets the uniforms. */
	get uniforms(): Collection<UniformGroup> {
		return this._uniforms;
	}

	/** Gets the scens. */
	get scenes(): Collection<Scene> {
		return this._scenes;
	}

	/** Render the stages. */
	render(): void {
		if (this._stageOrder.size() > 0) {
			// Render the stages in order.
			for (const stage of this._stageOrder) {
				stage.render(this._canvas.height);
			}
		}
		else {
			this._gl.clearColor(0, 0, 0, 1);
			this._gl.clear(this._gl.COLOR_BUFFER_BIT);
		}
	}

	/** The canvas element. */
	private _canvas: HTMLCanvasElement;

	/** The WebGL context. */
	private _gl: WebGL2RenderingContext;

	/** The order in which the stages are rendered. */
	private _stageOrder: FastOrderedSet<Stage> = new FastOrderedSet();

	/** The meshes. */
	private _meshes: Collection<Mesh> = new Collection(() => {
		return new Mesh(this._gl);
	}, (mesh: Mesh) => {
		mesh.destroy();
	});

	/** The shaders. */
	private _shaders: Collection<Shader> = new Collection(() => {
		return new Shader(this._gl);
	}, (shader: Shader) => {
		shader.destroy();
	});

	/** The texture cache. */
	private _textures = new Cache<Texture>(() => {
		return new Texture(this._gl);
	}, (texture: Texture) => {
		texture.destroy();
	});

	/** The models. */
	private _models: Collection<Model> = new Collection(() => {
		return new Model(this._gl);
	}, (model: Model) => {
		model.destroy();
	});

	/** The stages. */
	private _stages: Collection<Stage> = new Collection(() => {
		const stage = new Stage(this._gl);
		this._stageOrder.add(stage);
		return stage;
	}, (stage: Stage) => {
		stage.destroy();
		this._stageOrder.remove(stage);
	});

	/** The uniforms. */
	private _uniforms: Collection<UniformGroup> = new Collection(() => {
		return new UniformGroup(this._gl);
	}, (uniforms: UniformGroup) => {
		uniforms.destroy();
	});

	/** The scenes. */
	private _scenes: Collection<Scene> = new Collection(() => {
		return new Scene(this._gl);
	}, (scene: Scene) => {
		scene.destroy();
	});
}
