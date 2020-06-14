import { Scene } from './scene';

export class Target {
	constructor(gl: WebGL2RenderingContext) {
		// Save the WebGL context.
		this._gl = gl;

		// Create and bind the frame buffer.
		const frameBuffer = this._gl.createFramebuffer();
		if (frameBuffer === null) {
			throw new Error('Could not create the frame buffer.');
		}
		this._frameBuffer = frameBuffer;
		this._gl.bindFramebuffer(this._gl.FRAMEBUFFER, this._frameBuffer);
	}

	/** Destroys the target. */
	destroy(): void {
		this._gl.deleteFramebuffer(this._frameBuffer);
	}

	/** Renders the target. */
	render(): void {
	}

	/**  The WebGL context. */
	private _gl: WebGL2RenderingContext;

	private _frameBuffer: WebGLFramebuffer;
}

export class SceneTarget extends Target {
	/** Gets the scene. */
	get scene(): Scene | null {
		return this._scene;
	}

	/** Sets the scene. */
	set scene(scene: Scene | null) {
		this._scene = scene;
	}

	/** Renders the scene target. */
	render(): void {
		if (this._scene === null) {
			return;
		}
		this._scene.render();
	}

	/** The scene. */
	private _scene: Scene | null = null;
}
