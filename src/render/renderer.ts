import { ColorReadonly } from '../utils/color_readonly';
import { FastMap } from '../utils/fast_map';
import { Stage } from './stage';

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

		// Check the canvas size once a second and resize if needed.
		this._canvasResizeInterval = setInterval(function (): void {
			if (canvas.width !== canvas.clientWidth * devicePixelRatio) {
				canvas.width = canvas.clientWidth * devicePixelRatio;
			}
			if (canvas.height !== canvas.clientHeight * devicePixelRatio) {
				canvas.height = canvas.clientHeight * devicePixelRatio;
			}
		}, 1000, this._gl);
	}

	/** Destroys the renderer. */
	destroy(): void {
		// Clear the resize interval.
		clearInterval(this._canvasResizeInterval);

		// Lose the WebGL context.
		const loseContextExtension = this._gl.getExtension('WEBGL_lose_context');
		if (loseContextExtension !== null) {
			loseContextExtension.loseContext();
		}

		// Destroy the stages.
		for (let i = 0; i < this._stages.size; i++) {
			this._stages.getAt(i).value.destroy();
		}
	}

	/** Gets the WebGL context. */
	get gl(): WebGL2RenderingContext {
		return this._gl;
	}

	/** Adds a stage. */
	addStage(name: string): Stage {
		const stage = new Stage(this._gl);
		this._stages.set(name, stage);
		return stage;
	}

	/** Removes a stage. */
	removeStage(name: string): void {
		this._stages.delete(name);
	}

	clear(color: ColorReadonly): void {
		this._gl.clearColor(color.r, color.g, color.b, color.a);
		this._gl.clear(this._gl.COLOR_BUFFER_BIT);
	}

	render(): void {
		for (let i = 0, l = this._stages.size; i < l; i++) {
			this._stages.getAt(i).value.render();
		}
	}

	private _canvas: HTMLCanvasElement;

	private _gl: WebGL2RenderingContext;

	private _canvasResizeInterval: number;

	private _stages: FastMap<string, Stage> = new FastMap();
}
