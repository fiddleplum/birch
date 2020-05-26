import { ColorReadonly } from '../utils/color_readonly';

export class Renderer {
	private _canvas: HTMLCanvasElement;

	private _gl: WebGL2RenderingContext;

	private _canvasResizeInterval: number;

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

	destroy(): void {
		// Clear the resize interval.
		clearInterval(this._canvasResizeInterval);

		const loseContextExtension = this._gl.getExtension('WEBGL_lose_context');
		if (loseContextExtension !== null) {
			loseContextExtension.loseContext();
		}
	}

	get gl(): WebGL2RenderingContext {
		return this._gl;
	}

	clear(color: ColorReadonly): void {
		this._gl.clearColor(color.r, color.g, color.b, color.a);
		this._gl.clear(this._gl.COLOR_BUFFER_BIT);
	}
}
