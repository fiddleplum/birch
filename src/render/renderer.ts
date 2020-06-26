import { ColorReadonly } from '../utils/color_readonly';
import { OrderedSet } from '../utils/ordered_set';
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

	/** Gets the set of stages. */
	get stages(): OrderedSet<Stage> {
		return this._stages;
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

	/** The stages. */
	private _stages: OrderedSet<Stage> = new OrderedSet();
}
